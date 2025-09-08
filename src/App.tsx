import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, Suspense, useEffect } from 'react';
import { useTexture, PositionalAudio, PointerLockControls } from '@react-three/drei';
import { useHelper } from '@react-three/drei';
import * as THREE from 'three';

export default function App() {
  const InteriorBox = () => {
    const { wall, floor, ceiling } = useTexture({
      wall: '/textures/wallpaper.jpg',
      floor: '/textures/floor.png',
      ceiling: '/textures/ceiling.png',
    });

    [wall, floor, ceiling].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    });
    wall.repeat.set(2, 2);
    floor.repeat.set(4, 4); // gęstszy deseń na podłodze
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

  const plcRef = useRef<any>(null);

  const Scene = ({ plcRef }) => {
    const camera = useThree((state) => state.camera);
    const ROOM_HALF = 10; // bo box ma 20
    const RADIUS = 0.75; // „promień gracza”

    const keys = useRef({ w: false, a: false, s: false, d: false });

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in keys.current) keys.current[k as 'w' | 'a' | 's' | 'd'] = true;
      };
      const up = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in keys.current) keys.current[k as 'w' | 'a' | 's' | 'd'] = false;
      };
      window.addEventListener('keydown', down);
      window.addEventListener('keyup', up);
      return () => {
        window.removeEventListener('keydown', down);
        window.removeEventListener('keyup', up);
      };
    }, []);

    useFrame(({ camera }, dt) => {
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

      const speed = 3; // meters per second
      const move = new THREE.Vector3();
      if (keys.current.w) move.add(forward);
      if (keys.current.s) move.sub(forward);
      if (keys.current.a) move.add(right);
      if (keys.current.d) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        camera.position.add(move);
      }

      const p = camera.position;
      p.x = THREE.MathUtils.clamp(p.x, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
      p.y = THREE.MathUtils.clamp(p.y, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
      p.z = THREE.MathUtils.clamp(p.z, -ROOM_HALF + RADIUS, ROOM_HALF - RADIUS);
    });

    const directionalLightRef = useRef<THREE.DirectionalLight>(
      null!,
    ) as React.RefObject<THREE.DirectionalLight>;

    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

    const audioRef = useRef<THREE.PositionalAudio>(null);

    useEffect(() => {
      const unlock = () => {
        const ctx = THREE.AudioContext.getContext();
        if (ctx.state === 'suspended') ctx.resume();
        audioRef.current?.play?.();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('wheel', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true });
      window.addEventListener('wheel', unlock, { once: true, passive: true });
    }, []);

    return (
      <>
        {/* <directionalLight position={[0, 0, 2]} ref={directionalLightRef} /> */}
        <ambientLight />
        <PositionalAudio
          ref={audioRef}
          url="/audio/ambient.wav"
          autoplay
          loop
          distance={4}
          position={[0, 1.6, 0]}
        />
        <Suspense fallback={null}>
          <InteriorBox />
        </Suspense>
        <PointerLockControls ref={plcRef} />
      </>
    );
  };

  return (
    <Canvas onClick={() => plcRef.current?.lock?.()}>
      <Scene plcRef={plcRef} />
    </Canvas>
  );
}
