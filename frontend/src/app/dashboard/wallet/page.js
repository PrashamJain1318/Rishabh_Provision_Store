'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, Gift, CheckCircle2, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function WalletPage() {
  const [data, setData] = useState({ wallet: null, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAddMoney = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/wallet/add', { amount: 500 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWalletData();
    } catch (error) {
      console.error('Error adding money:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-gray-100 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  const { wallet, transactions } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Wallet</h1>
          <p className="text-gray-500">Manage your credits and cashback</p>
        </div>
        <button 
          onClick={mockAddMoney}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Add Money (Demo)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-gradient-to-br from-primary to-green-700 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="text-white/80 font-medium uppercase tracking-wider text-sm flex items-center gap-2">
                <Wallet size={16} /> Total Balance
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20">
                ACTIVE
              </span>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 font-mono tracking-tight">
                ₹{wallet?.balance?.toLocaleString() || 0}
              </div>
              <p className="text-white/80">Available for next purchase</p>
            </div>
          </div>
        </motion.div>

        {/* Secondary Balances */}
        <div className="space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Cashback</p>
              <p className="text-2xl font-black text-gray-900">₹{wallet?.cashback?.toLocaleString() || 0}</p>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-50 border border-purple-100 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Reward Coins</p>
              <p className="text-2xl font-black text-gray-900">{wallet?.rewardCoins?.toLocaleString() || 0}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History size={18} className="text-primary" /> Transaction History
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <div key={tx._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{tx.description}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="uppercase tracking-wider font-medium">{tx.category}</span>
                    <span>•</span>
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}