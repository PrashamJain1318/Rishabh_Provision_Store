'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, Search, Store, Mic, LogOut, X, ScanBarcode, QrCode, Clock, TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';

const TRENDING_SEARCHES = ['Maggi Noodles', 'Amul Butter', 'Aashirvaad Atta', 'Cold Drinks', 'Ice Cream'];
const RECENT_SEARCHES = ['Basmati Rice', 'Tata Salt', 'Fortune Sunflower Oil'];
const SUGGESTIONS = ['Milk', 'Bread', 'Eggs', 'Paneer', 'Curd', 'Cheese', 'Tomato Ketchup', 'Dark Chocolate', 'Green Tea', 'Coffee Powder'];

export default function Navbar() {
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Advanced Search States
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch(e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    if (userRole === 'admin') router.push('/admin/login');
    else router.push('/login');
  };

  const handleSearchSubmit = (e) => {
    if(e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const executeSearch = (term) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    router.push(`/search?keyword=${encodeURIComponent(term)}`);
  };

  const toggleVoiceSearch = () => {
    if (isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Search.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      setTimeout(() => executeSearch(transcript), 500);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const mockBarcodeScan = () => {
    alert("Launching Barcode Scanner Camera...");
  };

  const mockQrScan = () => {
    alert("Launching QR Scanner Camera...");
  };

  const getNavLinks = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Products', href: '/admin/dashboard/products' },
        { name: 'Orders', href: '/admin/dashboard/orders' },
        { name: 'Customers', href: '/admin/dashboard/customers' },
      ];
    } else if (userRole === 'customer') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Services', href: '/services' },
        { name: 'Orders', href: '/dashboard/orders' },
        { name: 'Wishlist', href: '/wishlist' },
        { name: 'AI Scanner', href: '/ai-scanner' },
        { name: 'Profile', href: '/dashboard' },
      ];
    } else {
      return [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Services', href: '/services' },
        { name: 'Offers', href: '/offers' },
        { name: 'AI Scanner', href: '/ai-scanner' },
        { name: 'Login', href: '/login' },
        { name: 'Signup', href: '/signup' },
      ];
    }
  };

  const navLinks = getNavLinks();
  const filteredSuggestions = SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:bg-primary/90 transition-colors">
              <Store size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
              Rishabh <span className="text-primary">Store</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 mx-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className={`text-sm font-bold transition-colors ${pathname === link.href ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Advanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Search className="absolute left-3 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search over 200+ groceries..." 
                className="w-full bg-gray-100 dark:bg-gray-800 border-transparent text-gray-900 dark:text-white text-sm rounded-full focus:ring-2 focus:ring-primary focus:border-transparent block pl-10 pr-24 py-2 outline-none transition-all placeholder-gray-500"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button type="button" onClick={mockBarcodeScan} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Barcode Search">
                  <ScanBarcode size={16} />
                </button>
                <button type="button" onClick={mockQrScan} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="QR Search">
                  <QrCode size={16} />
                </button>
                <button type="button" onClick={toggleVoiceSearch} className={`p-1.5 rounded-full transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900/30' : 'text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700'}`} title="Voice Search">
                  <Mic size={16} />
                </button>
              </div>
            </form>

            {/* Auto Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  {searchQuery.length === 0 ? (
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={12}/> Recent</h4>
                        <div className="space-y-1">
                          {RECENT_SEARCHES.map(item => (
                            <button key={item} onClick={() => executeSearch(item)} className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp size={12}/> Trending</h4>
                        <div className="space-y-1">
                          {TRENDING_SEARCHES.map(item => (
                            <button key={item} onClick={() => executeSearch(item)} className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map(item => (
                          <button key={item} onClick={() => executeSearch(item)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <Search size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.substring(0, item.toLowerCase().indexOf(searchQuery.toLowerCase()))}
                              <span className="text-primary font-bold">{item.substring(item.toLowerCase().indexOf(searchQuery.toLowerCase()), item.toLowerCase().indexOf(searchQuery.toLowerCase()) + searchQuery.length)}</span>
                              {item.substring(item.toLowerCase().indexOf(searchQuery.toLowerCase()) + searchQuery.length)}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Press Enter to search for &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <ThemeToggle />
            
            {userRole !== 'admin' && (
              <>
                <Link href="/wishlist">
                  <button className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors hidden sm:block">
                    <Heart size={22} />
                  </button>
                </Link>
                
                <Link href="/cart" className="relative">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2">
                    <ShoppingCart size={22} />
                  </motion.div>
                  {cartItems?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            {userRole ? (
              <button onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors p-2 hidden sm:block" title="Logout">
                <LogOut size={22} />
              </button>
            ) : (
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2 hidden sm:block" title="Login">
                  <User size={22} />
                </motion.div>
              </Link>
            )}

            <button className="lg:hidden text-gray-600 dark:text-gray-300 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
