# ClinicaSummary (ClinicaSonu) ⚕️

ClinicaSummary is an AI-powered Clinical Decision Support System (CDSS) built with a React frontend and a FastAPI backend. It utilizes OpenAI's state-of-the-art vision and language models to instantly extract, analyze, and synthesize patient medical histories, lab results, clinical audio dictations, and medical imagery.

## ✨ Features
- **Automated Triage & Synthesis**: Generates a quick clinical summary and triage severity score.
- **Differential Diagnosis**: Renders an interactive probability chart for potential conditions.
- **Visuals & Audio Processing**: Supports PDF uploads, live audio dictation (via Whisper API), and medical image analysis.
- **Standard of Care Guidance**: Recommends medications, generates an Action Plan, and lists potential risk factors.
- **Medical Administration**: Extracts corresponding ICD-10 Billing Codes to reduce administrative overhead.
- **Interactive Consultation Chat**: Chat directly with the uploaded medical context to ask specific questions.

---

## 🚀 How to Deploy on Render

This application uses a unified Multi-Stage `Dockerfile`, making it incredibly easy to deploy as a single, cost-effective service on Render! 

Follow these steps to deploy directly from your GitHub repository:

### Step 1: Create a Web Service
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Under "Connect a repository", select your `ClinicaSonu` GitHub repository.

### Step 2: Configure the Service
When setting up the Web Service, make sure you choose the following options:

- **Name**: `clinicasummary` (or whatever you prefer)
- **Region**: Choose the region closest to you
- **Branch**: `main`
- **Root Directory**: *Leave blank* (since the Dockerfile is in the root)
- **Runtime**: **Docker** *(Render should auto-detect this because of the `Dockerfile`)*
- **Instance Type**: Free or Starter (Starter recommended for production)

### Step 3: Add Environment Variables
Scroll down to the **Environment Variables** section and add the following:

- **Key**: `OPENAI_API_KEY` 
- **Value**: `sk-proj-...` *(paste your OpenAI API key here)*

*(Note: Render will automatically inject the `PORT` environment variable which our Dockerfile expects, so you don't need to add it manually).*

### Step 4: Deploy!
Click **Create Web Service**. 

Render will now execute the Dockerfile. It will:
1. Spin up a Node environment to build your React frontend.
2. Spin up a Python environment to install FastAPI.
3. Serve the entire full-stack application together!

Once the build is complete, your app will be live at the `.onrender.com` URL provided at the top of the dashboard!
