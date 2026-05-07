import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Search, Filter, ChevronDown, 
  MoreVertical, CheckCircle, Clock, 
  XCircle, Truck, ExternalLink, Mail, 
  Phone, MapPin, ShoppingBag, Loader2,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/orderService';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToAllOrders((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: Order['orderStatus']) => {
    setIsUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, status);
    } catch (err) {
      console.error(err);
      setError('Failed to update order status');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream/10 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-forest/5 text-brand-forest text-[10px] font-black uppercase tracking-widest mb-4"
              >
                <Package className="w-3 h-3" />
                <span>Admin Control</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-brand-forest uppercase tracking-tighter"
              >
                Order <span className="text-brand-sage">Management</span>
              </motion.h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-forest/20 group-focus-within:text-brand-sage transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage transition-all w-64 text-sm"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-forest/20" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-10 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage appearance-none text-sm cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-forest/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Orders Table Layout */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-forest/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Order ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Customer</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-forest/40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {error && (
                  <tr>
                    <td colSpan={6} className="px-8 py-4 bg-rose-50 text-rose-600 text-xs font-bold text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    </td>
                  </tr>
                )}
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <Loader2 className="w-10 h-10 text-brand-sage animate-spin mx-auto mb-4" />
                      <p className="text-xs font-bold text-brand-forest/40 uppercase tracking-widest">Loading Live Orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className={`hover:bg-brand-cream/5 transition-colors cursor-pointer ${expandedOrder === order.id ? 'bg-brand-cream/10' : ''}`} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-brand-forest">#{order.orderId}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-brand-forest">{order.customerName}</span>
                          <span className="text-[10px] text-brand-forest/40 font-medium">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-brand-forest/60">
                        {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-brand-forest">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <ChevronDown className={`w-4 h-4 text-brand-forest/20 transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>
                    
                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={6} className="bg-brand-cream/5 px-8 pt-0 pb-8">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid md:grid-cols-3 gap-12 pt-8 border-t border-brand-forest/5">
                                {/* Customer Summary */}
                                <div className="space-y-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Customer Details</h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-sm text-brand-forest">
                                      <Phone className="w-4 h-4 text-brand-sage" />
                                      <span>{order.phone}</span>
                                    </div>
                                    <div className="flex items-start space-x-3 text-sm text-brand-forest leading-relaxed">
                                      <MapPin className="w-4 h-4 text-brand-sage mt-1" />
                                      <span>{order.address}</span>
                                    </div>
                                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-[10px] font-bold text-brand-forest hover:text-brand-sage transition-colors">
                                      <Mail className="w-3 h-3" />
                                      <span>Contact Customer</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-6 col-span-2">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-forest/40">Ordered Products</h4>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    {order.items.map((item, i) => (
                                      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-brand-forest">{item.product.name}</p>
                                          <p className="text-[10px] text-brand-forest/40 font-medium">Qty: {item.quantity} • ${item.product.price}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-6 border-t border-brand-forest/5">
                                    <div className="flex space-x-4">
                                      <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-forest/30">Payment</p>
                                        <p className={`text-xs font-bold mt-1 ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-forest/30">Method</p>
                                        <p className="text-xs font-bold text-brand-forest mt-1 uppercase">{order.paymentMethod || 'N/A'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <select 
                                        disabled={isUpdating === order.id}
                                        value={order.orderStatus}
                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-forest focus:outline-none focus:border-brand-sage disabled:opacity-50"
                                      >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                      </select>
                                      <button className="p-2 bg-brand-forest text-white rounded-xl hover:bg-brand-sage transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-brand-forest/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-forest">No orders found</h3>
              <p className="text-sm text-brand-forest/40">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
