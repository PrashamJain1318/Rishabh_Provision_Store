'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Package, Mail, MapPin, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-XXXX';
  const { cartItems } = useCart(); // In a real app, we'd clear cart and fetch order details by ID

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-green-500 p-8 text-center text-white">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
            >
              <CheckCircle2 size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-green-50 text-sm">Thank you for shopping at Rishabh Provision Store.</p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="text-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
              <p className="text-2xl font-mono text-gray-900 dark:text-white font-bold">{orderId}</p>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-full w-max mx-auto">
                <Mail size={16} /> Invoice sent to your email
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><Package size={16}/> Delivery Slot</p>
                <p className="font-bold text-gray-900 dark:text-white">Today (10:00 AM - 12:00 PM)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><MapPin size={16}/> Shipping To</p>
                <p className="font-bold text-gray-900 dark:text-white">Prasham Jain</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">B-102, Sunrise Apartments, Mumbai</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/track-order" className="flex-1">
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <MapPin size={18} /> Track Order
                </button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Home size={18} /> Back to Store
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
