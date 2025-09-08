import { useEffect } from 'react';
// r155+: 'three/addons/...'; older three: 'three/examples/jsm/...'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

type CeilingLampProps = {
  position?: [number, number, number];
  size?: [number, number]; // [width, length]
  color?: string; // lamp color temp
  intensity?: number; // light power
  emissiveIntensity?: number; // panel glow
};

export const CeilingLamp = ({
  position = [0, 9.7, 0],
  size = [3, 1.2],
  color = '#fffdf5',
  intensity = 8,
  emissiveIntensity = 5,
}: CeilingLampProps) => {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    // rotate so it faces downward (-Y)
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* Real light source */}
      <rectAreaLight args={[color, intensity, size[0], size[1]]} />
      {/* Visible glowing panel (tiny offset to avoid z-fighting with ceiling) */}
      <mesh position={[0, 0.01, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color="white"
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
