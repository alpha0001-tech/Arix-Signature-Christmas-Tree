import React, { useState } from 'react';
import { TreeMorphState } from '../types';
import { generateLuxuryGreeting } from '../services/geminiService';

interface UIOverlayProps {
  currentState: TreeMorphState;
  onToggleState: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ currentState, onToggleState }) => {
  const [greeting, setGreeting] = useState<string>("Arix Interactive Signature Collection");
  const [loading, setLoading] = useState(false);

  const handleGenerateGreeting = async () => {
    setLoading(true);
    const text = await generateLuxuryGreeting();
    setGreeting(text);
    setLoading(false);
  };

  const isTree = currentState === TreeMorphState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start animate-fade-in">
        <div className="border-l-2 border-arix-gold pl-4">
          <h1 className="text-4xl md:text-6xl font-serif text-arix-gold tracking-widest uppercase drop-shadow-lg">
            Arix
          </h1>
          <p className="text-arix-goldLight text-xs md:text-sm tracking-[0.3em] font-sans mt-2 opacity-80">
            Signature Holiday 2024
          </p>
        </div>
        
        <div className="text-right hidden md:block">
           <p className="text-arix-gold text-xs font-sans tracking-widest opacity-60">
             INTERACTIVE EXPERIENCE
           </p>
           <p className="text-arix-gold text-xs font-sans tracking-widest opacity-60">
             {new Date().getFullYear()} LIMITED EDITION
           </p>
        </div>
      </header>

      {/* Main Content Area - Center */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`transition-opacity duration-1000 ${isTree ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-arix-gold via-white to-arix-gold text-center italic leading-relaxed drop-shadow-2xl max-w-4xl">
            "{greeting}"
          </h2>
          {loading && <p className="text-center text-arix-goldLight text-xs mt-4 tracking-widest animate-pulse">Consulting the Royal Scribe...</p>}
        </div>
      </div>

      {/* Controls Footer */}
      <footer className="pointer-events-auto flex flex-col md:flex-row items-center justify-center gap-6 pb-8">
        
        {/* Toggle Button */}
        <button
          onClick={onToggleState}
          className="group relative px-8 py-3 bg-arix-emerald/80 backdrop-blur-md border border-arix-gold/30 hover:border-arix-gold transition-all duration-500 rounded-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-arix-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-20"></div>
          <span className="relative font-sans text-arix-gold tracking-[0.2em] text-sm uppercase group-hover:text-white transition-colors">
            {isTree ? 'Disperse Elements' : 'Assemble Form'}
          </span>
        </button>

        {/* AI Generator Button */}
        {isTree && (
           <button
           onClick={handleGenerateGreeting}
           disabled={loading}
           className="group relative px-8 py-3 bg-arix-black/80 backdrop-blur-md border border-arix-gold/30 hover:border-arix-gold transition-all duration-500 rounded-full overflow-hidden"
         >
           <div className="absolute inset-0 bg-gradient-to-r from-arix-gold via-arix-goldLight to-arix-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out opacity-30"></div>
           <span className="relative font-sans text-arix-goldLight tracking-[0.2em] text-sm uppercase group-hover:text-white transition-colors">
             Generate Royal Greeting
           </span>
         </button>
        )}
      </footer>
      
      {/* Decorative Borders */}
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-arix-gold/20 hidden md:block"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-arix-gold/20 hidden md:block"></div>
    </div>
  );
};