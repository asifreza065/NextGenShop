import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CreditCard,
  Package,
  User,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Product, Order } from '../types';
import { orderService } from '../services/orderService';

interface OrderState {
  order?: Order;
}

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as OrderState;
  
  const [order, setOrder] = useState<Order | null>(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          const data = await orderService.getOrderById(orderId);
          if (data) {
            setOrder(data);
          } else {
            setError('Order not found');
          }
        } catch (err) {
          setError('Failed to load order details');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId]);
  
  const orderDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-sage animate-spin mx-auto mb-4" />
          <p className="text-brand-forest/60 text-sm font-bold uppercase tracking-widest">Validating Order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/10 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif italic text-brand-forest">Something went wrong</h1>
          <p className="text-brand-forest/40 text-sm">{error || 'Unable to retrieve your order details.'}</p>
          <Link to="/" className="inline-block px-10 py-4 bg-brand-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-12">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-green-600 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Your order has been placed</h1>
            <p className="text-white/80 text-lg font-medium">Thank you for choosing NextGenShop.</p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid md:grid-cols-2 gap-12 font-sans border-b border-slate-50 pb-12">
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Order Reference</p>
                   <p className="text-2xl font-serif italic font-bold text-brand-forest">#{orderId || order?.orderId}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-brand-forest/60">
                    <Calendar className="w-4 h-4 mr-3 text-green-600/30" />
                    <span>Ordered on: {orderDate}</span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-brand-forest/60">
                    <Package className="w-4 h-4 mr-3 text-green-600/30" />
                    <span>Est. Delivery: 3-5 Business Days</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Customer & Shipping</p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-bold text-brand-forest">
                      <User className="w-4 h-4 mr-3 opacity-20" />
                      {order?.customerName || 'Valued Customer'}
                    </div>
                    <div className="flex items-start text-sm font-medium text-brand-forest/60">
                      <MapPin className="w-4 h-4 mr-3 mt-1 opacity-20" />
                      {order?.address || '123 Sustainability Way, Portland, OR'}
                    </div>
                    {order?.phone && (
                      <div className="flex items-center text-sm font-medium text-brand-forest/60">
                        <Phone className="w-4 h-4 mr-3 opacity-20" />
                        {order.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Order Summary */}
            <div className="space-y-8">
              <h3 className="text-xl font-serif italic font-bold text-brand-forest">Order Summary</h3>
              <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                  {order?.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-forest">{item.product.name}</p>
                          <p className="text-[10px] text-brand-forest/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-forest">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-forest/30">Total Price</p>
                   <p className="text-2xl font-serif italic font-bold text-green-600">${order?.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link 
                  to={`/orders/${order.id}`}
                  className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-brand-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Order Details</span>
                </Link>
               <Link 
                to="/"
                className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-white border border-slate-100 text-brand-forest rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-sage transition-all"
               >
                 <span>Continue Shopping</span>
                 <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="bg-green-50 p-6 rounded-3xl text-center border border-green-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Secured via NextGenShop SSL
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};
