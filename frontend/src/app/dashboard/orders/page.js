'use client';

import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Clock, Search } from 'lucide-react';
import { useState } from 'react';

const MOCK_ORDERS = [
  { id: '#ORD-1209', date: 'Oct 24, 2026', total: 1250, status: 'Delivered', items: 'Aashirvaad Atta, Tomatoes, and 3 more' },
  { id: '#ORD-1150', date: 'Sep 15, 2026', total: 840, status: 'Processing', items: 'Maggi, Fortune Oil, and 1 more' },
  { id: '#ORD-1092', date: 'Aug 02, 2026', total: 420, status: 'Delivered', items: 'Broccoli, Surf Excel' },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order List */}
        <div className="lg:col-span-2 space-y-4">
          {MOCK_ORDERS.map((order, idx) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedOrder(order)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedOrder?.id === order.id 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.id}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={14} /> {order.date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Delivered' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{order.items}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Total: ₹{order.total}</span>
                <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Invoice Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText size={18} /> Invoice
                </h3>
                <button className="text-gray-400 hover:text-primary transition-colors" title="Download PDF">
                  <Download size={18} />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Paid via UPI</span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-gray-200 dark:border-gray-700"></div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.total - 40}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <Download size={16} /> Print Receipt
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center h-full flex flex-col items-center justify-center text-gray-500">
              <FileText size={32} className="mb-2 opacity-50" />
              <p>Select an order to view its invoice.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
