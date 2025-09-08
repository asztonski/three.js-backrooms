import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, Suspense, useEffect } from 'react';
import { useTexture, PositionalAudio } from '@react-three/drei';
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';

export default function App() {
  const InteriorBox = () => {
    const { wall, floor, ceiling } = useTexture({
      wall: '/textures/wallpaper.jpg',
      floor: '/textures/floor.webp',
      ceiling: '/textures/ceiling.png',
    });

    [wall, floor, ceiling].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    });
    wall.repeat.set(2, 2);
    floor.repeat.set(4, 4); // gęstszy deseń na podłodze
    ceiling.repeat.set(1, 1); // zwykle rzadszy na suficie

    return (
      <mesh>
        <mesh>
          <boxGeometry args={[20, 20, 20]} />
          {/* +X, -X */}
          <meshStandardMaterial attach="material-0" map={wall} side={THREE.BackSide} />
          <meshStandardMaterial attach="material-1" map={wall} side={THREE.BackSide} />
          {/* +Y = sufit, -Y = podłoga */}
          <meshStandardMaterial attach="material-2" map={ceiling} side={THREE.BackSide} />
          <meshStandardMaterial attach="material-3" map={floor} side={THREE.BackSide} />
          {/* +Z, -Z */}
          <meshStandardMaterial attach="material-4" map={wall} side={THREE.BackSide} />
          <meshStandardMaterial attach="material-5" map={wall} side={THREE.BackSide} />
        </mesh>
      </mesh>
    );
  };

  const Scene = () => {
    const camera = useThree((state) => state.camera);
    const ROOM_HALF = 10; // bo box ma 20
    const RADIUS = 0.75; // „promień gracza”

    useFrame(() => {
      const p = camera.position;
      p.x = THREE.MathUtils.clamp(p.x, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
      p.y = THREE.MathUtils.clamp(p.y, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
      p.z = THREE.MathUtils.clamp(p.z, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
    });

    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

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
      <>
        <directionalLight position={[0, 0, 2]} ref={directionalLightRef} />
        <ambientLight />
        <PositionalAudio
          ref={audioRef}
          url="/audio/ambient.wav"
          autoplay
          loop
          distance={4}
          position={[0, 1.6, 0]}
        />
        {/* <-- JEDYNA ZMIANA: Suspense wokół InteriorBox */}
        <Suspense fallback={null}>
          <InteriorBox />
        </Suspense>
        <OrbitControls />
      </>
    );
  };

  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}
