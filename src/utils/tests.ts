import { UnitTestResult } from '../types';
import { solveSphericalMirror, solveRefraction, solveLens, solvePrism, solveVectorOperations, solvePointAndPlane, solveConic } from './solvers';

export function runAllUnitTests(): UnitTestResult[] {
  const results: UnitTestResult[] = [];

  // Test 1: Concave mirror at C (u = -30 cm, f = -15 cm)
  {
    const t0 = performance.now();
    const res = solveSphericalMirror({ u: -30, f: -15, mirrorType: 'concave' });
    const vNum = res.numbers.find(n => n.label.includes('Image distance'))?.value;
    const mNum = res.numbers.find(n => n.label.includes('Magnification'))?.value;
    const passed = vNum?.includes('-30.00') && mNum?.includes('-1.00');
    results.push({
      id: 'optics-mirror-c',
      topic: 'Optics: Spherical Mirror',
      name: 'Concave mirror with u = -30 cm, f = -15 cm yields v = -30 cm, m = -1.0',
      passed: Boolean(passed),
      expected: 'v = -30.00 cm, m = -1.00',
      actual: `v = ${vNum}, m = ${mNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 2: Convex mirror (u = -20 cm, f = +20 cm) -> v = +10 cm, m = +0.5
  {
    const t0 = performance.now();
    const res = solveSphericalMirror({ u: -20, f: 20, mirrorType: 'convex' });
    const vNum = res.numbers.find(n => n.label.includes('Image distance'))?.value;
    const mNum = res.numbers.find(n => n.label.includes('Magnification'))?.value;
    const passed = vNum?.includes('+10.00') && mNum?.includes('+0.50');
    results.push({
      id: 'optics-mirror-convex',
      topic: 'Optics: Spherical Mirror',
      name: 'Convex mirror with u = -20 cm, f = +20 cm yields v = +10 cm (Virtual, Erect)',
      passed: Boolean(passed),
      expected: 'v = +10.00 cm, m = +0.50',
      actual: `v = ${vNum}, m = ${mNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 3: Prism minimum deviation (A = 60°, delta_m = 30° => n = √2 ≈ 1.4142)
  {
    const t0 = performance.now();
    const res = solvePrism({ aDeg: 60, deltaMDeg: 30 });
    const nNum = res.numbers.find(n => n.label.includes('Refractive index'))?.value;
    const nVal = parseFloat(nNum || '0');
    const passed = Math.abs(nVal - Math.SQRT2) < 0.002;
    results.push({
      id: 'optics-prism-min-dev',
      topic: 'Optics: Prism',
      name: 'Prism A = 60°, δ_m = 30° solves for n = √2 ≈ 1.414',
      passed,
      expected: 'n = 1.4142',
      actual: `n = ${nNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 4: Refraction Total Internal Reflection (TIR: n1 = 1.5, n2 = 1.0, i = 50°)
  {
    const t0 = performance.now();
    const res = solveRefraction({ n1: 1.5, n2: 1.0, iDeg: 50 });
    const passed = res.impossibleMessage?.includes('Total internal reflection') || res.verdict.includes('Total Internal Reflection');
    results.push({
      id: 'optics-refraction-tir',
      topic: 'Optics: Refraction',
      name: 'Denser to rarer with i (50°) > critical angle (41.81°) triggers TIR flag',
      passed: Boolean(passed),
      expected: 'sin r > 1: Total Internal Reflection triggered',
      actual: res.verdict,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 5: Lens Maker Formula (Equi-convex n = 1.5, R1 = +20 cm, R2 = -20 cm => f = +20 cm, P = +5.0 D)
  {
    const t0 = performance.now();
    const res = solveLens({ lensType: 'convex', nLens: 1.5, nMedium: 1.0, r1: 20, r2: -20, u: -30 });
    const fNum = res.numbers.find(n => n.label.includes('Focal length'))?.value;
    const pNum = res.numbers.find(n => n.label.includes('Power'))?.value;
    const passed = fNum?.includes('+20.00') && pNum?.includes('+5.00');
    results.push({
      id: 'optics-lens-maker',
      topic: 'Optics: Lenses',
      name: "Lens maker: n=1.5, R₁=+20cm, R₂=-20cm yields f = +20cm, P = +5.0 D",
      passed: Boolean(passed),
      expected: 'f = +20.00 cm, P = +5.00 D',
      actual: `f = ${fNum}, P = ${pNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 6: Vectors dot and cross (a = (1, 2, 3), b = (4, 5, 6))
  {
    const t0 = performance.now();
    const res = solveVectorOperations({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
    const dotNum = res.numbers.find(n => n.label === 'a · b')?.value;
    const passed = dotNum === '32.00';
    results.push({
      id: 'vectors-dot-cross',
      topic: 'Vectors: Dot & Cross',
      name: 'Vectors (1,2,3) and (4,5,6) dot product equals 32.00',
      passed,
      expected: 'a · b = 32.00',
      actual: `a · b = ${dotNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 7: Vectors coplanarity via Scalar Triple Product ([a b c] = 0)
  {
    const t0 = performance.now();
    const res = solveVectorOperations(
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 }
    );
    const coplanar = res.numbers.find(n => n.label === 'Coplanarity')?.value;
    const passed = coplanar?.includes('YES');
    results.push({
      id: 'vectors-coplanar',
      topic: 'Vectors: Triple Products',
      name: 'Coplanar vectors in xy-plane satisfy [a b c] = 0',
      passed: Boolean(passed),
      expected: 'Coplanar = YES',
      actual: `Coplanar = ${coplanar}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 8: Point to Plane distance & Foot (P(0, 0, 4) to z = 0 => Foot = (0, 0, 0), Image = (0, 0, -4))
  {
    const t0 = performance.now();
    const res = solvePointAndPlane(
      { x: 0, y: 0, z: 4 },
      { a: 0, b: 0, c: 1, d: 0 } // z = 0
    );
    const foot = res.numbers.find(n => n.label.includes('Foot'))?.value;
    const img = res.numbers.find(n => n.label.includes('Image'))?.value;
    const passed = foot?.includes('(0.00, 0.00, 0.00)') && img?.includes('(0.00, 0.00, -4.00)');
    results.push({
      id: '3d-point-plane',
      topic: '3D Geometry: Plane',
      name: 'Point (0, 0, 4) reflected across z = 0 yields image at (0, 0, -4)',
      passed: Boolean(passed),
      expected: 'Foot = (0, 0, 0), Image = (0, 0, -4)',
      actual: `Foot = ${foot}, Image = ${img}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 9: Parabola y^2 = 16x (a = 4 => focus (4,0), LR = 16)
  {
    const t0 = performance.now();
    const res = solveConic('parabola', 4);
    const focus = res.numbers.find(n => n.label.includes('Focus'))?.value;
    const lr = res.numbers.find(n => n.label.includes('Latus Rectum'))?.value;
    const passed = focus === '(4, 0)' && lr === '16';
    results.push({
      id: 'conics-parabola',
      topic: 'Coordinate Geometry: Parabola',
      name: 'Parabola y² = 16x has focus (4, 0) and latus rectum 16',
      passed: Boolean(passed),
      expected: 'Focus = (4, 0), LR = 16',
      actual: `Focus = ${focus}, LR = ${lr}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  // Test 10: Ellipse standard eccentricity (a = 5, b = 4 => e = 0.60)
  {
    const t0 = performance.now();
    const res = solveConic('ellipse', 5, 4);
    const eNum = res.numbers.find(n => n.label.includes('Eccentricity'))?.value;
    const passed = eNum?.includes('0.600');
    results.push({
      id: 'conics-ellipse',
      topic: 'Coordinate Geometry: Ellipse',
      name: 'Ellipse x²/25 + y²/16 = 1 yields eccentricity e = 0.600',
      passed: Boolean(passed),
      expected: 'e = 0.600',
      actual: `e = ${eNum}`,
      timeMs: Number((performance.now() - t0).toFixed(2)),
    });
  }

  return results;
}
