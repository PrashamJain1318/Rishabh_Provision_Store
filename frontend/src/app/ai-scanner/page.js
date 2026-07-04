'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ScanLine, ShoppingCart, CheckCircle, Sparkles, Loader2, ListPlus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Mocked detection results
const DETECTED_ITEMS = [
  { id: 'PRD-OCR-1', name: 'Farm Fresh Tomatoes 1kg', price: 40, qty: 1, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop' },
  { id: 'PRD-OCR-2', name: 'Amul Taaza Milk 1L', price: 65, qty: 2, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
  { id: 'PRD-OCR-3', name: 'Aashirvaad Whole Wheat Atta 5kg', price: 210, qty: 1, image: 'https://images.unsplash.com/photo-1579113087385-23130d7b22a0?w=200&h=200&fit=crop' },
  { id: 'PRD-OCR-4', name: 'Maggi 2-Minute Noodles', price: 14, qty: 4, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop' },
];

export default function AIScannerPage() {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      startScan();
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setResults(null);
    // Simulate OCR processing time
    setTimeout(() => {
      setIsScanning(false);
      setResults(DETECTED_ITEMS);
    }, 3000);
  };

  const handleAddAllToCart = () => {
    if (!results) return;
    results.forEach(item => {
      // Add each item multiple times if qty > 1
      for (let i = 0; i < item.qty; i++) {
         addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
      }
    });
    alert('All items added to cart!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="bg-purple-500/10 text-purple-500 font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-sm mb-4">
          <Sparkles size={16} /> AI Vision Powered
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Smart Grocery List Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a photo of your handwritten grocery list or your fridge interior. Our AI will automatically detect the items and add them to your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Upload & Scanner Zone */}
        <div className="relative">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tap to Upload Image</h3>
              <p className="text-gray-500 text-sm">Supports JPG, PNG (Max 5MB)</p>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-900 min-h-[400px] flex items-center justify-center">
              <img src={image} alt="Uploaded List" className="w-full h-full object-contain max-h-[500px]" />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <motion.div
                    animate={{ y: [-100, 100, -100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-full h-1 bg-primary absolute top-1/2 left-0 shadow-[0_0_20px_5px_rgba(34,197,94,0.5)]"
                  />
                  <ScanLine size={48} className="text-primary mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold mb-2">Analyzing Image...</h3>
                  <p className="text-sm text-gray-300">Extracting text and matching products</p>
                </div>
              )}
            </div>
          )}

          {image && !isScanning && (
            <button 
              onClick={() => { setImage(null); setResults(null); }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 justify-center w-full"
            >
              <Upload size={16} /> Upload a different image
            </button>
          )}
        </div>

        {/* Results Zone */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl min-h-[400px] flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <ListPlus size={24} className="text-primary" /> 
            Detected Products
          </h2>

          {!image ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ScanLine size={48} className="mb-4 opacity-20" />
              <p>Upload an image to see results here</p>
            </div>
          ) : isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center text-primary">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="font-medium animate-pulse">Running OCR Engine...</p>
            </div>
          ) : results ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4 mb-8 overflow-y-auto pr-2">
                {results.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                        <p className="text-primary font-bold text-sm">₹{item.price} <span className="text-gray-400 font-normal text-xs">x {item.qty}</span></p>
                      </div>
                    </div>
                    <CheckCircle className="text-green-500" size={20} />
                  </motion.div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Total Items Detected</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">{results.reduce((acc, curr) => acc + curr.qty, 0)}</span>
                </div>
                <button 
                  onClick={handleAddAllToCart}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <ShoppingCart size={20} /> Add All to Cart
                </button>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
