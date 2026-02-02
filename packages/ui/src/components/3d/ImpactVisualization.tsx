'use client';

import React, { Suspense, useMemo } from 'react';
import { ThreeScene } from './ThreeScene';
import { Fallback2D } from './Fallback2D';
import { EnvironmentalImpact } from '@ecohabit/shared';

export interface ImpactVisualizationProps {
  impact: EnvironmentalImpact;
  className?: string;
  animated?: boolean;
}

/**
 * 3D Impact Visualization component
 * Visualizes environmental impact with particle effects
 */
const ImpactScene: React.FC<{
  impact: EnvironmentalImpact;
  animated?: boolean;
}> = ({ impact, animated = true }) => {
  // Create particles based on impact metrics
  const particles = useMemo(() => {
    const count = Math.min(Math.floor(impact.co2Saved / 10), 100);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
    }));
  }, [impact.co2Saved]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Represent CO2 saved as particles */}
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
};

/**
 * 2D Fallback Impact Visualization
 */
const FallbackImpact: React.FC<{
  impact: EnvironmentalImpact;
}> = ({ impact }) => {
  return (
    <Fallback2D className="p-6">
      <div className="space-y-4 w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌍</div>
          <h3 className="text-lg font-semibold">Your Impact</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {impact.co2Saved.toFixed(1)}kg
            </div>
            <div className="text-xs text-foreground-secondary mt-1">CO₂ Saved</div>
          </div>
          
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {impact.waterSaved.toFixed(0)}L
            </div>
            <div className="text-xs text-foreground-secondary mt-1">Water Saved</div>
          </div>
          
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {impact.treesEquivalent.toFixed(1)}
            </div>
            <div className="text-xs text-foreground-secondary mt-1">Trees Equivalent</div>
          </div>
          
          <div className="text-center p-4 bg-earth/10 rounded-lg">
            <div className="text-2xl font-bold text-earth">
              {impact.wildlifeSaved}
            </div>
            <div className="text-xs text-foreground-secondary mt-1">Wildlife Saved</div>
          </div>
        </div>
      </div>
    </Fallback2D>
  );
};

/**
 * ImpactVisualization component
 * 3D visualization of environmental impact with fallback
 */
export const ImpactVisualization: React.FC<ImpactVisualizationProps> = ({
  impact,
  className,
  animated = true,
}) => {
  return (
    <ThreeScene
      className={className}
      fallback={<FallbackImpact impact={impact} />}
    >
      <Suspense fallback={null}>
        <ImpactScene impact={impact} animated={animated} />
      </Suspense>
    </ThreeScene>
  );
};

