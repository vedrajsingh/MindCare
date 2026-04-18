import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, HeartPulse } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import CrisisModal from './components/CrisisModal';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Mind<span className="text-indigo-400">Care</span></span>
          </div>
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Companion</span>
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const handleCrisisDetection = () => {
    setIsCrisisModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 w-full font-sans text-slate-200">
      <Navigation />
      
      <main className="flex-1 flex overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatInterface onCrisisDetected={handleCrisisDetection} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <CrisisModal 
        isOpen={isCrisisModalOpen} 
        onClose={() => setIsCrisisModalOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
