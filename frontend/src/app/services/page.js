'use client';

import { motion } from 'framer-motion';
import { Milk, Newspaper, Croissant, ShoppingBasket, Users, Leaf, RefreshCcw, MapPin, Phone, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ServicesHubPage() {
  
  const handleSubscribe = (service) => {
    toast?.success(`Successfully subscribed to ${service}!`);
  };

  const handleEcoToggle = () => {
    toast?.success('Eco Mode Activated! Future orders will use minimal plastic packaging.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Store Services & Subscriptions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Automate your daily needs, shop together with your neighborhood, and explore our eco-friendly initiatives.
        </p>
      </div>

      {/* Subscriptions Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Daily Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SubscriptionCard 
            title="Daily Milk" 
            desc="Fresh milk delivered by 6:00 AM daily." 
            price="₹45/day" 
            icon={Milk} 
            color="bg-blue-50 dark:bg-blue-900/20 text-blue-500" 
            onSubscribe={() => handleSubscribe('Daily Milk')}
          />
          <SubscriptionCard 
            title="Fresh Bread" 
            desc="Bakery fresh bread delivered every alternate day." 
            price="₹50/delivery" 
            icon={Croissant} 
            color="bg-orange-50 dark:bg-orange-900/20 text-orange-500" 
            onSubscribe={() => handleSubscribe('Fresh Bread')}
          />
          <SubscriptionCard 
            title="Newspaper" 
            desc="Your choice of daily newspaper." 
            price="₹150/month" 
            icon={Newspaper} 
            color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300" 
            onSubscribe={() => handleSubscribe('Newspaper')}
          />
          <SubscriptionCard 
            title="Monthly Grocery" 
            desc="Auto-restock your pantry every 1st of the month." 
            price="Custom" 
            icon={ShoppingBasket} 
            color="bg-primary/10 text-primary" 
            onSubscribe={() => handleSubscribe('Monthly Grocery')}
          />
        </div>
      </section>

      {/* Community & Eco Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        {/* Group Orders */}
        <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
          <Users size={32} className="text-purple-500 mb-6 relative z-10" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 relative z-10">Neighborhood Group Orders</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 relative z-10">
            Pool orders with your neighbors in the same apartment complex or street to unlock massive bulk discounts and free delivery!
          </p>
          <button 
            onClick={() => toast?.success('Group Order Link Generated! Share it on WhatsApp.')}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition relative z-10 shadow-lg shadow-purple-600/30"
          >
            Start a Group Cart
          </button>
        </div>

        {/* Eco Mode */}
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
          <Leaf size={32} className="text-green-500 mb-6 relative z-10" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 relative z-10">Eco Mode & Smart Restock</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 relative z-10">
            Opt into paper-only packaging and consolidated deliveries to reduce carbon footprint. Plus, use 1-click Smart Restock based on your purchase history.
          </p>
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={handleEcoToggle}
              className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              <Leaf size={18} /> Enable Eco Mode
            </button>
            <button 
              onClick={() => toast?.success('Pantry items added to cart!')}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            >
              <RefreshCcw size={18} /> Smart Restock
            </button>
          </div>
        </div>

      </section>

      {/* Store Locator & Contact */}
      <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Store Information</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-2xl min-h-[300px] relative flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Mock Google Map */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
            <div className="text-center z-10 relative bg-white/80 dark:bg-black/60 p-6 rounded-2xl backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-2xl">
              <MapPin size={32} className="mx-auto text-red-500 mb-2" />
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">Rishabh Provision Store</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">123 Market Street, City Center</p>
              <p className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">Delivery Radius: 15km</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Clock size={24} className="text-blue-500 mb-4" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Store Timings</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex justify-between"><span>Mon - Sat:</span> <span className="font-bold text-gray-900 dark:text-white">7:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday:</span> <span className="font-bold text-gray-900 dark:text-white">8:00 AM - 9:00 PM</span></li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = 'tel:+919876543210'}
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-1 shadow-lg"
              >
                <Phone size={20} /> Click to Call
              </button>
              <button 
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                className="flex-1 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-1 shadow-lg shadow-green-500/20"
              >
                <MessageSquare size={20} /> WhatsApp
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

function SubscriptionCard({ title, desc, price, icon: Icon, color, onSubscribe }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none hover:-translate-y-1 transition-transform">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">{desc}</p>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Starting At</p>
          <p className="font-bold text-gray-900 dark:text-white">{price}</p>
        </div>
        <button 
          onClick={onSubscribe}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
