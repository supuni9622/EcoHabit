import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { getCapabilityInfo } from '@ecohabit/shared';

export interface MobileAvatarProps {
  level: number;
  style?: any;
  onLevelChange?: (level: number) => void;
}

/**
 * Mobile 3D Avatar using Expo GL
 * Simplified models for mobile performance
 */
export const MobileAvatar: React.FC<MobileAvatarProps> = ({
  level,
  style,
  onLevelChange,
}) => {
  const capabilities = getCapabilityInfo();
  
  // If 3D is not supported, show 2D fallback
  if (!capabilities.webglSupported || capabilities.performanceTier === 'low') {
    return <FallbackMobileAvatar level={level} style={style} />;
  }

  const onContextCreate = async (gl: any) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    const renderer = new Renderer({ gl });
    
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Create simple avatar representation
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x22c55e });
    const avatar = new THREE.Mesh(geometry, material);
    scene.add(avatar);
    
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      avatar.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    
    animate();
  };

  return (
    <View style={[styles.container, style]}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

/**
 * 2D Fallback Avatar for Mobile
 */
const FallbackMobileAvatar: React.FC<{ level: number; style?: any }> = ({
  level,
  style,
}) => {
  const avatars = ['🌱', '🌿', '🌳', '🛡️'];
  const avatarIndex = Math.min(level - 1, avatars.length - 1);
  
  return (
    <View style={[styles.container, styles.fallback, style]}>
      <View style={styles.fallbackContent}>
        <View style={styles.avatarEmoji}>{avatars[avatarIndex]}</View>
        <View style={styles.levelText}>Level {level}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  glView: {
    flex: 1,
  },
  fallback: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContent: {
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    color: '#4b5563',
  },
});

