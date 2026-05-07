import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  XCircle, 
  Calendar,
  Clock,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { orderService } from '../services/orderService';

export const OrderDetails: React.FC<{ cart: Product[], onRemoveFromCart: (id: string) => void }> = ({ cart, onRemoveFromCart }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderById(orderId);
        if (data) {
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setIsCancelling(true);
    try {
      await orderService.updateOrderStatus(orderId, 'Cancelled');
      setOrder(prev => prev ? { ...prev, orderStatus: 'Cancelled' } : null);
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const trackingSteps = [
    { label: 'Ordered', icon: ShoppingBag },
    { label: 'Shipped', icon: Package },
    { label: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const getProgressIndex = (status: string) => {
    switch (status) {
      case 'Processing': return 0;
      case 'Shipped': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-brand-sage animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-brand-forest/60">Fetching order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-300 mb-6" />
        <h2 className="text-2xl font-serif font-bold text-brand-forest mb-2">Oops! Something went wrong</h2>
        <p className="text-sm text-brand-forest/40 max-w-sm mb-8">{error || 'Unable to load order'}</p>
        <Link to="/account" className="px-8 py-4 bg-brand-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStatus = order.orderStatus;
  const currentIndex = getProgressIndex(currentStatus);

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-12">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/account" 
            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-sage transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Account</span>
          </Link>
          <div className="flex space-x-3">
             <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-forest/60 hover:border-brand-sage hover:text-brand-sage transition-all shadow-sm">
                <ExternalLink className="w-4 h-4" />
                <span>Invoice</span>
             </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-2">Order Reference</p>
              <h1 className="text-3xl md:text-4xl font-serif italic font-semibold text-brand-forest">#{order.orderId}</h1>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center text-xs font-medium text-brand-forest/40">
                  <Calendar className="w-4 h-4 mr-2" />
                  {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(currentStatus)}`}>
                  {currentStatus}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {(currentStatus === 'Shipped' || currentStatus === 'Processing') && (
                <button 
                  onClick={() => navigate(`/orders/${orderId}/track`)}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-brand-forest text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all shadow-lg shadow-brand-forest/10"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Order</span>
                </button>
              )}
              {currentStatus === 'Processing' && (
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white border border-red-100 text-red-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {currentStatus !== 'Cancelled' ? (
            <div className="relative mt-8">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentIndex / (trackingSteps.length - 1)) * 100}%` }}
                  className="h-full bg-brand-sage"
                />
              </div>
              <div className="relative flex justify-between">
                {trackingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentIndex;
                  const isActive = idx === currentIndex;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-500 relative z-10 ${
                        isCompleted ? 'bg-brand-sage text-white shadow-lg' : 'bg-slate-50 text-slate-300'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                        {isCompleted && idx !== currentIndex && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                        isCompleted ? 'text-brand-forest' : 'text-slate-300'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-4 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600"
            >
               <XCircle className="w-8 h-8" />
               <div>
                 <p className="text-sm font-bold uppercase tracking-widest text-[10px] mb-1">Order Cancelled</p>
                 <p className="text-xs opacity-70 font-medium">This order has been permanently cancelled. Tracking is no longer available.</p>
               </div>
            </motion.div>
          )}
        </div>

        {/* Billing & Items Summary */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-serif font-bold text-brand-forest mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-3 text-brand-sage" />
                Items Purchased
              </h3>
              <div className="space-y-6">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-6 py-6 font-sans group">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl flex-shrink-0 p-4 transition-transform group-hover:scale-105">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-1">{item.product.category}</p>
                      <h4 className="text-base font-bold text-brand-forest truncate font-serif italic">{item.product.name}</h4>
                      <p className="text-xs text-brand-forest/40 mt-1 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-brand-forest">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid sm:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                <h3 className="text-base font-serif font-bold text-brand-forest mb-6 flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-brand-sage" />
                  Address Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-4 h-4 text-brand-forest/20 mt-0.5" />
                    <p className="text-sm font-bold text-brand-forest">{order.customerName}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-brand-forest/20 mt-0.5" />
                    <p className="text-sm text-brand-forest/60">{order.email}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-brand-forest/20 mt-0.5" />
                    <p className="text-sm text-brand-forest/60 leading-relaxed">{order.address}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-brand-forest/20 mt-0.5" />
                    <p className="text-sm text-brand-forest/60">{order.phone}</p>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                <h3 className="text-base font-serif font-bold text-brand-forest mb-6 flex items-center">
                  <CreditCard className="w-4 h-4 mr-3 text-brand-sage" />
                  Payment Info
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                     <p className="text-xs font-bold text-brand-forest">{order.paymentMethod}</p>
                     <ShieldCheck className="w-4 h-4 text-brand-sage" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    Transaction Confirmed
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-8">
            <section className="bg-brand-forest rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-30" />
               <h3 className="text-lg font-serif italic text-brand-sage mb-8">Financial Overview</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-white/50"><span>Subtotal</span><span>${(order.total - 14.50).toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/50"><span>Logistics</span><span>$14.50</span></div>
                  <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-1">Total Fee</span>
                       <span className="text-3xl font-serif italic font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
            </section>
          </div>
        </div>
      </main>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setShowCancelModal(false)}
              className="absolute inset-0 bg-brand-forest/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                 <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-brand-forest mb-4">Cancel your order?</h2>
              <p className="text-sm text-brand-forest/40 leading-loose mb-10 font-medium">
                Are you sure you want to cancel <span className="font-bold text-brand-forest">#{order.orderId}</span>? This action is permanent and cannot be reversed.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button 
                  disabled={isCancelling}
                  onClick={handleCancelOrder}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 hover:bg-black transition-all flex items-center justify-center"
                >
                  {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel Order'}
                </button>
                <button 
                  disabled={isCancelling}
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-forest transition-all"
                >
                  Wait, Keep Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
