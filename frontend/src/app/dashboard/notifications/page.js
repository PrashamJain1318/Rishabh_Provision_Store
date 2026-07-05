'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, CreditCard, Tag, AlertTriangle, ShieldCheck, CheckCheck, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = (id) => {
    // Optimistic delete for demo
    setNotifications(notifications.filter(n => n._id !== id));
    toast.success('Notification removed');
  };

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <Package className="text-blue-500" />;
      case 'payment': return <CreditCard className="text-green-500" />;
      case 'promo': return <Tag className="text-pink-500" />;
      case 'alert': return <AlertTriangle className="text-orange-500" />;
      default: return <ShieldCheck className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            Notifications 
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Stay updated with your orders and offers</p>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notif, i) => (
            <motion.div 
              key={notif._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex gap-4 ${
                notif.isRead ? 'bg-white border-gray-100 shadow-sm' : 'bg-primary/5 border-primary/20 shadow-md'
              }`}
            >
              <div className={`p-3 rounded-xl shrink-0 h-fit ${notif.isRead ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`font-bold ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h4>
                  <span className="text-xs text-gray-400 font-medium shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${notif.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                  {notif.message}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif._id)}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <CheckCheck size={14} /> Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif._id)}
                    className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notifications.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
              <Bell size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">You&apos;re all caught up!</h3>
            <p className="text-gray-500 text-sm">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}