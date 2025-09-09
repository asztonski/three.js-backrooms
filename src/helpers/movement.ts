import * as THREE from 'three';
import type { Keys } from './input';

export function stepCameraWASD(
  camera: THREE.Camera,
  dt: number,
  keys: React.MutableRefObject<Keys>,
  speed: number,
) {
  const forward = new THREE.Vector3();
  (camera as THREE.PerspectiveCamera).getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

  const move = new THREE.Vector3();
  if (keys.current.w) move.add(forward);
  if (keys.current.s) move.sub(forward);
  if (keys.current.a) move.add(right);
  if (keys.current.d) move.sub(right);

  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(speed * dt);
    (camera as THREE.PerspectiveCamera).position.add(move);
  }
}

export function clampCameraToRoom(
  camera: THREE.PerspectiveCamera,
  room: [number, number, number],
  radius: number,
) {
  const [rx, ry, rz] = room;
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -rx / 2 + radius, rx / 2 - radius);
  camera.position.y = THREE.MathUtils.clamp(camera.position.y, -ry / 2 + radius, ry / 2 - radius);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -rz / 2 + radius, rz / 2 - radius);
}
