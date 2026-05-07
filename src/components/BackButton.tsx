import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/' && !new URLSearchParams(location.search).get('search');

  return (
    <AnimatePresence>
      {!isHome && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="fixed top-24 left-6 z-40 group flex items-center space-x-3 bg-brand-forest text-white/90 px-5 py-2.5 rounded-full shadow-2xl shadow-brand-forest/40 hover:bg-brand-sage transition-all duration-300 md:left-10 md:top-28 ml-0 -mt-[26px]"
          id="global-back-button"
        >
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Back</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
