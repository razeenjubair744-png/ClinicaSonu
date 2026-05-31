import { Sparkles, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About({ onNavigate, isDark, toggleTheme }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 max-w-4xl font-sans text-solarized-base00"
    >
      <header className="mb-12 pt-8 flex items-center justify-between z-10 relative">
        <div>
          <h1 
            className="text-2xl font-serif font-bold text-solarized-base01 dark:text-solarized-base2 flex items-center gap-2 tracking-tight cursor-pointer"
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
            className="px-4 py-2 bg-claude-bg border border-claude-border rounded-lg text-solarized-base01 dark:text-solarized-base2 hover:bg-claude-hover hover:border-claude-accent font-medium transition-all dark:bg-solarized-base03 dark:border-solarized-base01/30 dark:text-solarized-base1 dark:hover:border-solarized-base1"
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

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 text-center">
        <h2 className="text-5xl font-serif font-bold text-solarized-base01 dark:text-solarized-base2 mb-6">Our Mission</h2>
        <p className="text-xl text-solarized-base1 leading-relaxed max-w-2xl mx-auto mb-16">
          To eliminate the administrative burden of healthcare by empowering physicians with intelligent, instant clinical reasoning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }} 
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            className="glass-card p-10 cursor-default"
          >
            <h3 className="text-2xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-4">The Problem</h3>
            <p className="leading-relaxed text-solarized-base00">
              Modern medicine is drowning in data. Physicians spend over 50% of their day reading disjointed EHRs, scanning through PDFs, and manually typing notes. This administrative bloat leads to severe burnout and less time spent actually treating patients.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
            className="glass-card p-10 bg-claude-bg/30 cursor-default"
          >
            <h3 className="text-2xl font-bold text-claude-accent mb-4">The Solution</h3>
            <p className="leading-relaxed text-solarized-base00">
              ClinicaSummary uses advanced, domain-tuned Retrieval-Augmented Generation (RAG) to instantly digest patient history. Whether it's an uploaded PDF, a dictated voice note, or a picture of an MRI report, our CDSS synthesizes the data into actionable intelligence in seconds.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 glass-card p-12 bg-claude-accent/5 border-claude-accent/20">
          <h3 className="text-3xl font-serif font-bold text-solarized-base01 dark:text-solarized-base2 mb-6">Built for the Future of Medicine</h3>
          <p className="leading-relaxed text-solarized-base00 max-w-3xl mx-auto text-lg">
            We believe that AI shouldn't replace doctors—it should give them their time back. By automating the extraction of vitals, generating differential diagnoses, and calculating triage severity, we are building the ultimate copilot for healthcare professionals.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
