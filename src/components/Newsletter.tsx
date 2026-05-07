import React from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

export const Newsletter: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-brand-forest rounded-[3rem] overflow-hidden relative min-h-[500px] flex items-center px-8 md:px-20 py-20">
          {/* Decorative background images */}
          <div className="absolute inset-0 z-0 opacity-40">
             <img 
              src="https://images.unsplash.com/photo-1556912177-c54030639a09?auto=format&fit=crop&q=80&w=2000" 
              alt="Kitchenware" 
              className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-brand-forest/80 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
             >
                <h2 className="text-brand-beige font-semibold tracking-[0.3em] uppercase text-xs mb-6">Get Recipes</h2>
                <h3 className="text-white text-5xl md:text-7xl font-serif italic mb-10">10% Off</h3>
                
                <div className="max-w-md mx-auto relative mb-8">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-8 py-5 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all font-light"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-brand-beige text-brand-forest px-8 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg">
                    Subscribe
                  </button>
                </div>

                <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
                  Eco-friendly recipes, cooking tips, and a 10% discount on sustainable kitchenware for a greener lifestyle.
                </p>
             </motion.div>
          </div>

          {/* Floating showcase items */}
          <div className="absolute left-8 top-8 w-24 h-24 rounded-2xl overflow-hidden hidden lg:block rotate-[-12deg] shadow-2xl border-4 border-white/10">
             <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
          </div>
          <div className="absolute right-12 top-12 w-32 h-32 rounded-2xl overflow-hidden hidden lg:block rotate-[8deg] shadow-2xl border-4 border-white/10">
             <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
          </div>
          <div className="absolute left-16 bottom-12 w-28 h-28 rounded-2xl overflow-hidden hidden lg:block rotate-[5deg] shadow-2xl border-4 border-white/10">
             <img src="https://images.unsplash.com/photo-1584990344321-27662ddec99a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
          </div>
          <div className="absolute right-16 bottom-8 w-36 h-48 rounded-[2rem] overflow-hidden hidden lg:block rotate-[-5deg] shadow-2xl border-4 border-white/10">
             <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
