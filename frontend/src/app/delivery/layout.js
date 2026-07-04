'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Package, User } from 'lucide-react';

export default function DeliveryLayout({ children }) {
  // Mobile-first layout for Delivery Partners
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Mobile Top App Bar */}
      <header className="bg-white dark:bg-gray-900 h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Package size={18} />
          </div>
          <span className="font-bold">Partner App</span>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-950 pb-20">
        {children}
      </main>
      
    </div>
  );
}
