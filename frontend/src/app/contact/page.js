'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h1>
        <p className="text-gray-500 mt-4">Have questions about your order or our store? We&apos;re here to help.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white text-primary rounded-xl shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Store Address</h4>
                  <p className="text-gray-600 mt-1">123 Market Street, City Center<br/>New Delhi, IN 400001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white text-secondary rounded-xl shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600 mt-1">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9AM-8PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white text-blue-500 rounded-xl shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Support</h4>
                  <p className="text-gray-600 mt-1">support@rishabhstore.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Send a Message</h3>
          
          <form className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary outline-none transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary outline-none transition-all"></textarea>
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-900 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mt-2"
            >
              Send Message <Send size={18} />
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  );
}
