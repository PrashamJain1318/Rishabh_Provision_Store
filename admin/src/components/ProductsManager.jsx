import React, { useState } from 'react';
import { Plus, Upload, Search, Edit2, Trash2, QrCode, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_PRODUCTS = [
  { _id: '1', name: 'Farm Fresh Tomatoes', price: 40, stock: 150, gst: 5, barcode: '890123456789' },
  { _id: '2', name: 'Aashirvaad Atta 5kg', price: 210, stock: 45, gst: 0, barcode: '890987654321' },
];

export default function ProductsManager() {
  const [view, setView] = useState('list'); // 'list', 'add', 'bulk'

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploading ${file.name}... (CSV parsing logic here)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products Inventory</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setView('bulk')}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Upload size={18} /> Bulk Upload CSV
          </button>
          <button 
            onClick={() => setView('add')}
            className="px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {view === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or barcode..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">GST %</th>
                <th className="px-6 py-4">Barcode</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageIcon size={18} />
                    </div>
                    {prod.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">₹{prod.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${prod.stock > 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {prod.stock} Units
                    </span>
                  </td>
                  <td className="px-6 py-4">{prod.gst}%</td>
                  <td className="px-6 py-4 font-mono text-xs">{prod.barcode}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-400 hover:text-blue-500"><QrCode size={18} /></button>
                      <button className="text-gray-400 hover:text-primary"><Edit2 size={18} /></button>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'add' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Add New Product</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none">
                <option>Vegetables</option>
                <option>Staples</option>
                <option>Snacks</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Selling Price (₹)</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">GST Percentage (%)</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
              <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Barcode <button className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">Generate Random</button></label>
              <input type="text" placeholder="Scan or enter barcode..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:outline-none font-mono" />
            </div>
            <div className="col-span-2 flex gap-4 mt-4">
              <button onClick={() => setView('list')} className="px-6 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
              <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">Save Product</button>
            </div>
          </div>
        </motion.div>
      )}

      {view === 'bulk' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <Upload size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="font-bold text-gray-900 text-lg mb-2">Upload CSV File</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Make sure your CSV contains headers for Name, Price, Stock, GST, and Barcode.</p>
          
          <input type="file" id="csvUpload" accept=".csv" className="hidden" onChange={handleBulkUpload} />
          <label htmlFor="csvUpload" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold cursor-pointer hover:bg-gray-800 transition-colors">
            Select CSV File
          </label>
          <div className="mt-4">
            <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:underline">Back to List</button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
