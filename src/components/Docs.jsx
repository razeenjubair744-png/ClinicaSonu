import React, { useRef } from 'react';
import { Sparkles, ArrowLeft, Database, Cog, BrainCircuit, Activity, ArrowDown, Target, Moon, Sun, Code, Cpu, Server, Zap, Terminal, Layout, FileCode2, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Docs({ onNavigate, isDark, toggleTheme }) {
  const workflowRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: workflowRef.current,
        start: "top 80%",
      }
    });

    tl.from(".workflow-step", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.3,
      ease: "power3.out"
    })
    .from(".workflow-arrow", {
      opacity: 0,
      scale: 0.5,
      duration: 0.4,
      stagger: 0.3,
      ease: "back.out(1.7)"
    }, "-=1.2");
  }, { scope: workflowRef });

  const ToolLogos = [Code, Cpu, Server, Database, Zap, Terminal, Layout, FileCode2, FlaskConical, BrainCircuit, Code, Cpu, Server, Database, Zap, Terminal, Layout, FileCode2, FlaskConical, BrainCircuit];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 max-w-4xl font-sans text-solarized-base00"
    >
      <header className="mb-12 pt-8 flex items-center justify-between z-10 relative">
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

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <h2 className="text-4xl font-serif font-bold text-solarized-base01 mb-6">Documentation</h2>
        
        <div className="space-y-8">
          <section className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <h3 className="text-2xl font-bold text-solarized-base01 mb-4">Overview</h3>
            <p className="leading-relaxed mb-4 text-solarized-base00">ClinicaSummary is an advanced Clinical Decision Support System (CDSS) designed to parse unstructured medical data into actionable intelligence.</p>
            <p className="leading-relaxed text-solarized-base00">It utilizes Retrieval-Augmented Generation (RAG) powered by OpenAI's GPT models to ensure highly accurate, context-grounded analysis.</p>
          </section>

          {/* Tools Marquee */}
          <div className="relative w-full overflow-hidden border-y border-claude-border dark:border-solarized-base01/30 py-8 bg-claude-bg/50 dark:bg-solarized-base03/50 my-12">
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white dark:from-[#001e26] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white dark:from-[#001e26] to-transparent z-10 pointer-events-none"></div>
            
            <div className="marquee-container">
              {ToolLogos.map((Icon, idx) => (
                <div key={idx} className="mx-12 p-4 rounded-2xl bg-white dark:bg-[#002b36] shadow-sm border border-claude-border dark:border-solarized-base01/30 text-solarized-base1 dark:text-solarized-base0 hover:text-claude-accent dark:hover:text-solarized-cyan hover:scale-110 hover:shadow-md transition-all cursor-pointer">
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>

          <section className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-solarized-red" />
              <h3 className="text-2xl font-bold text-solarized-base01">System Goals</h3>
            </div>
            <p className="leading-relaxed mb-4 text-solarized-base00">The primary objective of ClinicaSummary is to <strong>eliminate administrative burnout</strong> in healthcare. By automating the extraction of vital signs, generating Differential Diagnoses (DDx), and triaging patients instantly, the system aims to:</p>
            <ul className="list-disc pl-5 space-y-2 text-solarized-base00">
              <li>Reduce charting and documentation time by up to 50%.</li>
              <li>Provide instant, second-opinion clinical reasoning to reduce cognitive load.</li>
              <li>Translate complex medical histories into structured, actionable JSON data for Electronic Medical Records (EMR).</li>
            </ul>
          </section>

          <section className="glass-card p-8">
            <h3 className="text-2xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-8 text-center">System Workflow</h3>
            
            <div ref={workflowRef} className="flex flex-col items-center max-w-2xl mx-auto space-y-4">
              
              {/* Step 1 */}
              <div className="workflow-step w-full bg-white dark:bg-solarized-base03 border border-claude-border dark:border-solarized-base01/30 rounded-xl p-6 shadow-sm flex items-center gap-6 relative group hover:border-solarized-cyan transition-colors">
                <div className="w-12 h-12 bg-solarized-cyan/10 text-solarized-cyan rounded-full flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-solarized-base01 dark:text-solarized-base2 text-lg">1. Data Ingestion</h4>
                  <p className="text-sm text-solarized-base00 dark:text-solarized-base1 mt-1">Accepts unstructured data: PDF Reports, Audio Dictation (Web Speech API), Images (Base64), or Web Links.</p>
                </div>
              </div>

              <ArrowDown className="workflow-arrow w-6 h-6 text-solarized-base1 animate-bounce" />

              {/* Step 2 */}
              <div className="workflow-step w-full bg-white dark:bg-solarized-base03 border border-claude-border dark:border-solarized-base01/30 rounded-xl p-6 shadow-sm flex items-center gap-6 relative group hover:border-solarized-yellow transition-colors">
                <div className="w-12 h-12 bg-solarized-yellow/10 text-solarized-yellow rounded-full flex items-center justify-center shrink-0">
                  <Cog className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-solarized-base01 dark:text-solarized-base2 text-lg">2. Parsing & Pre-processing</h4>
                  <p className="text-sm text-solarized-base00 dark:text-solarized-base1 mt-1">FastAPI backend processes the file using PyPDF, Whisper AI, or BeautifulSoup to extract raw contextual text.</p>
                </div>
              </div>

              <ArrowDown className="workflow-arrow w-6 h-6 text-solarized-base1 animate-bounce" />

              {/* Step 3 */}
              <div className="workflow-step w-full bg-white dark:bg-solarized-base03 border border-claude-border dark:border-solarized-base01/30 rounded-xl p-6 shadow-sm flex items-center gap-6 relative group hover:border-claude-accent transition-colors">
                <div className="w-12 h-12 bg-claude-accent/10 text-claude-accent rounded-full flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-solarized-base01 dark:text-solarized-base2 text-lg">3. AI Synthesis Engine</h4>
                  <p className="text-sm text-solarized-base00 dark:text-solarized-base1 mt-1">LangChain passes the context to GPT-4o-Mini alongside a strict system prompt, enforcing structured Pydantic output.</p>
                </div>
              </div>

              <ArrowDown className="workflow-arrow w-6 h-6 text-solarized-base1 animate-bounce" />

              {/* Step 4 */}
              <div className="workflow-step w-full bg-white dark:bg-solarized-base03 border border-claude-border dark:border-solarized-base01/30 rounded-xl p-6 shadow-sm flex items-center gap-6 relative group hover:border-solarized-green transition-colors">
                <div className="w-12 h-12 bg-solarized-green/10 text-solarized-green rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-solarized-base01 dark:text-solarized-base2 text-lg">4. Actionable Output</h4>
                  <p className="text-sm text-solarized-base00 dark:text-solarized-base1 mt-1">React frontend renders the structured JSON into an interactive Triage, Vitals Tracker, and Differential Diagnosis (DDx) dashboard.</p>
                </div>
              </div>

            </div>
          </section>

          <section className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <h3 className="text-2xl font-bold text-solarized-base01 mb-4">Core Features</h3>
            <ul className="list-disc pl-5 space-y-3 text-solarized-base00">
              <li><strong>Automated Triage:</strong> Calculates severity scores (Critical, Urgent, Moderate, Routine).</li>
              <li><strong>Differential Diagnosis (DDx):</strong> Ranks potential conditions based on clinical presentation.</li>
              <li><strong>Vitals Tracking:</strong> Extracts and dynamically flags abnormal quantitative measurements.</li>
              <li><strong>Interactive RAG Chat:</strong> Ask specific follow-up questions directly to the document context.</li>
              <li><strong>Multimodal Support:</strong> Upload medical records (PDF), voice notes (MP3, WAV), or paste URLs for automated scraping.</li>
            </ul>
          </section>

          <section className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <h3 className="text-2xl font-bold text-solarized-base01 mb-4">Architecture</h3>
            <p className="leading-relaxed text-solarized-base00 mb-4">
              <strong>Backend:</strong> Built with FastAPI and LangChain, utilizing `pypdf` for file parsing, `BeautifulSoup` for URL scraping, and `OpenAI Whisper` for audio transcription. Data is passed through structured Pydantic models for guaranteed schema adherence.
            </p>
            <p className="leading-relaxed text-solarized-base00">
              <strong>Frontend:</strong> Built with React, Tailwind CSS, and `lucide-react` icons. It features a custom "Solarized Light" design system mimicking elegant, modern AI interfaces with responsive layouts and micro-animations.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
