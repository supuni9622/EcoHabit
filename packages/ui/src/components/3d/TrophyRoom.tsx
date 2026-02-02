'use client';

import React, { Suspense, useRef } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { ThreeScene } from './ThreeScene';
import { Fallback2D } from './Fallback2D';
import { Badge } from '@ecohabit/shared';

export interface TrophyRoomProps {
  badges: Badge[];
  className?: string;
  onBadgeSelect?: (badge: Badge) => void;
}

/**
 * 3D Trophy Room component
 * Displays badges in a 3D gallery with interactive controls
 */
const TrophyRoomScene: React.FC<{
  badges: Badge[];
  onBadgeSelect?: (badge: Badge) => void;
}> = ({ badges, onBadgeSelect }) => {
  const groupRef = useRef<Group>(null);
  
  // Rotate the room slowly
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <group ref={groupRef}>
        {badges.map((badge, index) => {
          const angle = (index / badges.length) * Math.PI * 2;
          const radius = 3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh
              key={badge.id}
              position={[x, 0, z]}
              onClick={() => onBadgeSelect?.(badge)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={badge.unlockedAt ? '#22c55e' : '#6b7280'}
                emissive={badge.unlockedAt ? '#10b981' : '#000000'}
                emissiveIntensity={badge.unlockedAt ? 0.3 : 0}
              />
            </mesh>
          );
        })}
      </group>
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={10}
      />
      <Environment preset="sunset" />
    </>
  );
};

/**
 * 2D Fallback Trophy Room
 */
const FallbackTrophyRoom: React.FC<{
  badges: Badge[];
  onBadgeSelect?: (badge: Badge) => void;
}> = ({ badges, onBadgeSelect }) => {
  return (
    <Fallback2D className="p-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        {badges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => onBadgeSelect?.(badge)}
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-lg border-2
              transition-all duration-300
              cursor-pointer
              ${badge.unlockedAt
                ? 'border-primary bg-primary/10 hover:bg-primary/20'
                : 'border-border bg-muted opacity-50'
              }
            `}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-xs text-center font-medium">
              {badge.name}
            </div>
          </div>
        ))}
      </div>
    </Fallback2D>
  );
};

/**
 * TrophyRoom component
 * 3D gallery for badges with fallback to 2D grid
 */
export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  badges,
  className,
  onBadgeSelect,
}) => {
  return (
    <ThreeScene
      className={className}
      fallback={<FallbackTrophyRoom badges={badges} onBadgeSelect={onBadgeSelect} />}
    >
      <Suspense fallback={null}>
        <TrophyRoomScene badges={badges} onBadgeSelect={onBadgeSelect} />
      </Suspense>
    </ThreeScene>
  );
};

