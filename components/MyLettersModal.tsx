
'use client';

import React, { useEffect, useState } from 'react';
import { X, FileText, Loader2, Calendar, Trash2, Clock } from 'lucide-react';
import { SavedLetter } from '../types';
import { fetchMyLetters } from '../services/letterService';

interface MyLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (letter: SavedLetter) => void;
}

export const MyLettersModal: React.FC<MyLettersModalProps> = ({ isOpen, onClose, onLoad }) => {
  const [letters, setLetters] = useState<SavedLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMyLetters()
        .then(setLetters)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">My Saved Letters</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading your documents...</p>
             </div>
           ) : letters.length === 0 ? (
             <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                <p className="text-slate-500 font-medium mb-1">No letters found</p>
                <p className="text-sm text-slate-400">Create your first document to see it here.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {letters.map((letter) => (
                 <div 
                   key={letter.id}
                   onClick={() => { onLoad(letter); onClose(); }}
                   className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                 >
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{letter.name || "Untitled Letter"}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                             <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(letter.lastModified).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(letter.lastModified).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-1">{letter.content.recipientName} • {letter.content.subject}</p>
                       </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Open</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
