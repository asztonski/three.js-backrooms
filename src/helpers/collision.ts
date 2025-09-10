// src/helpers/collision.ts
import * as THREE from 'three';

type Segment = {
  from: [number, number]; // [x,z]
  to: [number, number]; // [x,z]
  thickness?: number; // meters
};

function closestPointOnSegment2D(
  ax: number,
  az: number,
  bx: number,
  bz: number,
  px: number,
  pz: number,
) {
  const abx = bx - ax,
    abz = bz - az;
  const apx = px - ax,
    apz = pz - az;
  const abLenSq = abx * abx + abz * abz;
  let t = 0;
  if (abLenSq > 0) t = (apx * abx + apz * abz) / abLenSq;
  t = Math.max(0, Math.min(1, t));
  return { x: ax + abx * t, z: az + abz * t, t };
}

export function resolveCollisions2D(
  pos: THREE.Vector3,
  segments: Segment[],
  cameraRadius: number,
  iterations = 3,
  margin = 0.08, // ~8 cm bufora, możesz potem zmniejszyć do 0.03–0.05
) {
  for (let k = 0; k < iterations; k++) {
    let any = false;

    for (const s of segments) {
      const ax = s.from[0],
        az = s.from[1];
      const bx = s.to[0],
        bz = s.to[1];

      const segR = (s.thickness ?? 0.5) * 0.5;
      const R = cameraRadius + segR + margin;

      const cp = closestPointOnSegment2D(ax, az, bx, bz, pos.x, pos.z);
      let dx = pos.x - cp.x;
      let dz = pos.z - cp.z;
      const distSq = dx * dx + dz * dz;

      if (distSq < R * R) {
        let dist = Math.sqrt(Math.max(distSq, 1e-12));
        if (dist < 1e-6) {
          const sx = bx - ax,
            sz = bz - az;
          dx = -sz;
          dz = sx;
          const nlen = Math.hypot(dx, dz) || 1;
          dx /= nlen;
          dz /= nlen;
          dist = 0;
        } else {
          dx /= dist;
          dz /= dist;
        }

        const pen = R - dist;
        pos.x += dx * pen;
        pos.z += dz * pen;
        any = true;
      }
    }
    if (!any) break;
  }
}
