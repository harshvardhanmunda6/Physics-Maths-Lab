/**
 * NCERT Cartesian Sign Convention:
 * 1. All distances are measured from the Pole (mirror) or Optical Center (lens).
 * 2. Distances measured in the direction of incident light (left to right by default) are taken as POSITIVE.
 * 3. Distances measured against the direction of incident light are taken as NEGATIVE.
 * 4. Heights measured upwards and perpendicular to the principal axis are POSITIVE (+y).
 * 5. Heights measured downwards and perpendicular to the principal axis are NEGATIVE (-y).
 */

export function formatSigned(num: number | undefined | null, unit = '', decimals = 2): string {
  if (num === undefined || num === null || Number.isNaN(num)) return '—';
  if (!Number.isFinite(num)) return num > 0 ? '+∞' : '-∞';
  const rounded = num.toFixed(decimals);
  const sign = num > 0 ? '+' : num < 0 ? '-' : '';
  const absVal = Math.abs(num).toFixed(decimals);
  return `${sign}${absVal}${unit ? ' ' + unit : ''}`;
}

export function formatNumber(num: number | undefined | null, unit = '', decimals = 2): string {
  if (num === undefined || num === null || Number.isNaN(num)) return '—';
  if (!Number.isFinite(num)) return num > 0 ? '∞' : '-∞';
  return `${num.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}

// ----------------- VECTORS MATH -----------------

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export function vAdd(a: Vector3D, b: Vector3D): Vector3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function vSub(a: Vector3D, b: Vector3D): Vector3D {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function vScale(a: Vector3D, s: number): Vector3D {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

export function vDot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vCross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function vMag(a: Vector3D): number {
  return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}

export function vNormalize(a: Vector3D): Vector3D {
  const m = vMag(a);
  if (m === 0) return { x: 0, y: 0, z: 0 };
  return { x: a.x / m, y: a.y / m, z: a.z / m };
}

export function vAngleDeg(a: Vector3D, b: Vector3D): number {
  const ma = vMag(a);
  const mb = vMag(b);
  if (ma === 0 || mb === 0) return 0;
  const cosTheta = Math.max(-1, Math.min(1, vDot(a, b) / (ma * mb)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}

export function vProjection(a: Vector3D, onB: Vector3D): number {
  const mb = vMag(onB);
  if (mb === 0) return 0;
  return vDot(a, onB) / mb;
}

export function vScalarTriple(a: Vector3D, b: Vector3D, c: Vector3D): number {
  return vDot(a, vCross(b, c));
}

export function vVectorTriple(a: Vector3D, b: Vector3D, c: Vector3D): Vector3D {
  // a x (b x c) = (a.c)b - (a.b)c
  const ac = vDot(a, c);
  const ab = vDot(a, b);
  return vSub(vScale(b, ac), vScale(c, ab));
}

export function formatVector(v: Vector3D, name = 'v', decimals = 2): string {
  const fx = v.x >= 0 ? (v.x === 0 ? '0' : `+ ${v.x.toFixed(decimals)}î`) : `- ${Math.abs(v.x).toFixed(decimals)}î`;
  const fy = v.y >= 0 ? `+ ${v.y.toFixed(decimals)}ĵ` : `- ${Math.abs(v.y).toFixed(decimals)}ĵ`;
  const fz = v.z >= 0 ? `+ ${v.z.toFixed(decimals)}k̂` : `- ${Math.abs(v.z).toFixed(decimals)}k̂`;
  
  // Format cleanly without leading plus if x is positive
  const cleanX = v.x >= 0 ? `${v.x.toFixed(decimals)}î` : `- ${Math.abs(v.x).toFixed(decimals)}î`;
  return `${name} = ${cleanX} ${fy} ${fz}`;
}

// ----------------- 3D GEOMETRY MATH -----------------

export interface PlaneEquation {
  a: number;
  b: number;
  c: number;
  d: number; // ax + by + cz = d
}

export interface Line3D {
  p: Vector3D; // Point on line
  d: Vector3D; // Direction vector
}

export function pointToPlaneDistance(p: Vector3D, plane: PlaneEquation): number {
  const num = Math.abs(plane.a * p.x + plane.b * p.y + plane.c * p.z - plane.d);
  const den = Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c);
  return den === 0 ? 0 : num / den;
}

export function footOfPerpendicularPlane(p: Vector3D, plane: PlaneEquation): Vector3D {
  const { a, b, c, d } = plane;
  const den = a * a + b * b + c * c;
  if (den === 0) return p;
  const k = -(a * p.x + b * p.y + c * p.z - d) / den;
  return {
    x: p.x + k * a,
    y: p.y + k * b,
    z: p.z + k * c,
  };
}

export function imageOfPointPlane(p: Vector3D, plane: PlaneEquation): Vector3D {
  const { a, b, c, d } = plane;
  const den = a * a + b * b + c * c;
  if (den === 0) return p;
  const k = -2 * (a * p.x + b * p.y + c * p.z - d) / den;
  return {
    x: p.x + k * a,
    y: p.y + k * b,
    z: p.z + k * c,
  };
}

export function pointToLineDistance(point: Vector3D, line: Line3D): number {
  // d = |(P - A) x b| / |b|
  const ap = vSub(point, line.p);
  const cross = vCross(ap, line.d);
  const magD = vMag(line.d);
  return magD === 0 ? 0 : vMag(cross) / magD;
}

export function skewLinesDistance(l1: Line3D, l2: Line3D): { distance: number; isParallel: boolean } {
  // d = |(a2 - a1) . (b1 x b2)| / |b1 x b2|
  const b1xb2 = vCross(l1.d, l2.d);
  const magCross = vMag(b1xb2);
  if (magCross < 1e-6) {
    // Parallel lines: d = |(a2 - a1) x b1| / |b1|
    const a2_a1 = vSub(l2.p, l1.p);
    const magB = vMag(l1.d);
    return {
      distance: magB === 0 ? 0 : vMag(vCross(a2_a1, l1.d)) / magB,
      isParallel: true,
    };
  }
  const a2_a1 = vSub(l2.p, l1.p);
  return {
    distance: Math.abs(vDot(a2_a1, b1xb2)) / magCross,
    isParallel: false,
  };
}

// ----------------- COORDINATE GEOMETRY MATH -----------------

export interface Line2D {
  a: number; // ax + by + c = 0
  b: number;
  c: number;
}

export function pointToLine2DDistance(x0: number, y0: number, line: Line2D): number {
  const den = Math.hypot(line.a, line.b);
  if (den === 0) return 0;
  return Math.abs(line.a * x0 + line.b * y0 + line.c) / den;
}

export function angleBetween2DLines(l1: Line2D, l2: Line2D): number {
  // cos theta = |a1 a2 + b1 b2| / (sqrt(a1^2+b1^2) sqrt(a2^2+b2^2))
  const num = Math.abs(l1.a * l2.a + l1.b * l2.b);
  const den = Math.hypot(l1.a, l1.b) * Math.hypot(l2.a, l2.b);
  if (den === 0) return 0;
  const cosT = Math.max(-1, Math.min(1, num / den));
  return (Math.acos(cosT) * 180) / Math.PI;
}
