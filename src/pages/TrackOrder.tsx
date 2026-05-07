import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Clock,
  Navigation,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Product, Order } from '../types';
import { orderService } from '../services/orderService';

export const TrackOrder: React.FC<{ cart: Product[], onRemoveFromCart: (id: string) => void }> = ({ cart, onRemoveFromCart }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const data = await orderService.getOrderById(orderId);
        if (data) {
          setOrder(data);
        } else {
          setError('Order details not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tracking data');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getProgressIndex = (status: string) => {
    switch (status) {
      case 'Processing': return 0;
      case 'Shipped': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const getEvents = (order: Order) => {
    const events = [];
    const baseDate = order.createdAt && typeof order.createdAt === 'object' && 'seconds' in order.createdAt
      ? new Date(order.createdAt.seconds * 1000) 
      : new Date();
    
    // Always add Ordered event
    events.push({
      time: baseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: baseDate.toLocaleDateString(),
      status: 'Ordered',
      description: 'Order confirmed and being processed.',
      location: 'Warehouse',
      completed: true
    });

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      events.unshift({
        time: '02:30 PM',
        date: new Date(baseDate.getTime() + 86400000).toLocaleDateString(),
        status: 'Shipped',
        description: 'Package has left our warehouse.',
        location: 'Express Logistics Hub',
        completed: true
      });
    }

    if (order.orderStatus === 'Delivered') {
      events.unshift({
        time: '09:45 AM',
        date: new Date(baseDate.getTime() + 172800000).toLocaleDateString(),
        status: 'Delivered',
        description: 'Package was delivered and signed for.',
        location: order.address.split(',')[0],
        completed: true
      });
    }

    return events;
  };

  const steps = [
    { label: 'Ordered', icon: ShoppingBag },
    { label: 'Shipped', icon: Package },
    { label: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-cream/5">
        <Loader2 className="w-12 h-12 text-brand-sage animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-brand-forest/60">Loading Tracking Hub...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-300 mb-6" />
        <h2 className="text-2xl font-serif font-bold text-brand-forest mb-2">Tracking data unavailable</h2>
        <p className="text-sm text-brand-forest/40 max-w-sm mb-8">{error || 'Could not find tracking info for this order'}</p>
        <Link to="/account" className="px-8 py-4 bg-brand-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sage transition-all">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentIndex = getProgressIndex(order.orderStatus);
  const events = getEvents(order);
  const estArrival = order.createdAt && typeof order.createdAt === 'object' && 'seconds' in order.createdAt
    ? new Date(order.createdAt.seconds * 1000 + 432000000).toLocaleDateString() // +5 days
    : 'TBD';

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-12">
        {/* Back Button */}
        <Link 
          to={`/order-confirmation/${orderId}`} 
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-sage transition-all group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Order Details</span>
        </Link>

        {/* Header Information */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-brand-sage/10 rounded-2xl flex items-center justify-center text-brand-sage">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Real-time tracking</p>
                   <h1 className="text-2xl font-serif italic font-bold text-brand-forest">#{order.orderId}</h1>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium text-brand-forest/40 space-x-6">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Est. Arrival: {estArrival}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> By 8:00 PM</div>
              </div>
            </div>
            
            <div className={`px-8 py-4 rounded-2xl border ${
              order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Status</p>
              <p className="text-lg font-serif font-bold">{order.orderStatus}</p>
            </div>
          </div>

          {/* Progress Visualizer */}
          <div className="mt-12 relative">
            <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-100 -z-0" />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-6 left-0 h-[2px] bg-brand-sage -z-0" 
            />
            
            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentIndex;
                const isActive = idx === currentIndex;

                return (
                  <div key={idx} className="flex flex-col items-center bg-white z-10 px-2">
                     <motion.div 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ delay: idx * 0.1 }}
                       className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
                         isCompleted ? 'bg-brand-sage text-white' : 'bg-slate-100 text-slate-300'
                       }`}
                     >
                        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                     </motion.div>
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
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12">
              <h3 className="text-lg font-serif font-bold text-brand-forest mb-10 flex items-center">
                <Clock className="w-5 h-5 mr-3 text-brand-sage" />
                Transit History
              </h3>
              
              <div className="space-y-0 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                {events.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    key={idx} 
                    className="relative pl-12 pb-10 last:pb-0"
                  >
                    <div className={`absolute left-[13px] top-2 w-[10px] h-[10px] rounded-full border-2 border-white shadow-sm transition-colors duration-500 ${
                      idx === 0 ? 'bg-brand-sage ring-4 ring-brand-sage/20' : 'bg-slate-200'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-4">
                      <p className={`font-serif italic font-bold ${idx === 0 ? 'text-brand-forest' : 'text-brand-forest/60'}`}>
                        {event.status}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-brand-forest/30 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                        <span className="opacity-40">•</span>
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-brand-forest/40 leading-relaxed font-medium">{event.description}</p>
                    <div className="flex items-center mt-3 text-[10px] font-bold text-brand-sage uppercase tracking-widest bg-brand-sage/5 w-fit px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {event.location}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Details */}
          <div className="space-y-8">
            <section className="bg-brand-forest rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mb-16 blur-3xl opacity-50" />
               <h3 className="text-lg font-serif italic text-brand-sage mb-6">Courier Info</h3>
               <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-sage">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Nexora Express</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Premium Service</p>
                  </div>
               </div>
               <button className="w-full py-4 bg-brand-sage text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-forest transition-all">
                 Contact Carrier
               </button>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
              <ShieldCheck className="w-10 h-10 text-brand-sage mx-auto mb-4 opacity-40" />
              <h4 className="text-sm font-serif font-bold text-brand-forest">Eco-Delivery Guarantee</h4>
              <p className="text-xs text-brand-forest/40 mt-2 leading-relaxed">This shipment was 100% carbon neutral and used zero plastic packaging.</p>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
};
