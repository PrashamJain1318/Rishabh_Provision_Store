'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart } from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, Target, Zap, Users, Brain, Map } from 'lucide-react';

const PROFIT_EXPENSE_DATA = [
  { month: 'Jan', revenue: 45000, profit: 12000, expense: 33000 },
  { month: 'Feb', revenue: 52000, profit: 15000, expense: 37000 },
  { month: 'Mar', revenue: 48000, profit: 11000, expense: 37000 },
  { month: 'Apr', revenue: 61000, profit: 21000, expense: 40000 },
  { month: 'May', revenue: 59000, profit: 18000, expense: 41000 },
  { month: 'Jun', revenue: 75000, profit: 28000, expense: 47000 },
];

const PREDICTION_DATA = [
  { item: 'Aashirvaad Atta', currentDemand: 80, predictedDemand: 95, confidence: 92 },
  { item: 'Tata Salt', currentDemand: 90, predictedDemand: 85, confidence: 88 },
  { item: 'Almond Milk', currentDemand: 40, predictedDemand: 65, confidence: 78 }, // Upward trend
  { item: 'Winter Cream', currentDemand: 70, predictedDemand: 30, confidence: 85 }, // Downward trend
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Advanced Analytics</h1>
        <p className="text-gray-400 text-sm">Profitability, Predictions, and Heatmaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profit vs Expense Chart */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><IndianRupee size={18} className="text-green-500"/> Profit vs Expense</h3>
            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-xs font-bold">+24% Margin</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={PROFIT_EXPENSE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="month" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} name="Net Profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Demand Prediction */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-white flex items-center gap-2"><Brain size={18} className="text-purple-500"/> AI Demand Prediction (Next 30 Days)</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            {PREDICTION_DATA.map((data, i) => {
              const isUp = data.predictedDemand > data.currentDemand;
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-gray-800">
                  <div>
                    <p className="font-bold text-white text-sm">{data.item}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Target size={12}/> {data.confidence}% Confidence Score
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <span className="text-gray-400">Cur: {data.currentDemand}</span>
                    <Arrow direction={isUp} />
                    <span className={isUp ? 'text-green-500' : 'text-red-500'}>Est: {data.predictedDemand}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Best & Slow Movers */}
        <div className="lg:col-span-2 bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
           <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Zap size={18} className="text-yellow-500"/> Product Velocity</h3>
           <div className="grid grid-cols-2 gap-6">
             <div className="space-y-3">
               <h4 className="text-green-500 text-xs font-bold uppercase tracking-widest mb-4">Best Sellers</h4>
               {['Farm Fresh Tomatoes', 'Aashirvaad Atta', 'Amul Butter', 'Maggi Noodles'].map(i => (
                 <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                   <span className="text-gray-300">{i}</span>
                   <TrendingUp size={16} className="text-green-500"/>
                 </div>
               ))}
             </div>
             <div className="space-y-3">
               <h4 className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Slow Movers</h4>
               {['Imported Avocado', 'Gluten-Free Bread', 'Exotic Dragonfruit', 'Vegan Cheese'].map(i => (
                 <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                   <span className="text-gray-300">{i}</span>
                   <TrendingDown size={16} className="text-red-500"/>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Customer Heatmap Stub */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Map size={18} className="text-blue-500"/> Delivery Heatmap</h3>
          <p className="text-xs text-gray-400 mb-4">Visualizing order density across zones.</p>
          <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 relative overflow-hidden flex items-center justify-center min-h-[200px]">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
            <div className="absolute w-24 h-24 bg-red-500/40 blur-2xl rounded-full top-10 left-10"></div>
            <div className="absolute w-16 h-16 bg-orange-500/40 blur-xl rounded-full bottom-10 right-10"></div>
            <div className="absolute w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <Map size={32} className="text-gray-700 relative z-10" />
          </div>
        </div>

      </div>
    </div>
  );
}

function Arrow({ direction }) {
  return direction ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />;
}
