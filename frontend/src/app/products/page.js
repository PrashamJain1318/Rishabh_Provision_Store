'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter size={18} /> Filters
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
              <div className="space-y-2">
                {['All', 'Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Staples'].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
              <input type="range" className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹2000+</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Products ({products.length})</h1>
          <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-primary bg-white shadow-sm">
            <option>Sort by: Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-primary">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-soft border border-gray-100 relative group flex flex-col h-full"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  {product.isBestSeller && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Heart icon */}
                <button className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors z-10 bg-white/80 rounded-full p-1 backdrop-blur-sm">
                  <Heart size={18} />
                </button>

                {/* Real Image */}
                <Link href={`/product/${product._id}`} className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden block">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1 flex-1 flex flex-col">
                  <p className="text-xs text-gray-500 font-medium">{product.brand || 'Premium'}</p>
                  <Link href={`/product/${product._id}`} className="font-bold text-gray-900 text-sm md:text-base leading-tight line-clamp-2 hover:text-primary transition">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <span className="font-extrabold text-gray-900 text-lg">₹{product.sellingPrice || product.price}</span>
                    {product.mrp > (product.sellingPrice || product.price) && (
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => addToCart({ 
                    id: product._id, 
                    name: product.name, 
                    price: product.sellingPrice || product.price, 
                    image: product.images?.[0] 
                  })}
                  className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-primary/30 transition-all py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
