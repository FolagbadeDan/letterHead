'use client';

import React, { useState } from 'react';
import { Menu, X, FileText, User as UserIcon, LogOut, File, ChevronDown } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onStart: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenMyLetters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStart, onOpenAuth, onOpenPricing, onOpenMyLetters }) => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const LOGO_URL = "https://i.ibb.co/MyRD18v8/by-Youmaximize.png";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 lg:py-6 flex justify-between items-center">
        
        {/* Brand Logo - Enlarged */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onStart}>
           {!logoError ? (
             <img 
               src={LOGO_URL} 
               alt="LetAHeader" 
               className="w-[200px] md:w-[250px] h-auto max-h-[100px] object-contain" 
               onError={() => setLogoError(true)} 
             />
           ) : (
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-md">
                 <FileText className="w-6 h-6" />
               </div>
               <span className="font-bold text-2xl tracking-tight text-slate-900">LetAHeader</span>
             </div>
           )}
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={onStart} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Templates</button>
          <button onClick={onOpenPricing} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</button>
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                   {session.user?.name?.[0] || 'U'}
                </div>
                <span>{session.user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs text-slate-500 uppercase font-bold">{(session.user as any).plan || 'FREE'} Plan</p>
                  </div>
                  <button onClick={() => { setIsUserMenuOpen(false); onOpenMyLetters(); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <File className="w-4 h-4" /> My Letters
                  </button>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={onOpenAuth} className="text-sm font-bold text-slate-600 hover:text-slate-900">
                Log In
              </button>
              <button 
                onClick={onStart}
                className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition shadow-sm active:scale-95"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-6 gap-6">
            {!session && (
               <button onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }} className="text-base font-medium text-slate-700 text-left">Log In</button>
            )}
            <button onClick={() => { setIsMobileMenuOpen(false); onStart(); }} className="text-base font-medium text-slate-700 text-left">Templates</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onOpenPricing(); }} className="text-base font-medium text-slate-700 text-left">Pricing</button>
            {session && (
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenMyLetters(); }} className="text-base font-medium text-slate-700 text-left flex items-center gap-2">
                 <File className="w-4 h-4" /> My Letters
              </button>
            )}
            <hr className="border-slate-100" />
            <button 
              onClick={() => {
                onStart();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center font-bold bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800"
            >
              {session ? 'Create New Letter' : 'Get Started Free'}
            </button>
            {session && (
              <button onClick={() => signOut()} className="text-red-600 font-medium text-sm text-left">Sign Out</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};