'use client';

import React, { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';
import { ThreeScene } from './ThreeScene';
import { Fallback2D } from './Fallback2D';

export interface EcoAvatarProps {
  level: number;
  className?: string;
  onLevelChange?: (level: number) => void;
}

// Avatar model paths based on level
const AVATAR_MODELS: Record<number, string> = {
  1: '/3d-models/avatars/seed.glb',
  2: '/3d-models/avatars/sapling.glb',
  3: '/3d-models/avatars/tree.glb',
  4: '/3d-models/avatars/guardian.glb',
};

// Default to level 1 if model not found
const getModelPath = (level: number): string => {
  return AVATAR_MODELS[level] || AVATAR_MODELS[1];
};

/**
 * 3D Avatar component for level progression
 */
const AvatarModel: React.FC<{ level: number }> = ({ level }) => {
  const modelPath = getModelPath(level);
  
  // Use GLTF loader with error handling
  const { scene } = useGLTF(modelPath, true);
  
  // Clone the scene to avoid mutating the original
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  // Set up the model
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);
  
  return <primitive object={clonedScene} scale={1} position={[0, 0, 0]} />;
};

/**
 * 2D Fallback Avatar
 */
const FallbackAvatar: React.FC<{ level: number }> = ({ level }) => {
  const avatars = ['🌱', '🌿', '🌳', '🛡️'];
  const avatarIndex = Math.min(level - 1, avatars.length - 1);
  
  return (
    <Fallback2D className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce-gentle">
          {avatars[avatarIndex]}
        </div>
        <div className="text-sm text-foreground-secondary">
          Level {level}
        </div>
      </div>
    </Fallback2D>
  );
};

/**
 * EcoAvatar component with 3D progression
 */
export const EcoAvatar: React.FC<EcoAvatarProps> = ({
  level,
  className,
  onLevelChange,
}) => {
  const currentLevel = Math.max(1, Math.min(level, 4)); // Clamp between 1-4
  
  React.useEffect(() => {
    if (onLevelChange && currentLevel !== level) {
      onLevelChange(currentLevel);
    }
  }, [currentLevel, level, onLevelChange]);
  
  return (
    <ThreeScene
      className={className}
      fallback={<FallbackAvatar level={currentLevel} />}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <AvatarModel level={currentLevel} />
      </Suspense>
    </ThreeScene>
  );
};

// Note: Model preloading should be done at app initialization
// Use assetLoader from utils/3d-asset-loader.ts for centralized preloading

