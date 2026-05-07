import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Layout, Hash, Tv, Activity, 
  Briefcase, MousePointer2, StickyNote,
  Search, Filter, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES_LIST = [
  { 
    id: 1, 
    name: 'Graphic Design', 
    icon: <Palette className="w-6 h-6" />, 
    count: 124,
    description: 'Visual content to communicate messages through typography, imagery, and color.',
    color: 'bg-blue-500/10 text-blue-600'
  },
  { 
    id: 2, 
    name: 'Logo Design', 
    icon: <Hash className="w-6 h-6" />, 
    count: 89,
    description: 'Unique and memorable visual identities for businesses and brands.',
    color: 'bg-purple-500/10 text-purple-600'
  },
  { 
    id: 3, 
    name: 'Social Media Design', 
    icon: <Layout className="w-6 h-6" />, 
    count: 156,
    description: 'Engaging visuals tailored for platforms like Instagram, Facebook, and LinkedIn.',
    color: 'bg-pink-500/10 text-pink-600'
  },
  { 
    id: 4, 
    name: 'YouTube Thumbnail', 
    icon: <Tv className="w-6 h-6" />, 
    count: 210,
    description: 'High-click-through-rate cover images for YouTube videos.',
    color: 'bg-red-500/10 text-red-600'
  },
  { 
    id: 5, 
    name: 'Motion Graphics', 
    icon: <Activity className="w-6 h-6" />, 
    count: 45,
    description: 'Animated visual design elements including title sequences and explainer videos.',
    color: 'bg-indigo-500/10 text-indigo-600'
  },
  { 
    id: 6, 
    name: 'Branding', 
    icon: <Briefcase className="w-6 h-6" />, 
    count: 78,
    description: 'Comprehensive brand systems including guidelines, stationery, and messaging.',
    color: 'bg-emerald-500/10 text-emerald-600'
  },
  { 
    id: 7, 
    name: 'UI/UX Design', 
    icon: <MousePointer2 className="w-6 h-6" />, 
    count: 67,
    description: 'User interface and experience design for web and mobile applications.',
    color: 'bg-orange-500/10 text-orange-600'
  },
  { 
    id: 8, 
    name: 'Poster Design', 
    icon: <StickyNote className="w-6 h-6" />, 
    count: 92,
    description: 'Eye-catching layouts for events, advertisements, and decorations.',
    color: 'bg-cyan-500/10 text-cyan-600'
  },
];

export const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');

  const filteredCategories = useMemo(() => {
    return CATEGORIES_LIST
      .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.count - a.count;
      });
  }, [searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-brand-cream/10 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-brand-forest uppercase tracking-tighter mb-4"
            >
              Explore <span className="text-brand-sage">Categories</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-brand-forest/60 text-lg leading-relaxed"
            >
              Discover high-quality design services tailored to your specific needs. From branding to motion graphics, find the perfect match for your next project.
            </motion.p>
          </div>

          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-forest/40 group-focus-within:text-brand-sage transition-colors" />
              <input 
                type="text" 
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
              <button 
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'name' ? 'bg-brand-sage text-white' : 'text-brand-forest/40 hover:text-brand-forest'}`}
              >
                A-Z
              </button>
              <button 
                onClick={() => setSortBy('count')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'count' ? 'bg-brand-sage text-white' : 'text-brand-forest/40 hover:text-brand-forest'}`}
              >
                Popular
              </button>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link 
                to={`/?search=${encodeURIComponent(category.name)}`}
                className="block h-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-brand-forest/5 transition-all group-hover:shadow-brand-sage/10 relative overflow-hidden"
              >
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-black text-brand-forest mb-3 tracking-tight group-hover:text-brand-sage transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-brand-forest/40 text-sm leading-relaxed mb-8 line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-black text-brand-forest/30 uppercase tracking-widest">
                    {category.count} Items
                  </span>
                  <div className="w-10 h-10 bg-brand-forest/5 rounded-xl flex items-center justify-center text-brand-forest group-hover:bg-brand-sage group-hover:text-white transition-all transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-sage/5 rounded-full blur-3xl group-hover:bg-brand-sage/10 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-4">
              <Search className="w-8 h-8 text-brand-forest/10" />
            </div>
            <h3 className="text-xl font-bold text-brand-forest mb-2">No categories found</h3>
            <p className="text-brand-forest/40">Try adjusting your search term to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};
