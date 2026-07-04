'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Banknote, Store, Zap, HeartHandshake, Phone, FileText, Gift, Ticket, Map, Navigation, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone, color: 'text-purple-500' },
  { id: 'Razorpay', name: 'Razorpay', icon: ShieldCheck, color: 'text-blue-500' },
  { id: 'Stripe', name: 'Stripe (International)', icon: CreditCard, color: 'text-indigo-500' },
  { id: 'Card', name: 'Credit / Debit Card', icon: CreditCard, color: 'text-slate-700' },
  { id: 'Wallet', name: 'Store Wallet Balance', icon: Banknote, color: 'text-yellow-600' },
  { id: 'EMI', name: 'EMI on Cards', icon: Clock, color: 'text-orange-500' },
  { id: 'COD', name: 'Cash on Delivery', icon: Banknote, color: 'text-emerald-500' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totals } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [address, setAddress] = useState('B-102, Sunrise Apartments, Mumbai');
  const [contactless, setContactless] = useState(false);
  const [notes, setNotes] = useState('');

  // Slot State
  const [deliveryType, setDeliveryType] = useState('Standard');
  const [slot, setSlot] = useState('Today (10:00 AM - 12:00 PM)');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [coupon, setCoupon] = useState('');
  const [giftCard, setGiftCard] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const walletBalance = 500;
  const cashbackEarned = Math.floor(totals.estimatedTotal * 0.05); // 5% cashback

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      router.push(`/checkout/success?orderId=${orderId}`);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <Link href="/products" className="text-primary hover:underline">Go shopping</Link>
      </div>
    );
  }

  // Calculate dynamic totals based on Wallet
  const finalTotal = useWallet ? Math.max(0, totals.estimatedTotal - walletBalance) : totals.estimatedTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Flow */}
        <div className="flex-1 space-y-6">
          
          {/* Step 1: Address */}
          <div className={`bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 border transition-all ${step === 1 ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><MapPin size={20} /> Delivery Details</h2>
            </div>
            
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                
                {/* Google Maps Stub */}
                <div className="h-48 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 flex items-center justify-center relative overflow-hidden group cursor-crosshair">
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
                  <div className="z-10 flex flex-col items-center text-blue-600 dark:text-blue-400">
                    <Map size={32} className="mb-2" />
                    <p className="font-bold">Google Maps API Enabled</p>
                    <p className="text-xs">Pinpoint accurate delivery location</p>
                  </div>
                </div>

                <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-white dark:bg-gray-900 px-2 py-0.5 rounded-md text-xs font-bold border border-gray-200 dark:border-gray-700">Home</span>
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">Prasham Jain</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1"><Phone size={14}/> +91 9876543210</p>
                </div>

                {/* Contactless Delivery Toggle */}
                <label className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl cursor-pointer border border-green-100 dark:border-green-900/30">
                  <input type="checkbox" checked={contactless} onChange={(e) => setContactless(e.target.checked)} className="w-5 h-5 text-green-500 rounded focus:ring-green-500 accent-green-500" />
                  <div>
                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-1"><HeartHandshake size={16}/> Contactless Delivery</p>
                    <p className="text-xs text-green-600 dark:text-green-500">Driver will leave the package at your door.</p>
                  </div>
                </label>

                {/* Instructions */}
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-2"><FileText size={16}/> Delivery Instructions / Order Notes</label>
                  <textarea 
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Beware of dog, call upon arrival..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-primary focus:border-primary"
                    rows="2"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button onClick={handleNextStep} className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">Continue to Slot Selection</button>
                </div>
              </motion.div>
            ) : (
              <div className="ml-12 text-sm text-gray-600 dark:text-gray-400">
                <p>{address}</p>
                {contactless && <p className="text-green-600 dark:text-green-400 font-bold mt-1">✓ Contactless Delivery Requested</p>}
              </div>
            )}
          </div>

          {/* Step 2: Slot */}
          <div className={`bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 border transition-all ${step === 2 ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Clock size={20} /> Delivery Type & Slot</h2>
            </div>
            
            {step === 2 ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                
                {/* Delivery Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Standard', name: 'Standard Delivery', icon: Clock, desc: 'Scheduled Slots' },
                    { id: 'Express', name: 'Express Delivery', icon: Zap, desc: 'Under 30 Mins (₹49 extra)', color: 'text-orange-500' },
                    { id: 'Pickup', name: 'Store Pickup', icon: Store, desc: 'Collect from Hub' }
                  ].map(type => (
                    <div 
                      key={type.id} 
                      onClick={() => setDeliveryType(type.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${deliveryType === type.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/50'}`}
                    >
                      <type.icon size={28} className={`mb-2 ${deliveryType === type.id ? 'text-primary' : type.color || 'text-gray-400'}`} />
                      <p className="font-bold text-gray-900 dark:text-white">{type.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Time Slots (Only for Standard) */}
                {deliveryType === 'Standard' && (
                  <div className="space-y-3">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Schedule Delivery</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Today (10:00 AM - 12:00 PM)', 'Today (4:00 PM - 6:00 PM)', 'Tomorrow (Morning)'].map(s => (
                        <div 
                          key={s} 
                          onClick={() => setSlot(s)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${slot === s ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/50'}`}
                        >
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button onClick={handleNextStep} className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">Continue to Payment</button>
                </div>
              </motion.div>
            ) : (
              step > 2 && (
                <div className="ml-12 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">{deliveryType}</span>: {deliveryType === 'Standard' ? slot : 'As soon as possible'}
                </div>
              )
            )}
          </div>

          {/* Step 3: Payment */}
          <div className={`bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 border transition-all ${step === 3 ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><CreditCard size={20} /> Payment Gateway</h2>
            </div>
            
            {step === 3 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="w-5 h-5 text-primary focus:ring-primary accent-primary" />
                      <div className="flex items-center gap-2">
                        <method.icon size={20} className={method.color}/>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{method.name}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* GST Invoice Details Toggle */}
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-2">Need a GST Invoice for Business?</p>
                  <input type="text" placeholder="Enter GSTIN Number (Optional)" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-primary" />
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-black text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl"
                  >
                    {isProcessing ? 'Connecting to Gateway...' : `Pay ₹${finalTotal.toFixed(2)} Securely`}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> 256-bit Secure Encrypted Transaction (Mock)
                  </p>
                </div>
              </motion.div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Logistics */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 lg:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-sm">
            
            <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6">Order Summary</h3>
            
            {/* Promo Codes */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Referral Coupon Code" 
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-sm focus:ring-primary"
                />
                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition">Apply</button>
              </div>
              <div className="flex gap-2">
                <div className="relative w-full">
                  <Gift size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={giftCard}
                    onChange={(e) => setGiftCard(e.target.value)}
                    placeholder="Gift Card PIN" 
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-primary"
                  />
                </div>
                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition">Redeem</button>
              </div>
            </div>

            {/* Wallet Usage */}
            <label className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl mb-6 cursor-pointer">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 accent-yellow-600" />
                <div>
                  <p className="font-bold text-yellow-800 dark:text-yellow-500 flex items-center gap-1">Use Wallet Balance</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-600">Available: ₹{walletBalance}</p>
                </div>
              </div>
              <span className="font-bold text-yellow-800 dark:text-yellow-500">-₹{useWallet ? Math.min(walletBalance, totals.estimatedTotal) : 0}</span>
            </label>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 no-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.qty}x {item.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>GST (Tax) 18%</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery {deliveryType === 'Express' ? '(Express)' : ''}</span>
                <span className={totals.deliveryCharges === 0 && deliveryType !== 'Express' ? 'text-green-500 font-bold' : ''}>
                  {deliveryType === 'Express' ? '₹49.00' : (totals.deliveryCharges === 0 ? 'FREE' : `₹${totals.deliveryCharges}`)}
                </span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-500 font-bold">
                  <span>Discount</span>
                  <span>-₹{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total Pay Box */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-between items-end">
              <div>
                <span className="text-sm text-gray-500 block font-medium">Total Payable</span>
                <span className="text-3xl font-black text-gray-900 dark:text-white">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Cashback Reward Banner */}
            <div className="mt-6 bg-gradient-to-r from-emerald-500 to-green-400 p-4 rounded-xl text-white flex items-center justify-between shadow-lg shadow-green-500/20">
              <div>
                <p className="text-xs font-medium opacity-90">Expected Reward</p>
                <p className="font-black flex items-center gap-1">You will earn ₹{cashbackEarned} Cashback!</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <Ticket size={20} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
