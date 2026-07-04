'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Fruits & Vegetables', items: '120+ Items', color: 'bg-green-100', text: 'text-green-700' },
  { id: 2, name: 'Dairy & Breakfast', items: '85+ Items', color: 'bg-yellow-100', text: 'text-yellow-700' },
  { id: 3, name: 'Snacks & Munchies', items: '200+ Items', color: 'bg-orange-100', text: 'text-orange-700' },
  { id: 4, name: 'Cold Drinks & Juices', items: '90+ Items', color: 'bg-red-100', text: 'text-red-700' },
  { id: 5, name: 'Instant & Frozen Food', items: '150+ Items', color: 'bg-blue-100', text: 'text-blue-700' },
  { id: 6, name: 'Bakery & Biscuits', items: '75+ Items', color: 'bg-amber-100', text: 'text-amber-700' },
  { id: 7, name: 'Sweet Tooth', items: '60+ Items', color: 'bg-pink-100', text: 'text-pink-700' },
  { id: 8, name: 'Personal Care', items: '300+ Items', color: 'bg-purple-100', text: 'text-purple-700' },
  { id: 9, name: 'Cleaning Essentials', items: '180+ Items', color: 'bg-teal-100', text: 'text-teal-700' },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-2">Browse products by category</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {MOCK_CATEGORIES.map((cat, idx) => (
          <Link key={cat.id} href={`/products?category=${cat.id}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${cat.color} rounded-2xl p-6 h-40 flex flex-col justify-end relative overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
              <h3 className={`font-bold ${cat.text} text-lg leading-tight z-10`}>{cat.name}</h3>
              <p className={`text-sm ${cat.text} opacity-80 mt-1 z-10`}>{cat.items}</p>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
