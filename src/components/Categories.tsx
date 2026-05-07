import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const Categories: React.FC = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-brand-sage font-semibold tracking-widest uppercase text-xs mb-2">Explore our thoughtful and</p>
          <h2 className="text-4xl font-serif">planet-first <span className="italic font-light">✧ Categories</span></h2>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative min-w-[280px] md:min-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden snap-start group"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Explore</p>
                  <h3 className="text-white text-2xl font-serif italic mb-6">{category.name}</h3>
                  <button className="bg-white text-brand-forest px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-sage hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    Shop
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden absolute top-1/2 -left-4 -translate-y-1/2">
            <div className="p-2 glass-effect rounded-full shadow-lg">
                <ArrowRight className="w-5 h-5 opacity-40 rotate-180" />
            </div>
          </div>
          <div className="md:hidden absolute top-1/2 -right-4 -translate-y-1/2">
            <div className="p-2 glass-effect rounded-full shadow-lg">
                <ArrowRight className="w-5 h-5 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
