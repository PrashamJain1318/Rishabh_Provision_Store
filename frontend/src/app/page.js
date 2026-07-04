'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Clock, Star, ShieldCheck, Truck, Clock4, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const HERO_SLIDES = [
  {
    title: "Premium Groceries Delivered in Minutes",
    subtitle: "Experience luxury in every bite. Up to 50% OFF on organic essentials.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600",
    bg: "from-emerald-900 to-primary"
  },
  {
    title: "Handpicked Freshness for You",
    subtitle: "Direct from farms to your doorstep. Unmatched quality.",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=1600",
    bg: "from-amber-900 to-orange-600"
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else { m = 59; if (h > 0) h--; }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const flashSaleProducts = [
    { _id: '1', name: 'Farm Fresh Tomatoes 1kg', price: 45, mrp: 80, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', brand: 'Farm Fresh' },
    { _id: '2', name: 'Amul Taaza Milk 1L', price: 68, mrp: 72, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', brand: 'Amul' },
    { _id: '3', name: 'Aashirvaad Atta 5kg', price: 280, mrp: 320, image: 'https://images.unsplash.com/photo-1627485937980-221c88ce04ea?auto=format&fit=crop&w=400&q=80', brand: 'Aashirvaad' },
    { _id: '4', name: 'Fortune Sunflower Oil 1L', price: 145, mrp: 180, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', brand: 'Fortune' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-20 overflow-x-hidden">
      
      {/* Premium Hero Slider with Glassmorphism */}
      <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden mt-4 mx-4 md:mx-8 rounded-[3rem] shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${HERO_SLIDES[currentSlide].bg}`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Hero" 
              fill 
              priority
              className="object-cover mix-blend-overlay" 
            />
            
            <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 md:px-20 max-w-7xl mx-auto">
              <motion.span 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest mb-6 border border-white/20 flex items-center gap-2 uppercase"
              >
                <Sparkles size={14} /> Rishabh Premium
              </motion.span>
              
              <motion.h1 
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black text-white max-w-3xl leading-[1.1] mb-6 drop-shadow-lg"
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-lg md:text-2xl text-white/90 max-w-2xl mb-10 font-light"
              >
                {HERO_SLIDES[currentSlide].subtitle}
              </motion.p>
              
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Link href="/categories" className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 group">
                  Explore Collection <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)} 
              className={`h-2.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/80'}`} 
            />
          ))}
        </div>
      </div>

      {/* Glassmorphic Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-30 mb-20">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/40 dark:border-gray-800/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-gray-200 dark:divide-gray-800">
          {[
            { icon: Clock4, title: '10 Minute Delivery', sub: 'Lightning fast logistics' },
            { icon: ShieldCheck, title: 'Premium Quality', sub: 'Handpicked organic fresh' },
            { icon: Truck, title: 'Zero Fee Delivery', sub: 'On all orders above ₹500' }
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-5 md:justify-center group">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                <feat.icon size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{feat.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24">
        
        {/* Flash Sale Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <Clock size={24} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Flash Sale</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Premium essentials at unbeatable prices.</p>
            </div>
            
            <div className="flex gap-2">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((time, i) => (
                <div key={i} className="bg-red-600 text-white font-mono font-black text-2xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-red-600/30">
                  {time.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map(product => (
              <div key={product._id} className="bg-white dark:bg-[#111] rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-black border border-gray-100 dark:border-gray-800 transition-all duration-300 group flex flex-col relative overflow-hidden">
                
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-lg shadow-red-500/30 backdrop-blur-md">
                  {Math.round(((product.mrp - product.price)/product.mrp)*100)}% OFF
                </div>

                <Link href={`/product/${product._id}`} className="relative aspect-square mb-5 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden block">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition duration-500" 
                  />
                </Link>
                
                <div className="flex-1 flex flex-col px-2">
                  <span className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{product.brand}</span>
                  <Link href={`/product/${product._id}`} className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-4 line-clamp-2 hover:text-primary transition">
                    {product.name}
                  </Link>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">₹{product.mrp}</span>
                    </div>
                    <button 
                      onClick={() => addToCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 })}
                      className="p-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-primary/30"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
