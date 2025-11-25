
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { ConfigPanel } from './ConfigPanel';
import { DocumentPreview } from './DocumentPreview';
import { Editor } from './Editor';
import { AIAssistantModal } from './AIAssistantModal';
import { LandingPage } from './LandingPage';
import { AuthModal } from './AuthModal';
import { PricingModal } from './PricingModal';
import { MyLettersModal } from './MyLettersModal';
import { Download, Printer, Loader2, Settings, Edit3, Eye, FileText, ArrowLeft, Cloud, User as UserIcon, LogOut, File, ChevronDown } from 'lucide-react';
import { CompanyProfile, LetterContent, SavedTemplate, SavedLetter, DEFAULT_PROFILE, DEFAULT_CONTENT } from '../types';
import { generatePDF } from '../services/pdfService';
import { saveLetterToCloud } from '../services/letterService';

type ViewMode = 'config' | 'editor' | 'preview';

const AppWrapper: React.FC = () => {
  const { data: session } = useSession();
  const [hasStarted, setHasStarted] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const [content, setContent] = useState<LetterContent>(DEFAULT_CONTENT);
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  
  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isMyLettersModalOpen, setIsMyLettersModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [pricingReason, setPricingReason] = useState('');
  
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [initialSetupTab, setInitialSetupTab] = useState<'identity' | 'design' | 'templates'>('identity');
  const [logoError, setLogoError] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);
  const LOGO_URL = "https://i.ibb.co/MyRD18v8/by-Youmaximize.png"; 

  // Load local templates
  useEffect(() => {
    const savedTemplates = localStorage.getItem('proletter_templates');
    if (savedTemplates) {
      try { setTemplates(JSON.parse(savedTemplates)); } catch (e) {}
    }
  }, []);

  const handleStart = (initialContent: Partial<LetterContent>, initialProfile?: Partial<CompanyProfile>, openSetup = false) => {
    if (initialProfile) setProfile(prev => ({ ...prev, ...initialProfile }));
    if (Object.keys(initialContent).length > 0) {
      setContent(prev => ({
        ...prev,
        ...initialContent,
        date: initialContent.date || prev.date,
        recipientName: initialContent.recipientName || prev.recipientName,
        recipientAddress: initialContent.recipientAddress || prev.recipientAddress,
      }));
    }
    setHasStarted(true);
    
    if (openSetup) {
       setIsSidebarOpen(true);
       setInitialSetupTab('identity');
       if (window.innerWidth < 1024) setViewMode('config');
    } else {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
    }
  };

  const handleCloudSave = async () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    const name = prompt("Name this letter:");
    if (!name) return;

    try {
      await saveLetterToCloud(name, content, profile);
      alert("Letter saved to cloud!");
    } catch (error: any) {
      if (error.message === 'LIMIT_REACHED') {
        setPricingReason('Free Plan Limit Reached: 1 Letter');
        setIsPricingModalOpen(true);
      } else {
        alert("Failed to save letter.");
      }
    }
  };

  const saveTemplate = () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    const name = prompt("Name your template:");
    if (!name) return;
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name,
      profile,
      lastModified: Date.now()
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('proletter_templates', JSON.stringify(updated));
  };

  const loadTemplate = (t: SavedTemplate) => setProfile(t.profile);

  const handleLoadLetter = (letter: SavedLetter) => {
    setProfile(letter.profile);
    setContent(letter.content);
    setHasStarted(true);
  };

  const handleDownloadPDF = async () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      if (window.innerWidth < 1024) setViewMode('preview');
      await new Promise(resolve => setTimeout(resolve, 800));
      await generatePDF(printRef.current, `${content.recipientName.replace(/\s+/g, '_')}_Letter.pdf`);
    } catch (error) { alert("Failed to generate PDF"); } 
    finally { setIsGenerating(false); }
  };

  const handleOpenAI = () => {
    if (!session) {
       setIsAuthModalOpen(true);
       return;
    }
    setIsAIModalOpen(true);
  };

  if (!hasStarted) {
    return (
      <>
        <LandingPage 
          onStart={handleStart} 
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenMyLetters={() => {
            if (!session) setIsAuthModalOpen(true);
            else setIsMyLettersModalOpen(true);
          }}
        />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
        <MyLettersModal isOpen={isMyLettersModalOpen} onClose={() => setIsMyLettersModalOpen(false)} onLoad={handleLoadLetter} />
      </>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header */}
      <header className="h-20 lg:h-24 border-b border-slate-200 flex justify-between items-center px-4 lg:px-6 z-30 bg-white/80 backdrop-blur-sm sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setHasStarted(false)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition" title="Back to Home">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 mr-2">
            {!logoError ? (
               <img 
                 src={LOGO_URL} 
                 alt="LetAHeader" 
                 className="w-[180px] lg:w-[220px] h-auto max-h-[80px] object-contain" 
                 onError={() => setLogoError(true)} 
               />
             ) : (
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
                   <FileText className="w-5 h-5" />
                 </div>
                 <span className="font-bold text-lg hidden sm:block">LetAHeader</span>
               </div>
             )}
          </div>
          
          <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${isSidebarOpen ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
          >
            <Settings className="w-4 h-4" />
            {isSidebarOpen ? 'Close Setup' : 'Setup'}
          </button>
        </div>

        <div className="flex items-center gap-3">
           {/* User Dropdown */}
           {session ? (
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                   {session.user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => { setIsUserMenuOpen(false); setIsMyLettersModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <File className="w-4 h-4" /> My Letters
                  </button>
                  <button onClick={() => { setIsUserMenuOpen(false); setIsPricingModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> Upgrade Plan
                  </button>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
           ) : (
             <button onClick={() => setIsAuthModalOpen(true)} className="hidden md:block text-xs font-bold text-slate-600 hover:text-slate-900">Log In</button>
           )}

           <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

           <button 
             onClick={handleCloudSave}
             className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-bold transition"
           >
             <Cloud className="w-4 h-4" />
             Save
           </button>
           
           <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-70 shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {isGenerating ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`
          bg-white z-20 transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0.2,1)] border-r border-slate-200 pb-20 lg:pb-0
          lg:absolute lg:inset-y-0 lg:left-0 lg:shadow-[5px_0_25px_-5px_rgba(0,0,0,0.05)]
          ${viewMode === 'config' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 -translate-x-full'}
          ${isSidebarOpen ? 'lg:translate-x-0 lg:w-[340px]' : 'lg:-translate-x-full lg:w-[340px]'}
        `}>
           <ConfigPanel 
            profile={profile} 
            setProfile={setProfile} 
            templates={templates}
            loadTemplate={loadTemplate}
            saveCurrentAsTemplate={saveTemplate}
            initialTab={initialSetupTab}
          />
        </aside>

        <div className={`flex-1 flex transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0.2,1)] ${isSidebarOpen ? 'lg:ml-[340px]' : 'lg:ml-0'}`}>
          <section className={`
            bg-slate-50/50 z-10 flex flex-col transition-transform duration-300 ease-in-out pb-20 lg:pb-0
            lg:flex-1 lg:block lg:relative
            ${viewMode === 'editor' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 translate-x-full lg:translate-x-0'}
          `}>
            <Editor 
              content={content} 
              setContent={setContent} 
              onAIAssist={handleOpenAI} 
            />
          </section>

          <main className={`
            bg-[#E5E5E5] relative overflow-hidden transition-transform duration-300 ease-in-out pb-20 lg:pb-0
            lg:w-[45%] xl:w-[50%] lg:block lg:relative border-l border-slate-200
            ${viewMode === 'preview' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 translate-x-full lg:translate-x-0'}
          `}>
            <DocumentPreview 
              ref={printRef} 
              profile={profile} 
              content={content} 
            />
          </main>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-full px-2 py-2">
          <MobileDockBtn icon={Settings} label="Setup" active={viewMode === 'config'} onClick={() => setViewMode('config')} />
          <MobileDockBtn icon={Edit3} label="Write" active={viewMode === 'editor'} onClick={() => setViewMode('editor')} />
          <MobileDockBtn icon={Eye} label="Preview" active={viewMode === 'preview'} onClick={() => setViewMode('preview')} />
        </div>
      </div>
      
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onApply={(t) => setContent(prev => ({ ...prev, body: t }))} 
      />
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
        reason={pricingReason} 
      />

      <MyLettersModal 
        isOpen={isMyLettersModalOpen} 
        onClose={() => setIsMyLettersModalOpen(false)} 
        onLoad={handleLoadLetter} 
      />

    </div>
  );
};

const MobileDockBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
      active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
    {active && <span className="text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
  </button>
);

export default AppWrapper;
