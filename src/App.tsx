import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useHelper } from '@react-three/drei';
import { LightingInit } from './helpers/lighting';
import { CeilingLamp } from './components/scene/light/CeilingLamp';
import { InteriorBox } from './components/scene/sphere/InteriorBox';
import { computeLampGridPositions } from './helpers/grid';
import { useWASD } from './helpers/input';
import { stepCameraWASD, clampCameraToRoom } from './helpers/movement';
import * as THREE from 'three';

export default function App() {
  const ROOM_X = 100;
  const ROOM_Z = 80;
  const ROOM_Y = 20; // Height
  const ROOM: [number, number, number] = [ROOM_X, ROOM_Y, ROOM_Z];

  const padX = 3; // ~ sizeX/2 + clearance
  const padZ = 3;

  const LAMPS_POSITIONS = computeLampGridPositions(ROOM_X, ROOM_Z, padX, padZ, 9.9);

  const LAMPS_INSTANCES = LAMPS_POSITIONS.map((pos, i) => (
    <CeilingLamp key={i} size={[5, 5]} position={pos} />
  ));

  const plcRef = useRef<any>(null);

  const Scene = ({ plcRef }) => {
    const RADIUS = 0.75; // „promień gracza”

    const keys = useWASD();

    useFrame(({ camera }, dt) => {
      // krok ruchu WASD
      stepCameraWASD(camera, dt, keys, 9);
      // ograniczenie do rozmiaru pokoju
      clampCameraToRoom(camera as THREE.PerspectiveCamera, ROOM, RADIUS);
    });

    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

    const segments = [
      // 90° straight walls
      { from: [-40, -20], to: [40, -20] }, // horizontal
      { from: [40, -20], to: [40, 20] }, // vertical
      // 45° diagonal
      { from: [-10, 0], to: [10, 20], thickness: 0.5, tile: 0.5 },
    ];

    return (
      <>
        {LAMPS_INSTANCES}
        <LightingInit />
        <ambientLight color={0xfaf0a7} intensity={0.5} />
        <Suspense fallback={null}>
          <InteriorBox size={ROOM} segments={segments} />
        </Suspense>
        <PointerLockControls ref={plcRef} />
      </>
    );
  };

  return (
    <Canvas shadows onClick={() => plcRef.current?.lock?.()}>
      <Scene plcRef={plcRef} />
    </Canvas>
  );
}
