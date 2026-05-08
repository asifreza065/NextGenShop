import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, ArrowUpRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-cream border-t border-brand-accent px-6 py-16 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif italic font-semibold mb-6">NextZenShop</h2>
            <p className="text-brand-forest/60 max-w-md text-sm leading-loose">
              NextZenShop promotes sustainable dining with beautifully crafted bamboo and glass <span className="font-serif italic font-medium text-brand-forest">✧ Kitchenware!</span>
              We believe every home deserves aesthetic pieces that don't compromise our planet's future.
            </p>
            <button className="mt-10 bg-brand-forest text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-brand-sage transition-all flex items-center group">
               Join Us Now
               <ArrowUpRight className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
            </button>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-forest/40 mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/categories" className="hover:text-brand-sage transition-colors">Categories</Link></li>
              <li><a href="#" className="hover:text-brand-sage transition-colors">Tableware</a></li>
              <li><a href="#" className="hover:text-brand-sage transition-colors">Utensils</a></li>
              <li><Link to="/admin/login" className="flex items-center hover:text-brand-sage transition-colors group opacity-30 hover:opacity-100">
                <Shield className="w-3 h-3 mr-2" /> Admin Login
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-forest/40 mb-8">Social</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="flex items-center hover:text-brand-sage transition-colors group">Twitter <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" /></a></li>
              <li><a href="#" className="flex items-center hover:text-brand-sage transition-colors group">Instagram <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" /></a></li>
              <li><a href="#" className="flex items-center hover:text-brand-sage transition-colors group">LinkedIn <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" /></a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-brand-accent/50 gap-6">
           <h3 className="text-[12vw] leading-none font-serif italic text-brand-accent/40 font-bold select-none pointer-events-none">NextZenShop</h3>
           <div className="flex flex-col items-center md:items-end space-y-2">
              <p className="text-[10px] text-brand-forest/40 uppercase tracking-[0.3em] font-bold">© 2024 NextZenShop Studio</p>
              <div className="flex space-x-6 text-[10px] text-brand-forest/60 uppercase tracking-widest font-bold">
                 <a href="#" className="hover:text-brand-sage">Privacy</a>
                 <a href="#" className="hover:text-brand-sage">Terms</a>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};
