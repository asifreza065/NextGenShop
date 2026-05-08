import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Gift, ShieldCheck, Truck, ShoppingBag, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { orderService } from '../services/orderService';
import { auth } from '../lib/firebase';

interface CheckoutProps {
  cart: Product[];
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, onRemoveFromCart, onClearCart }) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'United States',
    zipCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [isLoading, setIsLoading] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('standard');

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = cartTotal === 0 ? 0 : cartTotal >= 100 ? 0 : 15.00; 
  const tax = cartTotal * 0.08; 
  const total = cartTotal + shipping + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // isSubmitted logic removed in favor of direct redirect after loading animation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (!auth.currentUser) {
      setErrors({ auth: 'Please sign in to place an order' });
      return;
    }

    setIsLoading(true);
    setError(null);

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    // Aggregate items for summary
    const items = cart.reduce((acc, product) => {
      const existing = acc.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        acc.push({ product, quantity: 1 });
      }
      return acc;
    }, [] as { product: Product, quantity: number }[]);

    const newOrder = {
      orderId,
      userId: auth.currentUser.uid,
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: auth.currentUser.email || formData.email || '',
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
      items,
      total,
      paymentStatus: (paymentMethod === 'card' || paymentMethod === 'mobile') ? 'Paid' : 'Pending' as any,
      orderStatus: 'Processing' as any,
      paymentMethod,
    };
    
    try {
      const firestoreId = await orderService.createOrder(newOrder);
      onClearCart();
      navigate(`/order-confirmation/${firestoreId}`, { state: { order: { ...newOrder, id: firestoreId } } });
    } catch (err: any) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 bg-brand-sage/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse text-brand-sage">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif italic text-brand-forest">Processing Order...</h1>
          <p className="text-brand-forest/40 text-sm max-w-xs mx-auto leading-relaxed">
            Please wait while we secure your sustainable items and generate your reference.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-12">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-forest/40 mb-12">
          <Link to="/" className="hover:text-brand-sage transition-colors flex items-center">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back
          </Link>
          <span className="w-1 h-1 bg-brand-forest/20 rounded-full" />
          <span className="text-brand-forest/80">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-brand-forest text-white flex items-center justify-center rounded-full text-xs font-bold">1</div>
                <h2 className="text-2xl font-serif italic font-semibold">Contact <span className="text-brand-sage">Details</span></h2>
              </div>
                <div className="space-y-4">
                  {errors.auth && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-xs font-bold uppercase tracking-wider">{errors.auth}</p>
                    </div>
                  )}
                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-xs font-bold">{error}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-6 pl-6 h-[58px] mt-[13px] ml-0 rounded-[24px] border ${errors.firstName ? 'border-red-400 bg-red-50/10' : 'border-gray-100 bg-gray-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all`}
                    />
                    {errors.firstName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-4">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-2xl border mt-[13px] ${errors.phone ? 'border-red-400 bg-red-50/10' : 'border-gray-100 bg-gray-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all`}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-4">{errors.phone}</p>}
                  </div>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-sage outline-none transition-all"
                  />
                </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-brand-forest text-white flex items-center justify-center rounded-full text-xs font-bold">2</div>
                <h2 className="text-2xl font-serif italic font-semibold">Shipping <span className="text-brand-sage">Address</span></h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <input
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 rounded-2xl border ${errors.address ? 'border-red-400 bg-red-50/10' : 'border-gray-100 bg-gray-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all`}
                  />
                  {errors.address && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-4">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-sage outline-none transition-all"
                  />
                  <input
                    required
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-sage outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Time Selection */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-5 h-5 text-brand-sage" />
                <h3 className="text-lg font-serif font-bold text-brand-forest">Delivery Schedule</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'standard', label: 'Standard', sub: '3-5 business days', price: 'Free' },
                  { id: 'express', label: 'Express', sub: '1-2 business days', price: '$15.00' }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDeliveryTime(slot.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      deliveryTime === slot.id 
                        ? 'border-brand-sage bg-brand-sage/5' 
                        : 'border-slate-50'
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest ${deliveryTime === slot.id ? 'text-brand-sage' : 'text-slate-300'}`}>{slot.label}</p>
                    <p className="text-sm font-bold text-brand-forest mt-1">{slot.sub}</p>
                    <p className="text-xs text-brand-forest/40 mt-1">{slot.price}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-brand-forest text-white flex items-center justify-center rounded-full text-xs font-bold">3</div>
                <h2 className="text-2xl font-serif italic font-semibold">Payment <span className="text-brand-sage">Choice</span></h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'card', label: 'Card Payment', icon: CreditCard },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  { id: 'mobile', label: 'Mobile Payment', icon: ShieldCheck }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-3 ${
                      paymentMethod === option.id 
                        ? 'border-brand-sage bg-brand-sage/5 text-brand-forest' 
                        : 'border-gray-50 text-brand-forest/40 hover:border-gray-200'
                    }`}
                  >
                    <option.icon className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{option.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-brand-forest rounded-[2rem] text-white space-y-6 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-10 h-10 text-brand-sage" />
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-white/20 rounded" />
                      <div className="w-10 h-6 bg-white/20 rounded" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full bg-white/10 border ${errors.cardNumber ? 'border-red-400' : 'border-white/20'} px-6 py-4 rounded-xl outline-none focus:border-brand-sage placeholder:text-white/40`}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 px-6 py-4 rounded-xl outline-none focus:border-brand-sage placeholder:text-white/40"
                      />
                      <input
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 px-6 py-4 rounded-xl outline-none focus:border-brand-sage placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                  <p className="text-sm font-medium text-brand-forest/60 text-center">
                    Pay with cash when your package arrives at your doorstep.
                  </p>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center justify-center space-x-3">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-bold text-blue-700">NextGenShop Wallet / Apple Pay</span>
                </div>
              )}
            </section>

            <button 
              onClick={handleSubmit}
              disabled={isLoading || cart.length === 0}
              className={`w-full bg-brand-forest text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[12px] hover:bg-brand-sage transition-all shadow-2xl flex items-center justify-center space-x-4 group ${(isLoading || cart.length === 0) ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Place My Order • ${total.toFixed(2)}</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-brand-forest/40 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Encrypted Connection</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass-effect border-brand-sage/10 p-8 rounded-[3rem] shadow-xl">
              <h3 className="text-xl font-serif italic mb-8 font-semibold flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-brand-sage" />
                Order <span className="text-brand-forest ml-1">Summary</span>
              </h3>
              
              <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <p className="text-brand-forest/40 italic">Your cart is empty</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex space-x-4 items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-brand-forest truncate mb-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-brand-sage uppercase tracking-wider">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4 pt-8 border-t border-brand-forest/5 text-sm">
                <div className="flex justify-between text-brand-forest/60">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-forest/60">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-brand-sage uppercase text-[10px] tracking-widest">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-brand-forest/60">
                  <span className="font-medium">Estimated Tax</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-brand-forest/10 text-xl font-serif italic">
                  <span className="font-semibold text-brand-forest">Total</span>
                  <span className="font-bold text-brand-forest">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4">
                <Link 
                  to="/cart"
                  className="w-full py-4 px-6 bg-white border border-slate-100 text-brand-forest rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-sage transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Cart</span>
                </Link>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-brand-cream/30 rounded-2xl text-center">
                    <Gift className="w-5 h-5 text-brand-sage mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-tighter text-brand-forest">Eco Wrapping</p>
                  </div>
                  <div className="flex-1 p-4 bg-brand-cream/30 rounded-2xl text-center">
                    <Truck className="w-5 h-5 text-brand-sage mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-tighter text-brand-forest">Carbon Neutral</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};
