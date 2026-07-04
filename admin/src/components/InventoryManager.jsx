import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Truck, Plus, CheckCircle2, Factory } from 'lucide-react';

const MOCK_LOW_STOCK = [
  { _id: '1', name: 'Aashirvaad Whole Wheat Atta 5kg', stock: 2, threshold: 10, category: 'Flour' },
  { _id: '2', name: 'Fortune Sunflower Oil 1L', stock: 0, threshold: 15, category: 'Oil' },
  { _id: '3', name: 'Maggi 2-Minute Noodles', stock: 8, threshold: 20, category: 'Snacks' },
];

const MOCK_EXPIRING = [
  { _id: '4', name: 'Amul Taaza Milk 1L', stock: 45, expiresAt: '2023-11-20', daysLeft: 2 },
  { _id: '5', name: 'Britannia Good Day Cookies', stock: 120, expiresAt: '2023-12-05', daysLeft: 17 },
];

const MOCK_SUPPLIERS = [
  { _id: '1', name: 'ITC Wholesale', contact: 'Ravi Kumar', phone: '+91 9876543210' },
  { _id: '2', name: 'Unilever Distributors', contact: 'Sneha Patel', phone: '+91 9123456789' },
];

export default function InventoryManager() {
  const [activeSubTab, setActiveSubTab] = useState('Alerts'); // Alerts, Suppliers, Purchase

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['Alerts', 'Suppliers', 'Purchase Orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-3 px-2 text-sm font-bold transition-colors relative ${
              activeSubTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
            {activeSubTab === tab && (
              <motion.div layoutId="inv-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Alerts View */}
      {activeSubTab === 'Alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Low Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-bold text-red-900">Low Stock Alerts</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Current Stock</th>
                    <th className="px-6 py-3">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_LOW_STOCK.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.stock} Units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-2">
              <Clock className="text-orange-500" size={20} />
              <h3 className="font-bold text-orange-900">Expiring in 30 Days</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Expires In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_EXPIRING.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-500">{item.stock}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded font-bold text-xs bg-red-100 text-red-700">
                          {item.daysLeft} Days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Suppliers View */}
      {activeSubTab === 'Suppliers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Factory size={18} /> Manage Suppliers</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90">
              <Plus size={16} /> Add Supplier
            </button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Supplier Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_SUPPLIERS.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                  <td className="px-6 py-4">{s.contact}</td>
                  <td className="px-6 py-4">{s.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary font-medium hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Orders View */}
      {activeSubTab === 'Purchase Orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Truck size={18} /> Incoming Shipments</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90">
              <Plus size={16} /> Create PO
            </button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">PO ID</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Total Items</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">PO-9012</td>
                <td className="px-6 py-4 font-bold">ITC Wholesale</td>
                <td className="px-6 py-4">150 Units</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹14,500</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="flex items-center gap-1 text-green-600 font-bold hover:underline ml-auto">
                    <CheckCircle2 size={16} /> Mark Received
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
