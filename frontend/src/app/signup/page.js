'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Phone, Store } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/profile');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/30">
            <Store size={32} />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the premium grocery experience today
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-glass sm:rounded-3xl sm:px-10 border border-white/50">
          <form className="space-y-5" onSubmit={handleSignup}>
            
            {/* Name */}
            <div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="text-gray-400" size={20} /></div>
                <input
                  type="text" required placeholder="Full Name"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="text-gray-400" size={20} /></div>
                <input
                  type="email" required placeholder="Email Address"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/50"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="text-gray-400" size={20} /></div>
                <input
                  type="tel" required placeholder="Mobile Number"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="text-gray-400" size={20} /></div>
                <input
                  type={showPassword ? "text" : "password"} required placeholder="Password"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/50"
                />
                <button
                  type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

        </div>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
