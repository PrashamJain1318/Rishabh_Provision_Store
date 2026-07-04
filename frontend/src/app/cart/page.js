'use client';

import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, totals, updateQuantity, removeFromCart, applyCoupon, removeCoupon, coupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = () => {
    const res = applyCoupon(couponInput);
    setCouponMessage(res.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"
            >
              <div className={`w-20 h-20 rounded-xl ${item.image}`}></div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-primary font-bold">₹{item.price}</p>
                <p className="text-xs text-gray-500">GST: {item.gst}%</p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-1 text-gray-500 hover:text-primary"><Minus size={16} /></button>
                <span className="w-4 text-center font-medium text-sm text-gray-900 dark:text-white">{item.qty}</span>
                <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-1 text-gray-500 hover:text-primary"><Plus size={16} /></button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2">
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}

          {cartItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty.</p>
              <Link href="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          {/* Coupon Code Block */}
          {cartItems.length > 0 && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Tag size={18} /> Apply Coupon</h2>
              {coupon ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl flex justify-between items-center text-green-700 dark:text-green-400">
                  <span className="font-bold">{coupon.code} Applied!</span>
                  <button onClick={removeCoupon} className="hover:bg-green-100 dark:hover:bg-green-900/40 p-1 rounded-full">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Code (try SAVE100)" 
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none dark:text-white uppercase"
                  />
                  <button onClick={handleApplyCoupon} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl font-bold text-sm">Apply</button>
                </div>
              )}
              {couponMessage && !coupon && <p className="text-xs text-red-500 mt-2">{couponMessage}</p>}
            </div>
          )}

          {/* Totals Panel */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Taxes (GST)</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{totals.totalTax.toFixed(2)}</span>
              </div>
              
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                  <span>Discount</span>
                  <span>-₹{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span className={totals.deliveryCharges === 0 ? 'text-green-600 dark:text-green-400 font-bold' : 'font-medium text-gray-900 dark:text-white'}>
                  {totals.deliveryCharges === 0 ? 'FREE' : `₹${totals.deliveryCharges}`}
                </span>
              </div>

              {totals.deliveryCharges > 0 && totals.subtotal > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800/30">
                  Add items worth ₹{(500 - totals.subtotal).toFixed(2)} more for FREE delivery!
                </p>
              )}
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Estimated Total</span>
                <span>₹{totals.estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              disabled={cartItems.length === 0}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
