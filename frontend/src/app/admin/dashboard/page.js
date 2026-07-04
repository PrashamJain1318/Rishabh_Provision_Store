'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IndianRupee, ShoppingCart, Users, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Charts
const revenueData = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 19000 },
  { name: 'Wed', revenue: 15000 },
  { name: 'Thu', revenue: 22000 },
  { name: 'Fri', revenue: 28000 },
  { name: 'Sat', revenue: 35000 },
  { name: 'Sun', revenue: 42000 },
];

const salesData = [
  { name: 'Mon', orders: 120 },
  { name: 'Tue', orders: 190 },
  { name: 'Wed', orders: 150 },
  { name: 'Thu', orders: 220 },
  { name: 'Fri', orders: 280 },
  { name: 'Sat', orders: 350 },
  { name: 'Sun', orders: 420 },
];

const recentOrders = [
  { id: 'ORD-101', customer: 'Rahul Sharma', amount: 1450, status: 'Pending', date: 'Just now' },
  { id: 'ORD-102', customer: 'Priya Patel', amount: 890, status: 'Processing', date: '5 mins ago' },
  { id: 'ORD-103', customer: 'Amit Kumar', amount: 2100, status: 'Delivered', date: '1 hour ago' },
  { id: 'ORD-104', customer: 'Neha Singh', amount: 450, status: 'Cancelled', date: '2 hours ago' },
  { id: 'ORD-105', customer: 'Unknown User', amount: 12500, status: 'Pending', date: '3 hours ago', fraudRisk: true },
];

const lowStockItems = [
  { name: 'Aashirvaad Atta 5kg', stock: 2, category: 'Atta' },
  { name: 'Amul Butter 500g', stock: 1, category: 'Dairy' },
  { name: 'Fortune Sunflower Oil 1L', stock: 4, category: 'Oil' },
];

export default function AdminDashboardOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent Recharts hydration mismatch

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back, Super Admin. Here is what is happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold border border-gray-700 hover:bg-gray-700 transition">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue (Month)" value="₹8,45,200" trend="+12.5%" icon={IndianRupee} color="text-green-500" bg="bg-green-500/10" border="border-green-500/20" />
        <MetricCard title="Total Orders (Month)" value="4,210" trend="+8.2%" icon={ShoppingCart} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
        <MetricCard title="Total Customers" value="12,450" trend="+14.1%" icon={Users} color="text-purple-500" bg="bg-purple-500/10" border="border-purple-500/20" />
        <MetricCard title="Low Stock Alerts" value="24 Items" trend="Critical" icon={AlertTriangle} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><TrendingUp size={18} className="text-green-500"/> Revenue Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><Package size={18} className="text-blue-500"/> Orders Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <RechartsTooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} cursor={{fill: '#222'}} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
            <h3 className="font-bold text-white">Recent Orders</h3>
            <Link href="/admin/dashboard/orders" className="text-sm font-bold text-red-500 hover:text-red-400">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-[#0a0a0a]">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      {order.id}
                      {order.fraudRisk && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold rounded-full border border-red-500/50 uppercase">AI Fraud Alert</span>}
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-bold text-white">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        order.status === 'Delivered' ? 'bg-green-900/30 text-green-400 border-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                        'bg-red-900/30 text-red-400 border-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#111] rounded-2xl border border-red-900/30 shadow-xl overflow-hidden shadow-red-900/10">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-red-950/20">
            <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={18} className="text-red-500"/> Low Stock Alerts</h3>
          </div>
          <div className="p-4 space-y-4">
            {lowStockItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-gray-800 hover:border-red-900/50 transition">
                <div>
                  <h4 className="font-bold text-gray-200 text-sm mb-1">{item.name}</h4>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-red-500">{item.stock}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Left</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-2 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-700 transition">
              Manage Inventory
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color, bg, border }) {
  return (
    <div className={`p-6 rounded-2xl bg-[#111] border border-gray-800 shadow-lg relative overflow-hidden group hover:border-gray-700 transition-colors`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bg} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${border} border`}>
          <Icon className={color} size={22} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 relative z-10">
        <span className={`text-sm font-bold ${trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
        <span className="text-xs text-gray-500 font-medium">vs last month</span>
      </div>
    </div>
  );
}
