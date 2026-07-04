'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Camera, Send, Loader2, Sparkles, Plus, Languages, Activity, Apple, Wallet, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const MODES = [
  { id: 'general', label: 'Assistant', icon: MessageSquare },
  { id: 'recipe', label: 'Recipe AI', icon: Apple },
  { id: 'nutrition', label: 'Nutrition', icon: Activity },
  { id: 'budget', label: 'Budget', icon: Wallet },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ka', label: 'ಕನ್ನಡ' }
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('general');
  const [language, setLanguage] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceVisualizer, setVoiceVisualizer] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();

  const getGreeting = () => {
    if (language === 'hi') return "नमस्ते! मैं आपका AI Assistant हूँ। मैं आपकी कैसे मदद कर सकता हूँ?";
    if (language === 'ka') return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI Assistant. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
    return "Hi! I'm your Omni AI Assistant ✨. I can help you find products, suggest recipes, or identify items from photos! What are you looking for?";
  };

  useEffect(() => {
    setMessages([{ role: 'assistant', text: getGreeting() }]);
  }, [language, activeMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Voice Search (Web Speech API)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceVisualizer(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ka' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceVisualizer(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setVoiceVisualizer(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceVisualizer(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceVisualizer(false);
    };
    
    recognition.start();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;

    const newMsg = { 
      role: 'user', 
      text: input, 
      image: selectedImage ? URL.createObjectURL(selectedImage) : null 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);
    
    const textToSend = input;
    setInput('');
    setSelectedImage(null);

    // Mock AI Response based on mode and language
    setTimeout(() => {
      let responseText = "I found some great options for you!";
      let recommendations = [];

      if (language === 'hi') responseText = "मुझे आपके लिए कुछ बेहतरीन विकल्प मिले हैं!";
      if (language === 'ka') responseText = "ನಾನು ನಿಮಗಾಗಿ ಕೆಲವು ಉತ್ತಮ ಆಯ್ಕೆಗಳನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೇನೆ!";

      if (activeMode === 'recipe' && textToSend.toLowerCase().includes('paneer')) {
        responseText = language === 'hi' ? "कड़ाही पनीर बनाने के लिए आपको इन चीज़ों की ज़रूरत होगी:" : "Here are the ingredients you need to cook Kadai Paneer. Add them to your cart directly!";
        recommendations = [
          { _id: 'rec1', name: 'Amul Fresh Paneer 200g', sellingPrice: 85, images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=100&fit=crop'] },
          { _id: 'rec2', name: 'Everest Paneer Masala', sellingPrice: 45, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&fit=crop'] }
        ];
      } else if (activeMode === 'budget') {
        responseText = "I found the most cost-effective options under ₹100 for your query.";
        recommendations = [
          { _id: 'rec3', name: 'Store Brand Atta 1kg', sellingPrice: 40, images: ['https://images.unsplash.com/photo-1579113087385-23130d7b22a0?w=100&fit=crop'] }
        ];
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: responseText,
        recommendations
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] z-50 transition-all ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] h-[650px] max-h-[85vh] bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex flex-col gap-3 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full"><Sparkles size={18} /></div>
                  <div>
                    <h3 className="font-bold leading-tight">Omni AI</h3>
                    <p className="text-[10px] opacity-80">GPT-4 Omni Vision</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-md hover:bg-white/30 transition">
                    <Languages size={14} /> {language.toUpperCase()}
                  </button>
                  
                  {showLangMenu && (
                    <div className="absolute top-8 right-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50">
                      {LANGUAGES.map(lang => (
                        <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Persona Modes */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {MODES.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button 
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeMode === mode.id ? 'bg-white text-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <Icon size={12} /> {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-800'
                  }`}>
                    {msg.image && <img src={msg.image} alt="Upload" className="w-full h-32 object-cover rounded-xl mb-2" />}
                    {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-2 w-[85%] space-y-2">
                      <p className="text-xs font-bold text-gray-500 ml-1">AI Suggestions:</p>
                      {msg.recommendations.map(prod => (
                        <div key={prod._id} className="bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center">
                          <img src={prod.images[0]} className="w-12 h-12 object-cover rounded-lg bg-gray-100" alt={prod.name} />
                          <div className="flex-1">
                            <h4 className="text-xs font-bold line-clamp-1">{prod.name}</h4>
                            <p className="text-xs text-purple-500 font-bold">₹{prod.sellingPrice}</p>
                          </div>
                          <button 
                            onClick={() => addToCart({
                              id: prod._id,
                              name: prod.name,
                              price: prod.sellingPrice,
                              image: prod.images[0]
                            })}
                            className="bg-purple-500/10 text-purple-500 p-1.5 rounded-lg hover:bg-purple-500 hover:text-white transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-800">
                    <Loader2 className="animate-spin text-purple-500" size={16} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {selectedImage && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 relative">
                <div className="relative inline-block">
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-gray-300" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Voice Visualizer */}
            <AnimatePresence>
              {voiceVisualizer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-center items-center gap-1 bg-gray-900 text-white">
                  {[...Array(10)].map((_, i) => (
                    <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} className="w-1 bg-purple-500 rounded-full" />
                  ))}
                  <span className="text-xs font-bold ml-2 text-purple-400">Listening...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 relative z-10">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-full pr-2 p-1 border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-400 hover:text-purple-500 transition bg-white dark:bg-gray-800 rounded-full shadow-sm"
                >
                  <Camera size={18} />
                </button>
                
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Ask Omni AI..."}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-2 py-2 dark:text-white"
                />

                {input.length === 0 && !selectedImage ? (
                  <button 
                    onClick={toggleListening}
                    className={`p-2 transition rounded-full ${isListening ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-purple-500'}`}
                  >
                    <Mic size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend}
                    className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:opacity-90 transition shadow-sm"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
