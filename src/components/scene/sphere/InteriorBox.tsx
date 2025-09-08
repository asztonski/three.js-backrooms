import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const InteriorBox = () => {
  const { wall, floor, ceiling } = useTexture({
    wall: '/textures/wallpaper.jpg',
    floor: '/textures/floor.png',
    ceiling: '/textures/ceiling.png',
  });

  [wall, floor, ceiling].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  });
  wall.repeat.set(10, 10);
  floor.repeat.set(1, 1); // gęstszy deseń na podłodze
  ceiling.repeat.set(1, 1); // zwykle rzadszy na suficie

  return (
    <mesh>
      <mesh>
        <boxGeometry args={[40, 20, 20]} />
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
