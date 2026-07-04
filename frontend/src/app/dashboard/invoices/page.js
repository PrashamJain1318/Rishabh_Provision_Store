'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (invNum) => {
    toast.success(`Downloading PDF for ${invNum}...`);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-100 rounded-xl" />
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Invoices</h1>
          <p className="text-gray-500">Download and manage your billing history</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search invoice #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-sm font-bold text-gray-500">
                <th className="p-4 sm:px-6 py-4">Invoice No.</th>
                <th className="p-4 sm:px-6 py-4">Date</th>
                <th className="p-4 sm:px-6 py-4">Amount</th>
                <th className="p-4 sm:px-6 py-4">Status</th>
                <th className="p-4 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((inv, i) => (
                <motion.tr 
                  key={inv._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileText size={16} />
                      </div>
                      <span className="font-bold text-gray-900">{inv.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6 py-4 text-sm text-gray-500 font-medium">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 sm:px-6 py-4 font-bold text-gray-900">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleDownload(inv.invoiceNumber)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => handleDownload(inv.invoiceNumber)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Print Invoice"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                <FileText size={24} />
              </div>
              <p className="text-gray-500 font-medium">No invoices found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}