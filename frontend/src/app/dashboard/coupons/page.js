'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Copy, CheckCircle2, Clock, Info } from 'lucide-react';
import axios from 'axios';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Coupons</h1>
        <p className="text-gray-500">Exclusive offers and promo codes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon, i) => (
          <motion.div 
            key={coupon._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-dashed border-primary/30 rounded-3xl p-6 relative overflow-hidden group hover:border-primary transition-colors shadow-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {coupon.discountType === 'flat' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">On orders above ₹{coupon.minOrderValue}</p>
                </div>
              </div>
              
              {coupon.maxDiscount && (
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Up to ₹{coupon.maxDiscount}
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100 relative z-10">
              <span className="font-mono font-black text-xl tracking-widest text-primary">{coupon.code}</span>
              <button 
                onClick={() => copyToClipboard(coupon.code)}
                className={`p-2 rounded-xl transition-all ${copiedCode === coupon.code ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 hover:text-primary shadow-sm hover:shadow-md'}`}
              >
                {copiedCode === coupon.code ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-500 relative z-10">
              <Clock size={14} /> 
              Valid till {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            
            {/* Cutout circles for coupon effect */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-100 -translate-y-1/2" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-100 -translate-y-1/2" />
          </motion.div>
        ))}
      </div>
      
      {coupons.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Ticket size={32} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">No coupons available</h3>
          <p className="text-gray-500 text-sm">Check back later for exciting offers!</p>
        </div>
      )}
    </div>
  );
}