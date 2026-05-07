import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const FeaturedBanner: React.FC = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden bg-brand-forest shadow-2xl">
          <div className="relative h-[400px] lg:h-auto overflow-hidden flex items-center justify-center bg-white p-8">
             <img 
              src="https://i.ibb.co.com/XdvMLzG/912-YTNXMZ1-L-AC-SL1500.jpg" 
              alt="Sustainable Kitchen" 
              loading="lazy"
              className="w-full max-w-[200px] h-auto object-contain transition-transform duration-[10s] hover:scale-110"
             />
             {/* Text overlay similar to image */}
             <div className="absolute inset-0 flex items-end p-10 bg-gradient-to-t from-black/40 to-transparent">
                <p className="text-white text-xl font-serif max-w-sm leading-relaxed">
                   We craft <span className="italic">kitchenware</span> you can trust for years to come — through everyday meals and <span className="italic font-light">evolving lifestyles</span>. 
                </p>
             </div>
          </div>

          <div className="p-12 md:p-20 flex flex-col justify-center bg-[#E5EAE1]">
             <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
             >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-sage mb-8 shadow-sm">
                   <span className="text-xl">✨</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-forest leading-tight mb-8">
                  Designed for the <br />
                  <span className="italic">Modern Interior</span>
                </h2>
                <p className="text-brand-forest/70 text-lg leading-relaxed mb-10">
                  Each piece is thoughtfully made with sustainable materials that age beautifully with your kitchen. Simple, functional, and planet-first.
                </p>
                <button className="bg-brand-forest text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-sage transition-all flex items-center group w-fit">
                  Learn Our Story
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
