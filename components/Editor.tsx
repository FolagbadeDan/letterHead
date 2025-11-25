
import React, { useState } from 'react';
import { LetterContent } from '../types';
import { 
  Bold, Italic, Underline, List, 
  AlignLeft, AlignCenter, AlignRight, 
  Wand2, ChevronDown, Calendar, User, MapPin, FileType, Type
} from 'lucide-react';

interface EditorProps {
  content: LetterContent;
  setContent: React.Dispatch<React.SetStateAction<LetterContent>>;
  onAIAssist: () => void;
}

export const Editor: React.FC<EditorProps> = ({ content, setContent, onAIAssist }) => {
  const [isMetaOpen, setIsMetaOpen] = useState(true);

  const handleFieldChange = (key: keyof LetterContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const execCmd = (command: string) => document.execCommand(command, false);

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      
      {/* Toolbar */}
      <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
         <div className="flex items-center gap-1">
            <div className="flex bg-slate-100/80 rounded-lg p-1 border border-slate-200/50">
              <ToolBtn icon={Bold} onClick={() => execCmd('bold')} />
              <ToolBtn icon={Italic} onClick={() => execCmd('italic')} />
              <ToolBtn icon={Underline} onClick={() => execCmd('underline')} />
            </div>
            <div className="w-px h-4 bg-slate-300 mx-2" />
            <div className="flex bg-slate-100/80 rounded-lg p-1 border border-slate-200/50">
              <ToolBtn icon={AlignLeft} onClick={() => execCmd('justifyLeft')} />
              <ToolBtn icon={AlignCenter} onClick={() => execCmd('justifyCenter')} />
              <ToolBtn icon={AlignRight} onClick={() => execCmd('justifyRight')} />
            </div>
         </div>

         <button 
            onClick={onAIAssist}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 rounded-full text-xs font-bold transition border border-blue-100 shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <button 
                onClick={() => setIsMetaOpen(!isMetaOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition border-b border-slate-100"
             >
               <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                 <FileType className="w-4 h-4 text-slate-400" /> Header Details
               </span>
               <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMetaOpen ? 'rotate-180' : ''}`} />
             </button>

             {isMetaOpen && (
               <div className="p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-4">
                     <Input 
                        label="Date" 
                        value={content.date} 
                        onChange={(v) => handleFieldChange('date', v)} 
                        icon={Calendar} 
                     />
                     <Input 
                        label="Recipient Name" 
                        value={content.recipientName} 
                        onChange={(v) => handleFieldChange('recipientName', v)} 
                        icon={User} 
                        placeholder="e.g. Jane Doe"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-500 uppercase">Recipient Address</label>
                     <div className="relative group">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <textarea 
                          value={content.recipientAddress}
                          onChange={(e) => handleFieldChange('recipientAddress', e.target.value)}
                          rows={3}
                          className="w-full text-sm border border-slate-300 bg-slate-50 focus:bg-white rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none text-slate-800 placeholder:text-slate-400 shadow-sm"
                          placeholder="Street Address&#10;City, State Zip&#10;Country"
                        />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Subject & Body */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
             <div className="p-6 border-b border-slate-100">
               <input 
                  type="text"
                  value={content.subject}
                  onChange={(e) => handleFieldChange('subject', e.target.value)}
                  className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                  placeholder="Type your subject here..."
               />
             </div>
             <div 
                className="flex-1 p-8 outline-none prose prose-slate max-w-none leading-7 text-slate-700 selection:bg-blue-100 selection:text-blue-900"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleFieldChange('body', e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content.body }}
             />
          </div>

        </div>
      </div>
    </div>
  );
};

const ToolBtn = ({ icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition active:scale-95"
  >
    <Icon className="w-4 h-4" />
  </button>
);

const Input = ({ label, value, onChange, icon: Icon, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase">{label}</label>
    <div className="relative group">
       <Icon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
       <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm border border-slate-300 bg-slate-50 focus:bg-white rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-slate-800 placeholder:text-slate-400 shadow-sm"
          placeholder={placeholder}
       />
    </div>
  </div>
);
