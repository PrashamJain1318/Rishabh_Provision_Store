'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowLeft, Navigation, ShieldAlert, Phone, Navigation2, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Real-time tracking mock state
  const [driverLat, setDriverLat] = useState(19.0760);
  const [driverLng, setDriverLng] = useState(72.8777);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    setLoading(true);
    setOrderId(searchId);

    // Mock API call & Socket.io Connection initialization
    setTimeout(() => {
      setOrderData({
        id: searchId,
        date: new Date().toISOString(),
        status: 'Out for Delivery',
        deliveryType: 'Express',
        contactless: true,
        deliveryOtp: '4821', // Secure OTP for driver
        items: [
          { name: 'Aashirvaad Atta', qty: 1, price: 280 },
          { name: 'Tata Salt', qty: 2, price: 40 }
        ],
        total: 360,
        driver: {
          name: 'Ramesh Kumar',
          phone: '+91 9876543210',
          vehicle: 'MH 02 AB 1234'
        },
        estimatedTime: '24 mins'
      });
      setLoading(false);
    }, 1500);
  };

  // Simulate Socket.io real-time driver movement
  useEffect(() => {
    if (orderData?.status === 'Out for Delivery') {
      const interval = setInterval(() => {
        setDriverLat(prev => prev + (Math.random() - 0.5) * 0.001);
        setDriverLng(prev => prev + (Math.random() - 0.5) * 0.001);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [orderData]);

  const steps = [
    { id: 'Placed', icon: Package, label: 'Order Placed', time: '10:00 AM' },
    { id: 'Packing', icon: CheckCircle2, label: 'Packed', time: '10:15 AM' },
    { id: 'Out for Delivery', icon: Truck, label: 'Out for Delivery', time: '10:30 AM' },
    { id: 'Delivered', icon: MapPin, label: 'Delivered', time: 'Pending' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Track Your Order</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Enter your order ID below to get real-time Socket.io tracking updates and driver location.
        </p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-4 max-w-md mx-auto mb-12">
        <input 
          type="text" 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="e.g. ORD-1234" 
          className="flex-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading || !searchId.trim()}
          className="bg-primary hover:bg-primary/90 text-white px-8 rounded-2xl font-bold disabled:opacity-50 transition-colors shadow-lg shadow-primary/30"
        >
          {loading ? 'Locating...' : 'Track'}
        </button>
      </form>

      <AnimatePresence>
        {orderData && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header / OTP Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 font-bold mb-1">ORDER ID: {orderData.id}</p>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  Arriving in {orderData.estimatedTime}
                  {orderData.deliveryType === 'Express' && <Zap size={24} className="text-orange-500"/>}
                </h2>
                {orderData.contactless && <p className="text-green-500 font-bold text-sm mt-2 flex items-center gap-1"><CheckCircle2 size={16}/> Contactless Delivery Enabled</p>}
              </div>

              {/* Secure Delivery OTP Box */}
              <div className="bg-gray-900 dark:bg-gray-800 px-8 py-4 rounded-2xl text-center shadow-2xl">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Delivery OTP</p>
                <p className="text-4xl font-black text-white tracking-widest">{orderData.deliveryOtp}</p>
                <p className="text-[10px] text-gray-500 mt-1">Share this with the driver</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Socket.io Map Stub */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm h-[400px] relative group cursor-crosshair">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
                
                {/* Real-time connection indicator */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Socket.io Live Tracking
                </div>

                {/* Driver Pin (Animated) */}
                <motion.div 
                  className="absolute z-10 flex flex-col items-center"
                  animate={{ x: (driverLng - 72.8777) * 100000, y: -(driverLat - 19.0760) * 100000 }} // Mock movement
                  style={{ top: '50%', left: '50%' }}
                >
                  <div className="bg-primary text-white p-3 rounded-full shadow-2xl">
                    <Navigation2 size={24} className="transform -rotate-45"/>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg text-xs font-bold mt-2 border border-gray-200 dark:border-gray-700">
                    {orderData.driver.name}
                  </div>
                </motion.div>
                
                {/* Destination Pin */}
                <div className="absolute z-10 flex flex-col items-center" style={{ top: '30%', left: '70%' }}>
                  <MapPin size={32} className="text-red-500 drop-shadow-xl" fill="currentColor"/>
                </div>
              </div>

              {/* Right: Driver Info & Timeline */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
                
                {/* Driver Profile */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-8">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="https://i.pravatar.cc/150?u=ramesh" alt="Driver" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 dark:text-white">{orderData.driver.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">Vehicle: {orderData.driver.vehicle}</p>
                  </div>
                  <button className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full hover:bg-green-200 transition-colors">
                    <Phone size={20}/>
                  </button>
                </div>

                {/* Timeline */}
                <h3 className="font-bold text-gray-900 dark:text-white mb-6">Order Timeline</h3>
                <div className="space-y-6 flex-1">
                  {steps.map((step, idx) => {
                    const isCompleted = ['Placed', 'Packing', 'Out for Delivery'].includes(step.id);
                    const isCurrent = step.id === orderData.status;
                    return (
                      <div key={step.id} className="flex gap-4 relative">
                        {idx !== steps.length - 1 && (
                          <div className={`absolute left-5 top-10 w-0.5 h-full -z-10 ${isCompleted ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-gray-900 ${isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20' : (isCompleted ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400')}`}>
                          <step.icon size={18} />
                        </div>
                        <div className="pt-2">
                          <p className={`font-bold ${isCurrent ? 'text-primary' : (isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400')}`}>{step.label}</p>
                          <p className="text-sm text-gray-500">{step.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
