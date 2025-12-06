import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateShapeData } from '../constants';
import { ShapeType } from '../types';

interface ParticleCloudProps {
  shapeType: ShapeType;
}

const ParticleCloud: React.FC<ParticleCloudProps> = ({ shapeType }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate target data (positions AND colors) for all shapes once
  const treeData = useMemo(() => generateShapeData(ShapeType.TREE), []);
  const sleighData = useMemo(() => generateShapeData(ShapeType.SLEIGH), []);
  const giftData = useMemo(() => generateShapeData(ShapeType.GIFT), []);

  // Current target state
  const targetData = useMemo(() => {
    switch (shapeType) {
      case ShapeType.TREE: return treeData;
      case ShapeType.SLEIGH: return sleighData;
      case ShapeType.GIFT: return giftData;
      default: return treeData;
    }
  }, [shapeType, treeData, sleighData, giftData]);

  // Initial buffers - cloned from Tree to start
  const currentPositions = useMemo(() => new Float32Array(treeData.positions), [treeData]);
  const currentColors = useMemo(() => new Float32Array(treeData.colors), [treeData]);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Smooth interpolation speed
    // Increase speed slightly for snappier transitions
    const speed = 3.0 * delta;
    
    const geometry = pointsRef.current.geometry;
    
    // Update Positions
    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;
    
    // Update Colors
    const colorAttribute = geometry.attributes.color;
    const colors = colorAttribute.array as Float32Array;

    const targetPos = targetData.positions;
    const targetCol = targetData.colors;

    let needsUpdate = false;

    // Safety check
    if (positions.length !== targetPos.length) return;

    for (let i = 0; i < positions.length; i++) {
      // --- Position Interpolation ---
      const diff = targetPos[i] - positions[i];
      if (Math.abs(diff) > 0.001) {
          positions[i] += diff * speed;
          needsUpdate = true;
      } else {
          positions[i] = targetPos[i];
      }

      // --- Color Interpolation ---
      const colDiff = targetCol[i] - colors[i];
      if (Math.abs(colDiff) > 0.01) {
          colors[i] += colDiff * speed;
          needsUpdate = true;
      } else {
          colors[i] = targetCol[i];
      }
    }
    
    // Rotate the whole cloud slowly for 3D effect
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    
    if (needsUpdate) {
        positionAttribute.needsUpdate = true;
        colorAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={currentPositions.length / 3}
          array={currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={currentColors.length / 3}
          array={currentColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14} // Slightly larger for better cloud merging
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleCloud;