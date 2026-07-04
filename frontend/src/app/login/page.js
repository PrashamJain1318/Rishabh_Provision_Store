'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, KeyRound, Fingerprint } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('login'); // 'login' or 'forgot'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe, adminOnly: false })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      if (!window.PublicKeyCredential) {
        setMessage('WebAuthn is not supported in this browser.');
        return;
      }
      setLoading(true);
      // Mocking WebAuthn API Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockToken = "mock_passkey_token";
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify({ role: 'customer', name: 'Passkey User' }));
      router.push('/dashboard');
    } catch (err) {
      setMessage('Biometric authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message || 'If the email exists, a reset link has been sent.');
    } catch (err) {
      setMessage('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/30">
            {view === 'login' ? <Store size={32} /> : <KeyRound size={32} />}
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {view === 'login' ? 'Customer Login' : 'Reset Password'}
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-glass sm:rounded-3xl border border-white/50 p-8 sm:px-10">
          
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.includes('success') || message.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          {view === 'login' ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl sm:text-sm bg-white/50 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl sm:text-sm bg-white/50 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me (30 Days)
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" onClick={() => setView('forgot')} className="font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-primary/20 focus:ring-primary transition-all active:scale-[0.98]">
                  {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-6 text-center space-y-4">
                <button 
                  type="button" 
                  onClick={handleBiometricLogin} 
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  <Fingerprint size={18} className="text-primary" /> Login with Face ID / Touch ID
                </button>
                
                <div>
                  <span className="text-sm text-gray-500">Or login with OTP?</span>
                  <button type="button" onClick={() => { setEmail('customer@example.com'); setPassword('password123'); }} className="ml-2 text-sm font-bold text-primary hover:underline">
                    Auto-fill Demo Customer
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter your Email Address</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl sm:text-sm bg-white/50 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-primary/20 transition-all active:scale-[0.98]">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center mt-4">
                <button type="button" onClick={() => setView('login')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have a customer account?{' '}
          <Link href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
