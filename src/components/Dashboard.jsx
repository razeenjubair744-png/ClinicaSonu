import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, AlertTriangle, FileText, Activity, Clock, CheckCircle2, ArrowRight, Sparkles, ListChecks, BookOpen, MessageCircleQuestion, Link as LinkIcon, Mic, Stethoscope, HeartPulse, Printer, MessageSquare, Send, ShieldCheck, Lock, Server, ChevronDown, ChevronUp, Star, Building, Zap, Moon, Sun, Pill, FileCode2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SAMPLE_CASES = [
  {
    title: "Cardiology Report",
    subtitle: "72yo Male • Chest Pain",
    text: "Patient is a 72-year-old male with a history of hypertension and hyperlipidemia. Presents with acute onset chest pain radiating to the left arm. BP is 165/95, HR is 110 bpm. ECG shows ST-segment elevation in leads V2-V4. Troponin I is elevated at 2.4 ng/mL. The patient was given aspirin 325mg and sublingual nitroglycerin. Plan for immediate cardiac catheterization."
  },
  {
    title: "Neurology Consult",
    subtitle: "45yo Female • Migraine",
    text: "45-year-old female presents with severe right-sided throbbing headache accompanied by photophobia, phonophobia, and nausea. She reports seeing a scintillating scotoma 30 minutes before the headache started. Vitals: BP 120/80, HR 75. Neurological exam is unremarkable. Diagnosis: Migraine with aura. Prescribed Sumatriptan 50mg PRN. Advised to maintain a headache diary."
  }
];

export default function Dashboard({ onNavigate, isDark, toggleTheme }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [inputType, setInputType] = useState('file');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const getChartData = (ddxList) => {
    if (!ddxList) return [];
    return ddxList.map(ddx => ({
      name: ddx.condition.length > 20 ? ddx.condition.substring(0, 20) + '...' : ddx.condition,
      fullCondition: ddx.condition,
      probabilityValue: ddx.probability.toLowerCase() === 'high' ? 90 : ddx.probability.toLowerCase() === 'medium' ? 50 : 20,
      probability: ddx.probability,
      fill: ddx.probability.toLowerCase() === 'high' ? '#dc322f' : ddx.probability.toLowerCase() === 'medium' ? '#cb4b16' : '#b58900'
    }));
  };

  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

  // Dictation State
  const [isDictating, setIsDictating] = useState(false);
  const [dictatedText, setDictatedText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
           fullTranscript += event.results[i][0].transcript;
        }
        setDictatedText(fullTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsDictating(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsDictating(false);
      };
    }
  }, []);

  const toggleDictation = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
    } else {
      setDictatedText('');
      recognitionRef.current?.start();
      setIsDictating(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (inputType === 'file' && !file) return;
    if (inputType === 'url' && !url) return;

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    if (inputType === 'file') {
      formData.append('file', file);
    } else {
      formData.append('url', url);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/process-case`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred while processing the case.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleCase = async (rawText) => {
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('raw_text', rawText);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/process-case`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred while processing the case.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: chatQuery }];
    setChatHistory(newHistory);
    setChatQuery('');
    setIsChatting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/chat`, {
        context: data.raw_context_text || '',
        query: chatQuery
      });
      setChatHistory([...newHistory, { role: 'assistant', content: response.data.answer }]);
    } catch (err) {
      console.error("Chat error", err);
      setChatHistory([...newHistory, { role: 'assistant', content: "Sorry, I encountered an error answering your question." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const getTriageColor = (level) => {
    const l = (level || '').toLowerCase();
    if (l.includes('critical')) return 'bg-solarized-red text-white';
    if (l.includes('urgent')) return 'bg-solarized-orange text-white';
    if (l.includes('moderate')) return 'bg-solarized-yellow text-solarized-base01';
    return 'bg-solarized-green text-white';
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      className="container mx-auto p-6 max-w-6xl font-sans text-solarized-base00"
    >
      <header className="mb-4 pt-8 flex items-center justify-between z-10 relative">
        <div>
          <h1 
            className="text-2xl font-serif font-bold text-solarized-base01 flex items-center gap-2 tracking-tight cursor-pointer"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <div className="bg-claude-accent/10 p-1.5 rounded-lg text-claude-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            ClinicaSummary
          </h1>
        </div>
        <nav className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate && onNavigate('home')} 
            className="text-solarized-base1 hover:text-claude-accent font-medium transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('about')} 
            className="text-solarized-base1 hover:text-claude-accent font-medium transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('docs')} 
            className="text-solarized-base1 hover:text-claude-accent font-medium transition-colors"
          >
            Docs
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('contact')} 
            className="px-4 py-2 bg-claude-bg border border-claude-border rounded-lg text-solarized-base01 hover:bg-claude-hover hover:border-claude-accent font-medium transition-all dark:bg-solarized-base03 dark:border-solarized-base01/30 dark:text-solarized-base1 dark:hover:border-solarized-base1"
          >
            Contact Sales
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-2 text-solarized-base1 hover:text-claude-accent transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {!data && !loading && (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12 items-center">
          
          <motion.div variants={staggerContainer} className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl font-serif font-bold text-solarized-base01 leading-tight tracking-tight">
              Clinical insight,<br/>
              <span className="text-claude-accent italic font-normal">instantly extracted.</span>
            </motion.h1>
            <p className="text-xl text-solarized-base00 leading-relaxed max-w-lg">
              Upload patient history, voice notes, or medical articles. Our Clinical Decision Support System (CDSS) synthesizes the data into actionable intelligence.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4 group cursor-default">
                <div className="p-3 bg-solarized-red/10 text-solarized-red rounded-xl group-hover:scale-110 group-hover:bg-solarized-red group-hover:text-white transition-all shadow-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-solarized-base01 text-lg mb-1 group-hover:text-solarized-red transition-colors">Automated Triage & DDx</h3>
                  <p className="text-solarized-base1 leading-relaxed">Instantly calculates severity scores and ranks potential diagnoses with clinical reasoning.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group cursor-default">
                <div className="p-3 bg-solarized-cyan/10 text-solarized-cyan rounded-xl group-hover:scale-110 group-hover:bg-solarized-cyan group-hover:text-white transition-all shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-solarized-base01 text-lg mb-1 group-hover:text-solarized-cyan transition-colors">Vitals Tracking</h3>
                  <p className="text-solarized-base1 leading-relaxed">Automatically extracts quantitative measurements and dynamically flags abnormal values.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group cursor-default">
                <div className="p-3 bg-claude-accent/10 text-claude-accent rounded-xl group-hover:scale-110 group-hover:bg-claude-accent group-hover:text-white transition-all shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-solarized-base01 text-lg mb-1 group-hover:text-claude-accent transition-colors">Interactive RAG Chat</h3>
                  <p className="text-solarized-base1 leading-relaxed">Ask specific follow-up questions directly to the uploaded clinical context for instant answers.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="glass-card p-10 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-claude-accent/5 rounded-full blur-3xl group-hover:bg-claude-accent/10 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-solarized-cyan/5 rounded-full blur-3xl group-hover:bg-solarized-cyan/10 transition-colors duration-700"></div>
              
              <div className="flex bg-claude-hover p-1.5 rounded-xl mb-10 z-10 border border-claude-border/50">
                 <button 
                   onClick={() => setInputType('file')} 
                   className={cn("px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2", inputType === 'file' ? "bg-white shadow-sm text-claude-accent" : "text-solarized-base1 hover:text-solarized-base00")}
                 >
                   <Upload className="w-4 h-4" /> File / Image
                 </button>
                 <button 
                   onClick={() => setInputType('url')} 
                   className={cn("px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2", inputType === 'url' ? "bg-white shadow-sm text-claude-accent" : "text-solarized-base1 hover:text-solarized-base00")}
                 >
                   <LinkIcon className="w-4 h-4" /> Web Link
                 </button>
                 <button 
                   onClick={() => setInputType('dictate')} 
                   className={cn("px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2", inputType === 'dictate' ? "bg-white shadow-sm text-claude-accent" : "text-solarized-base1 hover:text-solarized-base00")}
                 >
                   <Mic className="w-4 h-4" /> Dictate
                 </button>
              </div>

              <div className="w-24 h-24 bg-claude-bg rounded-full flex items-center justify-center mb-6 shadow-inner-soft border border-claude-border z-10 group-hover:scale-105 transition-transform duration-500">
                {inputType === 'file' && <Upload className="w-10 h-10 text-claude-accent" />}
                {inputType === 'url' && <LinkIcon className="w-10 h-10 text-claude-accent" />}
                {inputType === 'dictate' && <Mic className="w-10 h-10 text-claude-accent" />}
              </div>
              <h2 className="text-2xl font-serif font-bold mb-8 text-solarized-base01 z-10">
                {inputType === 'file' && "Upload Medical Data"}
                {inputType === 'url' && "Analyze Web Source"}
                {inputType === 'dictate' && "Real-Time Dictation"}
              </h2>
              
              {inputType === 'file' && (
                <div className="flex flex-col items-center gap-4 w-full justify-center z-10">
                  <label className="cursor-pointer bg-white text-solarized-base01 px-8 py-4 rounded-xl font-medium transition-all shadow-sm border border-claude-border hover:border-claude-accent hover:text-claude-accent flex items-center justify-center w-full">
                    <span className="truncate max-w-[200px]">{file ? file.name : "Choose PDF, Image, Audio"}</span>
                    <input type="file" className="hidden" accept=".pdf,.mp3,.wav,.m4a,.jpg,.jpeg,.png" onChange={handleFileChange} />
                  </label>
                  
                  {file && (
                    <button 
                      onClick={handleUpload}
                      className="bg-claude-accent hover:bg-[#c96647] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full animate-in fade-in zoom-in duration-300"
                    >
                      Analyze Source <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              {inputType === 'url' && (
                <div className="flex flex-col items-center gap-4 w-full justify-center z-10">
                  <input 
                    type="url" 
                    placeholder="https://example.com/medical-report" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white text-solarized-base01 px-6 py-4 rounded-xl font-medium shadow-sm border border-claude-border focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all"
                  />
                  {url && (
                    <button 
                      onClick={handleUpload}
                      className="bg-claude-accent hover:bg-[#c96647] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full animate-in fade-in zoom-in duration-300"
                    >
                      Analyze Source <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              {inputType === 'dictate' && (
                 <div className="flex flex-col items-center gap-4 w-full justify-center z-10">
                   <button 
                     onClick={toggleDictation}
                     className={cn("w-full py-4 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2 border", 
                       isDictating ? "bg-solarized-red/10 border-solarized-red text-solarized-red animate-pulse" : "bg-white border-claude-border hover:border-claude-accent text-solarized-base01"
                     )}
                   >
                     {isDictating ? <><Mic className="w-5 h-5" /> Stop Recording...</> : <><Mic className="w-5 h-5" /> Start Dictation</>}
                   </button>
                   
                   {dictatedText && (
                     <div className="w-full text-left bg-white border border-claude-border rounded-xl p-4 text-sm text-solarized-base00 h-32 overflow-y-auto">
                       {dictatedText}
                     </div>
                   )}

                   {dictatedText && !isDictating && (
                     <button 
                       onClick={() => handleSampleCase(dictatedText)}
                       className="bg-claude-accent hover:bg-[#c96647] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full animate-in fade-in zoom-in duration-300"
                     >
                       Analyze Dictation <ArrowRight className="w-5 h-5" />
                     </button>
                   )}
                 </div>
               )}
              {error && (
                <div className="mt-6 bg-solarized-red/10 text-solarized-red px-4 py-3 rounded-lg flex items-start gap-2 text-sm font-medium w-full text-left z-10 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> <span>{error}</span>
                </div>
              )}
            </div>

            {/* Sample Cases */}
            <div className="mt-8 text-left z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <p className="text-sm font-bold text-solarized-base1 uppercase tracking-widest mb-4 ml-2">Or try a sample case:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAMPLE_CASES.map((sc, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSampleCase(sc.text)}
                    className="text-left p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-claude-border hover:border-claude-accent hover:bg-white hover:shadow-soft transition-all group"
                  >
                    <h4 className="font-bold text-solarized-base01 group-hover:text-claude-accent transition-colors mb-1">{sc.title}</h4>
                    <p className="text-sm text-solarized-base1 font-medium">{sc.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
          </div>

          {/* Below the Fold Expanded Section */}
          <div className="mt-32 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-solarized-base01 mb-4">Why ClinicaSummary?</h2>
              <p className="text-lg text-solarized-base1 max-w-2xl mx-auto">Our CDSS engine is tailored to empower everyone in the healthcare ecosystem.</p>
            </div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card p-8 group transition-transform duration-500">
                 <div className="w-12 h-12 bg-solarized-blue/10 text-solarized-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-solarized-blue group-hover:text-white transition-colors">
                   <Stethoscope className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-solarized-base01 mb-3">For Physicians</h3>
                 <p className="text-solarized-base00 leading-relaxed">Save hours of manual charting. Instantly extract a chronological timeline, flag critical contraindications, and get AI-assisted Differential Diagnoses.</p>
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card p-8 group transition-transform duration-500 delay-100">
                 <div className="w-12 h-12 bg-solarized-green/10 text-solarized-green rounded-xl flex items-center justify-center mb-6 group-hover:bg-solarized-green group-hover:text-white transition-colors">
                   <BookOpen className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-solarized-base01 mb-3">For Medical Students</h3>
                 <p className="text-solarized-base00 leading-relaxed">Learn clinical reasoning faster. See exactly how symptoms map to triage severity scores and explore the AI's reasoning behind every diagnosis.</p>
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card p-8 group transition-transform duration-500 delay-200">
                 <div className="w-12 h-12 bg-solarized-violet/10 text-solarized-violet rounded-xl flex items-center justify-center mb-6 group-hover:bg-solarized-violet group-hover:text-white transition-colors">
                   <Activity className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-solarized-base01 mb-3">For Patients</h3>
                 <p className="text-solarized-base00 leading-relaxed">Demystify your health data. Complex medical jargon is automatically translated into a plain-English glossary, empowering you for your next visit.</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Pricing Section */}
          <div className="mt-32 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-solarized-base01 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-solarized-base1 max-w-2xl mx-auto">
                Powered by the advanced Claude 4.6 model. Plans are precisely calculated to cover API costs while ensuring sustainable growth and a healthy 30% margin.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic */}
              <div className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-xl font-bold text-solarized-base01 mb-2">Basic</h3>
                <p className="text-solarized-base1 mb-6 text-sm">Perfect for individuals</p>
                <div className="mb-6">
                  <span className="text-4xl font-serif font-bold text-solarized-base01">$9</span>
                  <span className="text-solarized-base1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-green" /> 100 cases per month</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-green" /> Standard Triage & DDx</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-green" /> Basic Email Support</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-claude-border text-solarized-base01 font-medium hover:bg-claude-hover transition-colors">Choose Basic</button>
              </div>

              {/* Pro */}
              <div className="glass-card p-8 flex flex-col relative transform md:-translate-y-4 shadow-float border-claude-accent/30 bg-claude-bg/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-claude-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
                <h3 className="text-xl font-bold text-solarized-base01 mb-2">Pro</h3>
                <p className="text-solarized-base1 mb-6 text-sm">For busy physicians</p>
                <div className="mb-6">
                  <span className="text-4xl font-serif font-bold text-solarized-base01">$29</span>
                  <span className="text-solarized-base1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-claude-accent" /> 500 cases per month</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-claude-accent" /> Advanced Interactive Chat</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-claude-accent" /> Priority Support</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-claude-accent hover:bg-[#c96647] text-white font-medium shadow-md transition-colors">Choose Pro</button>
              </div>

              {/* Premium */}
              <div className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-xl font-bold text-solarized-base01 mb-2">Premium</h3>
                <p className="text-solarized-base1 mb-6 text-sm">For clinics & hospitals</p>
                <div className="mb-6">
                  <span className="text-4xl font-serif font-bold text-solarized-base01">$119</span>
                  <span className="text-solarized-base1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-violet" /> 2,000 cases per month</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-violet" /> EMR Integration</li>
                  <li className="flex items-center gap-2 text-solarized-base00"><CheckCircle2 className="w-5 h-5 text-solarized-violet" /> 24/7 Dedicated Support</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-claude-border text-solarized-base01 font-medium hover:bg-claude-hover transition-colors">Choose Premium</button>
              </div>
            </div>
          </div>

          {/* 1. Trusted By Banner */}
          <div className="py-12 border-y border-claude-border/50 bg-claude-bg/30 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <p className="text-sm font-bold text-solarized-base1 uppercase tracking-widest mb-8">Trusted by visionary teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 font-serif text-xl font-bold text-solarized-base01"><Building className="w-6 h-6" /> Mount Sinai</div>
              <div className="flex items-center gap-2 font-serif text-xl font-bold text-solarized-base01"><Building className="w-6 h-6" /> Mayo Clinic</div>
              <div className="flex items-center gap-2 font-serif text-xl font-bold text-solarized-base01"><Building className="w-6 h-6" /> Cleveland Clinic</div>
              <div className="flex items-center gap-2 font-serif text-xl font-bold text-solarized-base01"><Building className="w-6 h-6" /> Johns Hopkins</div>
            </div>
          </div>

          {/* 2. Security & HIPAA Banner */}
          <div className="mt-32 max-w-5xl mx-auto glass-card p-12 bg-[#002b36] border-[#073642] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-solarized-cyan/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-solarized-cyan" />
                  <h2 className="text-3xl font-serif font-bold text-[#fdf6e3]">Enterprise-Grade Security</h2>
                </div>
                <p className="text-[#93a1a1] text-lg leading-relaxed">
                  Patient data is your most critical asset. We treat it with uncompromising security. Our systems are fully HIPAA compliant, utilizing military-grade AES-256 encryption at rest and TLS 1.3 in transit.
                </p>
                <div className="flex gap-6 pt-4">
                  <div className="flex items-center gap-2 text-[#eee8d5] font-medium"><Lock className="w-5 h-5 text-solarized-cyan" /> AES-256</div>
                  <div className="flex items-center gap-2 text-[#eee8d5] font-medium"><Server className="w-5 h-5 text-solarized-cyan" /> Zero Retention</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Testimonials */}
          <div className="mt-32 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-solarized-base01 mb-4">Loved by Healthcare Professionals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 relative">
                <div className="flex gap-1 mb-4 text-solarized-yellow"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                <p className="text-solarized-base00 italic mb-6">"ClinicaSummary has cut my charting time in half. The accuracy of the AI-generated differential diagnoses is genuinely mind-blowing."</p>
                <div className="font-bold text-solarized-base01">Dr. Sarah Jenkins</div>
                <div className="text-sm text-solarized-base1">Chief Medical Officer</div>
              </div>
              <div className="glass-card p-8 relative">
                <div className="flex gap-1 mb-4 text-solarized-yellow"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                <p className="text-solarized-base00 italic mb-6">"As a medical student, seeing how the AI maps symptoms to triage severity scores has accelerated my clinical reasoning immensely."</p>
                <div className="font-bold text-solarized-base01">Michael Chen</div>
                <div className="text-sm text-solarized-base1">M3 Student</div>
              </div>
              <div className="glass-card p-8 relative">
                <div className="flex gap-1 mb-4 text-solarized-yellow"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                <p className="text-solarized-base00 italic mb-6">"I finally understand my own health data. The interactive chat lets me ask questions about my lab results without feeling embarrassed."</p>
                <div className="font-bold text-solarized-base01">Emily R.</div>
                <div className="text-sm text-solarized-base1">Patient</div>
              </div>
            </div>
          </div>

          {/* 4. Interactive FAQ */}
          <div className="mt-32 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-solarized-base01">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                {q: "Is ClinicaSummary HIPAA compliant?", a: "Yes, our enterprise plans are fully HIPAA compliant. We sign BAAs, enforce AES-256 encryption, and maintain a strict zero-data-retention policy for API calls."},
                {q: "Does this replace a doctor?", a: "Absolutely not. ClinicaSummary is a Clinical Decision Support System (CDSS) designed to augment and assist medical professionals, not replace their critical judgment."},
                {q: "What file types can I upload?", a: "We support PDF medical records, audio files (.mp3, .wav) for dictation, and images (.jpg, .png) for multimodal visual analysis."}
              ].map((faq, idx) => (
                <div key={idx} className="glass-card overflow-hidden">
                  <button 
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-solarized-base01 hover:text-claude-accent transition-colors"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    {activeFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-6 text-solarized-base00 leading-relaxed animate-in slide-in-from-top-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Final CTA */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="mt-32 mb-10 max-w-4xl mx-auto text-center glass-card p-16 bg-claude-hover border-claude-border relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-claude-accent/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl font-serif font-bold text-solarized-base01 mb-6 relative z-10">Ready to modernize your workflow?</h2>
            <p className="text-xl text-solarized-base00 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of healthcare professionals who have already cut their charting time in half.</p>
            <div className="flex justify-center gap-4 relative z-10">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-claude-accent hover:bg-[#c96647] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Start Free Trial <Zap className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('contact')}
                className="bg-white border border-claude-border text-solarized-base01 hover:bg-claude-bg px-8 py-4 rounded-xl font-bold transition-all shadow-sm"
              >
                Contact Sales
              </button>
            </div>
          </motion.div>

        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative w-20 h-20 mb-8">
             <div className="absolute inset-0 border-4 border-claude-border rounded-full"></div>
             <div className="absolute inset-0 border-4 border-claude-accent rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-2xl font-serif font-bold text-solarized-base01 mb-3">Synthesizing clinical data</h3>
          <p className="text-solarized-base1 text-lg animate-pulse">Running advanced natural language processing...</p>
        </div>
      )}

      {data && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
          <div className="flex justify-between items-center mb-8 no-print">
             {data.triage_level ? (
                <div className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-sm flex items-center gap-2 ${getTriageColor(data.triage_level)}`}>
                  <Activity className="w-4 h-4" />
                  TRIAGE: {data.triage_level.toUpperCase()}
                </div>
             ) : <div></div>}
             <div className="flex gap-4">
               <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 rounded-full border border-claude-border bg-white text-solarized-base01 hover:bg-claude-hover transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Export PDF
                </button>
               <button 
                  onClick={() => {setData(null); setFile(null); setUrl(''); setChatHistory([]);}}
                  className="px-6 py-2 rounded-full border border-claude-border bg-white text-solarized-base01 hover:bg-claude-hover transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
                >
                  Upload New Document
                </button>
             </div>
          </div>

          {data.vitals_and_labs && data.vitals_and_labs.length > 0 && (
            <div className="mb-8 glass-card p-6 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-solarized-red/10 rounded-lg text-solarized-red">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-solarized-base01">Vitals & Lab Results</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.vitals_and_labs.map((vital, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${vital.is_abnormal ? 'bg-solarized-red/5 border-solarized-red/30' : 'bg-claude-bg/50 border-claude-border'}`}>
                    <div className="text-xs font-semibold text-solarized-base1 mb-1 truncate">{vital.test_name}</div>
                    <div className={`text-lg font-bold ${vital.is_abnormal ? 'text-solarized-red' : 'text-solarized-base01'}`}>{vital.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-solarized-blue/10 rounded-lg text-solarized-blue">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-solarized-base01">Clinical Synthesis</h3>
                </div>
                <div className="prose prose-solarized leading-relaxed text-solarized-base00">
                  <p>{data.patient_summary}</p>
                </div>
              </div>

              {data.differential_diagnosis && data.differential_diagnosis.length > 0 && (
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-solarized-violet/10 rounded-lg text-solarized-violet">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-solarized-base01">Differential Diagnosis</h3>
                  </div>

                  <div className="h-64 w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData(data.differential_diagnosis)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 13, fill: isDark ? '#93a1a1' : '#586e75' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-[#002b36] p-4 border border-claude-border shadow-lg rounded-xl">
                                <p className="font-bold text-solarized-base01 dark:text-solarized-base2 mb-1">{payload[0].payload.fullCondition}</p>
                                <p className="text-sm text-solarized-base1">Probability: <span className="font-bold">{payload[0].payload.probability}</span></p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="probabilityValue" radius={[0, 6, 6, 0]} barSize={24}>
                          {getChartData(data.differential_diagnosis).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {data.differential_diagnosis.map((ddx, idx) => (
                      <div key={idx} className="bg-claude-bg/50 p-4 rounded-xl border border-claude-border relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${ddx.probability.toLowerCase() === 'high' ? 'bg-solarized-red' : ddx.probability.toLowerCase() === 'medium' ? 'bg-solarized-orange' : 'bg-solarized-yellow'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                          <h4 className="font-bold text-solarized-base01">{ddx.condition}</h4>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${ddx.probability.toLowerCase() === 'high' ? 'bg-solarized-red/10 text-solarized-red' : ddx.probability.toLowerCase() === 'medium' ? 'bg-solarized-orange/10 text-solarized-orange' : 'bg-solarized-yellow/10 text-solarized-yellow'}`}>
                            {ddx.probability} Prob
                          </span>
                        </div>
                        <p className="text-sm text-solarized-base00 leading-relaxed pl-2">{ddx.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.potential_contraindications && data.potential_contraindications.length > 0 && (
                <div className="bg-white border border-solarized-orange/30 shadow-soft rounded-2xl p-8 relative overflow-hidden group hover:shadow-float transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-solarized-orange group-hover:w-2 transition-all"></div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-solarized-orange/10 rounded-lg text-solarized-orange">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-solarized-base01">Risk Factors</h3>
                  </div>
                  <ul className="space-y-4">
                    {data.potential_contraindications.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-solarized-base00">
                        <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-solarized-orange"></span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* End of Left Column */}
              
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7">
              <div className="glass-card p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-claude-accent/10 rounded-lg text-claude-accent">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-solarized-base01">Medical Timeline</h3>
                </div>
                
                <div className="relative border-l-2 border-claude-border ml-4 space-y-12 pb-4">
                  {data.timeline && data.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-10 group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-claude-accent group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                      
                      <div className="bg-claude-bg/50 rounded-2xl p-6 border border-claude-border group-hover:border-claude-accent/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <span className="text-sm font-bold px-3 py-1.5 rounded-lg bg-white text-claude-accent border border-claude-border shadow-sm">
                            {event.date}
                          </span>
                          <span className="text-sm font-semibold text-solarized-base00">
                            {event.event_type}
                          </span>
                        </div>
                        
                        <p className="text-solarized-base00 leading-relaxed mb-5">
                          {event.summary}
                        </p>
                        
                        {event.critical_findings && event.critical_findings.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {event.critical_findings.map((finding, fIdx) => (
                              <span key={fIdx} className="text-xs px-3 py-1.5 rounded-full bg-solarized-red/5 text-solarized-red border border-solarized-red/20 font-medium">
                                {finding}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.glossary && data.glossary.length > 0 && (
                <div className="glass-card p-8 sm:p-10 mt-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-solarized-cyan/10 rounded-lg text-solarized-cyan">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-solarized-base01">Medical Glossary</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.glossary.map((item, idx) => (
                      <div key={idx} className="bg-claude-bg/50 p-4 rounded-xl border border-claude-border hover:border-solarized-cyan/30 transition-colors">
                        <h4 className="font-bold text-solarized-cyan mb-2">{item.term}</h4>
                        <p className="text-sm text-solarized-base00 leading-relaxed">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moved blocks to balance the grid beautifully */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                {/* Short tags/lists go side-by-side */}
                {data.recommended_medications && data.recommended_medications.length > 0 && (
                  <div className="glass-card p-8 bg-solarized-cyan/5 border-solarized-cyan/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-solarized-cyan/10 rounded-lg text-solarized-cyan">
                        <Pill className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-solarized-base01">Recommended Medications</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      {data.recommended_medications.map((med, idx) => (
                        <div key={idx} className="bg-white dark:bg-solarized-base03 border border-claude-border dark:border-solarized-base01/30 p-4 rounded-xl shadow-sm flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-solarized-cyan shrink-0"></div>
                          <span className="font-bold text-solarized-base00 dark:text-solarized-base1">{med}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.icd10_codes && data.icd10_codes.length > 0 && (
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-solarized-blue/10 rounded-lg text-solarized-blue">
                        <FileCode2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-solarized-base01">ICD-10 Billing Codes</h3>
                    </div>
                    <div className="space-y-3">
                      {data.icd10_codes.map((code, idx) => {
                        const parts = code.split(' - ');
                        const codeNumber = parts[0];
                        const codeDesc = parts.slice(1).join(' - ') || code;
                        return (
                          <div key={idx} className="flex flex-col xl:flex-row xl:items-center justify-between p-3 rounded-lg bg-claude-bg/50 dark:bg-[#002b36] border border-claude-border dark:border-solarized-base01/30">
                            <span className="text-sm font-medium text-solarized-base00 dark:text-solarized-base1 mb-1 xl:mb-0">{codeDesc}</span>
                            <span className="font-mono font-bold text-solarized-blue bg-solarized-blue/10 px-3 py-1 rounded-md text-sm">{codeNumber}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Text-heavy lists take full width */}
              <div className="mt-8 space-y-8">
                {data.action_plan && data.action_plan.length > 0 && (
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-solarized-green/10 rounded-lg text-solarized-green">
                        <ListChecks className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-solarized-base01">Action Plan</h3>
                    </div>
                    <ul className="space-y-4">
                      {data.action_plan.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-solarized-base00">
                          <CheckCircle2 className="w-5 h-5 text-solarized-green flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.follow_up_questions && data.follow_up_questions.length > 0 && (
                  <div className="glass-card p-8 bg-claude-accent/5 border-claude-accent/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-claude-accent/10 rounded-lg text-claude-accent">
                        <MessageCircleQuestion className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-solarized-base01">Consultation Guide</h3>
                    </div>
                    <p className="text-sm text-solarized-base1 mb-4">Suggested questions:</p>
                    <ul className="space-y-4">
                      {data.follow_up_questions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-solarized-base00 bg-white p-4 rounded-xl border border-claude-border shadow-sm">
                          <span className="font-serif font-bold text-claude-accent text-lg leading-none mt-0.5">Q.</span>
                          <span className="leading-relaxed font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
            </div>
          </div>

          <div className="mt-8 glass-card p-8 no-print">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-claude-accent/10 rounded-lg text-claude-accent">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-solarized-base01">Ask the Data</h3>
            </div>
            
            <div className="bg-claude-bg/30 rounded-xl border border-claude-border p-4 mb-4 h-64 overflow-y-auto space-y-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-solarized-base1 text-sm">
                  Ask any follow-up questions about this medical case.
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-claude-accent text-white rounded-tr-sm' : 'bg-white border border-claude-border text-solarized-base00 rounded-tl-sm shadow-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-xl bg-white border border-claude-border text-solarized-base00 rounded-tl-sm shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-claude-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-claude-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-claude-accent rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-3">
              <input 
                type="text" 
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="E.g., What was the patient's heart rate?"
                className="flex-1 bg-white text-solarized-base01 px-4 py-3 rounded-xl shadow-sm border border-claude-border focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all"
              />
              <button 
                type="submit"
                disabled={!chatQuery.trim() || isChatting}
                className="bg-claude-accent hover:bg-[#c96647] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md flex items-center gap-2"
              >
                Send <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
