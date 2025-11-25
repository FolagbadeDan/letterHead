'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main App component to disable SSR for it
// This is necessary because the editor/preview logic relies heavily on window/document objects
const App = dynamic(() => import('../components/AppWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>
  )
});

export default function Home() {
  return <App />;
}