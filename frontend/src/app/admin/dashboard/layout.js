'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingCart, Users, Tags, Star, 
  Package, Boxes, Settings, LogOut, Ticket, Percent,
  Truck, BarChart3, LineChart, Receipt
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

const MENU_ITEMS = [
  { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Orders', href: '/admin/dashboard/orders', icon: ShoppingCart },
  { name: 'Manage Products', href: '/admin/dashboard/products', icon: Package },
  { name: 'Manage Categories', href: '/admin/dashboard/categories', icon: Tags },
  { name: 'Manage Inventory', href: '/admin/dashboard/inventory', icon: Boxes },
  { name: 'Manage Customers', href: '/admin/dashboard/customers', icon: Users },
  { name: 'Manage Coupons', href: '/admin/dashboard/coupons', icon: Ticket },
  { name: 'Manage Offers', href: '/admin/dashboard/offers', icon: Percent },
  { name: 'Manage Reviews', href: '/admin/dashboard/reviews', icon: Star },
  { name: 'Suppliers', href: '/admin/dashboard/suppliers', icon: Truck },
  { name: 'Reports', href: '/admin/dashboard/reports', icon: BarChart3 },
  { name: 'Profit Margins', href: '/admin/dashboard/profit', icon: LineChart },
  { name: 'Expense Tracking', href: '/admin/dashboard/expenses', icon: Receipt },
  { name: 'Website Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-gray-200">
        
        {/* Sidebar */}
        <aside className="w-72 bg-[#111] border-r border-gray-800 flex flex-col flex-shrink-0 z-20 shadow-2xl shadow-black">
          {/* Admin Header */}
          <div className="h-20 flex items-center px-6 border-b border-gray-800 bg-black/50 backdrop-blur-md">
            <h1 className="text-xl font-black text-white tracking-widest uppercase">Admin <span className="text-red-500">Panel</span></h1>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 translate-x-1' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} /> 
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Logout Footer */}
          <div className="p-4 border-t border-gray-800 bg-[#0c0c0c]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-950/50 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} /> Logout System
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-black relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          
          <div className="p-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
