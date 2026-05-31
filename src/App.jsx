import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import Docs from './components/Docs'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {currentPage === 'home' ? (
          <Dashboard onNavigate={setCurrentPage} />
        ) : (
          <Docs onNavigate={setCurrentPage} />
        )}
      </main>
      
      <footer className="py-8 text-center text-solarized-base1 font-medium mt-12 border-t border-claude-border/50 bg-claude-bg/30">
        <p>Made by Quazi Razeen Jubair and Sonu Khan</p>
      </footer>
    </div>
  )
}

export default App
