import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chrome, 
  Facebook, 
  Apple, 
  Mail, 
  Lock, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle, auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      }
      navigate('/account');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in your Firebase project. Please enable it in the Firebase Console under Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/account');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google authentication is not enabled in your Firebase project. Please enable it in the Firebase Console under Authentication -> Sign-in method.');
      } else {
        setError('Google login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -ml-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group">
             <h1 className="text-4xl font-serif italic font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">NextZenShop</h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-slate-100 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <p className="text-sm text-slate-500 mb-8 font-medium">
                {isLogin 
                  ? 'Use your NextZenShop Account' 
                  : 'Join thousands of eco-conscious members'}
              </p>

              {/* Error Alert */}
              <AnimatePresence shadow-none>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Logins */}
              <div className="space-y-3 mb-8">
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold font-sans text-sm text-slate-700 disabled:opacity-50"
                >
                  <Chrome className="w-4 h-4 text-blue-500" />
                  <span>Continue with Google</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button disabled className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-200 rounded-xl opacity-50 cursor-not-allowed font-semibold text-xs text-slate-700">
                    <Facebook className="w-4 h-4 text-blue-600 fill-current" />
                    <span>Facebook</span>
                  </button>
                  <button disabled className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-200 rounded-xl opacity-50 cursor-not-allowed font-semibold text-xs text-slate-700">
                    <Apple className="w-4 h-4 text-black fill-current" />
                    <span>Apple ID</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-[1px] bg-slate-100" />
                <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">or</span>
                <div className="flex-1 h-[1px] bg-slate-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Name" 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>
                )}

                {authMethod === 'email' ? (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email" 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input 
                      required
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Phone" 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>
                )}

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-400 text-sm"
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <label className="flex items-center space-x-2 text-slate-500 cursor-pointer">
                      <input type="checkbox" className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span>Stay signed in</span>
                    </label>
                    <button type="button" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 group mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Login/Phone Toggle */}
              <div className="mt-8 pt-6 border-t border-slate-50">
                <button 
                  disabled={isLoading}
                  onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {authMethod === 'email' ? 'Login with phone number' : 'Login with email address'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Toggle */}
        <div className="mt-8 text-center">
          <button 
            disabled={isLoading}
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm font-medium text-slate-500"
          >
            {isLogin ? "New to NextZenShop?" : "Already have an account?"}{' '}
            <span className="text-blue-600 font-bold hover:underline ml-1">
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure AES-256 encrypted authentication</span>
        </div>
      </motion.div>
    </div>
  );
};

