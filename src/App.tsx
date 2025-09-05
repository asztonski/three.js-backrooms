import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
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
    const [isGrabbed, setIsGrabbed] = useState(false);
    const [isHovered, setIsHovered] = useState(isGrabbed ? true : false);

    useFrame((state, delta) => {
      if (ref.current) {
        const speed = isHovered ? 1 : 0.2;
        const positionX = isGrabbed ? state.mouse.x * 5 : position[0];
        const positionY = isGrabbed ? state.mouse.y * 5 : position[1];
        const mousePosX = state.mouse.x;
        const mousePosY = state.mouse.y;

        ref.current.rotation.x += delta * speed;
        ref.current.rotation.y += delta * speed;
        ref.current.position.x = isGrabbed
          ? mousePosX * 7
          : THREE.MathUtils.lerp(ref.current.position.x, positionX, 0.1);
        ref.current.position.y = isGrabbed
          ? mousePosY * 7
          : THREE.MathUtils.lerp(ref.current.position.y, positionY, 0.1);
      }
    });

    return (
      <mesh
        onPointerEnter={(event) => [event.stopPropagation(), setIsHovered(true)]}
        onPointerLeave={() => setIsHovered(false)}
        onPointerDown={(event) => [event.stopPropagation(), setIsGrabbed(true)]}
        onPointerUp={() => setIsGrabbed(false)}
        position={position}
        ref={ref}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={isHovered ? secondColor : color} />
      </mesh>
    );
  };

  return (
    <>
      <Canvas>
        <directionalLight position={[0, 0, 2]} />
        <ambientLight />

        <group position={[0, -1, 0]}>
          <Cube size={[1, 1, 1]} position={[1, 0, 0]} color="royalblue" secondColor="lightblue" />
          <Cube size={[1, 1, 1]} position={[-1, 0, 0]} color="lime" secondColor="green" />
          <Cube size={[1, 1, 1]} position={[-1, 2, 0]} color="hotpink" secondColor="pink" />
          <Cube size={[1, 1, 1]} position={[1, 2, 0]} color="purple" secondColor="violet" />
        </group>
      </Canvas>
    </>
  );
}
