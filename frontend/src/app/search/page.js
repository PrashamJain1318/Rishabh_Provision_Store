'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Star, Plus, PackageX, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [inStock, setInStock] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    // Sync URL keyword with state if it changes
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (category) query.append('category', category);
      if (brand) query.append('brand', brand);
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);
      if (rating) query.append('rating', rating);
      if (inStock) query.append('inStock', 'true');

      const res = await fetch(`http://localhost:5001/api/products?${query.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [keyword, category, brand, minPrice, maxPrice, rating, inStock, fetchResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Search Results for &quot;{keyword}&quot;
        </h1>
        <p className="text-gray-500 mt-2">Found {products.length} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Brand</h4>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="Amul">Amul</option>
                <option value="Aashirvaad">Aashirvaad</option>
                <option value="Fortune">Fortune</option>
                <option value="Maggi">Maggi</option>
                <option value="Tata">Tata</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(stars => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      value={stars}
                      checked={Number(rating) === stars}
                      onChange={(e) => setRating(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex text-yellow-400">
                      {[...Array(stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      <span className="text-gray-500 text-sm ml-1">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-sm font-semibold">In Stock Only</span>
              </label>
            </div>
            
            <button 
              onClick={() => { setCategory(''); setBrand(''); setMinPrice(''); setMaxPrice(''); setRating(''); setInStock(false); }}
              className="w-full py-2 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition font-bold"
            >
              Clear Filters
            </button>

          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-primary"><Loader2 className="animate-spin" size={32} /></div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
              <PackageX size={48} className="mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700">No products found</h3>
              <p>Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col h-full">
                  <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs font-medium text-gray-500 mb-1">{product.brand}</span>
                    <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={14} className="text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-bold">{product.rating?.toFixed(1) || '4.5'}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-green-600">₹{product.sellingPrice}</span>
                        {product.mrp > product.sellingPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">₹{product.mrp}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart({
                          id: product._id,
                          name: product.name,
                          price: product.sellingPrice,
                          image: product.images[0]
                        })}
                        disabled={product.stock === 0}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          product.stock > 0 
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
