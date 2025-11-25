
export interface CompanyProfile {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'display' | 'grotesk';
  layout: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'bold';
  
  // Visual Toggles
  showLogo: boolean;
  showHeaderAddress: boolean;
  showHeaderContact: boolean;
  showFooter: boolean;
  showFooterDivider: boolean;
}

export interface LetterContent {
  recipientName: string;
  recipientAddress: string;
  date: string;
  subject: string;
  body: string; // HTML string
}

export interface SavedTemplate {
  id: string;
  name: string;
  profile: CompanyProfile;
  lastModified: number;
}

// New Types for Backend/Auth
export interface User {
  id: string;
  email: string;
  name?: string;
  plan: 'FREE' | 'PRO';
  aiUsageCount: number;
}

export interface SavedLetter {
  id: string;
  userId: string;
  name: string;
  content: LetterContent;
  profile: CompanyProfile;
  lastModified: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  profile: Partial<CompanyProfile>;
  thumbnailStyles?: {
    bg?: string;
    accent?: string;
  };
}

export const DEFAULT_PROFILE: CompanyProfile = {
  name: "Acme Corp Solutions",
  address: "123 Innovation Way, Tech City, TC 90210",
  email: "contact@acmecorp.com",
  phone: "+1 (555) 123-4567",
  website: "www.acmecorp.com",
  logoUrl: null,
  primaryColor: "#0f172a", // Slate 900
  accentColor: "#0ea5e9", // Sky 500
  fontFamily: 'sans',
  layout: 'modern',
  showLogo: true,
  showHeaderAddress: true,
  showHeaderContact: true,
  showFooter: true,
  showFooterDivider: true,
};

export const DEFAULT_CONTENT: LetterContent = {
  recipientName: "Jane Smith",
  recipientAddress: "Director of Operations\nGlobal Industries Inc.\n456 Corporate Blvd\nMetropolis, NY 10012",
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  subject: "Proposal for Q4 Strategic Partnership",
  body: `<p>Dear Ms. Smith,</p><p><br></p><p>I hope this letter finds you well. Following our recent discussion regarding the potential synergy between our organizations, I am pleased to submit this formal proposal for your review.</p><p><br></p><p>At <strong>Acme Corp Solutions</strong>, we believe that a strategic partnership would mutually benefit our objectives for the upcoming quarter. We have outlined the key deliverables and timeline in the attached documentation.</p><p><br></p><p>We are excited about the possibility of working together and look forward to your positive response.</p><p><br></p><p>Sincerely,</p><p><br></p><p><strong>John Doe</strong><br>Chief Executive Officer</p>`,
};

export const PRESETS: PresetTemplate[] = [
  {
    id: 'modern-blue',
    name: 'Modern Tech',
    profile: {
      primaryColor: '#0f172a',
      accentColor: '#0ea5e9',
      fontFamily: 'sans',
      layout: 'modern',
      showLogo: true
    },
    thumbnailStyles: { bg: '#f8fafc', accent: '#0ea5e9' }
  },
  {
    id: 'executive-dark',
    name: 'Executive',
    profile: {
      primaryColor: '#1a1a1a',
      accentColor: '#d4af37', // Gold
      fontFamily: 'serif',
      layout: 'executive',
      showLogo: true
    },
    thumbnailStyles: { bg: '#ffffff', accent: '#1a1a1a' }
  },
  {
    id: 'creative-pop',
    name: 'Creative Studio',
    profile: {
      primaryColor: '#4f46e5',
      accentColor: '#f43f5e',
      fontFamily: 'grotesk',
      layout: 'creative',
      showLogo: true
    },
    thumbnailStyles: { bg: '#fff1f2', accent: '#f43f5e' }
  },
  {
    id: 'classic-serif',
    name: 'Legal Classic',
    profile: {
      primaryColor: '#1c1917',
      accentColor: '#b91c1c',
      fontFamily: 'serif',
      layout: 'classic',
      showLogo: false
    },
    thumbnailStyles: { bg: '#fff', accent: '#b91c1c' }
  },
  {
    id: 'bold-brand',
    name: 'Bold Brand',
    profile: {
      primaryColor: '#000000',
      accentColor: '#000000',
      fontFamily: 'display',
      layout: 'bold',
      showLogo: true
    },
    thumbnailStyles: { bg: '#f0f0f0', accent: '#000' }
  },
  {
    id: 'minimal-clean',
    name: 'Clean Minimal',
    profile: {
      primaryColor: '#334155',
      accentColor: '#94a3b8',
      fontFamily: 'sans',
      layout: 'minimal',
      showLogo: true
    },
    thumbnailStyles: { bg: '#fff', accent: '#cbd5e1' }
  },
  {
    id: 'nature-green',
    name: 'Eco Nature',
    profile: {
      primaryColor: '#166534',
      accentColor: '#86efac',
      fontFamily: 'serif',
      layout: 'modern',
      showLogo: true
    },
    thumbnailStyles: { bg: '#f0fdf4', accent: '#166534' }
  },
  {
    id: 'startup-purple',
    name: 'SaaS Startup',
    profile: {
      primaryColor: '#7e22ce',
      accentColor: '#d8b4fe',
      fontFamily: 'grotesk',
      layout: 'modern',
      showLogo: true
    },
    thumbnailStyles: { bg: '#faf5ff', accent: '#7e22ce' }
  }
];