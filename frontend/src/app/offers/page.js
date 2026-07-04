'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, CheckCircle, Clock, Gift, Award, Wallet, Percent, BellRing, ChevronRight, Star, ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';

const COUPONS = [
  { id: 'bogo', type: 'BOGO', title: 'Buy 1 Get 1 FREE', desc: 'On all organic juices.', code: 'JUICEBOGO', color: 'from-green-500 to-emerald-400', expiry: 'Ends in 2 days' },
  { id: 'fest', type: 'FESTIVAL', title: 'Diwali Mega Dhamaka', desc: 'Flat 40% OFF on Sweets & Dry Fruits.', code: 'FEST40', color: 'from-orange-500 to-red-500', expiry: 'Ends in 5 days' },
  { id: 'brand', type: 'BRAND', title: 'Tata Sampann Specials', desc: 'Save 15% on all pulses and spices.', code: 'TATA15', color: 'from-blue-500 to-indigo-500', expiry: 'Ends tonight' },
];

export default function OffersPage() {
  const [copied, setCopied] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });
  const [notifications, setNotifications] = useState([]);

  // Mock Notifications Engine
  useEffect(() => {
    const alerts = [
      "🎁 Happy Birthday! Here is your ₹500 Coupon.",
      "📉 Price Drop Alert: Aashirvaad Atta is now 10% cheaper!",
      "⚠️ Hurry! Your FEST40 coupon expires tomorrow."
    ];
    let delay = 1000;
    alerts.forEach((msg, idx) => {
      setTimeout(() => {
        setNotifications(prev => [...prev, { id: idx, msg }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== idx)), 5000);
      }, delay);
      delay += 3500;
    });
  }, []);

  // Deal of the day countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else { m = 59; if (h > 0) h--; }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 overflow-x-hidden relative">
      
      {/* Toast Notification Area */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(note => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 border-l-4 border-primary shadow-2xl rounded-xl p-4 flex items-start gap-3 w-[300px]"
            >
              <BellRing className="text-primary shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-bold text-gray-900 dark:text-white">{note.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hero: Deal of the Day */}
      <div className="bg-gray-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/40 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full font-bold border border-red-500/30">
              <Clock size={18} className="animate-pulse" /> Deal of the Day
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Mega Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Grocery Haul</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
              Get an insane 60% OFF on our premium Monthly Grocery Basket. Strictly limited time!
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((time, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black border border-white/20 shadow-xl">
                    {time.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">
                    {['Hours', 'Mins', 'Secs'][i]}
                  </span>
                </div>
              ))}
            </div>

            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-primary/30 flex items-center gap-2 mx-auto lg:mx-0">
              Claim Deal Now <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Deal" className="rounded-3xl shadow-2xl border-4 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Engagement Dashboard (Loyalty, Wallet, Birthday) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Award size={28} className="text-primary" />
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Your Engagement Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Wallet */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Wallet size={24} /></div>
                <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">Cashback Wallet</span>
              </div>
              <div>
                <h4 className="text-4xl font-black text-gray-900 dark:text-white">₹1,250</h4>
                <p className="text-sm text-gray-500 mt-1">Available for next purchase</p>
              </div>
            </div>

            {/* Loyalty */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-primary/10 text-primary rounded-xl"><Star size={24} /></div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">Gold Member</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-black text-gray-900 dark:text-white">4,500 <span className="text-lg font-bold text-gray-400">pts</span></h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full w-[75%] rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">500 pts away from Platinum</p>
              </div>
            </div>

            {/* Special Occasion */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-20"><PartyPopper size={120} /></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"><Gift size={24} /></div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded">Birthday Month</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-black">Free Cake & 20% Off</h4>
                <p className="text-sm text-white/80 mt-1">Unlock on 15th October</p>
              </div>
            </div>

          </div>
        </section>

        {/* Coupons & Promo Codes */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Tag size={28} className="text-primary" />
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Active Coupons</h2>
            </div>
            <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-1">View Eligible Products <ChevronRight size={16}/></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COUPONS.map((offer, idx) => (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${offer.color} rounded-3xl p-6 text-white shadow-xl shadow-${offer.color.split('-')[1]}-500/20 relative overflow-hidden group`}
              >
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 space-y-4 flex flex-col h-full">
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-black tracking-widest uppercase w-max border border-white/30">{offer.type}</span>
                  <h3 className="text-2xl font-black leading-tight">{offer.title}</h3>
                  <p className="text-white/90 text-sm flex-1">{offer.desc}</p>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-white/80 mt-2">
                    <span className="flex items-center gap-1"><Clock size={12}/> {offer.expiry}</span>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center backdrop-blur-md border border-white/30 mt-4 border-dashed border-2">
                    <span className="font-mono font-bold tracking-widest text-lg">{offer.code}</span>
                    <button 
                      onClick={() => handleCopy(offer.code)}
                      className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                      title="Copy Code"
                    >
                      {copied === offer.code ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Referral System */}
        <section className="bg-primary/5 dark:bg-primary/10 rounded-[3rem] p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          
          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full font-bold">
              <PartyPopper size={18} /> Referral Program
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Invite Friends & <br/> Earn ₹500
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md">
              Share your unique referral link. They get ₹200 off their first order, and you get ₹500 in your wallet when their order is delivered!
            </p>
            
            <div className="flex gap-2 max-w-md">
              <input type="text" value="https://rishabh.store/ref/prasham123" readOnly className="flex-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-500 outline-none" />
              <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 rounded-xl font-bold hover:opacity-90 transition">Copy</button>
            </div>
          </div>

          <div className="w-full md:w-1/3 relative z-10 hidden md:block">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" alt="Referral" className="rounded-3xl shadow-2xl rotate-3" />
          </div>
        </section>

      </div>
    </div>
  );
}
