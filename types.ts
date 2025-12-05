import * as THREE from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  scale: number;
  rotationSpeed: number;
  colorVariation: number;
}

export interface TreeConfig {
  particleCount: number;
  ornamentCount: number;
  treeHeight: number;
  baseRadius: number;
  scatterRadius: number;
}