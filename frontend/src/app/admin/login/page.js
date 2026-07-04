'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enforce Admin Only
        body: JSON.stringify({ email, password, adminOnly: true }) 
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/admin/dashboard'); // Redirect to real admin dashboard
      } else {
        setMessage(data.message || 'Access Denied.');
      }
    } catch (err) {
      setMessage('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Dark Mode Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-black border border-gray-700 p-4 rounded-2xl text-white shadow-2xl shadow-black/50">
            <ShieldCheck size={40} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Secure access strictly for authorized personnel
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-[#111] shadow-2xl sm:rounded-3xl border border-gray-800 p-8 sm:px-10">
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.includes('success') ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'}`}>
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <div className="relative rounded-xl shadow-sm">
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-700 rounded-xl text-sm bg-black text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors placeholder-gray-600"
                  placeholder="admin@rishabhstore.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Security Key</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-500" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-xl text-sm bg-black text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-black transition-all active:scale-[0.98]">
                {loading ? 'Authenticating Identity...' : 'Authorize Access'} <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-6 text-center border-t border-gray-800 pt-6">
              <button type="button" onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Auto-fill Demo Admin Credentials
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
