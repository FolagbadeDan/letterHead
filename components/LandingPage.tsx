
import React, { useState, useRef } from 'react';
import { 
  ArrowRight, Wand2, FileText, CheckCircle2, Upload, Cloud, Edit3, Shield
} from 'lucide-react';
import { CompanyProfile, DEFAULT_PROFILE, LetterContent } from '../types';
import { Header } from './Header';

interface LandingPageProps {
  onStart: (initialContent: Partial<LetterContent>, initialProfile?: Partial<CompanyProfile>, openSetup?: boolean) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenMyLetters: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenAuth, onOpenPricing, onOpenMyLetters }) => {
  const [wizardStep, setWizardStep] = useState(0); 
  const [tempProfile, setTempProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleStartFlow = () => {
    setWizardStep(1);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setTempProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
       };
       reader.readAsDataURL(file);
    }
  };

  const handleWizardComplete = (mode: 'ai' | 'manual') => {
    if (mode === 'manual') {
      onStart({}, tempProfile, true);
    } else {
      onStart({}, tempProfile, false); 
    }
  };

  if (wizardStep > 0) {
    return (
      <WizardOverlay 
        step={wizardStep} 
        setStep={setWizardStep} 
        profile={tempProfile} 
        setProfile={setTempProfile}
        fileInputRef={fileInputRef}
        handleLogoUpload={handleLogoUpload}
        onComplete={handleWizardComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <Header 
        onStart={handleStartFlow} 
        onOpenAuth={onOpenAuth} 
        onOpenPricing={onOpenPricing}
        onOpenMyLetters={onOpenMyLetters}
      />

      {/* SECTION 1: HERO */}
      <section className="pt-24 pb-20 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
          Create Official Business <br/>
          Letters in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Seconds, Not Hours.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          The all-in-one tool to generate perfectly branded, formatted, and typo-free letterhead documents. No design skills required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={handleStartFlow}
            className="px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Create My First Letter for Free
          </button>
          <span className="text-sm text-slate-400">No credit card required</span>
        </div>

        {/* Visual Asset Mockup */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50 aspect-[16/9] flex group">
           <div className="w-1/2 p-8 border-r border-slate-200 flex flex-col items-start text-left bg-white">
              <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Input: Rough Notes</div>
              <div className="space-y-3 font-mono text-sm text-slate-600 opacity-70">
                 <p>- need to fire John</p>
                 <p>- effective next friday</p>
                 <p>- please return laptop</p>
                 <p>- thanks for service</p>
              </div>
           </div>
           <div className="w-1/2 p-8 flex flex-col items-start text-left bg-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
              <div className="relative z-10 w-full h-full bg-white shadow-lg border border-slate-100 p-4 rounded-lg transform scale-95 group-hover:scale-100 transition-transform duration-500">
                 <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                    <div className="w-6 h-6 bg-slate-900 rounded-md"></div>
                    <div className="h-2 w-20 bg-slate-800 rounded-sm"></div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-200 rounded-sm"></div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-sm"></div>
                    <div className="h-1.5 w-3/4 bg-slate-200 rounded-sm"></div>
                 </div>
              </div>
              <div className="absolute top-8 right-8 text-xs font-bold text-blue-600 uppercase tracking-wider z-20">Output: Professional PDF</div>
           </div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF */}
      <section className="py-10 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Trusted by 500+ professionals to close deals faster</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            <span className="text-xl font-serif font-bold text-slate-600">Freelancers Union</span>
            <span className="text-xl font-sans font-black text-slate-600 tracking-tighter">SBA</span>
            <span className="text-xl font-mono font-bold text-slate-600">TechStartups</span>
            <span className="text-xl font-display font-bold text-slate-600">LegalZoom</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: VALUE PROP */}
      <section className="py-24 max-w-7xl mx-auto px-6">
         <div className="grid md:grid-cols-3 gap-12">
            <FeatureColumn 
              icon={Shield} 
              title="Instant Brand Consistency" 
              body="Upload your logo and footer once. Every document you generate thereafter is automatically aligned to your brand guidelines. No more stretched logos."
            />
            <FeatureColumn 
              icon={Wand2} 
              title="AI Text Refinement" 
              body="Have rough notes? Our AI engine automatically corrects grammar, structures bullet points, and elevates your tone to 'Professional' instantly."
            />
            <FeatureColumn 
              icon={FileText} 
              title="Export Ready PDFs" 
              body="Download high-resolution, print-ready PDFs with one click. Perfect for official quotes, proposals, and legal correspondence."
            />
         </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">From Draft to Download in 3 Steps</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-800 z-0"></div>
              <StepCard number="1" title="Set Your Brand" body="Upload your company logo and set your footer details. You only have to do this once." />
              <StepCard number="2" title="Input Your Content" body="Type directly, paste existing text, or let our AI turn your rough bullet points into a polished letter." />
              <StepCard number="3" title="Generate & Download" body="Click generate. LetAHeader applies the formatting, checks spelling, and renders a professional PDF." />
           </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER CTA */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Professional Image Matters.</h2>
            <p className="text-lg text-slate-500 mb-8">Join the businesses upgrading their workflow today. It’s free to start.</p>
            <button 
              onClick={handleStartFlow}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full transition-all shadow-lg hover:shadow-blue-200"
            >
              Start Generating for Free
            </button>
         </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-slate-100 text-center text-sm text-slate-400">
         <p>&copy; {new Date().getFullYear()} LetAHeader. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureColumn = ({ icon: Icon, title, body }: any) => (
  <div className="flex flex-col items-start text-left">
     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
     </div>
     <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
     <p className="text-slate-500 leading-relaxed">{body}</p>
  </div>
);

const StepCard = ({ number, title, body }: any) => (
  <div className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700">
     <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-6 text-lg shadow-lg">
        {number}
     </div>
     <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
     <p className="text-slate-400 leading-relaxed">{body}</p>
  </div>
);

interface WizardProps {
  step: number;
  setStep: (s: number) => void;
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  fileInputRef: any;
  handleLogoUpload: any;
  onComplete: (mode: 'ai' | 'manual') => void;
}

const WizardOverlay: React.FC<WizardProps> = ({ 
  step, setStep, profile, setProfile, 
  fileInputRef, handleLogoUpload, onComplete 
}) => {
  
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
       
       <div className="w-full max-w-lg mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
             <span>Step {step} of 3</span>
             <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 transition-all duration-500 ease-out"
               style={{ width: `${(step / 3) * 100}%` }}
             ></div>
          </div>
       </div>

       {step === 1 && (
         <div className="w-full max-w-lg text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
               <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Let's set up your digital letterhead.</h2>
            <p className="text-slate-500">First, upload your company logo. We’ll position it perfectly at the top of every document you create.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 border-2 border-dashed border-slate-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
               {profile.logoUrl ? (
                 <img src={profile.logoUrl} alt="Uploaded" className="h-20 mx-auto object-contain" />
               ) : (
                 <div className="flex flex-col items-center gap-2">
                    <Cloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-semibold text-slate-600">Click to Upload Logo</span>
                    <span className="text-xs text-slate-400">Recommended: 300x100px PNG</span>
                 </div>
               )}
               <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg mt-4 flex items-center justify-center gap-2"
            >
              Next: Add Contact Info <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-slate-600">Skip for now</button>
         </div>
       )}

       {step === 2 && (
         <div className="w-full max-w-lg space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-slate-900">Where should people reply?</h2>
               <p className="text-slate-500 mt-2">Enter the details you want to appear in the footer.</p>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
               <input 
                 type="text" placeholder="Company Name" 
                 className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                 value={profile.name}
                 onChange={(e) => setProfile({...profile, name: e.target.value})}
               />
               <textarea 
                 placeholder="Office Address" 
                 rows={2}
                 className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none"
                 value={profile.address}
                 onChange={(e) => setProfile({...profile, address: e.target.value})}
               />
               <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Email Address" 
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Website" 
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                  />
               </div>
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
            >
              Looks Good – Save Setup
            </button>
         </div>
       )}

       {step === 3 && (
         <div className="w-full max-w-2xl text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">You are ready to write!</h2>
            <p className="text-lg text-slate-500">Your letterhead template is saved. Now, let's create your first professional document.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
               <div 
                 onClick={() => onComplete('ai')}
                 className="bg-white border-2 border-blue-100 hover:border-blue-500 p-8 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
               >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">AI Assist (Recommended)</h3>
                  <p className="text-sm text-slate-500 mb-6">"I have rough notes. Fix them for me."</p>
                  <span className="text-blue-600 font-bold text-sm group-hover:underline">Try AI Mode &rarr;</span>
               </div>

               <div 
                 onClick={() => onComplete('manual')}
                 className="bg-white border-2 border-slate-100 hover:border-slate-400 p-8 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
               >
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                     <Edit3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Manual Mode</h3>
                  <p className="text-sm text-slate-500 mb-6">"I have the final text ready to paste."</p>
                  <span className="text-slate-600 font-bold text-sm group-hover:underline">Open Editor &rarr;</span>
               </div>
            </div>
         </div>
       )}

    </div>
  );
};
