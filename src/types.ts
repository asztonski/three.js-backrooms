export type Vec3 = [number, number, number];

export type Segment = {
  from: [number, number]; // [x,z]
  to: [number, number]; // [x,z]
  thickness?: number;
  tile?: number;
};
