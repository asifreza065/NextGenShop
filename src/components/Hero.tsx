import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.ibb.co.com/k2qSTTLR/futuristic-video-game-equipment-illuminated-nightclub-generative-ai.jpg" 
          alt="Modern Kitchen" 
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-forest/60 via-brand-forest/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
              Eco-Friendly <br />
              <span className="italic font-light">Kitchenware</span> for <br />
              a greener home
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-lg font-light leading-relaxed">
              The eco-friendly kitchenware niche with a sense of urgency, look like the original banner with pieces that would look like old adjustments.
            </p>
            <div className="flex items-center space-x-4">
              <button className="bg-white text-brand-forest px-8 py-4 rounded-full font-semibold hover:bg-brand-sage hover:text-white transition-all flex items-center group">
                Shop now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Info Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute right-6 bottom-12 md:right-12 md:bottom-24 glass-effect p-8 rounded-2xl max-w-xs hidden sm:block"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-brand-forest/60 font-semibold leading-loose">
              Natural. <br />
              Sustainable. <br />
              Eco-conscious.
            </p>
            <div className="w-10 h-10 rounded-full bg-brand-sage/20 flex items-center justify-center">
               <span className="text-brand-sage text-xl font-serif">🌱</span>
            </div>
          </div>
          <div className="text-5xl font-serif italic text-brand-forest">96%</div>
          <p className="text-[10px] uppercase tracking-widest text-brand-forest/40 mt-2 font-bold">Recyclable materials</p>
        </motion.div>
      </div>
    </section>
  );
};
