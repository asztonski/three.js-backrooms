import { useEffect } from 'react';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

type CeilingTrofferProps = {
  position?: [number, number, number];
  size?: [number, number];
  color?: string;
  intensity?: number;
};

export const CeilingTroffer = ({
  position = [0, 9.7, 0],
  size = [3, 1.2],
  color = '#fffdf3',
  intensity = 8,
}: CeilingTrofferProps) => {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <>
      <ambientLight intensity={0.15} />
      <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <rectAreaLight args={[color, intensity, size[0], size[1]]} />
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[size[0] + 0.2, size[1] + 0.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fffef7"
            emissiveIntensity={5}
            roughness={0.2}
            metalness={0}
          />
        </mesh>
      </group>
    </>
  );
};
