import React, { useRef, useState, useEffect } from 'react';
import { formatSigned } from '../../utils/math';

interface SphericalMirrorCanvasProps {
  mirrorType: 'concave' | 'convex';
  focalLength: number; // magnitude in cm (e.g. 15)
  objectDistance: number; // in cm (positive magnitude, e.g. 30 -> NCERT u = -30)
  objectHeight: number; // in cm, e.g. 5
  onChange: (updates: { objectDistance?: number; objectHeight?: number; focalLength?: number }) => void;
}

export const SphericalMirrorCanvas: React.FC<SphericalMirrorCanvasProps> = ({
  mirrorType,
  focalLength,
  objectDistance,
  objectHeight,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 680, height: 340 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 680,
          height: Math.max(300, Math.min(380, window.innerHeight * 0.4)),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // NCERT Cartesian Signs:
  // u is negative for real object in front of mirror
  const u = -Math.abs(objectDistance);
  // Concave: f < 0, Convex: f > 0
  const f = mirrorType === 'concave' ? -Math.abs(focalLength) : Math.abs(focalLength);
  const R = 2 * f;

  // Mirror formula: 1/v = 1/f - 1/u => v = (u*f)/(u - f)
  const isAtFocus = Math.abs(u - f) < 0.2;
  const v = isAtFocus ? (u < f ? -9999 : 9999) : (u * f) / (u - f);
  const m = isAtFocus ? (v > 0 ? 99 : -99) : -v / u;
  const imageHeight = objectHeight * m;

  // Coordinate mapping
  // Pole P is at (cx, cy)
  const cx = dimensions.width * (mirrorType === 'concave' ? 0.72 : 0.28);
  const cy = dimensions.height * 0.55;
  // Scale: cm to pixels
  const scale = Math.min(dimensions.width / 90, 7.5);

  const objX = cx + u * scale; // since u is negative, objX < cx (left of mirror)
  const objY = cy - objectHeight * scale; // +y is upward
  const imgX = isAtFocus ? -999 : cx + v * scale;
  const imgY = isAtFocus ? -999 : cy - imageHeight * scale;

  const focusX = cx + f * scale;
  const centerOfCurvX = cx + R * scale;

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    // Convert pixel back to cm
    const newU_pixels = touchX - cx;
    const newU_cm = -newU_pixels / scale; // magnitude in front
    const newH_cm = (cy - touchY) / scale;

    const clampedU = Math.max(5, Math.min(70, Math.round(newU_cm * 2) / 2));
    const clampedH = Math.max(1, Math.min(15, Math.round(newH_cm * 2) / 2));

    onChange({ objectDistance: clampedU, objectHeight: clampedH });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Arc path for spherical mirror surface
  const arcRadius = Math.abs(R) * scale;
  const mirrorHalfH = dimensions.height * 0.42;
  const dxArc = mirrorType === 'concave' ? -20 : 20;

  const getZoneDescription = () => {
    if (mirrorType === 'concave') {
      const absU = Math.abs(u);
      const absF = Math.abs(f);
      if (Math.abs(absU - 2 * absF) < 1) return 'Object at Center C (u = 2f) ⟹ Image at C (Real, Inverted, Same Size, m = -1.0)';
      if (Math.abs(absU - absF) < 1) return 'Object at Focus F (u = f) ⟹ Reflected rays parallel (Image at ±∞)';
      if (absU > 2 * absF) return 'Object beyond C (u > 2f) ⟹ Image between C & F (Real, Inverted, Diminished)';
      if (absU > absF && absU < 2 * absF) return 'Object between C & F (f < u < 2f) ⟹ Image beyond C (Real, Inverted, Magnified)';
      if (absU < absF) return 'Object between F & Pole P (u < f) ⟹ Virtual, Erect, Magnified (Behind mirror, m > 1)';
    } else {
      return 'Convex Mirror: Always forms Virtual, Erect, Diminished image between Pole & Focus (0 < v < f)';
    }
    return '';
  };

  return (
    <div className="w-full select-none space-y-2" ref={containerRef}>
      {/* Quick JEE Presets Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] mr-1">JEE Cases:</span>
        {mirrorType === 'concave' ? (
          <>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 2.5) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              u &gt; 2f (Beyond C)
            </button>
            <button
              onClick={() => onChange({ objectDistance: focalLength * 2 })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              u = 2f (At C)
            </button>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 1.5) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              Between C &amp; F
            </button>
            <button
              onClick={() => onChange({ objectDistance: focalLength })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px] transition-colors"
            >
              u = f (Focus)
            </button>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 0.6) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-[11px] transition-colors"
            >
              u &lt; f (Virtual Erect)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onChange({ objectDistance: 30 })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              Distant Object (u = 30 cm)
            </button>
            <button
              onClick={() => onChange({ objectDistance: 10 })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              Near Object (u = 10 cm)
            </button>
          </>
        )}
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
        {/* Optical Regime Live Header Banner */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 pointer-events-none flex items-center justify-between gap-2">
          <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 font-medium">
            <span className="text-sky-400 font-bold mr-1">Regime:</span>
            {getZoneDescription()}
          </div>
        </div>

        {/* Live Drag Touch Overlay */}
        <svg
          className="w-full block touch-none cursor-grab active:cursor-grabbing"
          style={{ height: dimensions.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="mirrorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Mirror hatch stripes for back silvering */}
            <pattern id="silverHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
            </pattern>
            {/* Arrow markers */}
            <marker id="rayArrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
            <marker id="rayArrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80" />
            </marker>
            <marker id="rayArrowAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#mirrorGrid)" />

          {/* Principal Axis */}
          <line
            x1="0"
            y1={cy}
            x2={dimensions.width}
            y2={cy}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Mirror Surface */}
          <path
            d={`M ${cx + (mirrorType === 'concave' ? 12 : -12)} ${cy - mirrorHalfH} Q ${cx} ${cy} ${cx + (mirrorType === 'concave' ? 12 : -12)} ${cy + mirrorHalfH}`}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Mirror Silvering Hash */}
          <path
            d={`M ${cx + (mirrorType === 'concave' ? 14 : -14)} ${cy - mirrorHalfH} Q ${cx + (mirrorType === 'concave' ? 2 : -2)} ${cy} ${cx + (mirrorType === 'concave' ? 14 : -14)} ${cy + mirrorHalfH}`}
            fill="none"
            stroke="#64748b"
            strokeWidth="3"
            strokeDasharray="2 3"
          />

          {/* Key Reference Points: Pole, Focus, Center of Curvature */}
          {/* Pole P */}
          <circle cx={cx} cy={cy} r="4" fill="#38bdf8" />
          <text x={cx} y={cy + 18} fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">
            P (0,0)
          </text>

          {/* Focus F */}
          <circle cx={focusX} cy={cy} r="4" fill="#f59e0b" />
          <text x={focusX} y={cy + 18} fill="#f59e0b" fontSize="12" textAnchor="middle" fontWeight="bold">
            F ({formatSigned(f, '', 0)})
          </text>

          {/* Center of Curvature C */}
          <circle cx={centerOfCurvX} cy={cy} r="4" fill="#a855f7" />
          <text x={centerOfCurvX} y={cy + 18} fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">
            C ({formatSigned(R, '', 0)})
          </text>

          {/* 3 PRINCIPAL RAYS */}
          {!isAtFocus && (
            <>
              {/* Ray 1 (Blue): Parallel to principal axis -> reflects through Focus F */}
              {/* Incident part */}
              <line
                x1={objX}
                y1={objY}
                x2={cx}
                y2={objY}
                stroke="#38bdf8"
                strokeWidth="2"
                markerMid="url(#rayArrowBlue)"
              />
              {/* Reflected part */}
              {mirrorType === 'concave' ? (
                <>
                  <line
                    x1={cx}
                    y1={objY}
                    x2={imgX < cx ? imgX - 60 : cx - 180}
                    y2={imgY + (imgY - objY) * 0.4}
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {v > 0 && (
                    /* Virtual extension behind mirror */
                    <line
                      x1={cx}
                      y1={objY}
                      x2={imgX}
                      y2={imgY}
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                    />
                  )}
                </>
              ) : (
                /* Convex mirror: reflects diverging as if from F behind */
                <>
                  <line
                    x1={cx}
                    y1={objY}
                    x2={cx - 150}
                    y2={objY - ((objY - cy) / (focusX - cx)) * 150}
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <line
                    x1={cx}
                    y1={objY}
                    x2={focusX}
                    y2={cy}
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                </>
              )}

              {/* Ray 2 (Green): Directed towards / through Center of Curvature C -> reflects back */}
              {mirrorType === 'concave' ? (
                <>
                  <line
                    x1={objX}
                    y1={objY}
                    x2={cx}
                    y2={cy + (cy - objY) * ((cx - centerOfCurvX) / (centerOfCurvX - objX || 1))}
                    stroke="#4ade80"
                    strokeWidth="2"
                  />
                  {v > 0 && (
                    <line
                      x1={cx}
                      y1={cy + (cy - objY) * ((cx - centerOfCurvX) / (centerOfCurvX - objX || 1))}
                      x2={imgX}
                      y2={imgY}
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                    />
                  )}
                </>
              ) : (
                /* Convex mirror */
                <>
                  <line
                    x1={objX}
                    y1={objY}
                    x2={cx}
                    y2={cy - ((centerOfCurvX - cx) / (centerOfCurvX - objX)) * (cy - objY)}
                    stroke="#4ade80"
                    strokeWidth="2"
                  />
                  <line
                    x1={cx}
                    y1={cy - ((centerOfCurvX - cx) / (centerOfCurvX - objX)) * (cy - objY)}
                    x2={centerOfCurvX}
                    y2={cy}
                    stroke="#4ade80"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                </>
              )}

              {/* Ray 3 (Amber): Directed to Pole P -> reflects with equal angle */}
              <line
                x1={objX}
                y1={objY}
                x2={cx}
                y2={cy}
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx - 160}
                y2={cy + (cy - objY) * (160 / (cx - objX))}
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {v > 0 && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={imgX}
                  y2={imgY}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              )}
            </>
          )}

          {/* OBJECT ARROW (Draggable Handle) */}
          <g className="cursor-move">
            {/* Object vertical arrow */}
            <line
              x1={objX}
              y1={cy}
              x2={objX}
              y2={objY}
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <polygon
              points={`${objX},${objY - 8} ${objX - 6},${objY + 4} ${objX + 6},${objY + 4}`}
              fill="#38bdf8"
            />
            {/* Touch target ring */}
            <circle
              cx={objX}
              cy={objY}
              r="22"
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x={objX} y={objY - 14} fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
              Object (u = {formatSigned(u, 'cm', 1)})
            </text>
            <text x={objX} y={cy + 18} fill="#7dd3fc" fontSize="11" textAnchor="middle">
              h_o = +{objectHeight.toFixed(1)} cm
            </text>
          </g>

          {/* IMAGE ARROW */}
          {!isAtFocus && (
            <g>
              <line
                x1={imgX}
                y1={cy}
                x2={imgX}
                y2={imgY}
                stroke={v < 0 ? '#ec4899' : '#a855f7'}
                strokeWidth="4"
                strokeDasharray={v > 0 ? '5 4' : 'none'}
                strokeLinecap="round"
              />
              <polygon
                points={
                  m < 0
                    ? `${imgX},${imgY + 8} ${imgX - 6},${imgY - 4} ${imgX + 6},${imgY - 4}`
                    : `${imgX},${imgY - 8} ${imgX - 6},${imgY + 4} ${imgX + 6},${imgY + 4}`
                }
                fill={v < 0 ? '#ec4899' : '#a855f7'}
              />
              <text
                x={imgX}
                y={imgY + (m < 0 ? 20 : -14)}
                fill={v < 0 ? '#f472b6' : '#c084fc'}
                fontSize="12"
                textAnchor="middle"
                fontWeight="bold"
              >
                Image (v = {formatSigned(v, 'cm', 1)})
              </text>
              <text
                x={imgX}
                y={cy + 18}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="middle"
              >
                h_i = {formatSigned(imageHeight, 'cm', 1)}
              </text>
            </g>
          )}

          {/* Touch instruction badge inside canvas */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag arrow tip to change u &amp; height
            </text>
          </g>
        </svg>
      </div>

      {/* Ray Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mt-2 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Ray 1: Parallel ⟹ Focus
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Ray 2: Center C ⟹ Retraces
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Ray 3: Pole P (i = r)
          </span>
        </div>
        <div className="text-slate-400">
          NCERT: <span className="text-slate-200">Incident direction (+x) is rightwards</span>
        </div>
      </div>
    </div>
  );
};
