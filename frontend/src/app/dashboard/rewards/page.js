'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Trophy, Star, History, Target, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function RewardsPage() {
  const [data, setData] = useState({ reward: null, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/rewards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  const { reward, history } = data;
  
  // Calculate progress to next tier
  const tiers = { Bronze: 0, Silver: 1000, Gold: 5000, Platinum: 10000 };
  let nextTier = 'Silver';
  let nextTierPoints = 1000;
  if (reward?.vipLevel === 'Silver') { nextTier = 'Gold'; nextTierPoints = 5000; }
  else if (reward?.vipLevel === 'Gold') { nextTier = 'Platinum'; nextTierPoints = 10000; }
  else if (reward?.vipLevel === 'Platinum') { nextTier = 'Max'; nextTierPoints = 10000; }
  
  const progressPercent = reward?.vipLevel === 'Platinum' ? 100 : Math.min(100, (reward?.lifetimeEarned / nextTierPoints) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Reward Points</h1>
        <p className="text-gray-500">Earn points on every purchase to unlock VIP perks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Reward Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 bg-white/20 px-3 py-1 rounded-full w-fit backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                <Trophy size={14} className="text-yellow-300" /> {reward?.vipLevel || 'Bronze'} Member
              </div>
              <div className="text-6xl font-black font-mono tracking-tight mb-2 flex items-center gap-3">
                {reward?.points?.toLocaleString() || 0}
              </div>
              <p className="text-white/80 font-medium">Available Points</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm w-full md:w-auto">
              <div className="flex justify-between items-center mb-3 text-sm font-bold">
                <span>Lifetime Earned</span>
                <span>{reward?.lifetimeEarned?.toLocaleString() || 0} pts</span>
              </div>
              <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              {nextTier !== 'Max' && (
                <p className="text-xs text-white/70 mt-3 font-medium">
                  Earn {(nextTierPoints - reward?.lifetimeEarned).toLocaleString()} more points for <span className="text-yellow-300 font-bold">{nextTier}</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Earn More Suggestions */}
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={18} className="text-orange-500" /> How to earn more?
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-orange-50">
              <span className="font-medium text-gray-700">Make a purchase</span>
              <span className="font-bold text-orange-600">+10 pts / ₹100</span>
            </li>
            <li className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-orange-50">
              <span className="font-medium text-gray-700">Refer a friend</span>
              <span className="font-bold text-orange-600">+200 pts</span>
            </li>
            <li className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-orange-50">
              <span className="font-medium text-gray-700">Review a product</span>
              <span className="font-bold text-orange-600">+50 pts</span>
            </li>
          </ul>
        </div>
      </div>

      {/* History */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History size={18} className="text-primary" /> Reward History
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {history.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${item.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {item.type === 'earned' ? <Star size={20} /> : <Gift size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.description}</h4>
                  <div className="text-xs text-gray-500 mt-1 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`text-lg font-black ${item.type === 'earned' ? 'text-green-600' : 'text-gray-900'}`}>
                {item.type === 'earned' ? '+' : '-'}{item.points}
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No reward history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}