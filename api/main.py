from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import pypdf
import io
import os
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
import base64
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = FastAPI(title="ClinicaSummary API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TimelineEvent(BaseModel):
    date: str = Field(description="The date or timeframe of the event (e.g., '2023-10-12', 'October 2023')")
    event_type: str = Field(description="The type of the medical event (e.g., 'Lab Result', 'Diagnosis', 'Surgery')")
    summary: str = Field(description="A concise summary of the event")
    critical_findings: List[str] = Field(description="List of critical findings or abnormal values")

class LabValue(BaseModel):
    test_name: str = Field(description="The name of the vital sign or lab test")
    value: str = Field(description="The measured value and unit")
    is_abnormal: bool = Field(description="True if the value is considered abnormal")

class DiagnosisItem(BaseModel):
    condition: str = Field(description="The potential medical condition")
    probability: str = Field(description="Probability level: 'High', 'Medium', or 'Low'")
    reasoning: str = Field(description="Clinical reasoning for this diagnosis")

class GlossaryItem(BaseModel):
    term: str = Field(description="The medical term or jargon")
    definition: str = Field(description="A plain-English, patient-friendly definition of the term")

class ClinicalSynthesis(BaseModel):
    patient_summary: str = Field(description="A high-level clinical summary of the patient's history")
    triage_level: str = Field(description="Triage severity score: 'Critical', 'Urgent', 'Moderate', or 'Routine'")
    vitals_and_labs: List[LabValue] = Field(default_factory=list, description="Extracted quantitative vital signs and lab values")
    timeline: List[TimelineEvent] = Field(description="Chronological timeline of medical events")
    differential_diagnosis: List[DiagnosisItem] = Field(default_factory=list, description="Ranked list of potential diagnoses")
    recommended_medications: List[str] = Field(default_factory=list, description="List of recommended standard-of-care medications/treatments based on diagnoses")
    icd10_codes: List[str] = Field(default_factory=list, description="List of highly likely ICD-10 billing codes for the identified conditions")
    potential_contraindications: List[str] = Field(description="List of medical anomalies, risks, or contraindications")
    action_plan: List[str] = Field(default_factory=list, description="Recommended next steps, lifestyle changes, or treatments")
    glossary: List[GlossaryItem] = Field(default_factory=list, description="Definitions of complex medical jargon found in the report")
    follow_up_questions: List[str] = Field(default_factory=list, description="Critical questions to ask during the next consultation")

SYSTEM_PROMPT = """
You are an advanced medical intelligence engine and Clinical Decision Support System (CDSS).
Your task is to parse unstructured medical histories, lab reports, and imaging texts.

You must extract and generate:
1. A patient summary and chronological timeline.
2. An Automated Triage Severity Score (Critical, Urgent, Moderate, or Routine).
3. A Vitals & Lab Values tracker (flagging abnormal values).
4. A Differential Diagnosis (DDx) ranking potential conditions with probability and reasoning.
5. Action plan and potential contraindications or risk factors.
6. A Patient-Friendly Medical Glossary.
7. Suggested Follow-up Questions.
8. Recommended standard-of-care medications or treatments based on the diagnoses.
9. Highly likely ICD-10 billing codes for the identified conditions (e.g., 'J01.90 - Acute sinusitis').

Ensure all data is grounded in the source text. Do not hallucinate symptoms.
"""

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")

def extract_text_from_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        return soup.get_text(separator="\n", strip=True)
    except Exception as e:
        raise ValueError(f"Failed to scrape URL: {str(e)}")

@app.post("/api/process-case", response_model=ClinicalSynthesis)
async def process_case(file: Optional[UploadFile] = File(None), url: Optional[str] = Form(None), raw_text: Optional[str] = Form(None)):
    if not file and not url and not raw_text:
        raise HTTPException(status_code=400, detail="Please provide a file, a URL, or raw text.")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable is not set.")

    text = ""

    if raw_text:
        text = raw_text
    elif url:
        try:
            text = extract_text_from_url(url)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif file:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith('.pdf'):
            try:
                text = extract_text_from_pdf(contents)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        elif filename.endswith(('.mp3', '.wav', '.m4a', '.ogg', '.flac')):
            try:
                client = OpenAI(api_key=api_key)
                audio_file = io.BytesIO(contents)
                audio_file.name = file.filename
                transcript = client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file
                )
                text = transcript.text
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to transcribe audio: {str(e)}")
        elif filename.endswith(('.jpg', '.jpeg', '.png')):
            # We'll handle this in the LLM call directly, just set text to a placeholder
            text = "IMAGE_UPLOAD"
        else:
            raise HTTPException(status_code=400, detail="Only PDF, Image (.jpg/.png), and Audio files (.mp3/.wav/.m4a) are supported.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="The extracted content appears to be empty.")

    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)
        structured_llm = llm.with_structured_output(ClinicalSynthesis)
        
        if text == "IMAGE_UPLOAD" and file:
            # We already read the file into 'contents' at line 114
            image_b64 = base64.b64encode(contents).decode('utf-8')
            ext = file.filename.split('.')[-1].lower()
            mime_type = "image/png" if ext == 'png' else "image/jpeg"
            
            messages = [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=[
                    {"type": "text", "text": "Please analyze this medical image, extract its text, and synthesize the required information."},
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{image_b64}"}}
                ])
            ]
            result = structured_llm.invoke(messages)
            return {
                **result.dict(),
                "raw_context_text": "Extracted medical data from image."
            }
        else:
            prompt = ChatPromptTemplate.from_messages([
                ("system", SYSTEM_PROMPT),
                ("user", "Please analyze the following medical document and extract the required information:\n\n{text}")
            ])
            
            chain = prompt | structured_llm
            result = chain.invoke({"text": text[:100000]}) # Limit text length as a basic safety measure
            
            # We also want to return the raw text so the frontend can pass it to the /api/chat endpoint
            return {
                **result.dict(),
                "raw_context_text": text
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document via AI: {str(e)}")

class ChatRequest(BaseModel):
    context: str
    query: str

@app.post("/api/chat")
async def chat_with_document(req: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable is not set.")
    
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful medical AI assistant. Answer the user's question using ONLY the provided clinical context. If the answer is not in the context, state that clearly."),
            ("user", "Context:\n{context}\n\nQuestion: {query}")
        ])
        
        chain = prompt | llm
        result = chain.invoke({"context": req.context[:100000], "query": req.query})
        
        return {"answer": result.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Mount React App (Static Files)
# This allows FastAPI to serve the React frontend in production (Docker)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")
assets_dir = os.path.join(DIST_DIR, "assets")

# Mount assets specifically (we create the dir just in case to prevent crash if running locally without build)
import os
os.makedirs(assets_dir, exist_ok=True)

app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/{catchall:path}")
async def serve_spa(catchall: str):
    file_path = os.path.join(DIST_DIR, catchall)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"detail": "Frontend not built yet. Please run 'npm run build'."}
