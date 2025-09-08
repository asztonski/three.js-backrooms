// components/scene/sphere/InteriorBox.tsx
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type Segment = {
  from: [number, number]; // [x,z]
  to: [number, number]; // [x,z]
  height?: number; // default = room height
  thickness?: number; // default = 0.5
  tile?: number; // UV tiles per meter (optional, default 1)
};

type InteriorBoxProps = {
  size?: [number, number, number]; // [width, height, depth]
  segments?: Segment[];
};

export function InteriorBox({ size = [100, 20, 80], segments = [] }: InteriorBoxProps) {
  const [W, H, D] = size;

  const { wall, floor, ceiling } = useTexture({
    wall: '/textures/wallpaper.jpg',
    floor: '/textures/floor.png',
    ceiling: '/textures/ceiling.png',
  });

  [wall, floor, ceiling].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  });

  // Floor/ceiling tiling
  wall.repeat.set(20, 20);
  floor.repeat.set(10, 10);
  ceiling.repeat.set(5, 5);

  return (
    <group>
      {/* Envelope (keeps the Backrooms “box” around everything) */}
      <mesh>
        <boxGeometry args={[W, H, D]} />
        {/* +X, -X */}
        <meshStandardMaterial attach="material-0" map={wall} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-1" map={wall} side={THREE.BackSide} />
        {/* +Y (ceiling), -Y (floor) */}
        <meshStandardMaterial attach="material-2" map={ceiling} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-3" map={floor} side={THREE.BackSide} />
        {/* +Z, -Z */}
        <meshStandardMaterial attach="material-4" map={wall} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-5" map={wall} side={THREE.BackSide} />
      </mesh>

      {/* Interior, arbitrary-angled walls */}
      {segments.map((segment, index) => {
        const [x1, z1] = segment.from;
        const [x2, z2] = segment.to;
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.hypot(dx, dz); // meters
        const angleY = Math.atan2(dz, dx); // radians
        const center: [number, number, number] = [(x1 + x2) / 2, 0, (z1 + z2) / 2];

        const height = segment.height ?? H; // full height by default
        const thickness = 2; // thin wall
        const tile = segment.tile ?? 1; // UV tiling density

        // Clone the wall texture per segment so repeats can differ
        const wallTex = wall.clone();
        wallTex.needsUpdate = true;
        wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
        // Repeat proportional to physical size (tweak tile to taste)
        wallTex.repeat.set((length / 1) * tile, (height / 1) * tile);

        return (
          <mesh key={index} position={[center[0], 0, center[2]]} rotation={[0, angleY, 0]}>
            {/* width=length (X), height (Y), depth=thickness (Z) */}
            <boxGeometry args={[length, height, thickness]} />
            <meshStandardMaterial map={wallTex} />
          </mesh>
        );
      })}
    </group>
  );
}
