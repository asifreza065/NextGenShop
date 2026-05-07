import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Award, Recycle } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Natural Finish',
      description: 'Crafted from high-quality raw materials with organic finishes.'
    },
    {
      icon: <Recycle className="w-6 h-6" />,
      title: 'Eco Innovation',
      description: 'Smart designs that reduce carbon footprint and waste.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Sustainable Materials',
      description: 'Responsibly sourced bamboo, glass, and recycled metals.'
    }
  ];

  return (
    <section className="section-padding bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-beige/30 p-10 rounded-3xl flex flex-col items-center text-center group hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-brand-sage/10"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-sage mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif mb-4">{feature.title}</h3>
              <p className="text-brand-forest/60 text-sm leading-relaxed max-w-[240px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
