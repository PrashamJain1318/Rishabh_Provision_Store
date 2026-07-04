'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch from /api/users/wishlist based on new User schema
    setTimeout(() => {
      setWishlist([
        { _id: '1', name: 'Aashirvaad Atta 5kg', price: 280, mrp: 320, image: 'https://images.unsplash.com/photo-1627485937980-221c88ce04ea?auto=format&fit=crop&w=400&q=80', brand: 'Aashirvaad', stock: 45 },
        { _id: '2', name: 'Fortune Sunflower Oil 1L', price: 145, mrp: 180, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', brand: 'Fortune', stock: 0 },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item._id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6">
          <Heart size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Save items that you like in your wishlist. Review them anytime and easily move them to the cart.</p>
        <Link href="/" className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/30 flex items-center gap-2">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500" size={28} fill="currentColor" />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist <span className="text-gray-400 text-xl font-normal">({wishlist.length} items)</span></h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-soft transition group flex flex-col relative overflow-hidden">
            
            <button 
              onClick={() => removeFromWishlist(product._id)}
              className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full z-10 backdrop-blur transition"
            >
              <Trash2 size={18} />
            </button>

            <Link href={`/product/${product._id}`} className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden block flex items-center justify-center">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={product.name} />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Out of Stock</span>
                </div>
              )}
            </Link>
            
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">{product.brand}</span>
              <Link href={`/product/${product._id}`} className="font-bold text-gray-900 leading-tight mb-3 line-clamp-2 hover:text-primary transition">
                {product.name}
              </Link>

              <div className="mt-auto flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                </div>
                <button 
                  onClick={() => addToCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 })}
                  disabled={product.stock === 0}
                  className={`p-3 rounded-xl transition ${product.stock > 0 ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
