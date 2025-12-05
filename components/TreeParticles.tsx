import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData, TreeConfig } from '../types';

interface TreeParticlesProps {
  state: TreeMorphState;
  type: 'LEAF' | 'ORNAMENT';
}

const tempObject = new THREE.Object3D();
const tempVec3 = new THREE.Vector3();

// Helper to generate positions
const generateParticles = (count: number, config: TreeConfig, isOrnament: boolean): ParticleData[] => {
  const particles: ParticleData[] = [];
  
  for (let i = 0; i < count; i++) {
    // 1. Scatter Position (Random Sphere)
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * config.scatterRadius; // Cube root for uniform distribution
    
    const scatterPos = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // 2. Tree Position (Cone Spiral)
    // Normalized height (0 to 1)
    const hNorm = Math.random(); 
    // Logarithmic spiral distribution for better density at bottom
    const y = hNorm * config.treeHeight - (config.treeHeight / 2); 
    
    // Radius at this height (Cone formula)
    const coneRadiusAtHeight = (1 - hNorm) * config.baseRadius;
    
    // Angle (Spiral)
    const spiralAngle = hNorm * 50 + (Math.random() * Math.PI * 2);
    
    // Add some noise to tree shape so it's not perfect geometric cone
    const rNoise = isOrnament ? 0 : (Math.random() - 0.5) * 0.5;
    
    const treePos = new THREE.Vector3(
      Math.cos(spiralAngle) * (coneRadiusAtHeight + rNoise),
      y,
      Math.sin(spiralAngle) * (coneRadiusAtHeight + rNoise)
    );

    particles.push({
      id: i,
      scatterPosition: scatterPos,
      treePosition: treePos,
      scale: isOrnament ? Math.random() * 0.4 + 0.2 : Math.random() * 0.2 + 0.05,
      rotationSpeed: Math.random() * 0.02,
      colorVariation: Math.random() 
    });
  }
  return particles;
};

export const TreeParticles: React.FC<TreeParticlesProps> = ({ state, type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const config: TreeConfig = {
    particleCount: 1800, // Emerald leaves
    ornamentCount: 150, // Gold baubles
    treeHeight: 12,
    baseRadius: 4,
    scatterRadius: 15
  };

  const isOrnament = type === 'ORNAMENT';
  const count = isOrnament ? config.ornamentCount : config.particleCount;

  // Stable data generation
  const data = useMemo(() => generateParticles(count, config, isOrnament), [count, isOrnament]);
  
  // Store current positions for smooth interpolation (outside React state for perf)
  const currentPositions = useMemo(() => {
    return data.map(d => d.scatterPosition.clone());
  }, [data]);

  useFrame((stateThree) => {
    if (!meshRef.current) return;

    const time = stateThree.clock.getElapsedTime();
    const lerpFactor = 0.03; // Smoothness of transition

    data.forEach((particle, i) => {
      // 1. Determine Target
      const target = state === TreeMorphState.TREE_SHAPE 
        ? particle.treePosition 
        : particle.scatterPosition;

      // 2. Interpolate Position
      currentPositions[i].lerp(target, lerpFactor);

      // 3. Add "Alive" floating noise
      const noise = Math.sin(time * 0.5 + particle.id) * 0.05;
      const floatY = state === TreeMorphState.SCATTERED ? Math.sin(time + particle.id) * 0.02 : 0;

      tempObject.position.copy(currentPositions[i]);
      tempObject.position.y += floatY;

      // 4. Rotation
      // Rotate based on time + state
      if (state === TreeMorphState.SCATTERED) {
         tempObject.rotation.x += particle.rotationSpeed;
         tempObject.rotation.y += particle.rotationSpeed;
      } else {
         // Look at center-ish but keep upright mostly
         tempObject.rotation.set(0, time * 0.1 + particle.id, 0);
      }

      // 5. Scale
      // Pulse scale slightly for ornaments
      const pulse = isOrnament ? Math.sin(time * 2 + particle.id) * 0.05 + 1 : 1;
      tempObject.scale.setScalar(particle.scale * pulse);

      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // Dynamic Color updates for instanced mesh is expensive, so we stick to material properties usually.
      // But we can update color if we needed to.
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Materials
  const emeraldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#034d35'),
    emissive: new THREE.Color('#001a10'),
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 0.5,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FDD017'),
    emissive: new THREE.Color('#D4AF37'),
    emissiveIntensity: 0.4,
    roughness: 0.05, // Very polished
    metalness: 1.0,  // Pure metal
  });

  // Geometry
  const leafGeo = useMemo(() => new THREE.ConeGeometry(0.5, 1.5, 4), []); // Stylized crystals/needles
  const ornamentGeo = useMemo(() => new THREE.SphereGeometry(0.5, 16, 16), []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <primitive object={isOrnament ? ornamentGeo : leafGeo} attach="geometry" />
      <primitive object={isOrnament ? goldMaterial : emeraldMaterial} attach="material" />
    </instancedMesh>
  );
};