import React, { useRef, useState, useEffect } from 'react';
import { formatNumber } from '../../utils/math';

interface CoordinateCanvasProps {
  conicType: 'lines' | 'circle' | 'parabola' | 'ellipse' | 'hyperbola';
  paramA: number; // e.g. a for parabola or ellipse major axis
  paramB: number; // e.g. b for ellipse minor axis or hyperbola
  pointX: number;
  pointY: number;
  onChange: (updates: { pointX?: number; pointY?: number; paramA?: number; paramB?: number }) => void;
}

export const CoordinateCanvas: React.FC<CoordinateCanvasProps> = ({
  conicType,
  paramA,
  paramB,
  pointX,
  pointY,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 680, height: 350 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 680,
          height: Math.max(320, Math.min(400, window.innerHeight * 0.45)),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;
  const scale = 24; // pixels per unit

  // Pointer dragging handler for point P
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    let userX = (touchX - cx) / scale;
    let userY = (cy - touchY) / scale;

    // Snap to conic curve if requested or allow free drag with projection
    if (conicType === 'parabola') {
      // y^2 = 4ax => x = y^2 / (4a)
      const a = Math.max(0.5, paramA);
      userX = Math.max(0, userX);
      const signY = userY >= 0 ? 1 : -1;
      // Snap y to exact parabola point
      userY = signY * Math.sqrt(4 * a * userX);
    } else if (conicType === 'circle') {
      // x^2 + y^2 = r^2
      const r = Math.max(1, paramA);
      const angle = Math.atan2(userY, userX);
      userX = r * Math.cos(angle);
      userY = r * Math.sin(angle);
    } else if (conicType === 'ellipse') {
      // x = a cos t, y = b sin t
      const angle = Math.atan2(userY / paramB, userX / paramA);
      userX = paramA * Math.cos(angle);
      userY = paramB * Math.sin(angle);
    } else if (conicType === 'hyperbola') {
      // x = a sec t, y = b tan t
      userX = Math.max(paramA + 0.1, Math.abs(userX)) * (userX >= 0 ? 1 : -1);
      const signY = userY >= 0 ? 1 : -1;
      const insideSqrt = (userX * userX) / (paramA * paramA) - 1;
      if (insideSqrt >= 0) {
        userY = signY * paramB * Math.sqrt(insideSqrt);
      }
    }

    onChange({
      pointX: Math.round(userX * 10) / 10,
      pointY: Math.round(userY * 10) / 10,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Convert math (x, y) to SVG coordinates
  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;

  const px = toSvgX(pointX);
  const py = toSvgY(pointY);

  // Tangent and Normal slope calculation
  let tangentSlope = 0;
  let normalSlope = 0;
  let tangentEquation = '';
  let normalEquation = '';
  let focusX = 0;
  let directrixX = 0;
  let eccentricity = 1;

  if (conicType === 'parabola') {
    const a = paramA;
    // yy1 = 2a(x + x1) => slope m = 2a / y1
    tangentSlope = pointY !== 0 ? (2 * a) / pointY : Infinity;
    normalSlope = tangentSlope !== 0 && tangentSlope !== Infinity ? -1 / tangentSlope : 0;
    tangentEquation = `${formatNumber(tangentSlope)}x + ${formatNumber(pointY - tangentSlope * pointX)}`;
    focusX = a;
    directrixX = -a;
    eccentricity = 1;
  } else if (conicType === 'circle') {
    const r = paramA;
    tangentSlope = pointY !== 0 ? -pointX / pointY : Infinity;
    normalSlope = pointX !== 0 ? pointY / pointX : Infinity;
    eccentricity = 0;
  } else if (conicType === 'ellipse') {
    const a = paramA;
    const b = paramB;
    eccentricity = Math.sqrt(Math.max(0, 1 - (b * b) / (a * a)));
    focusX = a * eccentricity;
    directrixX = a / (eccentricity || 1);
    // x x1 / a^2 + y y1 / b^2 = 1 => slope = -(x1 / a^2) / (y1 / b^2)
    tangentSlope = pointY !== 0 ? -((pointX / (a * a)) / (pointY / (b * b))) : Infinity;
    normalSlope = tangentSlope !== 0 && tangentSlope !== Infinity ? -1 / tangentSlope : 0;
  } else if (conicType === 'hyperbola') {
    const a = paramA;
    const b = paramB;
    eccentricity = Math.sqrt(1 + (b * b) / (a * a));
    focusX = a * eccentricity;
    directrixX = a / eccentricity;
    // x x1 / a^2 - y y1 / b^2 = 1 => slope = (x1 / a^2) / (y1 / b^2)
    tangentSlope = pointY !== 0 ? ((pointX / (a * a)) / (pointY / (b * b))) : Infinity;
    normalSlope = tangentSlope !== 0 && tangentSlope !== Infinity ? -1 / tangentSlope : 0;
  }

  // Tangent Line endpoints on screen
  const tLen = 220;
  let tStartX = px, tStartY = py, tEndX = px, tEndY = py;
  if (tangentSlope === Infinity) {
    tStartY = py - tLen;
    tEndY = py + tLen;
  } else {
    const angle = Math.atan(tangentSlope);
    tStartX = px - tLen * Math.cos(angle);
    tStartY = py + tLen * Math.sin(angle);
    tEndX = px + tLen * Math.cos(angle);
    tEndY = py - tLen * Math.sin(angle);
  }

  // Normal Line endpoints
  let nStartX = px, nStartY = py, nEndX = px, nEndY = py;
  if (normalSlope === Infinity) {
    nStartY = py - 80;
    nEndY = py + 80;
  } else {
    const angle = Math.atan(normalSlope);
    nStartX = px - 80 * Math.cos(angle);
    nStartY = py + 80 * Math.sin(angle);
    nEndX = px + 80 * Math.cos(angle);
    nEndY = py - 80 * Math.sin(angle);
  }

  // Distance to Focus S(focusX, 0) and Directrix x = directrixX
  const focusDist = Math.hypot(pointX - focusX, pointY);
  const directrixDist = Math.abs(pointX - directrixX);
  const verifiedEcc = directrixDist > 0 ? focusDist / directrixDist : eccentricity;

  // Path generator for conic curves
  const renderConicPath = () => {
    if (conicType === 'parabola') {
      const a = paramA;
      // y = -10 to +10, x = y^2 / 4a
      let path = '';
      for (let y = -8; y <= 8; y += 0.2) {
        const x = (y * y) / (4 * a);
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        path += `${path === '' ? 'M' : 'L'} ${sx} ${sy} `;
      }
      return <path d={path} fill="none" stroke="#38bdf8" strokeWidth="3" />;
    } else if (conicType === 'circle') {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={paramA * scale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
        />
      );
    } else if (conicType === 'ellipse') {
      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx={paramA * scale}
          ry={paramB * scale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
        />
      );
    } else if (conicType === 'hyperbola') {
      const a = paramA;
      const b = paramB;
      let pathRight = '';
      let pathLeft = '';
      for (let y = -7; y <= 7; y += 0.2) {
        const x = a * Math.sqrt(1 + (y * y) / (b * b));
        pathRight += `${pathRight === '' ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)} `;
        pathLeft += `${pathLeft === '' ? 'M' : 'L'} ${toSvgX(-x)} ${toSvgY(y)} `;
      }
      return (
        <>
          <path d={pathRight} fill="none" stroke="#38bdf8" strokeWidth="3" />
          <path d={pathLeft} fill="none" stroke="#38bdf8" strokeWidth="3" />
        </>
      );
    }
    return null;
  };

  return (
    <div className="w-full select-none" ref={containerRef}>
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
        <svg
          className="w-full block touch-none cursor-grab active:cursor-grabbing"
          style={{ height: dimensions.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Background Grid */}
          <pattern id="coordGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#coordGrid)" />

          {/* Coordinate Axes */}
          <line x1="0" y1={cy} x2={dimensions.width} y2={cy} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx} y1="0" x2={cx} y2={dimensions.height} stroke="#475569" strokeWidth="1.5" />

          {/* Directrix Line (Orange) */}
          {conicType !== 'circle' && conicType !== 'lines' && (
            <>
              <line
                x1={toSvgX(directrixX)}
                y1={0}
                x2={toSvgX(directrixX)}
                y2={dimensions.height}
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text x={toSvgX(directrixX) - 8} y={30} fill="#f97316" fontSize="11" textAnchor="end">
                Directrix x = {directrixX.toFixed(1)}
              </text>
              {/* Perpendicular PM from Point P to Directrix */}
              <line
                x1={px}
                y1={py}
                x2={toSvgX(directrixX)}
                y2={py}
                stroke="#facc15"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx={toSvgX(directrixX)} cy={py} r="3" fill="#facc15" />
              <text x={toSvgX(directrixX) - 6} y={py - 6} fill="#facc15" fontSize="11">
                M
              </text>
            </>
          )}

          {/* Conic Curve Path */}
          {renderConicPath()}

          {/* Foci S (Focus) */}
          {conicType !== 'circle' && conicType !== 'lines' && (
            <>
              <circle cx={toSvgX(focusX)} cy={cy} r="4.5" fill="#10b981" />
              <text x={toSvgX(focusX)} y={cy + 18} fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">
                Focus S ({focusX.toFixed(1)}, 0)
              </text>
              {/* Focal radius SP */}
              <line x1={toSvgX(focusX)} y1={cy} x2={px} y2={py} stroke="#10b981" strokeWidth="1.8" strokeDasharray="4 3" />
            </>
          )}

          {/* Tangent Line (Pink) */}
          <line x1={tStartX} y1={tStartY} x2={tEndX} y2={tEndY} stroke="#ec4899" strokeWidth="2.5" />

          {/* Normal Line (Purple) */}
          <line x1={nStartX} y1={nStartY} x2={nEndX} y2={nEndY} stroke="#a855f7" strokeWidth="1.8" strokeDasharray="3 2" />

          {/* Draggable Point P(x, y) */}
          <g className="cursor-move">
            <circle cx={px} cy={py} r="22" fill="rgba(236, 72, 153, 0.25)" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={px} cy={py} r="6" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
            <text x={px + 10} y={py - 10} fill="#f472b6" fontSize="12" fontWeight="bold">
              P ({pointX.toFixed(1)}, {pointY.toFixed(1)})
            </text>
          </g>

          {/* Touch instruction badge */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag point P along the curve
            </text>
          </g>

          {/* Live Geometric Identity Card */}
          <g transform={`translate(${dimensions.width - 240}, 20)`}>
            <rect width="220" height="96" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
            <text x="12" y="22" fill="#ec4899" fontSize="12" fontWeight="bold">
              Tangent Slope m = {tangentSlope === Infinity ? '∞' : tangentSlope.toFixed(2)}
            </text>
            <text x="12" y="42" fill="#10b981" fontSize="11">
              Focal distance SP = {focusDist.toFixed(2)}
            </text>
            <text x="12" y="60" fill="#f97316" fontSize="11">
              Directrix distance PM = {directrixDist.toFixed(2)}
            </text>
            <text x="12" y="82" fill="#facc15" fontSize="12" fontWeight="bold">
              Ratio SP / PM = e = {verifiedEcc.toFixed(3)}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Formulas */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mt-2 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-pink-400">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" /> Live Tangent T = 0
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Normal Line
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Focus S
          </span>
          <span className="flex items-center gap-1.5 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Directrix
          </span>
        </div>
        <div className="text-slate-300 font-mono">
          Eccentricity: <span className="text-yellow-400 font-bold">{eccentricity.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};
