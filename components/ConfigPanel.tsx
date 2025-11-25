import React, { useRef, useState, useEffect } from 'react';
import { CompanyProfile, SavedTemplate, PRESETS } from '../types';
import { 
  Upload, Palette, Layout, Type, Building2, Sparkles, Save, 
  Check, ChevronRight, ChevronDown, Trash2, FolderOpen,
  MapPin, Globe, Mail, Phone, LayoutTemplate, FileText, Settings
} from 'lucide-react';

interface ConfigPanelProps {
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  templates: SavedTemplate[];
  loadTemplate: (t: SavedTemplate) => void;
  saveCurrentAsTemplate: () => void;
  initialTab?: 'identity' | 'design' | 'templates';
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  profile, 
  setProfile, 
  templates,
  loadTemplate,
  saveCurrentAsTemplate,
  initialTab = 'identity'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'identity' | 'design' | 'templates'>('identity');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Reset save status after a delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) { 
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (key: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetProfile: Partial<CompanyProfile>) => {
    setProfile(prev => ({ ...prev, ...presetProfile }));
  };

  const handleExplicitSave = () => {
    setSaveStatus('saved');
    // App.tsx auto-saves to localStorage on change, so we just show feedback
  };

  return (
    <div className="bg-white h-full flex flex-col border-r border-slate-200">
      
      {/* Segmented Control Tabs - Sticky Header */}
      <div className="px-4 pt-4 pb-2 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="flex p-1 bg-slate-100/80 rounded-lg">
          {[
            { id: 'identity', label: 'Identity' },
            { id: 'design', label: 'Design' },
            { id: 'templates', label: 'Templates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area - INCREASED BOTTOM PADDING HERE (pb-32) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6 pb-32">
        
        {/* === IDENTITY TAB (SETUP) === */}
        {activeTab === 'identity' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 font-medium">
                Start here. Enter your company details once to populate all templates automatically.
              </p>
            </div>

            {/* Identity Section */}
            <Section title="Brand Identity" description="Logo and company name">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition relative overflow-hidden group shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
                <div className="flex-1 space-y-2">
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 border-b border-slate-200 py-1 focus:border-blue-500 focus:outline-none bg-transparent transition"
                    placeholder="Company Name"
                  />
                  {profile.logoUrl && (
                    <button 
                      onClick={() => setProfile(prev => ({ ...prev, logoUrl: null }))}
                      className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </Section>

            {/* Contact Section */}
            <Section title="Contact Details" description="Displayed in headers and footers">
               <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                    <textarea 
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none placeholder:text-slate-300"
                      placeholder="123 Business Rd..."
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <InputRow icon={Mail} value={profile.email} onChange={(v) => handleInputChange('email', v)} placeholder="contact@company.com" />
                    <InputRow icon={Phone} value={profile.phone} onChange={(v) => handleInputChange('phone', v)} placeholder="+1 (555) 000-0000" />
                    <InputRow icon={Globe} value={profile.website} onChange={(v) => handleInputChange('website', v)} placeholder="www.company.com" />
                  </div>
               </div>
            </Section>

            <button 
              onClick={handleExplicitSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                saveStatus === 'saved' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saveStatus === 'saved' ? 'Settings Saved' : 'Save Configuration'}
            </button>
          </div>
        )}

        {/* === DESIGN TAB === */}
        {activeTab === 'design' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            
            {/* Layout Section */}
            <Section title="Layout Style" description="Choose the structural foundation">
               <div className="grid grid-cols-2 gap-2">
                 {['modern', 'classic', 'minimal', 'executive', 'creative', 'bold'].map((l) => (
                   <button
                    key={l}
                    onClick={() => handleInputChange('layout', l)}
                    className={`px-3 py-3 rounded-lg text-xs font-medium capitalize border transition-all text-center ${
                      profile.layout === l
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
            </Section>

            {/* Branding Section */}
            <Section title="Branding & Typography" description="Colors and fonts">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ColorPicker label="Primary" color={profile.primaryColor} onChange={(v) => handleInputChange('primaryColor', v)} />
                  <ColorPicker label="Accent" color={profile.accentColor} onChange={(v) => handleInputChange('accentColor', v)} />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Typography</label>
                   <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: 'sans', name: 'Modern Sans', sub: 'Inter' },
                      { id: 'serif', name: 'Classic Serif', sub: 'Merriweather' },
                      { id: 'display', name: 'Display', sub: 'Playfair' },
                      { id: 'grotesk', name: 'Technical', sub: 'Space Grotesk' }
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => handleInputChange('fontFamily', font.id)}
                        className={`px-3 py-2 rounded-md text-left text-xs flex items-center justify-between transition-all ${
                          profile.fontFamily === font.id 
                            ? 'bg-slate-100 text-slate-900 font-medium' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className={
                            font.id === 'serif' ? 'font-serif' : 
                            font.id === 'display' ? 'font-display' : 
                            font.id === 'grotesk' ? 'font-grotesk' : 'font-sans'
                        }>{font.name}</span>
                        {profile.fontFamily === font.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Visibility Toggles */}
             <Section title="Header & Footer Options" description="Customize element visibility">
               <div className="space-y-1">
                  <Toggle label="Show Logo" checked={profile.showLogo} onChange={(v) => handleInputChange('showLogo', v)} />
                  <Toggle label="Show Header Address" checked={profile.showHeaderAddress} onChange={(v) => handleInputChange('showHeaderAddress', v)} />
                  <Toggle label="Show Header Contact" checked={profile.showHeaderContact} onChange={(v) => handleInputChange('showHeaderContact', v)} />
                  <div className="h-px bg-slate-100 my-2" />
                  <Toggle label="Show Footer" checked={profile.showFooter} onChange={(v) => handleInputChange('showFooter', v)} />
                  {profile.showFooter && (
                    <div className="pl-4 border-l-2 border-slate-100 ml-1 my-1">
                      <Toggle label="Footer Divider" checked={profile.showFooterDivider} onChange={(v) => handleInputChange('showFooterDivider', v)} />
                    </div>
                  )}
               </div>
            </Section>

          </div>
        )}

        {/* === TEMPLATES TAB === */}
        {activeTab === 'templates' && (
           <div className="animate-in fade-in duration-300 space-y-6">
              
              <Section title="Quick Presets" description="Apply a complete style">
                <div className="space-y-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.profile)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group bg-white"
                    >
                      <div 
                        className="w-9 h-9 rounded-lg shadow-sm border border-black/5 shrink-0" 
                        style={{ background: preset.profile.primaryColor }}
                      />
                      <div className="text-left overflow-hidden">
                        <div className="text-xs font-bold text-slate-700 truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize truncate">{preset.profile.layout} layout</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="My Saved Templates" description="Your custom configurations">
                 <button 
                    onClick={saveCurrentAsTemplate}
                    className="w-full mb-4 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-xs font-bold"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Current Design
                  </button>

                 <div className="space-y-2">
                    {templates.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-400">No saved templates yet.</p>
                      </div>
                    )}
                    {templates.map(t => (
                      <div
                        key={t.id}
                        onClick={() => loadTemplate(t)}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-300 hover:shadow-sm transition cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-slate-700">{t.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(t.lastModified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
              </Section>
           </div>
        )}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const Section = ({ title, description, children }: { title: string, description: string, children?: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="border-b border-slate-100 pb-2">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
      <p className="text-[10px] text-slate-500 font-medium">{description}</p>
    </div>
    <div>{children}</div>
  </div>
);

const InputRow = ({ icon: Icon, value, onChange, placeholder }: any) => (
  <div className="relative group">
    <Icon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition placeholder-slate-300 text-slate-700"
      placeholder={placeholder}
    />
  </div>
);

const ColorPicker = ({ label, color, onChange }: { label: string, color: string, onChange: (v: string) => void }) => (
  <div className="flex-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">{label}</span>
    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 relative cursor-pointer hover:bg-slate-100 transition group">
      <div className="w-6 h-6 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: color }} />
      <span className="text-xs font-mono text-slate-500 uppercase group-hover:text-slate-900">{color}</span>
      <input 
          type="color" 
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-2 group cursor-pointer" onClick={() => onChange(!checked)}>
    <span className="text-xs text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{label}</span>
    <div
      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${checked ? 'bg-slate-900' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </div>
);