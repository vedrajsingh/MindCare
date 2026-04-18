import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldAlert, X } from 'lucide-react';

const CrisisModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-red-500/30 shadow-[0_0_40px_-5px_rgba(239,68,68,0.3)] rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You are not alone</h2>
              <p className="text-red-100">
                It sounds like you are going through a very difficult time right now. Please know that there is support available.
              </p>
            </div>
            
            <div className="p-6">
              <p className="text-slate-300 text-center mb-6">
                MindCare is an AI and not a substitute for professional help. If you are in crisis, please reach out immediately:
              </p>
              
              <a 
                href="tel:988" 
                className="flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl mb-4 transition-colors border border-slate-700"
              >
                <div className="bg-red-500/20 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-lg">Call or Text 988</span>
                  <span className="block text-sm text-slate-400">Suicide & Crisis Lifeline</span>
                </div>
              </a>
              
              <button 
                onClick={onClose}
                className="w-full py-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                I understand, return to chat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CrisisModal;
