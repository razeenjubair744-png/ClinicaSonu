import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Docs({ onNavigate }) {
  return (
    <div className="container mx-auto p-6 max-w-4xl font-sans text-solarized-base00">
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
        <nav>
          <button 
            onClick={() => onNavigate && onNavigate('home')} 
            className="flex items-center gap-2 text-solarized-base1 hover:text-claude-accent font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
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
    </div>
  );
}
