import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { CompanyProfile, LetterContent } from '../types';
import { ZoomIn, ZoomOut, Maximize, Scissors } from 'lucide-react';

interface DocumentPreviewProps {
  profile: CompanyProfile;
  content: LetterContent;
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(({ profile, content }, ref) => {
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1123); // Default A4 height in px
  const [totalPages, setTotalPages] = useState(1);
  const localContentRef = useRef<HTMLDivElement>(null);

  // A4 Standard Dimensions at 96 DPI
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  // Responsive Scale Logic
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 1024) { 
        // Mobile/Tablet: Fit width with safe margin
        const margin = 32; // 16px padding on each side
        const availableWidth = width - margin;
        const requiredScale = availableWidth / A4_WIDTH_PX;
        // Cap max scale at 1 so it doesn't look huge on wide mobile landscape
        setScale(Math.min(requiredScale, 1));
      } else { 
        // Desktop: Fixed comfortable scale
        setScale(0.85);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Height Observer: Ensures container grows if content exceeds 1 page
  useEffect(() => {
    if (!localContentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target) {
            const currentHeight = entry.target.scrollHeight;
            const pages = Math.ceil(currentHeight / A4_HEIGHT_PX);
            
            // Only update if changed to avoid loops
            if (Math.abs(currentHeight - contentHeight) > 5) {
                setContentHeight(Math.max(currentHeight, A4_HEIGHT_PX));
                setTotalPages(pages);
            }
        }
      }
    });

    observer.observe(localContentRef.current);
    return () => observer.disconnect();
  }, [contentHeight]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));
  const handleFitScreen = () => {
      const width = window.innerWidth;
      const margin = 32;
      const availableWidth = width - margin;
      const requiredScale = availableWidth / A4_WIDTH_PX;
      setScale(Math.min(requiredScale, 1));
  };

  const getFontFamily = () => {
    switch (profile.fontFamily) {
      case 'serif': return 'font-serif';
      case 'display': return 'font-display';
      case 'grotesk': return 'font-grotesk';
      default: return 'font-sans';
    }
  };
  const containerFont = getFontFamily();

  // --- Header Renderers ---

  const renderExecutiveHeader = () => (
    <header className="mb-12">
      <div className="bg-slate-900 text-white px-[20mm] py-10 -mx-[20mm] -mt-[20mm] mb-8 flex items-center justify-between" style={{ backgroundColor: profile.primaryColor }}>
        <div>
          {profile.showLogo && profile.logoUrl && (
            <img src={profile.logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-4 brightness-0 invert" />
          )}
          <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        </div>
        {profile.showHeaderContact && (
           <div className="text-right text-sm opacity-90 space-y-1 font-medium">
             <p>{profile.email}</p>
             <p>{profile.phone}</p>
             <p>{profile.website}</p>
           </div>
        )}
      </div>
      {profile.showHeaderAddress && (
         <div className="text-right border-b border-slate-200 pb-4">
           <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{profile.address.replace(/\n/g, ', ')}</p>
         </div>
      )}
    </header>
  );

  const renderCreativeHeader = () => (
    <header className="mb-16 relative">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl" style={{ backgroundColor: profile.accentColor }}></div>
      <div className="flex items-center gap-6">
        {profile.showLogo && profile.logoUrl ? (
           <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-white border border-slate-100 overflow-hidden p-2">
             <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
           </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-400">{profile.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none mb-1" style={{ color: profile.primaryColor }}>{profile.name}</h1>
          {profile.showHeaderAddress && <p className="text-slate-500 font-medium">{profile.address.split('\n')[0]}</p>}
        </div>
      </div>
      <div className="mt-8 flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-6" style={{ borderColor: profile.accentColor }}>
         {profile.showHeaderContact && (
            <>
              <span>{profile.website}</span>
              <span>{profile.email}</span>
            </>
         )}
      </div>
    </header>
  );

  const renderBoldHeader = () => (
    <header className="mb-16 border-b-4 border-black pb-8" style={{ borderColor: profile.primaryColor }}>
      <div className="flex justify-between items-end">
        <div>
          {profile.showLogo && profile.logoUrl && (
            <img src={profile.logoUrl} alt="Logo" className="h-20 w-auto object-contain mb-6" />
          )}
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]" style={{ color: profile.primaryColor }}>
            {profile.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
        </div>
        <div className="text-right space-y-4">
           {profile.showHeaderAddress && (
             <div className="text-sm font-bold max-w-[200px] leading-tight ml-auto">{profile.address}</div>
           )}
           {profile.showHeaderContact && (
              <div className="flex flex-col items-end text-xs font-mono bg-slate-100 p-3 rounded-lg">
                <span>{profile.email}</span>
                <span>{profile.phone}</span>
                <span>{profile.website}</span>
              </div>
           )}
        </div>
      </div>
    </header>
  );

  const renderClassicHeader = () => (
    <header className="mb-14 grid grid-cols-12 gap-8 items-center border-b border-slate-200 pb-8">
        <div className="col-span-4">
           {profile.showLogo && profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" className="max-h-24 w-auto object-contain" />
            ) : (
              <div className="h-24 w-24 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 text-xs rounded-lg font-serif italic">Logo Area</div>
            )}
        </div>
        <div className="col-span-8 text-right">
          <h1 className="text-4xl font-serif font-bold mb-3 tracking-tight" style={{ color: profile.primaryColor }}>{profile.name}</h1>
          {profile.showHeaderAddress && <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed font-serif">{profile.address}</p>}
          {profile.showHeaderContact && (
            <div className="mt-4 text-sm font-medium space-x-4 font-serif">
              <span style={{ color: profile.accentColor }}>{profile.email}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">{profile.phone}</span>
            </div>
          )}
        </div>
    </header>
  );

  const renderModernHeader = () => (
    <header className="flex justify-between items-start mb-12 pb-8 border-b-4" style={{ borderColor: profile.primaryColor }}>
      <div className="flex flex-col justify-center">
          {profile.showLogo && profile.logoUrl && (
          <img src={profile.logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-5 origin-left" />
        )}
        <h1 className="text-3xl font-bold tracking-tight leading-none" style={{ color: profile.primaryColor }}>
          {profile.name}
        </h1>
      </div>
      <div className="text-right text-sm text-slate-600 leading-relaxed">
        {profile.showHeaderAddress && <p className="whitespace-pre-line font-medium">{profile.address}</p>}
        {profile.showHeaderContact && (
          <div className="mt-3 flex flex-col items-end text-xs space-y-0.5">
            <span className="font-bold" style={{ color: profile.accentColor }}>{profile.website}</span>
            <span>{profile.email}</span>
            <span>{profile.phone}</span>
          </div>
        )}
      </div>
    </header>
  );

  const renderMinimalHeader = () => (
    <header className="flex flex-col items-center mb-16">
        {profile.showLogo && profile.logoUrl && (
          <img src={profile.logoUrl} alt="Logo" className="h-14 w-auto object-contain mb-6" />
        )}
      <h1 className="text-2xl font-bold tracking-[0.2em] uppercase mb-3" style={{ color: profile.primaryColor }}>
        {profile.name}
      </h1>
      {profile.showHeaderContact && (
        <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest items-center font-medium">
            <span>{profile.website}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{profile.email}</span>
        </div>
      )}
    </header>
  );

  const getHeader = () => {
    switch(profile.layout) {
      case 'executive': return renderExecutiveHeader();
      case 'creative': return renderCreativeHeader();
      case 'bold': return renderBoldHeader();
      case 'minimal': return renderMinimalHeader();
      case 'classic': return renderClassicHeader();
      default: return renderModernHeader();
    }
  };

  const renderFooter = () => {
    if (!profile.showFooter) return null;
    const divider = profile.showFooterDivider ? 'border-t border-slate-200' : '';

    if (profile.layout === 'executive') {
       return (
        <footer className={`mt-auto pt-6 text-center ${divider}`}>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">{profile.name}</div>
          <div className="text-xs text-slate-500 font-medium">{profile.address.replace(/\n/g, ' • ')}</div>
        </footer>
       );
    }
    if (profile.layout === 'creative') {
      return (
        <footer className="mt-auto flex items-center justify-between pt-8 border-t-2 border-dashed border-slate-200">
           <div className="text-xs font-bold text-slate-900">{profile.name}</div>
           <div className="flex gap-4 text-[10px] font-mono text-slate-500 bg-slate-50 px-4 py-2 rounded-full">
             <span>{profile.phone}</span>
             <span>{profile.email}</span>
           </div>
        </footer>
      );
    }
    return (
      <footer className={`mt-auto pt-8 ${divider} flex justify-between text-[10px] text-slate-400 uppercase tracking-wider font-medium`}>
        <span className="font-bold text-slate-500">{profile.name}</span>
        <span>{profile.website}</span>
      </footer>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#E5E5E5] relative overflow-hidden">
      
      {/* Zoom Control */}
      <div className="absolute bottom-24 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-1 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-200 rounded-full px-2 py-1.5 transition-all hover:scale-105">
        <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition active:scale-95">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200 mx-1"></div>
        <span className="text-xs font-bold text-slate-600 w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
        <div className="w-px h-4 bg-slate-200 mx-1"></div>
        <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition active:scale-95">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200 mx-1 lg:hidden"></div>
        <button onClick={handleFitScreen} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition active:scale-95 lg:hidden">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Viewport */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center bg-[#E5E5E5] custom-scrollbar pt-8 pb-32 lg:pt-12">
        
        {/* Scaled Wrapper: Mirrors the visual size of the scaled content */}
        <div 
          style={{ 
            width: `${A4_WIDTH_PX * scale}px`, 
            height: `${contentHeight * scale}px`
          }}
          className="relative transition-all duration-200 ease-out bg-white shadow-2xl"
        >
          {/* The Actual A4 Content - Transformed from Top-Left */}
          <div 
            style={{
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`
            }}
            className="absolute top-0 left-0"
          >
            <div 
               id="print-area"
               ref={(node) => {
                 // Forward ref to parent (for PDF generation)
                 if (typeof ref === 'function') ref(node);
                 else if (ref) ref.current = node;
                 
                 // Keep local ref for ResizeObserver
                 // @ts-ignore
                 localContentRef.current = node;
               }}
               className={`w-full min-h-full bg-white p-[20mm] flex flex-col relative ${containerFont} antialiased`}
            >
               {getHeader()}

               <main className="flex-1 relative z-10">
                 <div className="mb-10 flex flex-col gap-8">
                   <div className="font-semibold text-sm text-slate-500 tracking-wide">{content.date}</div>
                   <div className="text-base leading-relaxed whitespace-pre-line">
                     <p className="font-bold text-slate-900 mb-1.5 text-lg">{content.recipientName}</p>
                     <div className="text-slate-600">{content.recipientAddress}</div>
                   </div>
                 </div>

                 {content.subject && (
                   <div className="mb-10 font-bold text-lg tracking-tight" style={{ color: profile.primaryColor }}>
                     <span className="border-b-2 pb-0.5" style={{ borderColor: profile.accentColor }}>
                       RE: {content.subject}
                     </span>
                   </div>
                 )}

                 <div 
                   className="prose prose-slate max-w-none text-justify leading-8 text-[11pt] prose-p:mb-4 prose-strong:text-slate-800"
                   dangerouslySetInnerHTML={{ __html: content.body }}
                 />
               </main>

               {renderFooter()}
               
               {/* Visual Page Guides (Dashed Lines for Multi-Page) */}
               {totalPages > 1 && Array.from({ length: totalPages - 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute left-0 w-full border-b-2 border-dashed border-slate-300 pointer-events-none z-20 flex justify-end items-end px-2 print:hidden opacity-50"
                    style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}
                  >
                    <span className="text-[10px] text-slate-400 font-mono bg-white/80 px-1 mb-0.5">Page {i + 1} End</span>
                  </div>
               ))}

               {profile.layout === 'modern' && (
                 <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: `linear-gradient(to right, ${profile.primaryColor}, ${profile.accentColor})`}} />
               )}
               {profile.layout === 'bold' && (
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/5 -mr-16 -mb-16 rounded-full"></div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DocumentPreview.displayName = 'DocumentPreview';