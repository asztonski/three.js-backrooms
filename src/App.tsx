import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';

export default function App() {
  type CubeProps = {
    position?: [number, number, number];
    color: string;
    secondColor?: string;
    size: [number, number, number];
  };

  const Cube = ({ position = [0, 0, 0], color, secondColor, size = [1, 1, 1] }: CubeProps) => {
    const ref = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);

    useFrame((state, delta) => {
      if (ref.current) {
        const speed = isHovered ? 0 : 1;
        ref.current.rotation.x += delta * speed;
        ref.current.rotation.y += delta * speed;
      }
    });

    return (
      <mesh
        onPointerEnter={(event) => [event.stopPropagation(), setIsHovered(true)]}
        onPointerLeave={() => setIsHovered(false)}
        position={position}
        ref={ref}
      >
        <boxGeometry args={size} />
        <MeshWobbleMaterial
          color={isHovered ? secondColor : color}
          speed={1}
          factor={isHovered ? 1 : 0}
        />
      </mesh>
    );
  };

  const Scene = () => {
    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

    return (
      <>
        <directionalLight position={[0, 0, 2]} ref={directionalLightRef} />
        <ambientLight />
        <Cube size={[1, 1, 1]} position={[0, 0, 0]} color="purple" secondColor="violet" />
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
