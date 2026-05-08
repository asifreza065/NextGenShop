import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is in the admins collection
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
      if (adminDoc.exists()) {
        localStorage.setItem('nextzenshop_admin_session', 'true');
        onLogin();
        navigate('/admin/orders');
      } else {
        // Not an admin
        await auth.signOut();
        setError('Access Denied. You do not have administrator privileges.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in your Firebase project. Please enable it in the Firebase Console under Authentication.');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-forest/95 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-sage/10 rounded-full blur-[120px] -mr-24 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -ml-24 -mb-24 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Store</span>
        </Link>

        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-brand-sage mb-6 shadow-2xl shadow-brand-sage/20">
            <Shield className="w-8 h-8 text-brand-forest" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Admin <span className="text-brand-sage">Portal</span></h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Authorized Access Only</p>
        </div>

        {/* login Card */}
        <div className="glass-effect bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-8">Secure Login</h2>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-start space-x-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-200 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-sage transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                required
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-sage focus:ring-4 focus:ring-brand-sage/5 transition-all placeholder:text-white/20 text-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-sage transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                required
                type="password" 
                placeholder="Secret Key" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-sage focus:ring-4 focus:ring-brand-sage/5 transition-all placeholder:text-white/20 text-sm"
              />
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className={`w-full bg-brand-sage text-brand-forest py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-sage/20 hover:bg-white transition-all flex items-center justify-center space-x-2 group mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-widest text-white/20">
          <ShieldCheck className="w-4 h-4 text-brand-sage" />
          <span>Encrypted Environment • Admin v2.0</span>
        </div>
      </motion.div>
    </div>
  );
};

