import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function App() {
  type CubeProps = {
    position?: [number, number, number];
    color: string;
    size: [number, number, number];
  };

  const Cube = ({ position = [0, 0, 0], color, size = [1, 1, 1] }: CubeProps) => {
    const ref = useRef();

    useFrame((state, delta) => {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta;
    });

    return (
      <mesh position={position} ref={ref}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  return (
    <>
      <Canvas>
        <directionalLight position={[0, 0, 2]} />
        <ambientLight />

        {/* <group position={[0, -1, 0]}>
          <Cube size={[1, 1, 1]} position={[1, 0, 0]} color="royalblue" />
          <Cube size={[1, 1, 1]} position={[-1, 0, 0]} color="lime" />
          <Cube size={[1, 1, 1]} position={[-1, 2, 0]} color="hotpink" />
          <Cube size={[1, 1, 1]} position={[1, 2, 0]} color="purple" />
        </group> */}

        <Cube position={[0, 0, 0]} size={[1, 1, 1]} color="orange" />
      </Canvas>
    </>
  );
}
