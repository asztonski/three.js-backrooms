import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <>
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </>
  );
}
