import { Sparkles, Send, Mail, MapPin, Phone, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact({ onNavigate, isDark, toggleTheme }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 max-w-6xl font-sans text-solarized-base00"
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

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-bold text-solarized-base01 dark:text-solarized-base2 mb-6">Get in Touch</h2>
          <p className="text-xl text-solarized-base1 leading-relaxed max-w-2xl mx-auto">
            Interested in deploying ClinicaSummary at your hospital? Reach out to our enterprise sales and deployment team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
               <div className="p-4 bg-solarized-cyan/10 text-solarized-cyan rounded-xl group-hover:bg-solarized-cyan group-hover:text-white transition-colors">
                 <Mail className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-1">Email Us</h3>
                 <p className="text-solarized-base1 mb-2">Our friendly team is here to help.</p>
                 <a href="mailto:enterprise@clinicassummary.com" className="text-claude-accent font-medium hover:underline">enterprise@clinicassummary.com</a>
               </div>
            </div>

            <div className="glass-card p-8 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
               <div className="p-4 bg-solarized-green/10 text-solarized-green rounded-xl group-hover:bg-solarized-green group-hover:text-white transition-colors">
                 <MapPin className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-1">Our Headquarters</h3>
                 <p className="text-solarized-base1 mb-2">Come say hello.</p>
                 <p className="text-solarized-base00 font-medium">100 Medical Tech Way<br/>San Francisco, CA 94107</p>
               </div>
            </div>

            <div className="glass-card p-8 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
               <div className="p-4 bg-solarized-violet/10 text-solarized-violet rounded-xl group-hover:bg-solarized-violet group-hover:text-white transition-colors">
                 <Phone className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-1">Phone</h3>
                 <p className="text-solarized-base1 mb-2">Mon-Fri from 8am to 5pm.</p>
                 <p className="text-solarized-base00 font-medium">+1 (555) 000-0000</p>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-10 bg-white">
            <h3 className="text-2xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-6">Send us a message</h3>
            {submitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-solarized-green/10 text-solarized-green rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 ml-1" />
                </div>
                <h4 className="text-xl font-bold text-solarized-base01 dark:text-solarized-base2 mb-2">Message Sent!</h4>
                <p className="text-solarized-base1">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-solarized-base01 dark:text-solarized-base2">First Name</label>
                    <input required type="text" className="w-full bg-claude-bg/50 border border-claude-border rounded-lg px-4 py-3 focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-solarized-base01 dark:text-solarized-base2">Last Name</label>
                    <input required type="text" className="w-full bg-claude-bg/50 border border-claude-border rounded-lg px-4 py-3 focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-solarized-base01 dark:text-solarized-base2">Email</label>
                  <input required type="email" className="w-full bg-claude-bg/50 border border-claude-border rounded-lg px-4 py-3 focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all" placeholder="jane@hospital.org" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-solarized-base01 dark:text-solarized-base2">Message</label>
                  <textarea required rows={4} className="w-full bg-claude-bg/50 border border-claude-border rounded-lg px-4 py-3 focus:outline-none focus:border-claude-accent focus:ring-1 focus:ring-claude-accent transition-all resize-none" placeholder="Tell us about your deployment needs..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-claude-accent hover:bg-[#c96647] text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
