import { formatSigned, formatNumber, Vector3D, vAdd, vSub, vDot, vCross, vMag, vAngleDeg, vProjection, vScalarTriple, vVectorTriple, formatVector, PlaneEquation, Line3D, pointToPlaneDistance, footOfPerpendicularPlane, imageOfPointPlane, pointToLineDistance, skewLinesDistance, Line2D, pointToLine2DDistance, angleBetween2DLines } from './math';
import { SolverResult } from '../types';

// ==========================================
// LAB 1: OPTICS SOLVERS
// ==========================================

export interface SphericalMirrorInput {
  u?: number; // object distance (cm)
  v?: number; // image distance (cm)
  f?: number; // focal length (cm)
  mirrorType: 'concave' | 'convex';
}

export function solveSphericalMirror(input: SphericalMirrorInput): SolverResult {
  const { mirrorType } = input;
  let { u, v, f } = input;

  // Sign convention check
  // For concave mirror: f must be negative
  // For convex mirror: f must be positive
  if (f !== undefined) {
    if (mirrorType === 'concave' && f > 0) f = -f;
    if (mirrorType === 'convex' && f < 0) f = Math.abs(f);
  }

  // Object u is in front of reflecting surface (against incident rays), so u is negative
  if (u !== undefined && u > 0) {
    u = -u; // Enforce standard NCERT real object convention
  }

  const steps = [];
  const numbers = [];

  // Case 1: Given u and f, find v
  if (u !== undefined && f !== undefined) {
    if (u === 0) {
      return {
        success: false,
        verdict: 'Impossible: Object cannot be positioned at the mirror pole (u = 0).',
        steps: [],
        numbers: [],
        impossibleMessage: 'Object is at the pole. Optical rays cannot form a standard geometric image.',
      };
    }

    if (Math.abs(u - f) < 1e-5) {
      return {
        success: true,
        verdict: 'Object is at principal focus (u = f). Image is formed at INFINITY (v = ±∞).',
        steps: [
          {
            title: 'Mirror Formula',
            formula: '1/v + 1/u = 1/f  ⟹  1/v = 1/f - 1/u',
            substitution: `1/v = 1/(${formatSigned(f)}) - 1/(${formatSigned(u)}) = 0`,
            result: 'v = ±∞ cm',
            note: 'Parallel reflected rays emerge, forming an image at infinity with infinite magnification.',
          },
        ],
        numbers: [
          { label: 'Object distance (u)', value: formatSigned(u, 'cm'), signConvention: 'Negative (against incident light)' },
          { label: 'Focal length (f)', value: formatSigned(f, 'cm'), signConvention: mirrorType === 'concave' ? 'Negative (concave focus in front)' : 'Positive (convex focus behind)' },
          { label: 'Image distance (v)', value: '±∞', signConvention: 'At infinity' },
          { label: 'Magnification (m)', value: '∞', signConvention: 'Highly enlarged' },
        ],
      };
    }

    // 1/v = 1/f - 1/u = (u - f) / (u * f) => v = (u * f) / (u - f)
    const calculatedV = (u * f) / (u - f);
    const m = -calculatedV / u;
    const R = 2 * f;

    const isReal = calculatedV < 0;
    const isInverted = m < 0;
    const isMagnified = Math.abs(m) > 1;

    const natureStr = `${isReal ? 'Real' : 'Virtual'}, ${isInverted ? 'Inverted' : 'Erect'}, ${isMagnified ? 'Magnified' : Math.abs(m) === 1 ? 'Same size' : 'Diminished'}`;

    steps.push({
      title: 'State NCERT Sign Convention',
      formula: 'Incident light travels left to right. Pole is origin (0, 0).',
      substitution: `u = ${formatSigned(u, 'cm')}, f = ${formatSigned(f, 'cm')} (${mirrorType} mirror)`,
      result: `u < 0 always for real object; f ${mirrorType === 'concave' ? '< 0' : '> 0'}.`,
    });

    steps.push({
      title: 'Apply Mirror Formula for v',
      formula: '1/v + 1/u = 1/f  ⟹  v = (u · f) / (u - f)',
      substitution: `v = (${formatSigned(u)} · ${formatSigned(f)}) / (${formatSigned(u)} - (${formatSigned(f)})) = (${(u * f).toFixed(2)}) / (${(u - f).toFixed(2)})`,
      result: `v = ${formatSigned(calculatedV, 'cm')}`,
      note: calculatedV < 0 ? 'Negative v means image is in front of mirror (Real image).' : 'Positive v means image is behind mirror (Virtual image).',
    });

    steps.push({
      title: 'Calculate Transverse Magnification m',
      formula: 'm = -v / u = h_i / h_o',
      substitution: `m = -(${formatSigned(calculatedV)}) / (${formatSigned(u)})`,
      result: `m = ${formatSigned(m)}`,
      note: m < 0 ? 'Negative m confirms inverted image.' : 'Positive m confirms erect image.',
    });

    steps.push({
      title: 'Radius of Curvature R',
      formula: 'R = 2f',
      substitution: `R = 2 · (${formatSigned(f)})`,
      result: `R = ${formatSigned(R, 'cm')}`,
    });

    numbers.push(
      { label: 'Object distance (u)', value: formatSigned(u, 'cm'), signConvention: 'Negative: against incident light' },
      { label: 'Focal length (f)', value: formatSigned(f, 'cm'), signConvention: `${mirrorType === 'concave' ? 'Negative' : 'Positive'}` },
      { label: 'Radius of curvature (R)', value: formatSigned(R, 'cm'), signConvention: 'R = 2f' },
      { label: 'Image distance (v)', value: formatSigned(calculatedV, 'cm'), signConvention: calculatedV < 0 ? 'Negative (in front, Real)' : 'Positive (behind, Virtual)' },
      { label: 'Magnification (m)', value: formatSigned(m), signConvention: m < 0 ? 'Inverted image' : 'Erect image' }
    );

    return {
      success: true,
      verdict: `Image formed at ${formatSigned(calculatedV, 'cm')}. Nature: ${natureStr} (m = ${formatSigned(m)}).`,
      steps,
      numbers,
    };
  }

  // Case 2: Given v and f, find u
  if (v !== undefined && f !== undefined) {
    if (Math.abs(v - f) < 1e-5) {
      return {
        success: false,
        verdict: 'Impossible: Image at focus requires object at infinity.',
        steps: [],
        numbers: [],
        impossibleMessage: 'v = f implies u = ±∞. Cannot solve for finite object distance.',
      };
    }

    const calculatedU = (v * f) / (v - f);
    const m = -v / calculatedU;

    steps.push({
      title: 'Solve Mirror Formula for u',
      formula: '1/u = 1/f - 1/v  ⟹  u = (v · f) / (v - f)',
      substitution: `u = (${formatSigned(v)} · ${formatSigned(f)}) / (${formatSigned(v)} - (${formatSigned(f)}))`,
      result: `u = ${formatSigned(calculatedU, 'cm')}`,
    });

    steps.push({
      title: 'Magnification m',
      formula: 'm = -v / u',
      substitution: `m = -(${formatSigned(v)}) / (${formatSigned(calculatedU)})`,
      result: `m = ${formatSigned(m)}`,
    });

    numbers.push(
      { label: 'Image distance (v)', value: formatSigned(v, 'cm'), signConvention: 'Given' },
      { label: 'Focal length (f)', value: formatSigned(f, 'cm'), signConvention: 'Given' },
      { label: 'Object distance (u)', value: formatSigned(calculatedU, 'cm'), signConvention: 'Calculated' },
      { label: 'Magnification (m)', value: formatSigned(m), signConvention: 'Calculated' }
    );

    return {
      success: true,
      verdict: `Object must be placed at ${formatSigned(calculatedU, 'cm')} from pole. Magnification m = ${formatSigned(m)}.`,
      steps,
      numbers,
    };
  }

  // Case 3: Given u and v, find f
  if (u !== undefined && v !== undefined) {
    if (u + v === 0) {
      return {
        success: false,
        verdict: 'Impossible: u + v = 0 implies 1/f = 0 (Plane mirror limit, f = ∞).',
        steps: [],
        numbers: [],
        impossibleMessage: 'u = -v corresponds to a plane mirror (infinite focal length, R = ∞).',
      };
    }

    const calculatedF = (u * v) / (u + v);
    const m = -v / u;
    const R = 2 * calculatedF;

    steps.push({
      title: 'Calculate Focal Length f',
      formula: '1/f = 1/v + 1/u  ⟹  f = (u · v) / (u + v)',
      substitution: `f = (${formatSigned(u)} · ${formatSigned(v)}) / (${formatSigned(u)} + (${formatSigned(v)}))`,
      result: `f = ${formatSigned(calculatedF, 'cm')}`,
    });

    numbers.push(
      { label: 'Object distance (u)', value: formatSigned(u, 'cm') },
      { label: 'Image distance (v)', value: formatSigned(v, 'cm') },
      { label: 'Focal length (f)', value: formatSigned(calculatedF, 'cm'), signConvention: calculatedF < 0 ? 'Concave mirror' : 'Convex mirror' },
      { label: 'Radius of curvature (R)', value: formatSigned(R, 'cm') },
      { label: 'Magnification (m)', value: formatSigned(m) }
    );

    return {
      success: true,
      verdict: `Mirror focal length is ${formatSigned(calculatedF, 'cm')} (${calculatedF < 0 ? 'Concave' : 'Convex'} mirror, R = ${formatSigned(R, 'cm')}).`,
      steps,
      numbers,
    };
  }

  return {
    success: false,
    verdict: 'Insufficient parameters provided.',
    steps: [],
    numbers: [],
    impossibleMessage: 'Please provide at least 2 of: u, v, f.',
  };
}

// ----------------- REFRACTION SOLVER -----------------

export interface RefractionInput {
  n1: number; // medium 1 index
  n2: number; // medium 2 index
  iDeg: number; // angle of incidence in degrees
  thicknessCm?: number; // for slab lateral shift
  realDepthCm?: number; // for apparent depth
}

export function solveRefraction(input: RefractionInput): SolverResult {
  const { n1, n2, iDeg, thicknessCm = 10, realDepthCm = 12 } = input;

  if (n1 <= 0 || n2 <= 0) {
    return {
      success: false,
      verdict: 'Impossible: Refractive index must be strictly positive (n > 0).',
      steps: [],
      numbers: [],
      impossibleMessage: 'Physical refractive index must be positive.',
    };
  }

  const iRad = (iDeg * Math.PI) / 180;
  const sinI = Math.sin(iRad);
  const sinR = (n1 * sinI) / n2;

  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  // Critical angle check (only if n1 > n2)
  let criticalAngleDeg: number | null = null;
  if (n1 > n2) {
    criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
  }

  // Brewster's angle
  const brewsterAngleDeg = (Math.atan(n2 / n1) * 180) / Math.PI;

  steps.push({
    title: "Snell's Law of Refraction",
    formula: 'n₁ · sin(i) = n₂ · sin(r)  ⟹  sin(r) = (n₁ / n₂) · sin(i)',
    substitution: `sin(r) = (${n1.toFixed(3)} / ${n2.toFixed(3)}) · sin(${iDeg.toFixed(1)}°) = ${(n1 / n2).toFixed(3)} · ${sinI.toFixed(4)}`,
    result: `sin(r) = ${sinR.toFixed(4)}`,
  });

  if (sinR > 1.0) {
    // Total Internal Reflection (TIR)
    const msg = `sin r = ${sinR.toFixed(3)} > 1: TOTAL INTERNAL REFLECTION (TIR) occurs!`;
    steps.push({
      title: 'TIR Condition Triggered',
      formula: 'i > θ_c where sin(θ_c) = n₂ / n₁',
      substitution: `sin(θ_c) = ${n2.toFixed(3)} / ${n1.toFixed(3)} = ${(n2 / n1).toFixed(4)}  ⟹  θ_c = ${criticalAngleDeg?.toFixed(2)}°`,
      result: `i = ${iDeg.toFixed(1)}° > θ_c (${criticalAngleDeg?.toFixed(2)}°). 100% of light is reflected back into medium 1.`,
      note: 'No refracted light transmits into medium 2. The boundary behaves as a perfect mirror (angle of reflection = i).',
    });

    numbers.push(
      { label: 'Medium 1 index (n₁)', value: n1.toFixed(3) },
      { label: 'Medium 2 index (n₂)', value: n2.toFixed(3) },
      { label: 'Incident angle (i)', value: `${iDeg.toFixed(1)}°` },
      { label: 'Critical angle (θ_c)', value: criticalAngleDeg ? `${criticalAngleDeg.toFixed(2)}°` : 'N/A' },
      { label: 'Phenomenon', value: 'TOTAL INTERNAL REFLECTION' }
    );

    return {
      success: true,
      verdict: `sin r > 1: Total Internal Reflection occurs! Incident angle (${iDeg.toFixed(1)}°) exceeds critical angle (${criticalAngleDeg?.toFixed(1)}°).`,
      steps,
      numbers,
      impossibleMessage: 'sin r > 1: Total internal reflection. No refracted ray exists in medium 2.',
    };
  }

  const rRad = Math.asin(sinR);
  const rDeg = (rRad * 180) / Math.PI;
  const deviationDeg = Math.abs(iDeg - rDeg);

  // Apparent depth when viewed from medium 2 into medium 1 (observer in n2, object in n1):
  // d' = d * (n2 / n1) for normal incidence
  const apparentDepth = realDepthCm * (n2 / n1);

  // Lateral shift in parallel glass slab of thickness t:
  // delta_x = t * sin(i - r) / cos(r)
  const lateralShift = thicknessCm * (Math.sin(iRad - rRad) / Math.cos(rRad));

  steps.push({
    title: 'Calculate Angle of Refraction r',
    formula: 'r = arcsin(sin r)',
    substitution: `r = arcsin(${sinR.toFixed(4)})`,
    result: `r = ${rDeg.toFixed(2)}° (Deviation δ = |i - r| = ${deviationDeg.toFixed(2)}°)`,
    note: n1 < n2 ? 'Ray bends TOWARDS the normal (rarer to denser).' : 'Ray bends AWAY from the normal (denser to rarer).',
  });

  steps.push({
    title: 'Lateral Shift in Parallel Slab (Thickness t)',
    formula: 'd_lat = t · sin(i - r) / cos(r)',
    substitution: `d_lat = ${thicknessCm} · sin(${deviationDeg.toFixed(2)}°) / cos(${rDeg.toFixed(2)}°)`,
    result: `Lateral shift = ${lateralShift.toFixed(3)} cm`,
  });

  steps.push({
    title: 'Apparent Depth (Normal Incidence)',
    formula: "d' = d_real · (n_observer / n_object)",
    substitution: `d' = ${realDepthCm} · (${n2.toFixed(2)} / ${n1.toFixed(2)})`,
    result: `Apparent depth = ${apparentDepth.toFixed(2)} cm (Shift = ${Math.abs(realDepthCm - apparentDepth).toFixed(2)} cm)`,
  });

  steps.push({
    title: "Brewster's Polarization Angle",
    formula: 'tan(θ_p) = n₂ / n₁',
    substitution: `tan(θ_p) = ${n2.toFixed(3)} / ${n1.toFixed(3)} = ${(n2 / n1).toFixed(4)}`,
    result: `θ_p = ${brewsterAngleDeg.toFixed(2)}°`,
    note: 'At Brewster angle, reflected ray is completely plane polarized perpendicular to plane of incidence, and reflected ray is perpendicular to refracted ray (r + θ_p = 90°).',
  });

  numbers.push(
    { label: 'Medium 1 index (n₁)', value: n1.toFixed(3) },
    { label: 'Medium 2 index (n₂)', value: n2.toFixed(3) },
    { label: 'Incident angle (i)', value: `${iDeg.toFixed(1)}°` },
    { label: 'Refracted angle (r)', value: `${rDeg.toFixed(2)}°` },
    { label: 'Deviation (δ)', value: `${deviationDeg.toFixed(2)}°` },
    { label: 'Critical angle (θ_c)', value: criticalAngleDeg ? `${criticalAngleDeg.toFixed(2)}°` : 'None (n₁ < n₂)' },
    { label: "Brewster's angle (θ_p)", value: `${brewsterAngleDeg.toFixed(2)}°` },
    { label: 'Lateral shift in slab', value: `${lateralShift.toFixed(2)} cm` },
    { label: 'Apparent depth', value: `${apparentDepth.toFixed(2)} cm` }
  );

  return {
    success: true,
    verdict: `Refracted ray at r = ${rDeg.toFixed(1)}°. ${n1 < n2 ? 'Bends towards normal' : 'Bends away from normal'}. Lateral shift = ${lateralShift.toFixed(2)} cm.`,
    steps,
    numbers,
  };
}

// ----------------- LENSES SOLVER -----------------

export interface LensInput {
  u?: number; // cm
  v?: number; // cm
  f?: number; // cm
  lensType: 'convex' | 'concave';
  nLens?: number; // for lens maker's
  nMedium?: number;
  r1?: number; // cm
  r2?: number; // cm
}

export function solveLens(input: LensInput): SolverResult {
  const { lensType, nLens = 1.5, nMedium = 1.0, r1, r2 } = input;
  let { u, v, f } = input;

  // Enforce NCERT lens focal length signs
  // Convex lens: f > 0
  // Concave lens: f < 0
  if (f !== undefined) {
    if (lensType === 'convex' && f < 0) f = Math.abs(f);
    if (lensType === 'concave' && f > 0) f = -f;
  }

  // Object u in front of lens is negative
  if (u !== undefined && u > 0) {
    u = -u;
  }

  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  // If Lens Maker's parameters are given
  if (r1 !== undefined && r2 !== undefined) {
    // 1/f = (n_l/n_m - 1) * (1/R1 - 1/R2)
    const relN = nLens / nMedium;
    const curvatureFactor = (1 / r1) - (1 / r2);
    if (Math.abs(curvatureFactor) < 1e-6) {
      return {
        success: false,
        verdict: 'Impossible: 1/R1 - 1/R2 = 0 implies 1/f = 0 (Zero optical power, plane plate).',
        steps: [],
        numbers: [],
        impossibleMessage: 'Concentric radii (R1 = R2) creates a flat plate with infinite focal length (P = 0 D).',
      };
    }

    const calculatedF = 1 / ((relN - 1) * curvatureFactor);
    const powerD = 100 / calculatedF; // since f is in cm

    steps.push({
      title: "Lens Maker's Formula",
      formula: '1/f = (n_lens/n_med - 1) · (1/R₁ - 1/R₂)',
      substitution: `1/f = (${nLens.toFixed(2)}/${nMedium.toFixed(2)} - 1) · (1/(${formatSigned(r1)}) - 1/(${formatSigned(r2)}))`,
      result: `f = ${formatSigned(calculatedF, 'cm')}, Power P = ${formatSigned(powerD, 'D')}`,
      note: calculatedF > 0 ? 'Positive focal length ⟹ Converging (Convex) lens.' : 'Negative focal length ⟹ Diverging (Concave) lens.',
    });

    f = calculatedF;
  }

  if (u !== undefined && f !== undefined) {
    // 1/v - 1/u = 1/f => 1/v = 1/f + 1/u = (u + f) / (u * f) => v = (u * f) / (u + f)
    if (Math.abs(u + f) < 1e-5) {
      return {
        success: true,
        verdict: 'Object is at first focus (u = -f). Refracted rays emerge parallel, image at INFINITY (v = ±∞).',
        steps: [
          {
            title: 'Thin Lens Formula',
            formula: '1/v - 1/u = 1/f  ⟹  1/v = 1/f + 1/u',
            substitution: `1/v = 1/(${formatSigned(f)}) + 1/(${formatSigned(u)}) = 0`,
            result: 'v = ±∞ cm',
            note: 'Parallel beam produced.',
          },
        ],
        numbers: [
          { label: 'Object distance (u)', value: formatSigned(u, 'cm') },
          { label: 'Focal length (f)', value: formatSigned(f, 'cm') },
          { label: 'Image distance (v)', value: '±∞' },
          { label: 'Magnification (m)', value: '∞' },
        ],
      };
    }

    const calculatedV = (u * f) / (u + f);
    const m = calculatedV / u;
    const powerD = 100 / f;

    const isReal = calculatedV > 0;
    const isInverted = m < 0;
    const isMagnified = Math.abs(m) > 1;
    const nature = `${isReal ? 'Real' : 'Virtual'}, ${isInverted ? 'Inverted' : 'Erect'}, ${isMagnified ? 'Magnified' : Math.abs(m) === 1 ? 'Same size' : 'Diminished'}`;

    steps.push({
      title: 'Apply Thin Lens Formula for v',
      formula: '1/v - 1/u = 1/f  ⟹  v = (u · f) / (u + f)',
      substitution: `v = (${formatSigned(u)} · ${formatSigned(f)}) / (${formatSigned(u)} + ${formatSigned(f)}) = (${(u * f).toFixed(2)}) / (${(u + f).toFixed(2)})`,
      result: `v = ${formatSigned(calculatedV, 'cm')}`,
      note: calculatedV > 0 ? 'Positive v means image is on other side of lens (Real image).' : 'Negative v means image is on same side as object (Virtual image).',
    });

    steps.push({
      title: 'Transverse Magnification m',
      formula: 'm = v / u = h_i / h_o',
      substitution: `m = (${formatSigned(calculatedV)}) / (${formatSigned(u)})`,
      result: `m = ${formatSigned(m)}`,
    });

    steps.push({
      title: 'Optical Power in Dioptres',
      formula: 'P = 100 / f(cm)  [D]',
      substitution: `P = 100 / (${formatSigned(f)})`,
      result: `P = ${formatSigned(powerD, 'D')}`,
    });

    numbers.push(
      { label: 'Object distance (u)', value: formatSigned(u, 'cm'), signConvention: 'Negative (in front of lens)' },
      { label: 'Focal length (f)', value: formatSigned(f, 'cm'), signConvention: lensType === 'convex' ? 'Positive (converging)' : 'Negative (diverging)' },
      { label: 'Image distance (v)', value: formatSigned(calculatedV, 'cm'), signConvention: calculatedV > 0 ? 'Positive (Real, opposite side)' : 'Negative (Virtual, same side)' },
      { label: 'Magnification (m)', value: formatSigned(m), signConvention: m < 0 ? 'Inverted' : 'Erect' },
      { label: 'Power (P)', value: formatSigned(powerD, 'D') }
    );

    return {
      success: true,
      verdict: `Image at ${formatSigned(calculatedV, 'cm')}. Nature: ${nature} (m = ${formatSigned(m)}, P = ${formatSigned(powerD, 'D')}).`,
      steps,
      numbers,
    };
  }

  return {
    success: false,
    verdict: 'Insufficient parameters provided.',
    steps: [],
    numbers: [],
    impossibleMessage: 'Please provide at least 2 of: u, v, f (or Lens Maker radii).',
  };
}

// ----------------- PRISM SOLVER -----------------

export interface PrismInput {
  aDeg: number; // Prism angle A
  n?: number; // Refractive index of prism
  iDeg?: number; // Angle of incidence
  deltaMDeg?: number; // Minimum deviation
}

export function solvePrism(input: PrismInput): SolverResult {
  const { aDeg, n, iDeg, deltaMDeg } = input;
  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  // Case 1: Given A and delta_m, find n
  if (deltaMDeg !== undefined) {
    if (aDeg <= 0 || aDeg >= 180) {
      return {
        success: false,
        verdict: 'Impossible: Prism apex angle A must be between 0° and 180°.',
        steps: [],
        numbers: [],
        impossibleMessage: 'Geometric angle must satisfy 0° < A < 180°.',
      };
    }

    const aRad = (aDeg * Math.PI) / 180;
    const dmRad = (deltaMDeg * Math.PI) / 180;

    const num = Math.sin((aRad + dmRad) / 2);
    const den = Math.sin(aRad / 2);

    if (den === 0) {
      return {
        success: false,
        verdict: 'Impossible: sin(A/2) is zero.',
        steps: [],
        numbers: [],
      };
    }

    const calculatedN = num / den;
    const criticalAngleDeg = (Math.asin(1 / calculatedN) * 180) / Math.PI;

    steps.push({
      title: 'Prism Formula for Minimum Deviation',
      formula: 'n = sin((A + δ_m) / 2) / sin(A / 2)',
      substitution: `n = sin((${aDeg}° + ${deltaMDeg}°) / 2) / sin(${aDeg}° / 2) = sin(${((aDeg + deltaMDeg) / 2).toFixed(2)}°) / sin(${(aDeg / 2).toFixed(2)}°)`,
      result: `n = ${num.toFixed(4)} / ${den.toFixed(4)} = ${calculatedN.toFixed(4)}`,
      note: 'At minimum deviation: i = e, and ray inside prism travels symmetric and parallel to base (r₁ = r₂ = A/2).',
    });

    steps.push({
      title: 'Critical Angle for this Prism',
      formula: 'sin(θ_c) = 1 / n',
      substitution: `sin(θ_c) = 1 / ${calculatedN.toFixed(4)}`,
      result: `θ_c = ${criticalAngleDeg.toFixed(2)}°`,
    });

    numbers.push(
      { label: 'Prism apex angle (A)', value: `${aDeg.toFixed(1)}°` },
      { label: 'Minimum deviation (δ_m)', value: `${deltaMDeg.toFixed(1)}°` },
      { label: 'Refractive index (n)', value: calculatedN.toFixed(4) },
      { label: 'Internal angle at δ_m (r₁ = r₂)', value: `${(aDeg / 2).toFixed(2)}°` },
      { label: 'Critical angle (θ_c)', value: `${criticalAngleDeg.toFixed(2)}°` }
    );

    return {
      success: true,
      verdict: `Refractive index of prism is n = ${calculatedN.toFixed(3)} (θ_c = ${criticalAngleDeg.toFixed(1)}°).`,
      steps,
      numbers,
    };
  }

  // Case 2: Given A, n, and i, trace rays and find deviation
  if (n !== undefined && iDeg !== undefined) {
    const aRad = (aDeg * Math.PI) / 180;
    const iRad = (iDeg * Math.PI) / 180;

    // Refraction at first face: 1 * sin(i) = n * sin(r1)
    const sinR1 = Math.sin(iRad) / n;
    if (sinR1 > 1) {
      return {
        success: false,
        verdict: 'Impossible: sin r₁ > 1. Total internal reflection at first face!',
        steps: [],
        numbers: [],
        impossibleMessage: 'Light cannot enter prism face.',
      };
    }

    const r1Rad = Math.asin(sinR1);
    const r1Deg = (r1Rad * 180) / Math.PI;

    // Relation: r1 + r2 = A => r2 = A - r1
    const r2Deg = aDeg - r1Deg;
    const r2Rad = (r2Deg * Math.PI) / 180;

    const criticalAngleDeg = (Math.asin(1 / n) * 180) / Math.PI;

    steps.push({
      title: 'Refraction at First Face (Air ⟹ Prism)',
      formula: 'sin(r₁) = sin(i) / n',
      substitution: `sin(r₁) = sin(${iDeg}°) / ${n.toFixed(3)} = ${Math.sin(iRad).toFixed(4)} / ${n.toFixed(3)} = ${sinR1.toFixed(4)}`,
      result: `r₁ = ${r1Deg.toFixed(2)}°`,
    });

    steps.push({
      title: 'Angle of Incidence on Second Face (r₂)',
      formula: 'r₁ + r₂ = A  ⟹  r₂ = A - r₁',
      substitution: `r₂ = ${aDeg}° - ${r1Deg.toFixed(2)}°`,
      result: `r₂ = ${r2Deg.toFixed(2)}°`,
    });

    // Refraction at second face: n * sin(r2) = 1 * sin(e)
    const sinE = n * Math.sin(r2Rad);

    if (sinE > 1.0) {
      steps.push({
        title: 'TIR at Second Face',
        formula: 'sin(e) = n · sin(r₂) > 1',
        substitution: `sin(e) = ${n.toFixed(3)} · sin(${r2Deg.toFixed(2)}°) = ${sinE.toFixed(4)} > 1`,
        result: `TIR occurs at second face! r₂ (${r2Deg.toFixed(2)}°) > θ_c (${criticalAngleDeg.toFixed(2)}°).`,
        note: 'The ray cannot emerge from the second face. It undergoes Total Internal Reflection inside the prism.',
      });

      numbers.push(
        { label: 'Prism angle (A)', value: `${aDeg.toFixed(1)}°` },
        { label: 'Refractive index (n)', value: n.toFixed(3) },
        { label: 'Angle of incidence (i)', value: `${iDeg.toFixed(1)}°` },
        { label: 'Internal angle r₁', value: `${r1Deg.toFixed(2)}°` },
        { label: 'Internal angle r₂', value: `${r2Deg.toFixed(2)}°` },
        { label: 'Critical angle θ_c', value: `${criticalAngleDeg.toFixed(2)}°` },
        { label: 'Status', value: 'TOTAL INTERNAL REFLECTION AT 2ND FACE' }
      );

      return {
        success: true,
        verdict: `TIR occurs at second face because r₂ (${r2Deg.toFixed(1)}°) > θ_c (${criticalAngleDeg.toFixed(1)}°). No emergent ray.`,
        steps,
        numbers,
        impossibleMessage: 'sin e > 1: Total internal reflection at second face of prism.',
      };
    }

    const eRad = Math.asin(sinE);
    const eDeg = (eRad * 180) / Math.PI;

    // Total deviation: delta = i + e - A
    const deltaDeg = iDeg + eDeg - aDeg;

    // Minimum deviation for this prism
    const minDevDeg = (2 * Math.asin(n * Math.sin(aRad / 2)) * 180) / Math.PI - aDeg;

    steps.push({
      title: 'Emergence Angle e at Second Face',
      formula: 'sin(e) = n · sin(r₂)',
      substitution: `sin(e) = ${n.toFixed(3)} · sin(${r2Deg.toFixed(2)}°) = ${sinE.toFixed(4)}`,
      result: `e = ${eDeg.toFixed(2)}°`,
    });

    steps.push({
      title: 'Total Deviation Angle δ',
      formula: 'δ = i + e - A',
      substitution: `δ = ${iDeg.toFixed(1)}° + ${eDeg.toFixed(2)}° - ${aDeg}°`,
      result: `δ = ${deltaDeg.toFixed(2)}°`,
    });

    steps.push({
      title: 'Minimum Deviation for Reference',
      formula: 'δ_m = 2 · arcsin(n · sin(A / 2)) - A',
      substitution: `δ_m = 2 · arcsin(${n.toFixed(3)} · sin(${aDeg / 2}°)) - ${aDeg}°`,
      result: `δ_m = ${minDevDeg.toFixed(2)}° (Achieved when i = e = ${((minDevDeg + aDeg) / 2).toFixed(2)}°)`,
    });

    numbers.push(
      { label: 'Prism angle (A)', value: `${aDeg.toFixed(1)}°` },
      { label: 'Refractive index (n)', value: n.toFixed(3) },
      { label: 'Incidence (i)', value: `${iDeg.toFixed(1)}°` },
      { label: 'r₁', value: `${r1Deg.toFixed(2)}°` },
      { label: 'r₂', value: `${r2Deg.toFixed(2)}°` },
      { label: 'Emergence (e)', value: `${eDeg.toFixed(2)}°` },
      { label: 'Deviation (δ)', value: `${deltaDeg.toFixed(2)}°` },
      { label: 'Min Deviation (δ_m)', value: `${minDevDeg.toFixed(2)}°` }
    );

    return {
      success: true,
      verdict: `Ray emerges at e = ${eDeg.toFixed(1)}° with deviation δ = ${deltaDeg.toFixed(1)}° (Min deviation possible = ${minDevDeg.toFixed(1)}°).`,
      steps,
      numbers,
    };
  }

  return {
    success: false,
    verdict: 'Insufficient parameters.',
    steps: [],
    numbers: [],
    impossibleMessage: 'Provide either (A, δ_m) to find n, or (A, n, i) to trace deviation.',
  };
}

// ==========================================
// LAB 2: VECTORS & 3D GEOMETRY SOLVERS
// ==========================================

export function solveVectorOperations(a: Vector3D, b: Vector3D, c?: Vector3D): SolverResult {
  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  const magA = vMag(a);
  const magB = vMag(b);
  const sum = vAdd(a, b);
  const diff = vSub(a, b);
  const dot = vDot(a, b);
  const cross = vCross(a, b);
  const magCross = vMag(cross);
  const angle = vAngleDeg(a, b);
  const projAonB = vProjection(a, b);

  steps.push({
    title: 'Vector Magnitudes & Sum',
    formula: '|a| = √(x² + y² + z²),  a + b = (x₁+x₂)î + (y₁+y₂)ĵ + (z₁+z₂)k̂',
    substitution: `|a| = √(${a.x}² + ${a.y}² + ${a.z}²) = ${magA.toFixed(3)}, |b| = ${magB.toFixed(3)}`,
    result: `a + b = (${sum.x})î + (${sum.y})ĵ + (${sum.z})k̂`,
  });

  steps.push({
    title: 'Dot (Scalar) Product',
    formula: 'a · b = a_x b_x + a_y b_y + a_z b_z = |a||b| cos(θ)',
    substitution: `a · b = (${a.x})(${b.x}) + (${a.y})(${b.y}) + (${a.z})(${b.z})`,
    result: `a · b = ${dot.toFixed(2)}  ⟹  Angle θ = ${angle.toFixed(2)}°`,
    note: dot === 0 ? 'Vectors are orthogonal (perpendicular).' : undefined,
  });

  steps.push({
    title: 'Cross (Vector) Product',
    formula: 'a × b = det | î ĵ k̂ ; a_x a_y a_z ; b_x b_y b_z |',
    substitution: `a × b = (${a.y}·${b.z} - ${a.z}·${b.y})î - (${a.x}·${b.z} - ${a.z}·${b.x})ĵ + (${a.x}·${b.y} - ${a.y}·${b.x})k̂`,
    result: `a × b = (${cross.x})î + (${cross.y})ĵ + (${cross.z})k̂  (|a × b| = ${magCross.toFixed(3)})`,
    note: '|a × b| equals the area of the parallelogram formed by a and b.',
  });

  steps.push({
    title: 'Projection of a on b',
    formula: 'proj_b(a) = (a · b) / |b|',
    substitution: `(${dot.toFixed(2)}) / ${magB.toFixed(3)}`,
    result: `Projection = ${projAonB.toFixed(3)}`,
  });

  if (c) {
    const stp = vScalarTriple(a, b, c);
    const vtp = vVectorTriple(a, b, c);
    const isCoplanar = Math.abs(stp) < 1e-4;

    steps.push({
      title: 'Scalar Triple Product [a b c] (Volume of Parallelepiped)',
      formula: '[a b c] = a · (b × c) = det | a ; b ; c |',
      substitution: `a · (${cross.x}î + ${cross.y}ĵ + ${cross.z}k̂)`,
      result: `[a b c] = ${stp.toFixed(3)} (Volume = ${Math.abs(stp).toFixed(3)})`,
      note: isCoplanar ? 'Vectors a, b, c are COPLANAR since [a b c] = 0.' : 'Vectors a, b, c are NON-COPLANAR.',
    });

    steps.push({
      title: 'Vector Triple Product a × (b × c)',
      formula: 'a × (b × c) = (a · c)b - (a · b)c  [BAC-CAB Rule]',
      substitution: `(${vDot(a, c).toFixed(2)})b - (${dot.toFixed(2)})c`,
      result: `a × (b × c) = (${vtp.x.toFixed(2)})î + (${vtp.y.toFixed(2)})ĵ + (${vtp.z.toFixed(2)})k̂`,
    });

    numbers.push(
      { label: '[a b c]', value: stp.toFixed(3) },
      { label: 'Coplanarity', value: isCoplanar ? 'YES (Coplanar)' : 'NO' }
    );
  }

  numbers.push(
    { label: '|a|', value: magA.toFixed(3) },
    { label: '|b|', value: magB.toFixed(3) },
    { label: 'a · b', value: dot.toFixed(2) },
    { label: '|a × b|', value: magCross.toFixed(3) },
    { label: 'Angle θ', value: `${angle.toFixed(2)}°` },
    { label: 'Projection of a on b', value: projAonB.toFixed(3) }
  );

  return {
    success: true,
    verdict: `a · b = ${dot.toFixed(2)}, |a × b| = ${magCross.toFixed(2)}, Angle θ = ${angle.toFixed(1)}°.`,
    steps,
    numbers,
  };
}

export function solvePointAndPlane(p: Vector3D, plane: PlaneEquation): SolverResult {
  const { a, b, c, d } = plane;
  const dist = pointToPlaneDistance(p, plane);
  const foot = footOfPerpendicularPlane(p, plane);
  const img = imageOfPointPlane(p, plane);

  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  steps.push({
    title: 'Perpendicular Distance from Point to Plane',
    formula: 'd = |a x₀ + b y₀ + c z₀ - d| / √(a² + b² + c²)',
    substitution: `d = |(${a})(${p.x}) + (${b})(${p.y}) + (${c})(${p.z}) - (${d})| / √(${a}² + ${b}² + ${c}²)`,
    result: `Distance = ${dist.toFixed(3)} units`,
  });

  steps.push({
    title: 'Foot of Perpendicular on Plane',
    formula: '(x - x₀)/a = (y - y₀)/b = (z - z₀)/c = -(a x₀ + b y₀ + c z₀ - d) / (a² + b² + c²)',
    substitution: `k = -(${a * p.x + b * p.y + c * p.z - d}) / (${a * a + b * b + c * c})`,
    result: `Foot = (${foot.x.toFixed(2)}, ${foot.y.toFixed(2)}, ${foot.z.toFixed(2)})`,
  });

  steps.push({
    title: 'Image of Point in Plane',
    formula: '(x - x₀)/a = (y - y₀)/b = (z - z₀)/c = -2(a x₀ + b y₀ + c z₀ - d) / (a² + b² + c²)',
    substitution: `k_img = 2 · k`,
    result: `Image = (${img.x.toFixed(2)}, ${img.y.toFixed(2)}, ${img.z.toFixed(2)})`,
    note: 'The foot is the exact midpoint between the original point and its image.',
  });

  numbers.push(
    { label: 'Point P', value: `(${p.x}, ${p.y}, ${p.z})` },
    { label: 'Plane', value: `${a}x + ${b}y + ${c}z = ${d}` },
    { label: 'Perpendicular Distance', value: dist.toFixed(3) },
    { label: 'Foot of Perpendicular', value: `(${foot.x.toFixed(2)}, ${foot.y.toFixed(2)}, ${foot.z.toFixed(2)})` },
    { label: 'Image Point', value: `(${img.x.toFixed(2)}, ${img.y.toFixed(2)}, ${img.z.toFixed(2)})` }
  );

  return {
    success: true,
    verdict: `Distance = ${dist.toFixed(2)} units. Foot at (${foot.x.toFixed(1)}, ${foot.y.toFixed(1)}, ${foot.z.toFixed(1)}), Image at (${img.x.toFixed(1)}, ${img.y.toFixed(1)}, ${img.z.toFixed(1)}).`,
    steps,
    numbers,
  };
}

export function solveSkewLines(l1: Line3D, l2: Line3D): SolverResult {
  const result = skewLinesDistance(l1, l2);
  const b1xb2 = vCross(l1.d, l2.d);
  const a2_a1 = vSub(l2.p, l1.p);

  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  if (result.isParallel) {
    steps.push({
      title: 'Lines are Parallel (b₁ × b₂ = 0)',
      formula: 'd = |(a₂ - a₁) × b₁| / |b₁|',
      substitution: `|((${a2_a1.x})î + (${a2_a1.y})ĵ + (${a2_a1.z})k̂) × (${l1.d.x}î + ${l1.d.y}ĵ + ${l1.d.z}k̂)| / ${vMag(l1.d).toFixed(2)}`,
      result: `Shortest Distance = ${result.distance.toFixed(3)} units`,
    });
  } else {
    steps.push({
      title: 'Shortest Distance Between Skew Lines',
      formula: 'd = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|',
      substitution: `|(${a2_a1.x})(${b1xb2.x}) + (${a2_a1.y})(${b1xb2.y}) + (${a2_a1.z})(${b1xb2.z})| / ${vMag(b1xb2).toFixed(3)}`,
      result: `Shortest Distance = ${result.distance.toFixed(3)} units`,
      note: result.distance === 0 ? 'Lines intersect in 3D space!' : 'Lines are non-intersecting and non-parallel (skew).',
    });
  }

  numbers.push(
    { label: 'Line 1 Point', value: `(${l1.p.x}, ${l1.p.y}, ${l1.p.z})` },
    { label: 'Line 1 Direction', value: `⟨${l1.d.x}, ${l1.d.y}, ${l1.d.z}⟩` },
    { label: 'Line 2 Point', value: `(${l2.p.x}, ${l2.p.y}, ${l2.p.z})` },
    { label: 'Line 2 Direction', value: `⟨${l2.d.x}, ${l2.d.y}, ${l2.d.z}⟩` },
    { label: 'Shortest Distance', value: result.distance.toFixed(3) },
    { label: 'Relationship', value: result.isParallel ? 'Parallel lines' : result.distance < 1e-4 ? 'Intersecting lines' : 'Skew lines' }
  );

  return {
    success: true,
    verdict: `Shortest distance between lines is ${result.distance.toFixed(2)} units (${result.isParallel ? 'Parallel' : result.distance < 1e-4 ? 'Intersecting' : 'Skew'}).`,
    steps,
    numbers,
  };
}

// ==========================================
// LAB 3: COORDINATE GEOMETRY SOLVERS
// ==========================================

export function solveStraightLine(l1: Line2D, l2?: Line2D, point?: { x: number; y: number }): SolverResult {
  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  const slope1 = l1.b !== 0 ? -l1.a / l1.b : Infinity;
  const xInt = l1.a !== 0 ? -l1.c / l1.a : Infinity;
  const yInt = l1.b !== 0 ? -l1.c / l1.b : Infinity;

  steps.push({
    title: 'Line 1 Standard Form: ax + by + c = 0',
    formula: 'Slope m = -a/b,  x-intercept = -c/a,  y-intercept = -c/b',
    substitution: `${l1.a}x + ${l1.b}y + ${l1.c} = 0`,
    result: `Slope m₁ = ${slope1 === Infinity ? 'Undefined (vertical)' : slope1.toFixed(3)}, x-int = ${xInt.toFixed(2)}, y-int = ${yInt.toFixed(2)}`,
  });

  numbers.push(
    { label: 'Line 1', value: `${l1.a}x + ${l1.b}y + ${l1.c} = 0` },
    { label: 'Slope m₁', value: slope1 === Infinity ? '∞' : slope1.toFixed(2) }
  );

  if (point) {
    const dist = pointToLine2DDistance(point.x, point.y, l1);
    steps.push({
      title: 'Perpendicular Distance from Point to Line',
      formula: 'd = |a x₀ + b y₀ + c| / √(a² + b²)',
      substitution: `|(${l1.a})(${point.x}) + (${l1.b})(${point.y}) + (${l1.c})| / √(${l1.a}² + ${l1.b}²)`,
      result: `d = ${dist.toFixed(3)} units`,
    });
    numbers.push(
      { label: 'Point', value: `(${point.x}, ${point.y})` },
      { label: 'Distance to Line 1', value: dist.toFixed(3) }
    );
  }

  if (l2) {
    const angle = angleBetween2DLines(l1, l2);
    const slope2 = l2.b !== 0 ? -l2.a / l2.b : Infinity;

    // Intersection
    const det = l1.a * l2.b - l2.a * l1.b;
    let interX = 0, interY = 0;
    const isParallel = Math.abs(det) < 1e-6;

    if (!isParallel) {
      interX = (l1.b * l2.c - l2.b * l1.c) / det;
      interY = (l2.a * l1.c - l1.a * l2.c) / det;
    }

    steps.push({
      title: 'Angle Between Two Lines',
      formula: 'tan(θ) = |(m₁ - m₂) / (1 + m₁ m₂)|  or  cos(θ) = |a₁ a₂ + b₁ b₂| / (√(a₁²+b₁²) √(a₂²+b₂²))',
      substitution: `|(${l1.a})(${l2.a}) + (${l1.b})(${l2.b})| / (√(${l1.a}²+${l1.b}²) √(${l2.a}²+${l2.b}²))`,
      result: `Acute Angle θ = ${angle.toFixed(2)}°`,
    });

    if (!isParallel) {
      steps.push({
        title: 'Point of Intersection',
        formula: 'Solve system: L₁ = 0, L₂ = 0 via Cramer’s rule',
        substitution: `x = (${l1.b}·${l2.c} - ${l2.b}·${l1.c}) / ${det}, y = (${l2.a}·${l1.c} - ${l1.a}·${l2.c}) / ${det}`,
        result: `Intersection = (${interX.toFixed(2)}, ${interY.toFixed(2)})`,
      });
      numbers.push({ label: 'Intersection Point', value: `(${interX.toFixed(2)}, ${interY.toFixed(2)})` });
    }

    numbers.push(
      { label: 'Line 2', value: `${l2.a}x + ${l2.b}y + ${l2.c} = 0` },
      { label: 'Angle θ', value: `${angle.toFixed(1)}°` }
    );

    return {
      success: true,
      verdict: `Angle between lines = ${angle.toFixed(1)}°. ${isParallel ? 'Lines are PARALLEL.' : `Intersect at (${interX.toFixed(1)}, ${interY.toFixed(1)}).`}`,
      steps,
      numbers,
    };
  }

  return {
    success: true,
    verdict: `Line slope = ${slope1 === Infinity ? 'Vertical' : slope1.toFixed(2)}, intercepts at (${xInt.toFixed(1)}, 0) and (0, ${yInt.toFixed(1)}).`,
    steps,
    numbers,
  };
}

export function solveConic(type: 'parabola' | 'ellipse' | 'hyperbola', a: number, b = 3): SolverResult {
  const steps: SolverResult['steps'] = [];
  const numbers: SolverResult['numbers'] = [];

  if (a <= 0 || (type !== 'parabola' && b <= 0)) {
    return {
      success: false,
      verdict: 'Impossible: Conic axis parameters a, b must be strictly positive (> 0).',
      steps: [],
      numbers: [],
      impossibleMessage: 'Parameters a and b represent geometric lengths.',
    };
  }

  if (type === 'parabola') {
    // y^2 = 4ax
    const latusRectum = 4 * a;
    steps.push({
      title: 'Standard Parabola: y² = 4ax',
      formula: 'Focus S = (a, 0), Directrix x = -a, Eccentricity e = 1',
      substitution: `a = ${a}`,
      result: `Focus S = (${a}, 0), Directrix x = -${a}`,
    });
    steps.push({
      title: 'Latus Rectum and Focal Chord',
      formula: 'Length of Latus Rectum = 4a. Extremities = (a, ±2a)',
      substitution: `4 · ${a} = ${latusRectum}`,
      result: `Length = ${latusRectum}, Ends = (${a}, ${2 * a}) and (${a}, -${2 * a})`,
      note: 'If t₁ and t₂ are parameters of ends of a focal chord, t₁ · t₂ = -1.',
    });
    steps.push({
      title: 'Equation of Tangent at (x₁, y₁)',
      formula: 'T: y · y₁ = 2a(x + x₁)',
      substitution: 'Parametric form (at² , 2at): t · y = x + a · t²',
      result: 'Slope form: y = m x + a / m',
    });

    numbers.push(
      { label: 'Equation', value: `y² = ${4 * a}x` },
      { label: 'Eccentricity (e)', value: '1 (Parabola)' },
      { label: 'Focus (S)', value: `(${a}, 0)` },
      { label: 'Directrix', value: `x = -${a}` },
      { label: 'Latus Rectum', value: `${latusRectum}` }
    );

    return {
      success: true,
      verdict: `Parabola y² = ${4 * a}x with focus at (${a}, 0) and directrix x = -${a}.`,
      steps,
      numbers,
    };
  }

  if (type === 'ellipse') {
    // x^2/a^2 + y^2/b^2 = 1 (assume a >= b for horizontal)
    const isHorizontal = a >= b;
    const majorA = isHorizontal ? a : b;
    const minorB = isHorizontal ? b : a;

    const e = Math.sqrt(1 - (minorB * minorB) / (majorA * majorA));
    const ae = majorA * e;
    const directrixVal = majorA / e;
    const latusRectum = (2 * minorB * minorB) / majorA;

    steps.push({
      title: 'Standard Ellipse: x²/a² + y²/b² = 1',
      formula: 'e = √(1 - b²/a²),  Foci = (±ae, 0),  Directrices x = ±a/e',
      substitution: `e = √(1 - ${minorB}²/${majorA}²) = √(1 - ${(minorB * minorB) / (majorA * majorA)})`,
      result: `Eccentricity e = ${e.toFixed(4)} (< 1)`,
    });

    steps.push({
      title: 'Foci and Directrices',
      formula: 'Foci S, S\' = (±ae, 0); Directrices = ±a/e',
      substitution: `ae = ${majorA} · ${e.toFixed(4)} = ${ae.toFixed(3)}, a/e = ${(majorA / e).toFixed(3)}`,
      result: `Foci = (±${ae.toFixed(2)}, 0); Directrices x = ±${directrixVal.toFixed(2)}`,
      note: 'Sum of focal distances SP + S\'P = 2a (constant for every point on the ellipse).',
    });

    steps.push({
      title: 'Latus Rectum & Tangents',
      formula: 'LR = 2b² / a;  Slope form tangent: y = m x ± √(a² m² + b²)',
      substitution: `2 · (${minorB}²) / ${majorA} = ${latusRectum.toFixed(3)}`,
      result: `LR = ${latusRectum.toFixed(2)}`,
    });

    numbers.push(
      { label: 'Equation', value: `x²/${(a * a).toFixed(0)} + y²/${(b * b).toFixed(0)} = 1` },
      { label: 'Eccentricity (e)', value: `${e.toFixed(3)} (< 1)` },
      { label: 'Foci (S, S\')', value: `(±${ae.toFixed(2)}, 0)` },
      { label: 'Directrices', value: `x = ±${directrixVal.toFixed(2)}` },
      { label: 'Latus Rectum', value: latusRectum.toFixed(2) },
      { label: "Focal distance sum (SP + S'P)", value: `${(2 * majorA).toFixed(1)}` }
    );

    return {
      success: true,
      verdict: `Ellipse with e = ${e.toFixed(3)}, foci at (±${ae.toFixed(1)}, 0), LR = ${latusRectum.toFixed(2)}.`,
      steps,
      numbers,
    };
  }

  // Hyperbola: x^2/a^2 - y^2/b^2 = 1
  const e = Math.sqrt(1 + (b * b) / (a * a));
  const ae = a * e;
  const directrixVal = a / e;
  const latusRectum = (2 * b * b) / a;

  steps.push({
    title: 'Standard Hyperbola: x²/a² - y²/b² = 1',
    formula: 'e = √(1 + b²/a²),  Foci = (±ae, 0),  Directrices x = ±a/e',
    substitution: `e = √(1 + ${b}²/${a}²) = √(1 + ${(b * b) / (a * a)})`,
    result: `Eccentricity e = ${e.toFixed(4)} (> 1)`,
  });

  steps.push({
    title: 'Foci & Asymptotes',
    formula: 'Foci = (±ae, 0), Asymptotes: y = ±(b/a)x',
    substitution: `ae = ${a} · ${e.toFixed(3)} = ${ae.toFixed(3)}, Slope = ±${b}/${a}`,
    result: `Foci = (±${ae.toFixed(2)}, 0), Asymptotes y = ±${(b / a).toFixed(2)}x`,
    note: '|S\'P - SP| = 2a (constant difference of focal distances).',
  });

  numbers.push(
    { label: 'Equation', value: `x²/${(a * a).toFixed(0)} - y²/${(b * b).toFixed(0)} = 1` },
    { label: 'Eccentricity (e)', value: `${e.toFixed(3)} (> 1)` },
    { label: 'Foci', value: `(±${ae.toFixed(2)}, 0)` },
    { label: 'Directrices', value: `x = ±${directrixVal.toFixed(2)}` },
    { label: 'Asymptotes', value: `y = ±${(b / a).toFixed(2)}x` },
    { label: 'Latus Rectum', value: latusRectum.toFixed(2) }
  );

  return {
    success: true,
    verdict: `Hyperbola with e = ${e.toFixed(3)} (> 1), foci at (±${ae.toFixed(1)}, 0), asymptotes y = ±${(b / a).toFixed(2)}x.`,
    steps,
    numbers,
  };
}
