import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const galleryItems = [
  { title: 'SizzlePro Non-Stick Pan', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600' },
  { title: 'Grain Slice Board Duo', image: 'https://images.unsplash.com/photo-1591192131238-d621ed0f04ca?auto=format&fit=crop&q=80&w=600' },
  { title: 'Bamboo Utensil Set', image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=600' },
  { title: 'Glow Pot Ceramic', image: 'https://images.unsplash.com/photo-1584990344321-27662ddec99a?auto=format&fit=crop&q=80&w=600' },
  { title: 'StoneSip Ceramic Cup', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600' },
];

export const Gallery: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-brand-sage font-semibold tracking-widest uppercase text-xs mb-2">Thoughtful, Planet-Prioritizing Ideas</p>
            <h2 className="text-3xl font-serif">and Inspiration <span className="italic font-light">✧ Gallery</span></h2>
          </div>
          <div className="hidden md:flex space-x-2">
            <button className="p-3 border border-gray-100 rounded-full hover:bg-brand-sage hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-3 border border-gray-100 rounded-full hover:bg-brand-sage hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`min-w-[200px] md:min-w-[240px] snap-start group relative rounded-2xl overflow-hidden ${index % 2 === 0 ? 'h-[300px]' : 'h-[240px] mt-auto'}`}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-xs italic font-serif">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
