import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  return (
    <section className="section-padding bg-brand-beige/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <div className="flex items-center space-x-2 mb-6">
                 <span className="text-5xl font-serif text-brand-forest italic">4.9</span>
                 <span className="text-brand-forest/40 text-xl font-light">/5</span>
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-brand-sage">More than 25,000</p>
            <h2 className="text-3xl font-serif leading-tight">5-Star <span className="italic">Reviews for Our Award-Winning Eco Products</span></h2>
          </div>

          <div className="lg:w-2/3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm relative group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="text-brand-sage/20 absolute top-8 right-8">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand-sage text-brand-sage" />
                  ))}
                </div>
                <p className="text-brand-forest/70 text-sm leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-bold text-brand-forest">{testimonial.name}</h4>
                  <p className="text-brand-forest/40 text-xs uppercase tracking-widest font-bold mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
