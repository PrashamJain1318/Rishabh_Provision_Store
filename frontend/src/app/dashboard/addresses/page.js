'use client';

import { motion } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import { useState } from 'react';

const MOCK_ADDRESSES = [
  { id: 1, tag: 'Home', name: 'Prasham Jain', street: 'B-102, Sunrise Apartments, Main Road', city: 'Mumbai', pin: '400001', phone: '+91 9876543210', icon: Home, isDefault: true },
  { id: 2, tag: 'Work', name: 'Prasham Jain', street: 'Tech Park, Tower C, 5th Floor', city: 'Mumbai', pin: '400052', phone: '+91 9876543210', icon: Briefcase, isDefault: false },
];

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add New</>}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add a new address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary dark:text-white" />
            <input type="text" placeholder="Phone Number" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary dark:text-white" />
            <input type="text" placeholder="PIN Code" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary dark:text-white" />
            <input type="text" placeholder="City" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary dark:text-white" />
            <div className="md:col-span-2">
              <textarea placeholder="Flat, House no., Building, Company, Apartment" rows={2} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary dark:text-white"></textarea>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Save Address</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md">
                Default
              </span>
            )}
            
            <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <addr.icon size={18} />
              </div>
              <h3 className="font-bold text-lg">{addr.tag}</h3>
            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">{addr.name}</p>
              <p>{addr.street}</p>
              <p>{addr.city} - {addr.pin}</p>
              <p className="pt-2 flex items-center gap-2"><MapPin size={14} /> {addr.phone}</p>
            </div>

            <div className="flex gap-4 mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
              <button className="text-sm font-medium flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                <Edit2 size={16} /> Edit
              </button>
              <button className="text-sm font-medium flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
