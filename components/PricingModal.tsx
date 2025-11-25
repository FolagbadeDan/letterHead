'use client';

import React from 'react';
import { X, Check, Zap, Crown } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left: Info */}
          <div className="p-10 bg-slate-50 flex flex-col justify-center">
             {reason && (
               <div className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full mb-4 self-start">
                 {reason}
               </div>
             )}
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
             <p className="text-slate-500 text-lg leading-relaxed mb-8">
               Remove limits and unlock the full potential of LetAHeader AI.
             </p>
             <div className="space-y-4">
                <Benefit text="Unlimited Document Saves" />
                <Benefit text="Unlimited AI Generation" />
                <Benefit text="Access to Premium Templates" />
                <Benefit text="Priority PDF Export" />
             </div>
          </div>

          {/* Right: Pricing */}
          <div className="p-10 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Crown className="w-8 h-8" />
             </div>
             <div className="text-5xl font-black text-slate-900 mb-2">$9<span className="text-xl text-slate-400 font-medium">/mo</span></div>
             <p className="text-slate-500 mb-8">Cancel anytime. No questions asked.</p>
             
             <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all">
               Upgrade Now
             </button>
             <p className="mt-4 text-xs text-slate-400">Secure payment via Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Benefit = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
      <Check className="w-3 h-3" />
    </div>
    <span className="text-slate-700 font-medium">{text}</span>
  </div>
);