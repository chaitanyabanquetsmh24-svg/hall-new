import { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserAuthModal({ open, onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const userData = await login(form.email, form.password);
        toast.success('Welcome back!');
        onClose();
        if (userData.role === 'admin') navigate('/admin/dashboard');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created! Please sign in.');
        setMode('login');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" inset-0 z-[1000] flex items-center justify-center p-1">
      {/* Semi-transparent Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Compact Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header Area */}
        <div className="p-8 pb-4 text-center">
          <button onClick={onClose} className="absolute top-5 right-5 text-stone-400 hover:text-red-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-red-800" />
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
        </div>

        {/* Simple Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input 
                  placeholder="Full Name" 
                  className="pl-10 h-11 rounded-xl bg-stone-50 border-stone-200"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="pl-10 h-11 rounded-xl bg-stone-50 border-stone-200"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input 
                type="password" 
                placeholder="Password" 
                className="pl-10 h-11 rounded-xl bg-stone-50 border-stone-200"
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-800 text-white py-3 rounded-xl font-bold hover:bg-red-900 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-900/10"
            >
              {loading ? 'Wait...' : mode === 'login' ? 'Sign In' : 'Join Now'}
            </button>
          </form>

          {/* Switch Link */}
          <div className="mt-6 text-center text-sm">
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
              className="text-stone-500 hover:text-red-800 transition-colors"
            >
              {mode === 'login' ? (
                <>New here? <span className="text-red-800 font-bold">Sign Up</span></>
              ) : (
                <>Already have an account? <span className="text-red-800 font-bold">Sign In</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}