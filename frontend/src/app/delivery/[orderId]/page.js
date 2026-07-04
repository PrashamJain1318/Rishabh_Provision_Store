'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, CheckCircle2, ChevronLeft, ShieldCheck, Map as MapIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ActiveDeliveryPage() {
  const { orderId } = useParams();
  const router = useRouter();
  
  const [status, setStatus] = useState('EnRoute'); // EnRoute, Arrived, Delivered
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus logic would go here in a real app
    if (newOtp.every(v => v !== '')) {
      setTimeout(() => {
        setShowOtpModal(false);
        setStatus('Delivered');
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Top Nav */}
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 shrink-0">
        <Link href="/delivery">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <ChevronLeft size={24} />
          </button>
        </Link>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{orderId}</h2>
          <p className="text-xs text-primary font-bold">● {status}</p>
        </div>
      </div>

      {/* Mock Map Area */}
      <div className="flex-1 bg-blue-50/50 dark:bg-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Decorative Map Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
          backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="z-10 text-center text-gray-400">
          <MapIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">GPS Navigation Active</p>
          <p className="text-xs">Distance: 1.2km • 5 mins away</p>
        </div>

        {/* Route Line Mock */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-2 bg-primary/20 rounded-full blur-[1px] rotate-45"></div>
      </div>

      {/* Bottom Action Sheet */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-3xl p-6 shrink-0 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-6"></div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Prasham Jain</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={14} /> B-102, Sunrise Apts
            </p>
          </div>
          <button className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center">
            <Phone size={20} />
          </button>
        </div>

        {/* Delivery Instructions */}
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl">
          <p className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1">Customer Instructions</p>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">&quot;Please leave the grocery bags at the front door and don&apos;t ring the bell. Baby is sleeping.&quot;</p>
        </div>

        {status === 'EnRoute' && (
          <button 
            onClick={() => setStatus('Arrived')}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <Navigation size={20} /> Mark as Arrived
          </button>
        )}

        {status === 'Arrived' && (
          <button 
            onClick={() => setShowOtpModal(true)}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Enter OTP to Deliver
          </button>
        )}

        {status === 'Delivered' && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 font-bold border border-green-200 dark:border-green-900/30">
            <CheckCircle2 size={24} /> Successfully Delivered!
          </div>
        )}
      </div>

      {/* OTP Modal Overlay */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm"
            >
              <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">Verify Delivery</h3>
              <p className="text-sm text-center text-gray-500 mb-6">Ask the customer for the 4-digit PIN</p>
              
              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, i) => (
                  <input 
                    key={i}
                    type="number" 
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:outline-none dark:text-white"
                  />
                ))}
              </div>

              <button 
                onClick={() => setShowOtpModal(false)}
                className="w-full text-gray-500 font-medium py-3"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
