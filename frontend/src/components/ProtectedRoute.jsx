'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

// requiredRole can be 'customer', 'admin', 'delivery'
export default function ProtectedRoute({ children, requiredRole = 'customer' }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        router.push(requiredRole === 'admin' ? '/admin/login' : '/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (requiredRole && user.role !== requiredRole) {
          // e.g. Customer trying to access Admin Dashboard
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        router.push(requiredRole === 'admin' ? '/admin/login' : '/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You do not have the required permissions to view this page. If you believe this is an error, please contact support or log in with a different account.
        </p>
        <button 
          onClick={() => router.push(requiredRole === 'admin' ? '/admin/login' : '/login')}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-colors"
        >
          Switch Account
        </button>
      </div>
    );
  }

  return children;
}
