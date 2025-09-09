import { useEffect, useRef } from 'react';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';

type CeilingLampProps = {
  position?: [number, number, number];
  size?: [number, number];
  color?: string;
  intensity?: number; // area light flux-ish (will feel “big”)
  emissiveIntensity?: number; // panel glow
};

export const CeilingLamp = ({
  position = [0, 9.7, 0],
  size = [3, 1.2],
  color = '#fffdf5',
  intensity = 10, // try 30–150 depending on your scene scale
  emissiveIntensity = 5,
}: CeilingLampProps) => {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  const audioRef = useRef<THREE.PositionalAudio>(null);

  useEffect(() => {
    const unlock = () => {
      const ctx = THREE.AudioContext.getContext();
      if (ctx.state === 'suspended') ctx.resume();
      audioRef.current?.play?.();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('wheel', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('wheel', unlock, { once: true, passive: true });
  }, []);

  return (
    <group position={position}>
      {/* Shadow-casting / actual reach */}
      <pointLight
        color={color}
        intensity={100} // try 300–1500; physically-correct falloff needs bigger numbers
        distance={0} // no hard cutoff (inverse-square)
        decay={2}
        position={[0, -0.1, 0]} // just below the ceiling in world -Y
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-radius={2}
      />
      <PositionalAudio
        ref={audioRef}
        url="/audio/ambient.wav"
        autoplay
        loop
        distance={4}
        position={[0, 1.6, 0]}
      />

      {/* Aim the panel + rect area light downward */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <rectAreaLight args={[color, intensity, size[0], size[1]]} />
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={size} />
          <meshStandardMaterial
            color="white"
            emissive={color}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      </group>
    </group>
  );
};
