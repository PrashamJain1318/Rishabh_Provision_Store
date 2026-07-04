import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderTree, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CATEGORIES = [
  { _id: '1', name: 'Rice', itemsCount: 45, image: 'rice.jpg' },
  { _id: '2', name: 'Oil', itemsCount: 32, image: 'oil.jpg' },
  { _id: '3', name: 'Milk', itemsCount: 12, image: 'milk.jpg' },
  { _id: '4', name: 'Chocolate', itemsCount: 89, image: 'choc.jpg' },
  { _id: '5', name: 'Beverages', itemsCount: 156, image: 'bev.jpg' },
  { _id: '6', name: 'Cleaning', itemsCount: 74, image: 'clean.jpg' },
  { _id: '7', name: 'Vegetables', itemsCount: 110, image: 'veg.jpg' },
  { _id: '8', name: 'Fruits', itemsCount: 45, image: 'fruits.jpg' },
  { _id: '9', name: 'Stationery', itemsCount: 210, image: 'stat.jpg' },
  { _id: '10', name: 'Personal Care', itemsCount: 140, image: 'care.jpg' },
  { _id: '11', name: 'Dry Fruits', itemsCount: 35, image: 'dry.jpg' },
  { _id: '12', name: 'Baby Care', itemsCount: 50, image: 'baby.jpg' }
];

export default function CategoriesManager() {
  const [view, setView] = useState('list'); // 'list', 'add'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        
        <button 
          onClick={() => setView('add')}
          className="px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {view === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search categories..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Total Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CATEGORIES.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                      <FolderTree size={18} />
                    </div>
                    {cat.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                      {cat.itemsCount} Items
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'add' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <h3 className="font-bold text-gray-900 mb-6">Add New Category</h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category Name</label>
              <input type="text" placeholder="e.g. Rice, Oil, Milk..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category Image URL</label>
              <input type="text" placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none" />
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button onClick={() => setView('list')} className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 flex-1">Cancel</button>
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 flex-1">Create Category</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
