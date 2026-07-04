'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Share2, ShieldCheck, Leaf, Star, ChevronRight, Plus, Minus, Search, ShoppingBag, ShoppingCart, Zap, Clock, Info, CheckCircle2, Bookmark, ChefHat, RefreshCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('details'); // details, recipes

  useEffect(() => {
    // Mock the massive new payload
    setTimeout(() => {
      setProduct({
        _id: id,
        name: 'Farm Fresh Alphonso Mangoes (Ratnagiri)',
        brand: 'NatureFresh',
        mrp: 1200,
        sellingPrice: 950,
        discountPercentage: 20,
        images: [
          'https://images.unsplash.com/photo-1553279768-865429fd8096?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 15,
        rating: 4.9,
        reviewsCount: 342,
        isBestSeller: true,
        tags: ['organic', 'bestseller', 'fresh'],
        nutritionInfo: 'Per 100g: Calories 60kcal, Protein 0.8g, Carbohydrates 15g, Vitamin C 60% DV.',
        ingredients: '100% Pure Alphonso Mangoes',
        storageInstructions: 'Store at room temperature until ripe, then refrigerate.',
        allergens: ['None'],
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        countryOfOrigin: 'India',
        description: 'Authentic, hand-picked Alphonso Mangoes straight from the farms of Ratnagiri. Known as the King of Mangoes, these are naturally ripened without any chemicals.',
        
        // Premium Indicators
        freshnessLevel: 9, // out of 10
        ripenessLevel: 'Ripe',
        qualityGrade: 'A+',
        
        // Bulk Discounts
        bulkDiscounts: [
          { minQuantity: 3, discountPercentage: 5 },
          { minQuantity: 5, discountPercentage: 10 }
        ],

        // Recipes
        recipes: [
          {
            name: 'Mango Lassi',
            time: '10 mins',
            ingredients: ['2 Alphonso Mangoes', '1 cup Curd', '2 tbsp Sugar', 'Pinch of Cardamom'],
            cartItems: [
              { id: 'prod_curd', name: 'Amul Fresh Curd', price: 65, image: 'https://images.unsplash.com/photo-1628189679193-c4e976694318?auto=format&fit=crop&q=80&w=200' },
              { id: 'prod_sugar', name: 'Madhur Pure Sugar', price: 55, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=200' }
            ]
          }
        ]
      });
      setMainImage('https://images.unsplash.com/photo-1553279768-865429fd8096?auto=format&fit=crop&q=80&w=800');
      setLoading(false);
    }, 800);
  }, [id]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleOneClickBuy = () => {
    addToCart({ id: product._id, name: product.name, price: product.sellingPrice, image: mainImage, quantity });
    router.push('/checkout');
  };

  const handleRecipeToCart = (recipe) => {
    // Add main product
    addToCart({ id: product._id, name: product.name, price: product.sellingPrice, image: mainImage, quantity: 1 });
    // Add recipe ingredients
    recipe.cartItems.forEach(item => {
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    });
    alert(`Added all ingredients for ${recipe.name} to Cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 animate-pulse">
        <div className="w-full md:w-1/2 bg-gray-200 dark:bg-gray-800 h-[600px] rounded-3xl"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full mt-8"></div>
        </div>
      </div>
    );
  }

  // Calculate Expiry Days
  const daysToExpiry = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
          <li><ChevronRight size={14} /></li>
          <li><Link href="/products" className="hover:text-primary transition">Fresh Fruits</Link></li>
          <li><ChevronRight size={14} /></li>
          <li className="font-bold text-gray-900 dark:text-white truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        
        {/* Left: Premium Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-20 flex-shrink-0 no-scrollbar py-2 md:py-0">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div 
            className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden relative group cursor-crosshair h-[400px] md:h-[600px] shadow-inner"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Dynamic Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.tags.includes('organic') && (
                <motion.span initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} className="bg-green-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wide">
                  <Leaf size={12}/> Organic
                </motion.span>
              )}
              {product.discountPercentage > 0 && (
                <motion.span initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:0.1}} className="bg-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                  {product.discountPercentage}% OFF
                </motion.span>
              )}
            </div>

            <img 
              src={mainImage} 
              alt={product.name} 
              className={`w-full h-full object-contain p-8 transition-transform duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Premium Zoom Lens */}
            {isZoomed && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}
          </div>
        </div>

        {/* Right: Rich Product Data & Buy Box */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-primary font-black uppercase tracking-wider mb-2">{product.brand}</div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">{product.name}</h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-gray-400 dark:text-gray-500 rounded-full transition-colors" title="Save for Later"><Bookmark size={22} /></button>
              <button className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary text-gray-400 dark:text-gray-500 rounded-full transition-colors" title="Add to Wishlist"><Heart size={22} /></button>
            </div>
          </div>
          
          {/* Smart Indicators Panel */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Quality Grade</span>
              <div className="flex items-center gap-1 font-black text-gray-900 dark:text-white"><ShieldCheck size={16} className="text-blue-500"/> Grade {product.qualityGrade}</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Ripeness</span>
              <div className="flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400"><Star size={16} fill="currentColor"/> {product.ripenessLevel}</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Freshness Index</span>
              <div className="flex items-center gap-1 font-black text-green-600 dark:text-green-400">
                <Leaf size={16}/> {product.freshnessLevel}/10
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-lg text-green-700 dark:text-green-400 font-bold text-sm">
              <span className="mr-1">{product.rating}</span>
              <Star size={14} fill="currentColor" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {product.reviewsCount.toLocaleString()} Verified Reviews
            </span>
          </div>

          {/* Price & Bulk Discount Box */}
          <div className="bg-white dark:bg-[#0a0a0a] border-y border-gray-100 dark:border-gray-800 py-6 mb-8">
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black text-gray-900 dark:text-white">₹{product.sellingPrice}</span>
              {product.mrp > product.sellingPrice && (
                <span className="text-2xl text-gray-400 line-through mb-1 font-medium">₹{product.mrp}</span>
              )}
            </div>
            
            {/* Bulk Discount Tiers */}
            {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.bulkDiscounts.map((tier, idx) => (
                  <div key={idx} className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 px-3 py-2 rounded-xl whitespace-nowrap">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 block">Buy {tier.minQuantity}+</span>
                    <span className="text-sm font-black text-orange-700 dark:text-orange-500">Get {tier.discountPercentage}% Extra Off</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-2xl h-16 w-full sm:w-auto flex-shrink-0 bg-white dark:bg-gray-900 overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"><Minus size={20}/></button>
              <span className="w-10 text-center font-black text-xl dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-5 h-full text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"><Plus size={20}/></button>
            </div>

            <button 
              onClick={() => addToCart({ id: product._id, name: product.name, price: product.sellingPrice, image: mainImage, quantity })}
              className="flex-1 w-full h-16 bg-white dark:bg-gray-900 border-2 border-primary text-primary rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
            >
              <ShoppingBag size={22} /> Add to Cart
            </button>

            <button 
              onClick={handleOneClickBuy}
              className="flex-1 w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30 transition-all"
            >
              <Zap size={22} /> One Click Buy
            </button>
          </div>

          {/* Expiry & Logistics Banner */}
          <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl mb-8 border border-red-100 dark:border-red-900/20">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl text-red-600 dark:text-red-400">
              <Clock size={24}/>
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 dark:text-red-400">Expiring in {daysToExpiry} days!</p>
              <p className="text-xs text-red-700 dark:text-red-300">Harvested just 2 days ago. Consume while fresh.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section (Details vs Recipes) */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-lg font-black transition-colors relative ${activeTab === 'details' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            Product Details
            {activeTab === 'details' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`pb-4 text-lg font-black transition-colors relative flex items-center gap-2 ${activeTab === 'recipes' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <ChefHat size={20}/> Recipe Suggestions
            {activeTab === 'recipes' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-16">
        {activeTab === 'details' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Info size={18} className="text-primary"/> Description</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">{product.description}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ingredients</h4>
                <p className="text-gray-600 dark:text-gray-400">{product.ingredients}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">Allergens</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.allergens.join(', ')}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Nutrition Information</h4>
                <p className="text-gray-600 dark:text-gray-400">{product.nutritionInfo}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Storage Instructions</h4>
                <p className="text-gray-600 dark:text-gray-400">{product.storageInstructions}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {product.recipes.map((recipe, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{recipe.name}</h3>
                    <span className="text-sm font-bold text-primary flex items-center gap-1"><Clock size={14}/> {recipe.time}</span>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                    <ChefHat size={24}/>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">You will need:</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 size={16} className="text-green-500"/> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleRecipeToCart(recipe)}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart size={18}/> Add Recipe to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cross-Selling Carousels Stubs */}
      <div className="space-y-16">
        {/* Frequently Bought Together */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Frequently Bought Together</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center h-48 border border-gray-100 dark:border-gray-800 text-gray-400 font-bold">
                Combo Item {i}
              </div>
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2"><RefreshCcw size={24}/> Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center h-48 border border-gray-100 dark:border-gray-800 text-gray-400 font-bold">
                History Item {i}
              </div>
            ))}
          </div>
        </section>

        {/* ================= CUSTOMER ENGAGEMENT: REVIEWS & Q&A ================= */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-16 mt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Reviews & Ratings */}
            <section>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Star size={32} className="text-yellow-400 fill-yellow-400" /> Customer Reviews
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start mb-10">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 text-center min-w-[200px] border border-gray-100 dark:border-gray-700">
                  <h4 className="text-6xl font-black text-gray-900 dark:text-white mb-2">4.8</h4>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i !== 5 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-50'}/>)}
                  </div>
                  <p className="text-sm text-gray-500 font-bold">Based on 1,284 reviews</p>
                </div>
                
                <div className="flex-1 w-full space-y-3">
                  {[
                    { stars: 5, pct: 85 },
                    { stars: 4, pct: 10 },
                    { stars: 3, pct: 3 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 1 }
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                      <span className="w-12">{row.stars} Stars</span>
                      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{width: `${row.pct}%`}}></div>
                      </div>
                      <span className="w-10 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: 'Rahul V.', date: '2 days ago', text: 'Absolutely perfect quality! The freshness index is accurate, and it arrived in 10 minutes.', rating: 5 },
                  { name: 'Priya K.', date: '1 week ago', text: 'Great combo discount when bought in bulk. Will definitely order again.', rating: 5 },
                  { name: 'Amit S.', date: '2 weeks ago', text: 'Good product, but the packaging could be slightly better.', rating: 4 }
                ].map((rev, i) => (
                  <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {rev.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {rev.name} <CheckCircle2 size={14} className="text-green-500"/>
                          </p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={12} className={idx < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}/>)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 ml-13 pl-13">{rev.text}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Write a Review
              </button>
            </section>

            {/* Questions & Answers */}
            <section>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Info size={32} className="text-primary" /> Questions & Answers
              </h3>
              
              <div className="space-y-6">
                {[
                  { q: 'Is this product purely organic?', a: 'Yes, it is certified 100% organic by FSSAI and contains zero pesticides.' },
                  { q: 'What is the exact expiry date?', a: 'As per our freshness tracking, this batch expires in approximately 45 days from today.' },
                  { q: 'Can I return it if the seal is broken?', a: 'Absolutely. We offer a no-questions-asked replacement if the seal is tampered with.' }
                ].map((qa, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-900 dark:text-white mb-3 flex gap-3">
                      <span className="text-primary">Q:</span> {qa.q}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex gap-3">
                      <span className="text-gray-400 font-bold">A:</span> {qa.a}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4">
                <input type="text" placeholder="Have a question about this product?" className="flex-1 bg-transparent outline-none text-sm px-2 text-gray-900 dark:text-white" />
                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-xl font-bold hover:opacity-90 transition">Ask</button>
              </div>
            </section>

          </div>
        </div>
        {/* ========================================================================= */}

      </div>
    </div>
  );
}
