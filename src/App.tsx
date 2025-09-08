import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
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

  // + w Scene (w return)
  <Suspense fallback={null}>
    <InteriorBox />
  </Suspense>;

  const Scene = () => {
    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

    return (
      <>
        <directionalLight position={[0, 0, 2]} ref={directionalLightRef} />
        <ambientLight />
        <InteriorBox />
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
