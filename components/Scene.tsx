import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { TreeMorphState } from '../types';
import * as THREE from 'three';

interface SceneProps {
  treeState: TreeMorphState;
}

const RotatingCamera = () => {
  useFrame((state) => {
    // Gentle constant rotation for cinematic feel
    const angle = state.clock.getElapsedTime() * 0.05;
    const radius = 22;
    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.z = Math.cos(angle) * radius;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 25], fov: 45 }}
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ReinhardToneMapping, 
        toneMappingExposure: 1.5 
      }}
      className="w-full h-full bg-arix-emerald"
    >
      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.2} color="#0b4a36" />
      
      {/* Key Light (Gold) */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={200} 
        color="#FDD017" 
        castShadow 
      />
      
      {/* Rim Light (Cool) */}
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={100} 
        color="#aaddff" 
      />

      {/* Center Glow */}
      <pointLight position={[0, 0, 0]} intensity={50} color="#D4AF37" distance={10} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={4} speed={0.4} opacity={0.5} color="#FDD017" />

      {/* The Interactive Tree Components */}
      <group position={[0, -4, 0]}>
        <TreeParticles state={treeState} type="LEAF" />
        <TreeParticles state={treeState} type="ORNAMENT" />
      </group>

      <RotatingCamera />
      
      {/* Post Processing for the "Bloom" Glow */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};