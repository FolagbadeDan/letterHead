import React, { useState } from 'react';
import { Wand2, Loader2, X } from 'lucide-react';
import { generateLetterContent } from '../services/geminiService';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (content: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onApply }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const content = await generateLetterContent(prompt);
      onApply(content);
      onClose();
      setPrompt('');
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> AI Letter Drafter
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Briefly describe the letter you need (e.g., "Resignation letter effective in 2 weeks," or "Invoice cover letter for project X").
          </p>
          
          <textarea
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[120px] resize-none"
            placeholder="E.g. Write a formal apology to a client for a delivery delay..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            autoFocus
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};