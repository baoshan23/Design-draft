import React, { useState } from 'react';
import Diagram from './components/Diagram';

export default function App() {
  const [view, setView] = useState<'B2C' | 'B2B'>('B2C');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-8 py-6 flex justify-between items-center shrink-0 z-10 relative">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">EV Charging Ecosystem</h1>
          <p className="text-sm text-slate-400 mt-1">Interactive 3D Flow Visualization</p>
        </div>
        <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700 shadow-inner">
          <button 
            onClick={() => setView('B2C')} 
            className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all ${view === 'B2C' ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            B2C Model
          </button>
          <button 
            onClick={() => setView('B2B')} 
            className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all ${view === 'B2B' ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            B2B Model
          </button>
        </div>
      </header>
      
      <main className="flex-1 w-full flex flex-col relative">
        <div className="w-full flex-1 overflow-hidden relative">
          <Diagram type={view} />
        </div>
      </main>
    </div>
  );
}
