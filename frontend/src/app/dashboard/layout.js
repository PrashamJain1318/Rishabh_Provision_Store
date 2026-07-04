'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, Heart, ShoppingCart, Package, MapPin, 
  Wallet, Ticket, Gift, Bell, FileText, 
  ShieldQuestion, Settings, LogOut, Navigation 
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const TABS = [
  { name: 'Profile', href: '/dashboard', icon: User },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
  { name: 'Shopping Cart', href: '/cart', icon: ShoppingCart },
  { name: 'My Orders', href: '/dashboard/orders', icon: Package },
  { name: 'Track Orders', href: '/track-order', icon: Navigation },
  { name: 'Saved Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Coupons', href: '/dashboard/coupons', icon: Ticket },
  { name: 'Reward Points', href: '/dashboard/rewards', icon: Gift },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Support', href: '/dashboard/support', icon: ShieldQuestion },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredRole="customer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
              P
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Customer</h2>
              <p className="text-sm text-gray-500">Premium Member</p>
            </div>
          </div>
          
          <nav className="p-2 space-y-1 h-[60vh] overflow-y-auto no-scrollbar">
            {TABS.map((tab) => {
              // Exact match or sub-route match for active state
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.name} href={tab.href}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 translate-x-1' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} /> {tab.name}
                  </button>
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[70vh]">
          {children}
        </div>
      </div>
      
    </div>
    </ProtectedRoute>
  );
}
