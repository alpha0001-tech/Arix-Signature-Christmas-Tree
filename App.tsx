import React, { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [mounted, setMounted] = useState(false);

  // Initial animation sequence
  useEffect(() => {
    setMounted(true);
    // Automatically assemble after a delay for dramatic effect
    const timer = setTimeout(() => {
      setTreeState(TreeMorphState.TREE_SHAPE);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleState = () => {
    setTreeState(prev => 
      prev === TreeMorphState.TREE_SHAPE 
        ? TreeMorphState.SCATTERED 
        : TreeMorphState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-screen h-screen bg-arix-black overflow-hidden selection:bg-arix-gold selection:text-arix-black">
      
      {/* 3D Scene Layer */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Scene treeState={treeState} />
      </div>

      {/* UI Layer */}
      <UIOverlay currentState={treeState} onToggleState={toggleState} />
      
      {/* Grain/Texture Overlay for filmic look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
};

export default App;