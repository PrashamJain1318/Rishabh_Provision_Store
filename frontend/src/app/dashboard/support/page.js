'use client';

import { motion } from 'framer-motion';
import { Send, User, Bot, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function SupportChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello Prasham! How can we help you with your recent order #ORD-1209?', sender: 'Support', time: '10:00 AM' },
    { id: 2, text: 'The tomatoes I received were slightly damaged.', sender: 'Customer', time: '10:05 AM' },
    { id: 3, text: 'We sincerely apologize for that. I have initiated a refund of ₹40 to your store wallet. Is there anything else?', sender: 'Support', time: '10:06 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      text: input, 
      sender: 'Customer', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInput('');
  };

  return (
    <div className="h-[600px] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">Customer Support</h2>
          <p className="text-sm text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'Customer';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-3 ${isCustomer ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isCustomer ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-primary text-white'
              }`}>
                {isCustomer ? <User size={14} /> : <Bot size={14} />}
              </div>
              
              <div className={`max-w-[75%] ${isCustomer ? 'items-end text-right' : 'items-start text-left'}`}>
                <div className={`p-4 rounded-2xl ${
                  isCustomer 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 inline-block">{msg.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
          />
          <button 
            type="submit"
            className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      
    </div>
  );
}
