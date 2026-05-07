import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Product } from '../types';

interface CartProps {
  cart: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveOne: (id: string) => void;
  onRemoveAll: (id: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cart, onAddToCart, onRemoveOne, onRemoveAll }) => {
  const navigate = useNavigate();

  // Aggregate cart items
  const aggregatedItems = cart.reduce((acc, product) => {
    const existing = acc.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ product, quantity: 1 });
    }
    return acc;
  }, [] as { product: Product, quantity: number }[]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen">
      

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-forest/30 mb-12">
          <Link to="/" className="hover:text-brand-sage transition-all">Home</Link>
          <span>/</span>
          <span className="text-brand-forest">Your Cart</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif italic font-bold text-brand-forest mb-12">
          Shopping <span className="text-brand-sage">Cart</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {aggregatedItems.length > 0 ? (
                aggregatedItems.map(({ product, quantity }) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product.id}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-8 group"
                  >
                    <div className="w-32 h-32 bg-slate-50 rounded-2xl flex-shrink-0 p-4 relative group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-black text-brand-sage uppercase tracking-widest">{product.category}</p>
                      <h3 className="text-xl font-serif italic font-bold text-brand-forest">{product.name}</h3>
                      <p className="text-brand-forest/40 text-sm font-medium">Sustainable Choice</p>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => onRemoveOne(product.id)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-brand-forest hover:shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-brand-forest font-mono">{quantity}</span>
                        <button 
                          onClick={() => onAddToCart(product)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-brand-forest hover:shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-lg font-serif italic font-bold text-brand-forest">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => onRemoveAll(product.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 mt-2 transition-colors flex items-center justify-end"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <ShoppingBag className="w-10 h-10 text-slate-200" />
                   </div>
                   <h2 className="text-2xl font-serif italic text-brand-forest mb-4">Your cart is empty</h2>
                   <p className="text-brand-forest/40 mb-8 max-w-sm mx-auto">Looks like you haven't added any sustainable treasures to your cart yet.</p>
                   <Link 
                    to="/" 
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-brand-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10"
                   >
                     <span>Start Shopping</span>
                     <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="space-y-8">
            <section className="bg-brand-forest rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-brand-sage/20 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
               <h2 className="text-2xl font-serif italic text-white mb-10">Summary</h2>
               
               <div className="space-y-6 text-sm">
                 <div className="flex justify-between text-white/50">
                    <span className="font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-white/50">
                    <span className="font-medium uppercase tracking-widest text-[10px]">Delivery Charge</span>
                    <span className="font-bold">${deliveryCharge.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-white/50">
                    <span className="font-medium uppercase tracking-widest text-[10px]">Estimated Tax</span>
                    <span className="font-bold">Calculated at checkout</span>
                 </div>
                 
                 <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-2">Total Amount</p>
                      <p className="text-4xl font-serif italic font-bold">${total.toFixed(2)}</p>
                    </div>
                 </div>
               </div>

               <div className="mt-8 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Discount Code</p>
                 <div className="flex space-x-2">
                   <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-brand-sage placeholder:text-white/20"
                   />
                   <button className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Apply</button>
                 </div>
               </div>

               <button 
                 disabled={cart.length === 0}
                 onClick={() => navigate('/checkout')}
                 className="w-full mt-10 py-5 bg-brand-sage text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-forest transition-all shadow-xl shadow-brand-sage/20 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <span>Proceed to Checkout</span>
                 <ArrowRight className="w-4 h-4" />
               </button>

               <div className="mt-8 flex items-center justify-center space-x-4 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                 <ShieldCheck className="w-4 h-4" />
                 <span>Verified Secure Checkout</span>
               </div>
            </section>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-brand-sage/10 rounded-xl flex items-center justify-center text-brand-sage">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-forest">Free Delivery Over $100</h4>
                    <p className="text-[10px] text-brand-forest/40 uppercase tracking-widest mt-1">Sustainable methods only</p>
                  </div>
               </div>
               {subtotal < 100 && subtotal > 0 && (
                 <div className="space-y-3">
                   <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                     <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(subtotal / 100) * 100}%` }}
                      className="h-full bg-brand-sage"
                     />
                   </div>
                   <p className="text-[9px] font-bold text-brand-forest/60 uppercase tracking-tight">
                     Add <span className="text-brand-sage">${(100 - subtotal).toFixed(2)}</span> more for free delivery
                   </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};
