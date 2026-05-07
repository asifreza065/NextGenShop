import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Edit2,
  ShoppingBag,
  Bell,
  Loader2,
  Camera,
  Upload,
  X,
  AlertCircle
} from 'lucide-react';
import { Product, Order } from '../types';
import { PRODUCTS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { auth, logout } from '../lib/firebase';
import { orderService } from '../services/orderService';

type TabType = 'profile' | 'orders' | 'addresses' | 'payment' | 'wishlist' | 'settings';

export const Account: React.FC<{ cart: Product[], onRemoveFromCart: (id: string) => void }> = ({ cart, onRemoveFromCart }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const navigate = useNavigate();

  const [realOrders, setRealOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && auth.currentUser) {
      const fetchOrders = async () => {
        setIsOrdersLoading(true);
        setOrdersError(null);
        try {
          const data = await orderService.getUserOrders();
          setRealOrders(data || []);
        } catch (err) {
          setOrdersError('Failed to load orders');
        } finally {
          setIsOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('nexora_wishlist');
    return saved ? JSON.parse(saved) : [PRODUCTS[2], PRODUCTS[3]];
  });
  const [addressItems, setAddressItems] = useState(() => {
    const saved = localStorage.getItem('nexora_addresses');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        label: 'Home',
        name: 'Alex Thompson',
        street: '123 Pinecrest Avenue',
        city: 'Portland, OR 97201',
        country: 'United States',
        isDefault: true
      }
    ];
  });
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('nexora_payments');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        brand: 'Visa',
        last4: '4242',
        expiry: '12/25',
        isDefault: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nexora_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem('nexora_addresses', JSON.stringify(addressItems));
  }, [addressItems]);

  useEffect(() => {
    localStorage.setItem('nexora_payments', JSON.stringify(payments));
  }, [payments]);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, type: 'wishlist' | 'address' | 'payment' | null, id: string | null }>({
    isOpen: false,
    type: null,
    id: null
  });

  const [notification, setNotification] = useState<{ show: boolean, message: string }>({
    show: false,
    message: ''
  });

  const triggerNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleDeleteConfirm = () => {
    const { type, id } = deleteModal;
    if (!type || !id) return;

    if (type === 'wishlist') {
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } else if (type === 'address') {
      setAddressItems(prev => prev.filter(item => item.id !== id));
    } else if (type === 'payment') {
      setPayments(prev => prev.filter(item => item.id !== id));
    }

    setDeleteModal({ isOpen: false, type: null, id: null });
    triggerNotification('Item deleted successfully');
  };

  // User data in state for editing
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : {
      name: auth.currentUser?.displayName || 'Alex Thompson',
      email: auth.currentUser?.email || 'alex.thompson@example.com',
      avatar: auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      joinedDate: 'October 2023'
    };
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'user')}&background=f4f1ea&color=5c6f68&bold=true`,
          joinedDate: 'Joined recently'
        });
        setProfileFormData({
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'user')}&background=f4f1ea&color=5c6f68&bold=true`,
          joinedDate: 'Joined recently'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('nexora_user', JSON.stringify(user));
  }, [user]);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ ...user });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileFormData(prev => ({ ...prev, avatar: result }));
        if (!isEditProfileOpen) {
          setUser(prev => ({ ...prev, avatar: result }));
          triggerNotification('Profile photo updated');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileFormData.name || 'User')}&background=f4f1ea&color=5c6f68&bold=true`;
    setProfileFormData(prev => ({ ...prev, avatar: defaultAvatar }));
    if (!isEditProfileOpen) {
      setUser(prev => ({ ...prev, avatar: defaultAvatar }));
      triggerNotification('Profile photo removed');
    }
  };

  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState<any>(null);

  const handleEditAddress = (addr: any) => {
    setAddressFormData({ ...addr });
    setIsEditAddressOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        // dynamic import or use auth directly, we will need to updateProfile from firebase/auth
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(auth.currentUser, {
          displayName: profileFormData.name,
          photoURL: profileFormData.avatar
        });
      }
      setUser({ ...profileFormData });
      setIsEditProfileOpen(false);
      triggerNotification('Profile updated successfully');
    } catch (err: any) {
      triggerNotification('Error updating profile: ' + err.message);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressItems(prev => {
      const exists = prev.find(a => a.id === addressFormData.id);
      if (exists) {
        return prev.map(a => a.id === addressFormData.id ? addressFormData : a);
      }
      return [...prev, addressFormData];
    });
    setIsEditAddressOpen(false);
    triggerNotification('Address updated successfully');
  };

  const orders = [
    {
      id: 'ORD-89234',
      date: 'Dec 12, 2023',
      total: 124.50,
      status: 'Delivered',
      items: [PRODUCTS[0]],
      image: PRODUCTS[0].image
    },
    {
      id: 'ORD-77102',
      date: 'Nov 28, 2023',
      total: 679.99,
      status: 'Shipped',
      items: [PRODUCTS[1]],
      image: PRODUCTS[1].image
    },
    {
      id: 'ORD-65432',
      date: 'Oct 15, 2023',
      total: 43.85,
      status: 'Pending',
      items: [PRODUCTS[0]],
      image: PRODUCTS[0].image
    },
    {
      id: 'ORD-12345',
      date: 'Sep 01, 2023',
      total: 89.99,
      status: 'Cancelled',
      items: [PRODUCTS[2]],
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isSavingCard, setIsSavingCard] = useState(false);

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'MasterCard';
    return 'Credit Card';
  };

  const validateCard = () => {
    const errors: Record<string, string> = {};
    if (!cardFormData.name) errors.name = 'Cardholder name is required';
    if (!cardFormData.number || cardFormData.number.replace(/\s/g, '').length !== 16) {
      errors.number = 'Valid 16-digit card number is required';
    }
    if (!cardFormData.expiry || !cardFormData.expiry.includes('/')) {
      errors.expiry = 'Valid expiry (MM/YY) is required';
    }
    if (!cardFormData.cvv || cardFormData.cvv.length < 3) {
      errors.cvv = 'Valid CVV is required';
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCard()) return;

    setIsSavingCard(true);

    // Simulate API call
    setTimeout(() => {
      const newCard = {
        id: Math.random().toString(36).substr(2, 9),
        brand: getCardBrand(cardFormData.number),
        last4: cardFormData.number.slice(-4),
        expiry: cardFormData.expiry,
        isDefault: payments.length === 0
      };

      setPayments([...payments, newCard]);
      setIsSavingCard(false);
      setIsAddCardOpen(false);
      setCardFormData({ name: '', number: '', expiry: '', cvv: '' });
      triggerNotification('Card added successfully');
    }, 2000);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sticky top-32">
              <div className="flex items-center space-x-4 mb-8 px-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-sage/20">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-forest">{user.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-brand-forest/40 font-bold">Standard Member</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                        activeTab === item.id 
                          ? 'bg-brand-sage/10 text-brand-sage' 
                          : 'text-brand-forest/60 hover:bg-gray-50 hover:text-brand-forest'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-brand-sage' : 'text-gray-400 group-hover:text-brand-forest'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {activeTab === item.id && <motion.div layoutId="indicator" className="w-1.5 h-1.5 rounded-full bg-brand-sage" />}
                    </button>
                  );
                })}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-4 rounded-xl text-red-400 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {activeTab === 'profile' && (
                  <div className="space-y-8 text-left">
                    <header className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">Account <span className="text-brand-sage">Overview</span></h1>
                        <p className="text-brand-forest/40 text-sm">Manage your personal information and account security.</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-white border border-red-100 text-red-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-serif font-bold text-brand-forest">Profile Snapshot</h2>
                          <button 
                            onClick={() => setIsEditProfileOpen(true)}
                            className="p-2 bg-brand-cream/40 rounded-full text-brand-sage hover:bg-brand-sage hover:text-white transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="relative group/avatar">
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl shadow-brand-forest/5 border-2 border-white">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-brand-forest/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center rounded-[2rem] text-white backdrop-blur-[2px]"
                            >
                              <Camera className="w-6 h-6" />
                            </button>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handlePhotoChange}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-1">Full Name</p>
                            <p className="text-xl font-medium text-brand-forest font-serif">{user.name}</p>
                            <p className="text-sm text-brand-forest/40 mt-1">Member since {user.joinedDate}</p>
                            <div className="flex items-center space-x-3 mt-3">
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[9px] font-black uppercase tracking-widest text-brand-sage hover:text-brand-forest transition-colors"
                              >
                                Change Photo
                              </button>
                              <span className="w-1 h-1 rounded-full bg-brand-forest/10" />
                              <button 
                                onClick={handleRemovePhoto}
                                className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-50">
                          <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-1">Email Address</p>
                          <p className="text-brand-forest font-medium">{user.email}</p>
                        </div>
                      </section>

                      <section className="bg-brand-forest p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-8">
                            <ShoppingBag className="w-8 h-8 text-brand-sage" />
                            <Bell className="w-6 h-6 text-white/40" />
                          </div>
                          <h2 className="text-2xl font-serif italic mb-2">Sustainable <span className="text-brand-sage">Rewards</span></h2>
                          <p className="text-white/60 text-sm leading-relaxed">You've helped plant 12 trees this year through your carbon-neutral purchases.</p>
                        </div>
                        <Link to="/" className="w-full py-4 bg-brand-sage text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center mt-8 hover:bg-white hover:text-brand-forest transition-all">
                          Keep Shopping
                        </Link>
                      </section>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-8 text-left">
                    <header>
                      <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">My <span className="text-brand-sage">Orders</span></h1>
                      <p className="text-brand-forest/40 text-sm">Track shipments and view order details.</p>
                    </header>

                    <div className="space-y-4">
                      {isOrdersLoading ? (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100">
                          <Loader2 className="w-10 h-10 text-brand-sage animate-spin mx-auto mb-4" />
                          <p className="text-xs font-bold text-brand-forest/40 uppercase tracking-widest">Fetching your orders...</p>
                        </div>
                      ) : ordersError ? (
                        <div className="py-20 text-center bg-rose-50 rounded-[3rem] border border-rose-100 italic text-rose-600">
                          <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-20" />
                          <p>{ordersError}</p>
                        </div>
                      ) : realOrders.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-brand-sage/20">
                          <ShoppingBag className="w-10 h-10 text-brand-sage/20 mx-auto mb-4" />
                          <p className="text-brand-forest/40 font-medium">You haven't placed any orders yet.</p>
                          <Link to="/" className="text-brand-sage font-black uppercase tracking-widest text-[10px] mt-4 inline-block">Start Shopping</Link>
                        </div>
                      ) : (
                        realOrders.map((order) => (
                          <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 hover:border-brand-sage/20 transition-all group">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden p-3 flex items-center justify-center">
                              <img 
                                src={order.items[0]?.product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'} 
                                alt="Order" 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" 
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-3">
                                <p className="font-bold text-brand-forest font-serif">#{order.orderId}</p>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                                  {order.orderStatus}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-brand-forest/40 space-x-4">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" /> 
                                  {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                </div>
                                <div className="font-bold text-brand-forest/60">${order.total.toFixed(2)}</div>
                              </div>
                            </div>
                            <Link 
                              to={`/order-confirmation/${order.id}`}
                              className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-sage group-hover:translate-x-2 transition-transform"
                            >
                              View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="space-y-8 text-left">
                    <header>
                      <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">My <span className="text-brand-sage">Wishlist</span></h1>
                      <p className="text-brand-forest/40 text-sm">Saved items for your next sustainable upgrade.</p>
                    </header>

                    {wishlistItems.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-xl hover:shadow-brand-forest/5 transition-all group">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] uppercase font-black tracking-widest text-brand-sage mb-1">{item.category}</p>
                              <h4 className="text-sm font-bold text-brand-forest truncate">{item.name}</h4>
                              <p className="text-sm font-medium text-brand-forest/60">${item.price.toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, type: 'wishlist', id: item.id })}
                              className="p-3 bg-red-50 rounded-xl text-red-400 hover:bg-red-400 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-brand-sage/20">
                        <Heart className="w-12 h-12 text-brand-sage/20 mx-auto mb-4" />
                        <p className="text-brand-forest/40 font-medium">Your wishlist is currently empty.</p>
                        <Link to="/" className="text-brand-sage font-black uppercase tracking-widest text-[10px] mt-4 inline-block">Explore Shop</Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-8 text-left">
                    <header className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">Shipping <span className="text-brand-sage">Addresses</span></h1>
                        <p className="text-brand-forest/40 text-sm">Where your green essentials get delivered.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setAddressFormData({ id: Math.random().toString(), label: '', name: '', street: '', city: '', country: 'United States', isDefault: false });
                          setIsEditAddressOpen(true);
                        }}
                        className="flex items-center space-x-2 bg-brand-sage text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-forest transition-all shadow-lg shadow-brand-sage/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New</span>
                      </button>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      {addressItems.map((addr) => (
                        <div key={addr.id} className={`p-8 rounded-[2.5rem] border ${addr.isDefault ? 'bg-brand-cream/20 border-brand-sage/20' : 'bg-white border-gray-100'} shadow-sm relative overflow-hidden group`}>
                          {addr.isDefault && (
                            <div className="absolute top-6 right-6 flex items-center space-x-2 text-[8px] font-black uppercase tracking-[0.2em] text-brand-sage bg-white px-3 py-1 rounded-full border border-brand-sage/10">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Default</span>
                            </div>
                          )}
                          <div className="mb-6">
                            <div className="w-10 h-10 bg-brand-sage/10 rounded-xl flex items-center justify-center text-brand-sage mb-4">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-brand-forest font-serif text-lg">{addr.label}</h3>
                          </div>
                          <div className="space-y-1 text-sm text-brand-forest/60 font-medium">
                            <p>{addr.name}</p>
                            <p>{addr.street}</p>
                            <p>{addr.city}</p>
                            <p>{addr.country}</p>
                          </div>
                          <div className="mt-8 flex items-center space-x-4 pt-6 border-t border-brand-forest/5">
                            <button 
                              onClick={() => handleEditAddress(addr)}
                              className="text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-sage transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, type: 'address', id: addr.id })}
                              className="text-[10px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-8 text-left">
                    <header className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">Payment <span className="text-brand-sage">Methods</span></h1>
                        <p className="text-brand-forest/40 text-sm">Secure and encrypted payment information.</p>
                      </div>
                      <button 
                        onClick={() => setIsAddCardOpen(true)}
                        className="flex items-center space-x-2 bg-brand-sage text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-forest transition-all shadow-lg shadow-brand-sage/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Card</span>
                      </button>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      {payments.map((pay) => (
                        <div key={pay.id} className="bg-brand-forest p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex justify-between items-start mb-12">
                             <CreditCard className="w-10 h-10 text-brand-sage" />
                             <div className="flex items-center space-x-3">
                               {pay.isDefault && <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Default</span>}
                               <button 
                                onClick={() => setDeleteModal({ isOpen: true, type: 'payment', id: pay.id })}
                                className="p-2 bg-red-400/20 rounded-lg text-white hover:bg-red-500 transition-colors"
                               >
                                 <Trash2 className="w-3 h-3" />
                               </button>
                             </div>
                           </div>
                           <div className="space-y-1">
                             <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Card Holder</p>
                             <div className="flex items-baseline space-x-2">
                               <p className="text-2xl font-serif italic text-white/20">•••• •••• ••••</p>
                               <p className="text-xl font-serif font-bold text-brand-sage">{pay.last4}</p>
                             </div>
                           </div>
                           <div className="mt-8 flex justify-between items-end">
                             <div>
                               <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">Expires</p>
                               <p className="text-sm font-bold">{pay.expiry}</p>
                             </div>
                             <div className="w-12 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold italic text-[10px] uppercase tracking-tighter text-white/40">{pay.brand}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8 text-left">
                    <header>
                      <h1 className="text-3xl font-serif italic font-semibold text-brand-forest mb-2">Account <span className="text-brand-sage">Settings</span></h1>
                      <p className="text-brand-forest/40 text-sm">Tailor your experience and security preferences.</p>
                    </header>

                    {isChangingPassword ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-serif font-bold text-brand-forest">Change Password</h3>
                          <button 
                            onClick={() => setIsChangingPassword(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-sage transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Confirm New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" />
                          </div>
                          <button className="w-full py-4 bg-brand-forest text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-forest/20 hover:bg-brand-sage transition-all mt-4">
                            Update Password
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                        <div 
                          onClick={() => setIsChangingPassword(true)}
                          className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                              <Settings className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-brand-forest font-serif">Password & Security</h3>
                              <p className="text-xs text-brand-forest/40 mt-1">Change your password and manage 2FA settings.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all cursor-pointer group">
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-brand-sage/10 rounded-2xl flex items-center justify-center text-brand-sage group-hover:scale-110 transition-transform">
                              <Bell className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-brand-forest font-serif">Notifications</h3>
                              <p className="text-xs text-brand-forest/40 mt-1">Choose which updates you want to receive.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>

      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-forest/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="bg-brand-forest p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-2xl font-serif italic font-bold text-white">Edit <span className="text-brand-sage">Profile</span></h3>
                <p className="text-white/40 text-sm mt-1">Update your personal information</p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
                {/* Photo Upload Section */}
                <div className="flex flex-col items-center space-y-4 mb-2">
                  <div className="relative group/modal-avatar">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                      <img src={profileFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-3 bg-brand-sage text-white rounded-2xl shadow-xl hover:bg-brand-forest transition-all"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-sage flex items-center"
                    >
                      <Upload className="w-3 h-3 mr-2" /> Upload New
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProfileFormData(prev => ({...prev, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileFormData.name)}&background=f4f1ea&color=5c6f68&bold=true`}))}
                      className="text-[10px] font-black uppercase tracking-widest text-red-400"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Full Name</label>
                    <input 
                      type="text" 
                      value={profileFormData.name} 
                      onChange={e => setProfileFormData({...profileFormData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Email Address</label>
                    <input 
                      type="email" 
                      value={profileFormData.email} 
                      onChange={e => setProfileFormData({...profileFormData, email: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 bg-slate-50 text-brand-forest/40 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-brand-forest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isEditAddressOpen && addressFormData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-forest/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="bg-brand-forest p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-2xl font-serif italic font-bold">Edit <span className="text-brand-sage">Address</span></h3>
                <p className="text-white/40 text-sm mt-1">Update your shipping details</p>
              </div>

              <form onSubmit={handleSaveAddress} className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Label (e.g. Home, Office)</label>
                    <input 
                      type="text" 
                      value={addressFormData.label} 
                      onChange={e => setAddressFormData({...addressFormData, label: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Receiver Name</label>
                    <input 
                      type="text" 
                      value={addressFormData.name} 
                      onChange={e => setAddressFormData({...addressFormData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Street Address</label>
                    <input 
                      type="text" 
                      value={addressFormData.street} 
                      onChange={e => setAddressFormData({...addressFormData, street: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">City, State, Zip</label>
                    <input 
                      type="text" 
                      value={addressFormData.city} 
                      onChange={e => setAddressFormData({...addressFormData, city: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditAddressOpen(false)}
                    className="flex-1 bg-slate-50 text-brand-forest/40 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-brand-forest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddCardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-forest/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="bg-brand-forest p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-2xl font-serif italic font-bold">Add New <span className="text-brand-sage">Card</span></h3>
                <p className="text-white/40 text-sm mt-1">Securely save your payment details</p>
              </div>

              <form onSubmit={handleAddCard} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardFormData.name}
                    onChange={(e) => setCardFormData({ ...cardFormData, name: e.target.value })}
                    placeholder="Enter full name"
                    className={`w-full px-6 py-4 rounded-2xl border ${cardErrors.name ? 'border-red-400 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all`}
                  />
                  {cardErrors.name && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest pl-4">{cardErrors.name}</p>}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardFormData.number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim()}
                        onChange={(e) => setCardFormData({ ...cardFormData, number: e.target.value.replace(/\s/g, '') })}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full px-6 py-4 rounded-2xl border ${cardErrors.number ? 'border-red-400 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all font-mono`}
                      />
                      <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-forest/20" />
                    </div>
                    {cardErrors.number && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest pl-4">{cardErrors.number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardFormData.expiry}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes('/')) val += '/';
                          setCardFormData({ ...cardFormData, expiry: val });
                        }}
                        placeholder="MM/YY"
                        className={`w-full px-6 py-4 rounded-2xl border ${cardErrors.expiry ? 'border-red-400 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all font-mono`}
                      />
                      {cardErrors.expiry && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest pl-4">{cardErrors.expiry}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardFormData.cvv}
                        onChange={(e) => setCardFormData({ ...cardFormData, cvv: e.target.value })}
                        placeholder="•••"
                        className={`w-full px-6 py-4 rounded-2xl border ${cardErrors.cvv ? 'border-red-400 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:bg-white focus:border-brand-sage outline-none transition-all font-mono`}
                      />
                      {cardErrors.cvv && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest pl-4">{cardErrors.cvv}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSavingCard}
                    className="flex-1 bg-brand-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingCard ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Card</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSavingCard}
                    onClick={() => setIsAddCardOpen(false)}
                    className="flex-1 bg-slate-50 text-brand-forest/40 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-brand-forest transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-forest/40 backdrop-blur-sm">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 p-8 text-center"
             >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif italic font-bold text-brand-forest mb-2">Are you sure?</h3>
                <p className="text-sm text-brand-forest/40 mb-8">This action cannot be undone. This item will be permanently removed.</p>
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={handleDeleteConfirm}
                    className="w-full py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/10"
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })}
                    className="w-full py-4 bg-slate-50 text-brand-forest/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-brand-forest transition-all"
                  >
                    Cancel
                  </button>
                </div>
             </motion.div>
          </div>
        )}

        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 pointer-events-none border border-green-400"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
