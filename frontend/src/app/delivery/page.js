'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, IndianRupee, Star, PackageCheck, Power, Clock, Fuel, CalendarClock, Route, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const MOCK_ACTIVE_ORDERS = [
  { id: 'ORD-9912', dest: 'B-102, Sunrise Apts', dist: '3.2 km', time: '12 mins', payout: 40, priority: 'Normal' },
  { id: 'ORD-9915', dest: 'Tower C, Tech Park', dist: '1.4 km', time: '5 mins', payout: 55, priority: 'Express' },
  { id: 'ORD-9918', dest: 'Villa 44, Palm Grove', dist: '5.1 km', time: '18 mins', payout: 75, priority: 'Normal' },
];

export default function DeliveryDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState(MOCK_ACTIVE_ORDERS);
  const [optimized, setOptimized] = useState(false);
  const [fuelLogged, setFuelLogged] = useState(false);

  const toggleOptimization = () => {
    if (!optimized) {
      // Sort by closest distance first
      const sorted = [...orders].sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
      setOrders(sorted);
      setOptimized(true);
      toast?.success('Route Optimized for lowest distance!');
    } else {
      setOrders(MOCK_ACTIVE_ORDERS);
      setOptimized(false);
      toast?.success('Restored original routing.');
    }
  };

  const handleFuelLog = () => {
    const amount = prompt("Enter Fuel Amount (in ₹):");
    if (amount) {
      setFuelLogged(true);
      toast?.success(`₹${amount} logged for reimbursement.`);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto bg-gray-50 dark:bg-[#0a0a0a] min-h-screen">
      
      {/* Availability Toggle */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 flex justify-between items-center shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div>
          <h2 className="font-black text-xl text-gray-900 dark:text-white">{isOnline ? 'You are Online' : 'You are Offline'}</h2>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
            <Clock size={14}/> Shift ends at 10:00 PM
          </p>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${
            isOnline ? 'bg-green-500 shadow-green-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
          }`}
        >
          <Power size={28} />
        </button>
      </div>

      {/* Stats & Tools Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="bg-green-50 dark:bg-green-900/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <IndianRupee size={20} className="text-green-500" />
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Earnings</p>
          <p className="font-black text-2xl text-gray-900 dark:text-white">₹840</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <PackageCheck size={20} className="text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Delivered</p>
          <p className="font-black text-2xl text-gray-900 dark:text-white">21</p>
        </div>

        {/* Attendance Action */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-3xl text-white">
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <CalendarClock size={20} className="text-white" />
          </div>
          <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Attendance</p>
          <p className="font-bold text-sm">Present (8 Hrs)</p>
        </div>

        {/* Fuel Tracker Action */}
        <div 
          onClick={handleFuelLog}
          className={`p-4 rounded-3xl border cursor-pointer transition-colors ${
            fuelLogged 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${fuelLogged ? 'bg-green-100 text-green-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
            <Fuel size={20} />
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fuel Log</p>
          <p className={`font-bold text-sm ${fuelLogged ? 'text-green-600' : 'text-primary'}`}>
            {fuelLogged ? 'Logged Today' : 'Log Expense'}
          </p>
        </div>
      </div>

      {/* Orders Queue */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white">Active Queue</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">{orders.length} Deliveries Pending</p>
          </div>
          <button 
            onClick={toggleOptimization}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              optimized ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Route size={16} /> {optimized ? 'Optimized' : 'Optimize'}
          </button>
        </div>
        
        {isOnline ? (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order, idx) => (
                <motion.div 
                  layout
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900 dark:text-white">{order.id}</span>
                      {order.priority === 'Express' && (
                        <span className="bg-orange-500/10 text-orange-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Express</span>
                      )}
                    </div>
                    <span className="text-sm font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      +₹{order.payout}
                    </span>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full text-blue-500"><MapPin size={20} /></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.dest}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">{order.dist} • Est. {order.time}</p>
                      </div>
                    </div>
                    
                    <Link href={`/delivery/${order.id}`}>
                      <button className="w-full mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg">
                        <Navigation size={18} /> Start Navigation
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-100 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <Power size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">You are Offline</h3>
            <p className="text-gray-500 text-sm">Go online to view active assignments and start earning.</p>
          </div>
        )}
      </div>

    </div>
  );
}
