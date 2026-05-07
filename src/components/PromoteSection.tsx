import React from 'react';
import { motion } from 'motion/react';
import { Share2, Heart, Award } from 'lucide-react';

export const PromoteSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-brand-cream/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-sage/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-brand-forest/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Support the Craft</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-brand-forest mb-6 tracking-tighter uppercase"
        >
          Promote <span className="text-brand-sage">My Work</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-brand-forest/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          If you appreciate the creative effort behind these designs, your support means the world. Share this portfolio with your network or help us reach more creative minds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button
            className="group relative px-10 py-5 bg-brand-forest text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] overflow-hidden transition-all hover:bg-brand-sage shadow-2xl shadow-brand-forest/20 active:scale-95"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Creative Design Portfolio',
                  text: 'Check out this amazing creative work!',
                  url: window.location.href,
                }).catch(console.error);
              } else {
                alert('Shared to clipboard link!');
              }
            }}
          >
            <span className="relative z-10 flex items-center">
              Promote Now
              <Share2 className="w-4 h-4 ml-3 group-hover:rotate-12 transition-transform" />
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-4 rounded-2xl border border-brand-forest/10 hover:border-brand-sage hover:bg-brand-sage/5 transition-all text-brand-forest/40 hover:text-brand-sage active:scale-90">
              <Heart className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-forest/30">
              Join 2k+ Supporters
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
