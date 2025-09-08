import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';

export default function App() {
  const InteriorBox = () => {
    const tex = useTexture('/textures/wallpaper.jpg'); // wrzuć plik do /public/textures/
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);

    return (
      <mesh>
        <boxGeometry args={[20, 20, 20]} />
        <meshStandardMaterial map={tex} side={THREE.BackSide} />
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
