'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  speed: number;
}

function FloatingCard({ position, rotation, color, speed }: FloatingCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const floatOffset = useRef({ x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2 });

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    meshRef.current.position.y += Math.sin(time * speed + floatOffset.current.y) * 0.005;
    meshRef.current.position.x += Math.sin(time * speed * 0.7 + floatOffset.current.x) * 0.003;

    // Auto rotation
    meshRef.current.rotation.x += 0.001 * speed;
    meshRef.current.rotation.y += 0.002 * speed;
    meshRef.current.rotation.z += 0.0005 * speed;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Card geometry */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glowing edge */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.52, 2.02, 0.01]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

interface ThreeDSceneProps {
  sectionColor: string;
  intensity?: number;
}

export function ThreeDScene({ sectionColor, intensity = 1 }: ThreeDSceneProps) {
  const cardConfigs = useMemo(() => {
    const colors = [
      '#00d4ff', // cyan
      '#00ff88', // green
      '#ff00ff', // magenta
      '#ffaa00', // orange
      '#00ffff', // light cyan
      '#ff0088', // pink
    ];

    return colors.slice(0, 3 + Math.floor(intensity)).map((color, idx) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      color: color,
      speed: 0.5 + Math.random() * 1.5,
    }));
  }, [intensity]);

  return (
    <Canvas
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.6} color={sectionColor} />

      {cardConfigs.map((config, idx) => (
        <FloatingCard
          key={idx}
          position={config.position}
          rotation={config.rotation}
          color={config.color}
          speed={config.speed}
        />
      ))}

      {/* Floating particles */}
      <Points sectionColor={sectionColor} />
    </Canvas>
  );
}

function Points({ sectionColor }: { sectionColor: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.x += 0.0001;
    pointsRef.current.rotation.y += 0.0002;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={sectionColor}
        sizeAttenuation
        transparent
        opacity={0.4}
      />
    </points>
  );
}
