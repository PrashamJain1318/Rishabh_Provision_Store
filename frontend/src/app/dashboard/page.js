'use client';

import { CreditCard, Heart, Package } from 'lucide-react';

export default function CustomerDashboardOverview() {
  // Mock Data
  const user = { name: 'Customer', email: 'customer@example.com', phone: '+91 9876543210', walletBalance: 1250, loyaltyPoints: 4500 };
  const orders = [
    { id: 'ORD-8921', date: 'Oct 24, 2024', total: 1845, status: 'Delivered', items: 12 },
    { id: 'ORD-8910', date: 'Oct 15, 2024', total: 650, status: 'Delivered', items: 4 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h2>
          <p className="text-gray-500">{user.email} • {user.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-primary p-6 rounded-2xl text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-white/90 font-medium mb-1">Rishabh Wallet Balance</h3>
            <p className="text-4xl font-extrabold mb-4">₹{user.walletBalance}</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold transition">Add Money</button>
          </div>
          <CreditCard className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500" size={120} />
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-secondary p-6 rounded-2xl text-white shadow-lg shadow-secondary/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-white/90 font-medium mb-1">Loyalty Reward Points</h3>
            <p className="text-4xl font-extrabold mb-4">{user.loyaltyPoints} <span className="text-lg font-normal">pts</span></p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold transition">Redeem Now</button>
          </div>
          <Heart className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500" size={120} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Recent Order Activity</h3>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.map((order, i) => (
          <div key={order.id} className={`p-4 flex items-center justify-between ${i !== orders.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl"><Package className="text-gray-500" /></div>
              <div>
                <h4 className="font-bold text-gray-900">{order.id}</h4>
                <p className="text-sm text-gray-500">{order.items} items • {order.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{order.total}</p>
              <p className="text-sm text-green-600 font-medium">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
