import Link from 'next/link';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-xl text-white">
                <Store size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rishabh <span className="text-primary">Store</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your neighborhood provision store, now online. Fresh groceries delivered to your doorstep in minutes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors text-sm font-bold">FB</a>
              <a href="#" className="hover:text-primary transition-colors text-sm font-bold">TW</a>
              <a href="#" className="hover:text-primary transition-colors text-sm font-bold">IG</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors">Today&apos;s Offers</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Customer Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>123 Market Street, City Center, IN 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@rishabhstore.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Rishabh Provision Store. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
