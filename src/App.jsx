import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import Docs from './components/Docs'
import About from './components/About'
import Contact from './components/Contact'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Dashboard onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} key="home" />;
      case 'docs': return <Docs onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} key="docs" />;
      case 'about': return <About onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} key="about" />;
      case 'contact': return <Contact onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} key="contact" />;
      default: return <Dashboard onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} key="home" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="py-8 text-center text-solarized-base1 font-medium mt-12 border-t border-claude-border/50 bg-claude-bg/30">
        <p>Made by Quazi Razeen Jubair and Sonu Khan</p>
      </footer>
    </div>
  )
}

export default App
