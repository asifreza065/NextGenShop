import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, User, Menu, X, Trash2, Plus, Minus, Clock, ChevronDown, Palette, Layout, Hash, Tv, Activity, Briefcase, MousePointer2, StickyNote, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { auth, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import Fuse from 'fuse.js';

interface NavbarProps {
  cart: Product[];
  onRemoveFromCart: (id: string) => void;
  onSearch?: (query: string) => void;
  products?: Product[];
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cart, onRemoveFromCart, onSearch, products, isAdmin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const allProducts = products || PRODUCTS;
  const trendingSearches = ['Kitchen Set', 'Sustainable Bowls', 'Organic Cotton', 'Marble Tray', 'Ceramic Mug'];

  const categories = [
    { name: 'Graphic Design', icon: <Palette className="w-4 h-4" /> },
    { name: 'Logo Design', icon: <Hash className="w-4 h-4" /> },
    { name: 'Social Media Design', icon: <Layout className="w-4 h-4" /> },
    { name: 'YouTube Thumbnail', icon: <Tv className="w-4 h-4" /> },
    { name: 'Motion Graphics', icon: <Activity className="w-4 h-4" /> },
    { name: 'Branding', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'UI/UX Design', icon: <MousePointer2 className="w-4 h-4" /> },
    { name: 'Poster Design', icon: <StickyNote className="w-4 h-4" /> },
  ];

  const isHome = location.pathname === '/';
  const hasSearch = new URLSearchParams(location.search).get('search') || searchQuery;
  
  const navbarBackground = (isHome && !hasSearch && !isScrolled) 
      ? 'bg-transparent py-6' 
      : 'bg-white/90 backdrop-blur-xl shadow-md py-4 border-b border-gray-100';

  const navbarTextColor = (isHome && !hasSearch && !isScrolled)
      ? 'text-white'
      : 'text-brand-forest';

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="text-brand-sage font-black">{part}</span> 
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const suggestions = searchQuery.length >= 1 
    ? (() => {
        const fuse = new Fuse<Product>(allProducts, {
          keys: ['name', 'category'],
          threshold: 0.4,
          minMatchCharLength: 1,
        });
        return fuse.search(searchQuery).map(result => result.item).slice(0, 8);
      })()
    : [];

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('nextgenshop_search_history') || '[]');
    setRecentSearches(history);
  }, [showSuggestions]);

  const removeSearchHistoryItem = (item: string) => {
    const history = JSON.parse(localStorage.getItem('nextgenshop_search_history') || '[]');
    const newHistory = history.filter((h: string) => h !== item);
    localStorage.setItem('nextgenshop_search_history', JSON.stringify(newHistory));
    setRecentSearches(newHistory);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('nextgenshop_search_history');
    setRecentSearches([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    if (onSearch) {
      onSearch(query);
    }
  };

  const [isMouseOverSearch, setIsMouseOverSearch] = useState(false);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const history = JSON.parse(localStorage.getItem('nextgenshop_search_history') || '[]');
    const newHistory = [query, ...history.filter((h: string) => h !== query)].slice(0, 5);
    localStorage.setItem('nextgenshop_search_history', JSON.stringify(newHistory));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      addToHistory(searchQuery);
      if (!onSearch) {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleSuggestionClick = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) addToHistory(product.name);
    
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBackground} ${navbarTextColor}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Links Left */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider">
            <Link to="/" className="hover:text-brand-sage transition-colors">Shop</Link>
            <Link to="/" className="hover:text-brand-sage transition-colors">Bestsellers</Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button 
                className="flex items-center hover:text-brand-sage transition-colors focus:outline-none"
              >
                Categories
                <ChevronDown className={`ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    <div className="p-3 grid gap-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={`/?search=${encodeURIComponent(category.name)}`}
                          className="flex items-center px-4 py-2.5 rounded-xl text-[11px] font-bold text-brand-forest hover:bg-brand-sage/5 hover:text-brand-sage transition-all group"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <span className="mr-3 text-brand-forest/30 group-hover:text-brand-sage transition-colors">
                            {category.icon}
                          </span>
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="bg-gray-50/50 p-3 flex justify-center">
                      <Link to="/categories" className="text-[10px] font-black uppercase tracking-widest text-brand-forest/40 hover:text-brand-sage transition-colors">
                        View All Categories
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Logo */}
          <Link to="/" className="flex-1 text-center md:flex-initial">
            <h1 className="text-3xl font-serif italic font-semibold">NextGenShop</h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
             <div 
               onMouseEnter={() => {
                 setIsMouseOverSearch(true);
                 setShowSuggestions(true);
               }}
               onMouseLeave={() => {
                 setIsMouseOverSearch(false);
                 if (document.activeElement !== searchInputRef.current) {
                   setShowSuggestions(false);
                 }
               }}
               className="hidden md:flex items-center glass-effect px-4 py-2 rounded-full border-none bg-brand-forest/5 relative"
             >
                <Search className="w-4 h-4 text-brand-forest/60 mr-2" />
                <input 
                 ref={searchInputRef}
                 type="text" 
                 placeholder="Search Product..." 
                 value={searchQuery}
                 onChange={handleSearchChange}
                 onKeyDown={handleKeyDown}
                 onFocus={() => setShowSuggestions(true)}
                 onBlur={() => {
                   if (!isMouseOverSearch) setShowSuggestions(false);
                 }}
                 className="bg-transparent border-none outline-none text-xs w-32 focus:w-48 transition-all"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => {
                        setSearchQuery('');
                        if (onSearch) onSearch('');
                      }}
                      className="ml-2 p-1 text-brand-forest/40 hover:text-brand-sage transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute top-full left-[-20%] w-[320px] mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
                  >
                    {!searchQuery && (recentSearches.length > 0 || trendingSearches.length > 0) && (
                      <div className="p-5 border-b border-gray-50">
                        {recentSearches.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] uppercase tracking-widest font-black text-brand-forest/30 flex items-center">
                                <Trash2 className="w-3 h-3 mr-2" /> Recent Searches
                              </h4>
                              <button 
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  clearSearchHistory();
                                }}
                                className="text-[9px] font-black uppercase text-red-300 hover:text-red-500 transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="space-y-1">
                              {recentSearches.map((s, i) => (
                                <div key={i} className="flex items-center justify-between group/item px-3 py-2 -mx-3 rounded-xl hover:bg-gray-50 transition-all">
                                  <button 
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setSearchQuery(s);
                                      if (onSearch) onSearch(s);
                                      setShowSuggestions(false);
                                    }}
                                    className="flex items-center text-xs text-brand-forest hover:text-brand-sage transition-colors text-left flex-1 font-medium"
                                  >
                                    <Clock className="w-3 h-3 mr-3 text-brand-forest/20 group-hover/item:text-brand-sage/40 transition-colors" />
                                    {s}
                                  </button>
                                  <button
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      removeSearchHistoryItem(s);
                                    }}
                                    className="opacity-0 group-hover/item:opacity-100 p-1 text-brand-forest/20 hover:text-red-500 transition-all ml-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <h4 className="text-[10px] uppercase tracking-widest font-black text-brand-sage mb-3">Trending Searches</h4>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((s, i) => (
                            <button 
                              key={i}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSearchQuery(s);
                                if (onSearch) onSearch(s);
                                setShowSuggestions(false);
                              }}
                              className="px-3 py-1.5 bg-brand-forest/5 rounded-full text-[10px] text-brand-forest hover:bg-brand-sage hover:text-white transition-all font-medium"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchQuery && suggestions.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-xs text-brand-forest/40 italic">No products matched your search.</p>
                      </div>
                    )}

                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(suggestion.id);
                        }}
                        className="w-full flex items-center p-4 hover:bg-slate-50 transition-all text-left border-b border-slate-50 last:border-0 group"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 mr-4 flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                          <img src={suggestion.image} alt="" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-brand-forest truncate leading-tight">
                            {highlightText(suggestion.name, searchQuery)}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-[9px] text-brand-forest/40 uppercase tracking-widest">{suggestion.category}</span>
                            <span className="text-[9px] font-black text-brand-sage">${suggestion.price}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {searchQuery && suggestions.length > 0 && (
                      <button 
                        onClick={() => navigate(`/?search=${encodeURIComponent(searchQuery)}`)}
                        className="w-full p-4 text-center bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-brand-forest/40 hover:bg-brand-sage hover:text-white transition-all"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    )}
                  </motion.div>
                )}
               </AnimatePresence>
            </div>
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-brand-forest hover:text-brand-sage transition-colors">Login</Link>
                <Link to="/login" className="px-4 py-2 text-sm font-medium bg-brand-forest text-white rounded-[2rem] hover:bg-brand-sage transition-colors">Create Account</Link>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link to="/account" className="p-2 hover:bg-brand-sage/10 rounded-full transition-colors text-brand-forest" title="My Account">
                  <User className="w-5 h-5" />
                </Link>
                <button 
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }} 
                  className="px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            
            {isAdmin && (
              <div className="flex items-center space-x-1">
                <Link to="/admin/orders" className="p-2 hover:bg-brand-sage/10 rounded-full transition-colors hidden md:block text-brand-sage" title="Admin Orders">
                  <Shield className="w-5 h-5" />
                </Link>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-rose-500/10 rounded-full transition-colors text-rose-500"
                  title="Logout Admin"
                >
                  <Shield className="w-5 h-5 fill-rose-500/10 hover:fill-rose-500/20" />
                </button>
              </div>
            )}
            <button 
              className="p-2 hover:bg-brand-sage/10 rounded-full transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-sage text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-cream p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif italic font-semibold">NextGenShop</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-brand-forest/5 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-8 relative">
              <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                <Search className="w-5 h-5 text-brand-forest/20 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search Product..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      if (onSearch) onSearch('');
                    }}
                    className="p-1 text-brand-forest/40 hover:text-brand-sage transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
                <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    {!searchQuery && (recentSearches.length > 0 || trendingSearches.length > 0) && (
                      <div className="p-4 border-b border-gray-50 bg-slate-50/30">
                        {recentSearches.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[9px] uppercase tracking-widest font-black text-brand-forest/20">Recent</h4>
                              <button 
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  clearSearchHistory();
                                }}
                                className="text-[8px] font-black uppercase text-red-300"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.map((s, i) => (
                                <div key={i} className="flex items-center bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
                                  <button 
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setSearchQuery(s);
                                      if (onSearch) onSearch(s);
                                      setShowSuggestions(false);
                                    }}
                                    className="text-[10px] text-brand-forest"
                                  >
                                    {s}
                                  </button>
                                  <button 
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      removeSearchHistoryItem(s);
                                    }}
                                    className="ml-1.5 p-0.5 text-brand-forest/30 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <h4 className="text-[9px] uppercase tracking-widest font-black text-brand-sage mb-2">Trending</h4>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((s, i) => (
                            <button 
                              key={i}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSearchQuery(s);
                                if (onSearch) onSearch(s);
                                setShowSuggestions(false);
                              }}
                              className="text-[10px] font-medium text-brand-forest hover:text-brand-sage transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchQuery && suggestions.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-xs text-brand-forest/40">No matches found.</p>
                      </div>
                    )}

                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(suggestion.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-lg p-1.5 mr-4 flex-shrink-0 flex items-center justify-center">
                          <img src={suggestion.image} alt="" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-brand-forest truncate">
                            {highlightText(suggestion.name, searchQuery)}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[9px] text-brand-forest/40 uppercase tracking-widest">{suggestion.category}</span>
                            <span className="text-[10px] font-black text-brand-sage">${suggestion.price}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {searchQuery && suggestions.length > 0 && (
                      <button 
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="w-full p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-brand-forest/40"
                      >
                        Show all results
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col space-y-6 text-xl font-medium">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Bestsellers</Link>
              
              {/* Mobile Categories Accordion */}
              <div>
                <button 
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  Categories
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMobileCategoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 pl-4 grid grid-cols-1 gap-4">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={`/?search=${encodeURIComponent(category.name)}`}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsMobileCategoriesOpen(false);
                            }}
                            className="flex items-center text-sm text-brand-forest/60 hover:text-brand-sage"
                          >
                            <span className="mr-3 text-brand-forest/20">{category.icon}</span>
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!currentUser ? (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Create Account</Link>
                </>
              ) : (
                <>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  <button 
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await logout();
                      navigate('/');
                    }} 
                    className="text-left text-rose-500 font-bold"
                  >
                    Logout
                  </button>
                </>
              )}
              {isAdmin && (
                <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-sage font-black">Admin Dashboard</Link>
              )}
              {isAdmin && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }} 
                  className="text-left text-rose-500 font-bold"
                >
                  Admin Logout
                </button>
              )}
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-xl font-semibold">Your Cart ({cart.length})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex space-x-4">
                      <img src={item.image} alt={item.name} loading="lazy" className="w-20 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-brand-sage text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center space-x-2 border border-gray-100 rounded-full px-2 py-1">
                              <Minus className="w-3 h-3 text-gray-400 cursor-pointer" />
                              <span className="text-xs">1</span>
                              <Plus className="w-3 h-3 text-gray-400 cursor-pointer" />
                           </div>
                           <button 
                            onClick={() => onRemoveFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-bold font-serif italic">${cartTotal.toFixed(2)}</span>
                </div>
                <Link 
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-brand-forest text-white py-4 rounded-xl font-medium hover:bg-brand-sage transition-all shadow-lg hover:shadow-brand-sage/20 flex items-center justify-center mb-3"
                >
                  View My Cart
                </Link>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-white border border-brand-forest/10 text-brand-forest py-4 rounded-xl font-medium hover:border-brand-sage transition-all flex items-center justify-center"
                >
                  Checkout
                </Link>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
