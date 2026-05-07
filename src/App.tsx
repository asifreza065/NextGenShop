/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { FeaturedBanner } from './components/FeaturedBanner';
import { Features } from './components/Features';
import { Categories } from './components/Categories';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { Login } from './pages/Login';
import { OrderDetails } from './pages/OrderDetails';
import { TrackOrder } from './pages/TrackOrder';
import { Cart } from './pages/Cart';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { CategoriesPage } from './pages/Categories';
import { AdminOrders } from './pages/AdminOrders';
import { AdminLogin } from './pages/AdminLogin';
import { ScrollToTop } from './components/ScrollToTop';
import { BackButton } from './components/BackButton';
import { PromoteSection } from './components/PromoteSection';

import Fuse from 'fuse.js';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexora_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexora_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('nexora_admin_session') === 'true';
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('nexora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  const filteredProducts = (() => {
    if (!searchQuery.trim()) return products;

    const fuse = new Fuse<Product>(products, {
      keys: ['name', 'category', 'description'],
      threshold: 0.35, // Balanced threshold for typo tolerance
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 1,
    });

    return fuse.search(searchQuery).map(result => result.item);
  })();

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification(`${updatedProduct.name} updated successfully!`);
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const removeOneFromCart = (id: string) => {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-brand-cream/20">
      <ScrollToTop />
      <BackButton />
      {location.pathname !== '/login' && location.pathname !== '/admin/login' && (
        <Navbar 
          cart={cart} 
          onRemoveFromCart={removeFromCart} 
          onSearch={setSearchQuery}
          products={products}
          isAdmin={isAdmin}
          onLogout={() => {
            localStorage.removeItem('nexora_admin_session');
            setIsAdmin(false);
          }}
        />
      )}
      <main className={`${(location.pathname === '/' && !searchQuery) || location.pathname === '/login' ? '' : 'pt-24'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'linear' }}
          >
            <Routes location={location}>
            <Route path="/" element={
              <>
                {!searchQuery && <Hero />}
                <ProductGrid products={filteredProducts} onAddToCart={addToCart} searchQuery={searchQuery} />
                {!searchQuery && (
                  <>
                    <FeaturedBanner />
                    <Features />
                    <Categories />
                    <Gallery />
                    <Testimonials />
                    <div className="bg-white py-12 flex flex-col items-center justify-center text-center px-6">
                      <p className="text-brand-forest/60 text-lg md:text-2xl max-w-3xl leading-relaxed italic font-serif">
                         "Discover our commitment to 🪵 🪴 <span className="font-bold underline decoration-brand-sage underline-offset-8 not-italic">sustainable</span> materials, low-impact production, and <span className="font-bold italic">ethical sourcing</span> partnerships — all crafted to support a healthier planet and a <span className="font-bold text-brand-forest">🥦 greener kitchen.</span>"
                      </p>
                    </div>
                    <Newsletter />
                    <PromoteSection />
                  </>
                )}
              </>
            } />
            <Route path="/product/:id" element={
              <ProductDetails 
                cart={cart}
                products={products}
                onAddToCart={addToCart} 
                onRemoveFromCart={removeFromCart} 
                onUpdateProduct={updateProduct}
              />
            } />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
            <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Navigate to="/admin/login" />} />
            <Route path="/checkout" element={
              <Checkout 
                cart={cart} 
                onRemoveFromCart={removeFromCart} 
                onClearCart={clearCart}
              />
            } />
            <Route path="/cart" element={
              <Cart 
                cart={cart} 
                onAddToCart={addToCart}
                onRemoveOne={removeOneFromCart}
                onRemoveAll={removeFromCart} 
              />
            } />
            <Route path="/order-confirmation/:orderId" element={
              <OrderConfirmation 
                cart={cart} 
              />
            } />
            <Route path="/account" element={
              <Account 
                cart={cart} 
                onRemoveFromCart={removeFromCart} 
              />
            } />
            <Route path="/orders/:orderId" element={
              <OrderDetails 
                cart={cart} 
                onRemoveFromCart={removeFromCart} 
              />
            } />
            <Route path="/orders/:orderId/track" element={
              <TrackOrder 
                cart={cart} 
                onRemoveFromCart={removeFromCart} 
              />
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      </main>
      {location.pathname !== '/login' && <Footer />}

        {/* Persistent Bottom Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] glass-effect px-6 py-3 rounded-full text-brand-forest text-sm font-semibold shadow-2xl border-brand-sage/20 flex items-center space-x-2"
            >
              <span className="w-2 h-2 bg-brand-sage rounded-full animate-pulse" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

