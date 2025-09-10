import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useHelper } from '@react-three/drei';
import { LightingInit } from './helpers/lighting';
import { CeilingLamp } from './components/scene/light/CeilingLamp';
import { InteriorBox } from './components/scene/sphere/InteriorBox';
import { computeLampGridPositions } from './helpers/grid';
import { useWASD } from './helpers/input';
import { stepCameraWASD, clampCameraToRoom } from './helpers/movement';
import { resolveCollisions2D } from './helpers/collision';
import scene from './config/scene.json';
import * as THREE from 'three';

export default function App() {
  const ROOM = scene.room.size as [number, number, number];
  const [ROOM_X, ROOM_Y, ROOM_Z] = ROOM;

  const padX = 3; // ~ sizeX/2 + clearance
  const padZ = 3;

  const LAMPS_POSITIONS = computeLampGridPositions(ROOM_X, ROOM_Z, padX, padZ, ROOM_Y);

  const LAMPS_INSTANCES = LAMPS_POSITIONS.map((pos, i) => (
    <CeilingLamp key={i} size={[5, 5]} position={pos} />
  ));

  const plcRef = useRef<any>(null);

  const Scene = ({ plcRef }) => {
    const RADIUS = 0.75; // „promień gracza”
    const segments = scene.segments as any;
    const keys = useWASD();

    useFrame(({ camera }, dt) => {
      // krok ruchu WASD
      stepCameraWASD(camera, dt, keys, 9);
      // kolizje z wewnętrznymi ścianami (XZ)
      resolveCollisions2D((camera as THREE.PerspectiveCamera).position, segments, RADIUS, 5, 0.15);
      // ograniczenie do rozmiaru pokoju
      clampCameraToRoom(camera as THREE.PerspectiveCamera, ROOM, RADIUS);
    });

    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

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
