import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeEmotion, detectCrisis, generateMockResponse, saveSession } from '../utils/aiSimulator';

const ChatInterface = ({ onCrisisDetected }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there. I'm MindCare. How are you feeling today?", sender: 'ai', emotion: null }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionScores, setSessionScores] = useState([]);
  
  // Simulated report data based on user instructions
  const [reportData] = useState({
    stressLevel: 'high',
    sleepHours: 4,
    moodTrend: 'declining'
  });
  
  const bottomRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Save session on unmount if there are user messages
  useEffect(() => {
    return () => {
      if (sessionScores.length > 0) {
        const avgScore = sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length;
        saveSession(Math.round(avgScore), sessionScores.length);
      }
    };
  }, [sessionScores]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    // Process text
    if (detectCrisis(userText)) {
      onCrisisDetected();
    }
    
    const emotionScore = analyzeEmotion(userText);
    setSessionScores(prev => [...prev, emotionScore]);
    
    setIsTyping(true);
    
    // Simulate AI delay
    setTimeout(() => {
      const aiResponseText = generateMockResponse(userText, emotionScore, updatedMessages, reportData);
      const aiMsg = { id: Date.now() + 1, text: aiResponseText, sender: 'ai', emotion: emotionScore };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 mx-auto w-full max-w-4xl border-x border-slate-800 shadow-2xl">
      <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
          </div>
          <div>
            <h1 className="font-bold text-slate-100 dark:text-slate-100">MindCare</h1>
            <p className="text-xs text-indigo-400">Always here to listen</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 mt-auto">
                  {msg.sender === 'ai' ? (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'} shadow-lg`}>
                  <p className="leading-relaxed text-[15px]">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start w-full"
          >
            <div className="flex max-w-[80%] gap-3">
              <div className="flex-shrink-0 mt-auto">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm shadow-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400">MindCare is typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="p-4 bg-slate-800/50 backdrop-blur-md border-t border-slate-700">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-4 pl-6 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
          Responses are generated locally for privacy and safety.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
