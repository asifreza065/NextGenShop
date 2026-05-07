import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, ArrowRight, Star, Search, RefreshCcw, X, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import Fuse from 'fuse.js';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isFirst?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isFirst }) => {
  const isDetailed = !!product.rating;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group flex flex-col ${isDetailed ? 'bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300' : ''}`}
    >
      <div className={`relative ${isDetailed ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden rounded-2xl bg-white mb-4 flex items-center justify-center`}>
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            className={`transition-transform duration-700 group-hover:scale-110 ${isFirst ? 'w-full max-w-[200px] h-auto' : 'w-full h-full object-cover'}`}
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {product.badge === 'Customer Favorite' ? (
           <div className="absolute top-0 left-0 bg-orange-500 text-white px-3 py-1 rounded-br-xl text-[9px] font-bold uppercase tracking-tighter z-10 shadow-lg pointer-events-none">
            Overall Pick
          </div>
        ) : product.badge && (
          <span className="absolute top-4 left-4 glass-effect px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-forest/60 pointer-events-none">
            {product.badge}
          </span>
        )}

        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-brand-forest opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-sage hover:text-white translate-y-2 group-hover:translate-y-0 shadow-sm">
          <Heart className="w-4 h-4" />
        </button>

        {!isDetailed && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-forest text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-brand-sage transition-colors shadow-lg"
            >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">+ Cart</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5 px-1 flex-1 flex flex-col">
        {!isDetailed && (
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-forest/40 font-bold mb-1">
              {product.category}
            </p>
            <div className="flex space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-sage"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand-beige"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent"></div>
            </div>
          </div>
        )}

        <Link to={`/product/${product.id}`}>
          <h3 className={`text-brand-forest/90 group-hover:text-brand-sage transition-colors leading-tight line-clamp-2 ${isDetailed ? 'text-sm font-semibold' : 'text-base font-medium truncate'}`}>
            {product.name}
          </h3>
        </Link>

        {product.options && (
          <p className="text-[10px] text-blue-600 hover:underline cursor-pointer font-medium">Options: {product.options}</p>
        )}

        {product.rating && (
          <div className="flex items-center space-x-1 py-0.5">
             <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
             <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                ))}
             </div>
             <span className="text-[10px] text-blue-600 font-medium hover:underline cursor-pointer">({product.reviews})</span>
          </div>
        )}

        {product.boughtCount && (
          <p className="text-[10px] text-gray-500 font-medium">{product.boughtCount}</p>
        )}

        {isDetailed ? (
          <div className="pt-1">
            <div className="flex items-baseline space-x-0.5">
              <span className="text-[10px] font-bold translate-y-[-4px]">$</span>
              <span className="text-2xl font-bold leading-none">{Math.floor(product.price)}</span>
              <span className="text-[10px] font-bold translate-y-[-4px]">{(product.price % 1).toFixed(2).split('.')[1]}</span>
            </div>
          </div>
        ) : (
          <p className="text-lg font-serif italic text-brand-forest font-semibold">
            ${product.price.toFixed(2)}
          </p>
        )}

        {product.delivery && (
          <p className="text-[10px] text-gray-600 font-medium">{product.delivery}</p>
        )}

        {isDetailed && (
          <div className="mt-auto pt-4">
             <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-terracotta text-white py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-brand-forest transition-all shadow-md active:scale-95"
             >
                Add To Cart
             </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, searchQuery = '' }) => {
  const recommendations = PRODUCTS.slice(0, 4);
  const [history, setHistory] = React.useState<string[]>([]);
  const [localSearch, setLocalSearch] = React.useState('');
  const [showLocalSuggestions, setShowLocalSuggestions] = React.useState(false);
  const navigate = useNavigate();

  const localSuggestions = localSearch.length >= 1 
    ? (() => {
        const fuse = new Fuse<Product>(PRODUCTS, {
          keys: ['name', 'category'],
          threshold: 0.4,
          minMatchCharLength: 1,
        });
        return fuse.search(localSearch).map(result => result.item).slice(0, 5);
      })()
    : [];

  const loadHistory = () => {
    const saved = localStorage.getItem('nexora_search_history');
    if (saved) setHistory(JSON.parse(saved));
  };

  React.useEffect(() => {
    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('nexora_search_history');
    setHistory([]);
  };

  const removeHistoryItem = (item: string) => {
    const newHistory = history.filter(h => h !== item);
    localStorage.setItem('nexora_search_history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      const history = JSON.parse(localStorage.getItem('nexora_search_history') || '[]');
      const newHistory = [localSearch, ...history.filter((h: string) => h !== localSearch)].slice(0, 5);
      localStorage.setItem('nexora_search_history', JSON.stringify(newHistory));
      setShowLocalSuggestions(false);
      navigate(`/?search=${encodeURIComponent(localSearch)}`);
    }
  };

  const getSimilarProducts = () => {
    const query = searchQuery || new URLSearchParams(window.location.search).get('search');
    if (!query) return PRODUCTS.slice(0, 4);

    const fuse = new Fuse<Product>(PRODUCTS, {
      keys: ['name', 'category', 'description'],
      threshold: 0.5, // Higher threshold for "similar" products
      shouldSort: true,
    });

    const results = fuse.search(query).map(result => result.item);
    return results.length > 0 ? results.slice(0, 4) : PRODUCTS.slice(0, 4);
  };

  const trendingSearches = ['Kitchen Set', 'Sustainable Bowls', 'Organic Cotton', 'Marble Tray', 'Ceramic Mug'];
  const recommendedItems = getSimilarProducts();
  const effectiveSearchQuery = searchQuery || new URLSearchParams(window.location.search).get('search');

  return (
    <section className="section-padding bg-white min-h-[60vh] flex items-center" id="products">
      <div className="max-w-7xl mx-auto w-full">
        {products.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-brand-sage font-semibold tracking-widest uppercase text-xs mb-2">
                {effectiveSearchQuery ? "Search Results" : "Eco Essentials Planet-Friendly"}
              </p>
              <h2 className="text-4xl font-serif">
                {effectiveSearchQuery ? (
                  <>Matches for <span className="italic font-light">✧ "{effectiveSearchQuery}"</span></>
                ) : (
                  <>Bestselling <span className="italic font-light">✧ Products</span></>
                )}
              </h2>
            </div>
            {!effectiveSearchQuery && (
              <a href="#" className="flex items-center text-sm font-semibold hover:text-brand-sage transition-all group">
                More products
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                isFirst={true}
              />
            ))
          ) : (
            <div className="col-span-full py-12 md:py-20 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto px-6"
              >
                <div className="w-24 h-24 bg-brand-forest/5 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-forest/20">
                  <Search className="w-12 h-12" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-serif italic text-brand-forest mb-4">No results for your search query.</h3>
                
                <p className="text-brand-forest/50 text-lg mb-10">
                  Try checking your spelling or use more general terms.<br />
                  <span className="text-sm">Check each product page for other buying options.</span>
                </p>

                <form onSubmit={handleLocalSearch} className="max-w-md mx-auto mb-12 relative group">
                  <input 
                    type="text" 
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onFocus={() => setShowLocalSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocalSuggestions(false), 200)}
                    placeholder="Try searching something else..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-sage transition-all shadow-sm focus:shadow-md"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-forest/20 group-focus-within:text-brand-sage transition-colors" />
                  
                  <AnimatePresence>
                    {showLocalSuggestions && localSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onMouseDown={(e) => e.preventDefault()}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[70] text-left"
                      >
                        {localSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setLocalSearch(suggestion.name);
                              navigate(`/?search=${encodeURIComponent(suggestion.name)}`);
                            }}
                            className="w-full flex items-center p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                          >
                            <div className="w-8 h-8 bg-gray-50 rounded-lg p-1 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                              <img src={suggestion.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-[10px] font-bold text-brand-forest truncate">{suggestion.name}</p>
                              <p className="text-[8px] text-brand-forest/40 uppercase tracking-widest">{suggestion.category}</p>
                            </div>
                            <p className="text-[10px] font-black text-brand-sage ml-2">${suggestion.price}</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                {history.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage flex items-center">
                        <RefreshCcw className="w-3 h-3 mr-2" /> Recently Searched
                      </p>
                      <button 
                        onClick={clearHistory}
                        className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {history.map((item, idx) => (
                        <div key={idx} className="group relative">
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              navigate(`/?search=${encodeURIComponent(item)}`);
                            }}
                            className="inline-block px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs text-brand-forest hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-all pr-8"
                          >
                            {item}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeHistoryItem(item);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-forest/30 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-sage mb-4">Trending Now</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {trendingSearches.map((s, i) => (
                      <button 
                        key={i}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(`/?search=${encodeURIComponent(s)}`);
                        }}
                        className="px-4 py-2 bg-brand-forest/5 rounded-full text-[10px] text-brand-forest hover:bg-brand-sage hover:text-white transition-all font-bold uppercase tracking-widest"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                  <Link 
                    to="/" 
                    className="w-full sm:w-auto px-10 py-5 bg-brand-forest text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-brand-sage transition-all shadow-xl shadow-brand-forest/10"
                  >
                    Back to Home
                  </Link>
                  <button 
                    onClick={() => {
                        const input = document.querySelector('input[placeholder="Search Product..."]') as HTMLInputElement;
                        input?.focus();
                    }}
                    className="w-full sm:w-auto px-10 py-5 bg-white border border-gray-100 text-brand-forest rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                  >
                    Search Again
                  </button>
                </div>

                <div className="pt-20 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <div className="text-left">
                      <p className="text-brand-sage font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                        {effectiveSearchQuery ? "Similar Findings" : "Editor's Choice"}
                      </p>
                      <h4 className="text-2xl font-serif text-brand-forest">
                        {effectiveSearchQuery ? "Recommended for " : "Curated for "}<span className="italic">✧ You</span>
                      </h4>
                    </div>
                    <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-brand-forest/30 hover:text-brand-sage transition-all underline underline-offset-8 decoration-brand-forest/10 hover:decoration-brand-sage/40">View All Collections</Link>
                  </div>
                  <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12"
                  >
                    {recommendedItems.map(item => (
                      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} key={item.id}>
                        <ProductCard product={item} onAddToCart={onAddToCart} isFirst={true} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
