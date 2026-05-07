import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Truck, Shield, ArrowLeft, ShoppingCart, Heart, Share2, Ruler, Info, CheckCircle2, Edit2, X } from 'lucide-react';
import { Product } from '../types';
import { AnimatePresence } from 'motion/react';

interface ProductDetailsProps {
  cart: Product[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ cart, products, onAddToCart, onRemoveFromCart, onUpdateProduct }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Product>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || ''
      });
    }
  }, [id, product]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && formData.name && formData.price !== undefined && formData.image) {
      onUpdateProduct({
        ...product,
        name: formData.name,
        price: Number(formData.price),
        image: formData.image,
        description: formData.description
      });
      setIsEditModalOpen(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream/30 px-6 text-center">
        <h1 className="text-4xl font-serif mb-6">Product Not Found</h1>
        <p className="text-brand-forest/60 mb-8 max-w-md">We couldn't find the product you're looking for. It might have been moved or is no longer available.</p>
        <Link 
          to="/" 
          className="bg-brand-forest text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-sage transition-all shadow-lg"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-forest/40 mb-12">
          <Link to="/" className="hover:text-brand-sage transition-colors">Home</Link>
          <span className="w-1 h-1 bg-brand-forest/20 rounded-full" />
          <span className="hover:text-brand-sage transition-colors uppercase">{product.category}</span>
          <span className="w-1 h-1 bg-brand-forest/20 rounded-full" />
          <span className="text-brand-forest/80 truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Product Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden group relative flex items-center justify-center p-12">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8">
                {product.badge && (
                  <span className="glass-effect px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-forest/70 shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>
              <button className="absolute top-8 right-8 p-3 rounded-full bg-white shadow-md text-brand-forest hover:text-red-500 hover:scale-110 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {/* Thumbnail Preview (Placeholder) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-2xl border-2 border-transparent hover:border-brand-sage transition-all cursor-pointer overflow-hidden p-3 group">
                   <img 
                    src={product.image} 
                    alt={`Preview ${i}`} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>

            {/* Detailed Specs and Features (Moved to sides to the left) */}
            <div className="mt-16 space-y-12">
               {product.features && (
                 <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-forest mb-6 flex items-center text-left">
                     <span className="w-8 h-[1px] bg-brand-sage mr-4" />
                     Key Features
                   </h3>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                     {product.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start space-x-3 text-sm text-brand-forest/70">
                         <CheckCircle2 className="w-4 h-4 text-brand-sage flex-shrink-0 mt-0.5" />
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {product.specifications && (
                 <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-forest mb-6 flex items-center text-left">
                     <span className="w-8 h-[1px] bg-brand-sage mr-4" />
                     Technical Specifications
                   </h3>
                   <div className="bg-brand-cream/10 rounded-3xl overflow-hidden border border-brand-sage/5">
                     <table className="w-full text-sm text-left">
                       <tbody>
                         {Object.entries(product.specifications).map(([key, value], idx) => (
                           <tr key={key} className={idx % 2 === 0 ? 'bg-brand-cream/20' : ''}>
                             <td className="py-4 px-6 font-bold text-brand-forest/60 w-1/3">{key}</td>
                             <td className="py-4 px-6 text-brand-forest/80 italic">{value}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}
             </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8 relative">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -top-4 right-0 p-2.5 bg-brand-cream/40 rounded-full text-brand-sage hover:bg-brand-sage hover:text-white transition-all shadow-sm z-10"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-sage mb-4 block">
                {product.category}
              </span>
              <h1 className="text-lg md:text-2xl font-serif text-brand-forest leading-snug mb-4 tracking-tight font-semibold">
                {product.name}
              </h1>
              
              {product.rating && (
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-orange-400 text-orange-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-brand-forest/60">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                  <span className="w-6 h-[1px] bg-brand-forest/10" />
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider">{product.boughtCount}</span>
                </div>
              )}

              <div className="flex items-baseline space-x-2 mb-8">
                <span className="text-4xl font-bold text-brand-forest">${product.price.toFixed(2)}</span>
                <span className="text-xs font-bold text-brand-forest/40 uppercase tracking-widest">+ Free Shipping</span>
              </div>

              <p className="text-brand-forest/70 leading-relaxed mb-8 text-lg font-light">
                {product.description || `Elevate your sustainable kitchen with the ${product.name}. Crafted from eco-friendly materials, this ${product.category.toLowerCase()} piece combines timeless minimalist design with peak functionality. Perfect for those who value ethical sourcing without compromising on style.`}
              </p>
            </div>

            {/* Options */}
            {product.options && (
              <div className="mb-8 p-6 bg-brand-cream/20 rounded-3xl border border-brand-sage/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-forest/80">Available Options</h4>
                  <button className="flex items-center text-[10px] font-bold text-brand-sage hover:underline">
                    <Ruler className="w-3 h-3 mr-1" /> Size Guide
                  </button>
                </div>
                <p className="text-sm font-medium text-brand-forest/60">{product.options}</p>
                <div className="flex space-x-3 mt-4">
                  {['#E5E7EB', '#D1D5DB', '#9CA3AF'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-200 hover:ring-brand-sage transition-all" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-brand-forest text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-sage transition-all shadow-xl hover:shadow-brand-sage/20 flex items-center justify-center space-x-3 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button className="px-8 py-5 rounded-full border-2 border-brand-forest/10 font-bold uppercase tracking-[0.2em] text-[10px] text-brand-forest hover:bg-brand-forest hover:text-white transition-all flex items-center justify-center space-x-3 group">
                <Share2 className="w-4 h-4 group-hover:scale-110" />
                <span>Share</span>
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-brand-forest/5">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-cream/40 rounded-xl">
                  <Truck className="w-5 h-5 text-brand-sage" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-forest mb-1">Fast Delivery</h4>
                  <p className="text-[10px] font-bold text-brand-forest/40 uppercase leading-relaxed">{product.delivery || 'Ships within 24h'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-cream/40 rounded-xl">
                  <Shield className="w-5 h-5 text-brand-sage" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-forest mb-1">Eco Warranty</h4>
                  <p className="text-[10px] font-bold text-brand-forest/40 uppercase leading-relaxed">2 Year Guarantee</p>
                </div>
              </div>
            </div>
            
            {/* Added Note */}
             <div className="mt-12 p-5 bg-brand-forest rounded-2xl flex items-center space-x-4 text-white/90">
                <Info className="w-6 h-6 flex-shrink-0 text-brand-sage" />
                <p className="text-[11px] leading-relaxed font-medium">
                  By purchasing this {product.category.toLowerCase()}, you're helping us plant 1 tree in deforested areas across Africa. Every small step counts.
                </p>
             </div>
          </motion.div>

        </div>

        {/* Similar Products Placeholder */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif">You May Also <span className="italic">✧ Like</span></h2>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-brand-sage hover:underline">View All Collection</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.filter(p => p.id !== product.id).slice(0, 4).map(item => (
              <Link key={item.id} to={`/product/${item.id}`} className="group block">
                <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-4 p-6 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-xs font-bold text-brand-forest/80 group-hover:text-brand-sage transition-colors truncate uppercase tracking-widest">{item.name}</h4>
                <p className="text-sm font-serif italic text-brand-forest">${item.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-forest/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100"
            >
              <div className="bg-brand-forest p-8 text-white relative overflow-hidden flex justify-between items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div>
                  <h3 className="text-2xl font-serif italic font-bold">Edit <span className="text-brand-sage">Product</span></h3>
                  <p className="text-white/40 text-sm mt-1">Updates will be reflected instantly</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-white/60 hover:text-white transition-colors relative z-10">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Product Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Price ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formData.price || 0} 
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Category</label>
                      <input 
                        type="text" 
                        value={product.category || ''} 
                        disabled
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 outline-none cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Image URL</label>
                    <input 
                      type="text" 
                      value={formData.image || ''} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-sage">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description || ''} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-sage outline-none transition-all resize-none" 
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
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
