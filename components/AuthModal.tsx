'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Auto login after register
        const loginRes = await signIn('credentials', { email, password, redirect: false });
        if (loginRes?.error) throw new Error("Login failed after registration");
        
        onClose();
      } else {
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) {
          throw new Error("Invalid email or password");
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
           <h3 className="text-xl font-bold text-slate-900">
             {mode === 'login' ? 'Welcome Back' : 'Create Account'}
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
             {mode === 'signup' && (
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required={mode === 'signup'} 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="John Doe" />
                   </div>
                </div>
             )}
             
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="you@company.com" />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="••••••••" />
                </div>
             </div>

             {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium text-center">{error}</div>}

             <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'Sign In' : 'Create Free Account'}
             </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-slate-500">
               {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
               <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="ml-1 text-blue-600 font-bold hover:underline">
                 {mode === 'login' ? 'Sign up free' : 'Log in'}
               </button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};