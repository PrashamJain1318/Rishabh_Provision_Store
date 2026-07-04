import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { IndianRupee, Package, Users, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  // In a real app, these would fetch from the backend we just built.
  // For the MVP UI visualization, we will generate robust mock data that matches our backend schema
  // since the backend might not have enough historical order data seeded yet to look good on a chart.

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      // Generate 30 days of mock data for 'daily'
      const mockSales = [];
      let date = new Date();
      date.setDate(date.getDate() - 30);
      
      for(let i=0; i<30; i++) {
        const rev = Math.floor(Math.random() * 50000) + 10000;
        mockSales.push({
          date: date.toISOString().split('T')[0],
          revenue: rev,
          profit: rev * 0.20,
          orders: Math.floor(Math.random() * 100) + 20
        });
        date.setDate(date.getDate() + 1);
      }

      setSalesData(mockSales);

      setTopProducts([
        { name: 'Aashirvaad Atta 5kg', totalSold: 450, revenue: 157500 },
        { name: 'Amul Butter 500g', totalSold: 380, revenue: 95000 },
        { name: 'Maggi Noodles', totalSold: 320, revenue: 16000 },
        { name: 'Fortune Oil 1L', totalSold: 290, revenue: 43500 },
        { name: 'Tata Salt 1kg', totalSold: 250, revenue: 5000 }
      ]);

      setSummary({
        revenue: 845230,
        profit: 169046,
        orders: 1254,
        users: 856
      });

      setLoading(false);
    }, 800);
  }, [period]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-primary font-bold animate-pulse">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        
        {/* Period Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
          {['daily', 'monthly', 'yearly'].map(p => (
            <button 
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all ${
                period === p ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `₹${summary?.revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-100' },
          { title: 'Est. Profit (20%)', value: `₹${summary?.profit.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'Total Orders', value: summary?.orders.toLocaleString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Customers', value: summary?.users.toLocaleString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue vs Profit Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={18} /> Revenue & Profit Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, undefined]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Package size={18} /> Order Volume</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Products Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><ShoppingBag size={18} /> Best Selling Products (Volume)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="totalSold" name="Units Sold" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Revenue Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><IndianRupee size={18} /> Top Revenue Generators</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Product</th>
                  <th className="px-4 py-3">Units Sold</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.sort((a,b) => b.revenue - a.revenue).map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.totalSold}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
