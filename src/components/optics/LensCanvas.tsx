import React, { useRef, useState, useEffect } from 'react';
import { formatSigned } from '../../utils/math';

interface LensCanvasProps {
  lensType: 'convex' | 'concave';
  focalLength: number; // magnitude in cm (e.g. 20)
  objectDistance: number; // positive magnitude in cm (e.g. 30 -> u = -30)
  objectHeight: number; // cm
  isCombination?: boolean;
  focalLength2?: number; // for two lenses in contact
  isSilvered?: boolean;
  onChange: (updates: { objectDistance?: number; objectHeight?: number; focalLength?: number; focalLength2?: number }) => void;
}

export const LensCanvas: React.FC<LensCanvasProps> = ({
  lensType,
  focalLength,
  objectDistance,
  objectHeight,
  isCombination = false,
  focalLength2 = -40,
  isSilvered = false,
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

  // NCERT Signs:
  const u = -Math.abs(objectDistance);
  let f = lensType === 'convex' ? Math.abs(focalLength) : -Math.abs(focalLength);

  // If combination: 1/F = 1/f1 + 1/f2
  if (isCombination) {
    const invF = (1 / f) + (1 / focalLength2);
    if (Math.abs(invF) > 1e-4) {
      f = 1 / invF;
    }
  }

  // 1/v - 1/u = 1/f => 1/v = 1/f + 1/u = (u + f) / (u*f) => v = (u*f)/(u + f)
  const isAtFocus = Math.abs(u + f) < 0.2;
  const v = isAtFocus ? (u < -f ? -9999 : 9999) : (u * f) / (u + f);
  const m = isAtFocus ? 99 : v / u;
  const imageHeight = objectHeight * m;

  const cx = dimensions.width / 2;
  const cy = dimensions.height * 0.55;
  const scale = Math.min(dimensions.width / 110, 6);

  const objX = cx + u * scale; // left of lens
  const objY = cy - objectHeight * scale;
  const imgX = isAtFocus ? -999 : cx + v * scale;
  const imgY = isAtFocus ? -999 : cy - imageHeight * scale;

  const f1X = cx - Math.abs(f) * scale;
  const twoF1X = cx - 2 * Math.abs(f) * scale;
  const f2X = cx + Math.abs(f) * scale;
  const twoF2X = cx + 2 * Math.abs(f) * scale;

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const newU_pixels = touchX - cx;
    const newU_cm = -newU_pixels / scale;
    const newH_cm = (cy - touchY) / scale;

    const clampedU = Math.max(5, Math.min(80, Math.round(newU_cm * 2) / 2));
    const clampedH = Math.max(1, Math.min(15, Math.round(newH_cm * 2) / 2));

    onChange({ objectDistance: clampedU, objectHeight: clampedH });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const lensHalfH = dimensions.height * 0.42;

  const getLensZoneDescription = () => {
    if (lensType === 'convex') {
      const absU = Math.abs(u);
      const absF = Math.abs(f);
      if (Math.abs(absU - 2 * absF) < 1) return 'Object at 2F₁ (u = -2f) ⟹ Real, Inverted image at 2F₂ (v = +2f, Same Size, m = -1.0)';
      if (Math.abs(absU - absF) < 1) return 'Object at Focus F₁ (u = -f) ⟹ Refracted rays emerge parallel (Image at ±∞)';
      if (absU > 2 * absF) return 'Object beyond 2F₁ (u > 2f) ⟹ Real, Inverted, Diminished image between F₂ & 2F₂';
      if (absU > absF && absU < 2 * absF) return 'Object between 2F₁ & F₁ ⟹ Real, Inverted, Magnified image beyond 2F₂';
      if (absU < absF) return 'Object between F₁ & Optical Center ⟹ Virtual, Erect, Magnified (Simple Microscope Mode, m > 1)';
    } else {
      return 'Concave Lens: Always forms Virtual, Erect, Diminished image on the same side as object (v < 0)';
    }
    return '';
  };

  return (
    <div className="w-full select-none space-y-2" ref={containerRef}>
      {/* Quick JEE Presets Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] mr-1">JEE Cases:</span>
        {lensType === 'convex' ? (
          <>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 2.5) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              u &gt; 2f (Camera)
            </button>
            <button
              onClick={() => onChange({ objectDistance: focalLength * 2 })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              u = 2f (v = +2f, m = -1)
            </button>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 1.5) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              Between 2F &amp; F (Projector)
            </button>
            <button
              onClick={() => onChange({ objectDistance: focalLength })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px] transition-colors"
            >
              u = f (Collimator, v = ∞)
            </button>
            <button
              onClick={() => onChange({ objectDistance: Math.round(focalLength * 0.6) })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-[11px] transition-colors"
            >
              u &lt; f (Microscope Mode)
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
              onClick={() => onChange({ objectDistance: 15 })}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px] transition-colors"
            >
              Near Object (u = 15 cm)
            </button>
          </>
        )}
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
        {/* Optical Regime Live Header Banner */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 pointer-events-none flex items-center justify-between gap-2">
          <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 font-medium">
            <span className="text-sky-400 font-bold mr-1">Regime:</span>
            {getLensZoneDescription()}
          </div>
        </div>

        <svg
          className="w-full block touch-none cursor-grab active:cursor-grabbing"
          style={{ height: dimensions.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Background Grid */}
          <pattern id="lensGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lensGrid)" />

          {/* Principal Axis */}
          <line x1="0" y1={cy} x2={dimensions.width} y2={cy} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Lens Plane */}
          <line x1={cx} y1={cy - lensHalfH} x2={cx} y2={cy + lensHalfH} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

          {/* Optical Center O */}
          <circle cx={cx} cy={cy} r="3.5" fill="#38bdf8" />
          <text x={cx} y={cy + 18} fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
            O (0,0)
          </text>

          {/* Foci and 2F points */}
          <circle cx={f1X} cy={cy} r="3.5" fill="#f59e0b" />
          <text x={f1X} y={cy + 18} fill="#f59e0b" fontSize="11" textAnchor="middle">
            F₁
          </text>
          <circle cx={twoF1X} cy={cy} r="3" fill="#a855f7" />
          <text x={twoF1X} y={cy + 18} fill="#c084fc" fontSize="10" textAnchor="middle">
            2F₁
          </text>

          <circle cx={f2X} cy={cy} r="3.5" fill="#f59e0b" />
          <text x={f2X} y={cy + 18} fill="#f59e0b" fontSize="11" textAnchor="middle">
            F₂
          </text>
          <circle cx={twoF2X} cy={cy} r="3" fill="#a855f7" />
          <text x={twoF2X} y={cy + 18} fill="#c084fc" fontSize="10" textAnchor="middle">
            2F₂
          </text>

          {/* LENS BODY SHAPE */}
          {lensType === 'convex' ? (
            /* Convex lens (bi-convex curved ellipse) */
            <path
              d={`M ${cx} ${cy - lensHalfH} Q ${cx + 14} ${cy} ${cx} ${cy + lensHalfH} Q ${cx - 14} ${cy} ${cx} ${cy - lensHalfH}`}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          ) : (
            /* Concave lens (hourglass curved shape) */
            <path
              d={`M ${cx - 12} ${cy - lensHalfH} L ${cx + 12} ${cy - lensHalfH} Q ${cx + 2} ${cy} ${cx + 12} ${cy + lensHalfH} L ${cx - 12} ${cy + lensHalfH} Q ${cx - 2} ${cy} ${cx - 12} ${cy - lensHalfH}`}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          )}

          {/* Silvered backing if silvered */}
          {isSilvered && (
            <path
              d={`M ${cx + 2} ${cy - lensHalfH} Q ${cx + 16} ${cy} ${cx + 2} ${cy + lensHalfH}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="3.5"
              strokeDasharray="2 3"
            />
          )}

          {/* 3 PRINCIPAL RAYS */}
          {!isAtFocus && (
            <>
              {/* Ray 1 (Sky Blue): Parallel to axis -> refracts through F2 */}
              <line x1={objX} y1={objY} x2={cx} y2={objY} stroke="#38bdf8" strokeWidth="2" />
              {lensType === 'convex' ? (
                <>
                  <line
                    x1={cx}
                    y1={objY}
                    x2={imgX > cx ? imgX + 50 : cx + 220}
                    y2={imgY + (imgY - objY) * 0.2}
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {v < 0 && (
                    /* Virtual backward extension */
                    <line x1={cx} y1={objY} x2={imgX} y2={imgY} stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 3" />
                  )}
                </>
              ) : (
                /* Concave lens: diverges as if from F1 */
                <>
                  <line
                    x1={cx}
                    y1={objY}
                    x2={cx + 160}
                    y2={objY - ((objY - cy) / (cx - f1X)) * 160}
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <line x1={cx} y1={objY} x2={f1X} y2={cy} stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 3" />
                </>
              )}

              {/* Ray 2 (Emerald): Through Optical Center O (undeviated) */}
              <line x1={objX} y1={objY} x2={cx} y2={cy} stroke="#4ade80" strokeWidth="2" />
              <line
                x1={cx}
                y1={cy}
                x2={cx + (cx - objX) * 1.5}
                y2={cy + (cy - objY) * 1.5}
                stroke="#4ade80"
                strokeWidth="2"
              />
              {v < 0 && (
                <line x1={cx} y1={cy} x2={imgX} y2={imgY} stroke="#4ade80" strokeWidth="1.8" strokeDasharray="4 3" />
              )}

              {/* Ray 3 (Amber): Through / towards F1 -> refracts parallel */}
              {lensType === 'convex' ? (
                <>
                  <line
                    x1={objX}
                    y1={objY}
                    x2={cx}
                    y2={cy + (cy - objY) * ((cx - f1X) / (f1X - objX || 1))}
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <line
                    x1={cx}
                    y1={cy + (cy - objY) * ((cx - f1X) / (f1X - objX || 1))}
                    x2={dimensions.width}
                    y2={cy + (cy - objY) * ((cx - f1X) / (f1X - objX || 1))}
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                </>
              ) : null}
            </>
          )}

          {/* OBJECT ARROW (Draggable) */}
          <g className="cursor-move">
            <line x1={objX} y1={cy} x2={objX} y2={objY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <polygon points={`${objX},${objY - 8} ${objX - 6},${objY + 4} ${objX + 6},${objY + 4}`} fill="#38bdf8" />
            <circle cx={objX} cy={objY} r="22" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
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
                stroke={v > 0 ? '#ec4899' : '#a855f7'}
                strokeWidth="4"
                strokeDasharray={v < 0 ? '5 4' : 'none'}
                strokeLinecap="round"
              />
              <polygon
                points={
                  m < 0
                    ? `${imgX},${imgY + 8} ${imgX - 6},${imgY - 4} ${imgX + 6},${imgY - 4}`
                    : `${imgX},${imgY - 8} ${imgX - 6},${imgY + 4} ${imgX + 6},${imgY + 4}`
                }
                fill={v > 0 ? '#ec4899' : '#a855f7'}
              />
              <text
                x={imgX}
                y={imgY + (m < 0 ? 20 : -14)}
                fill={v > 0 ? '#f472b6' : '#c084fc'}
                fontSize="12"
                textAnchor="middle"
                fontWeight="bold"
              >
                Image (v = {formatSigned(v, 'cm', 1)})
              </text>
              <text x={imgX} y={cy + 18} fill="#94a3b8" fontSize="11" textAnchor="middle">
                m = {formatSigned(m)}
              </text>
            </g>
          )}

          {/* Touch instruction badge */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag arrow tip to adjust position u &amp; height
            </text>
          </g>
        </svg>
      </div>

      {/* Ray Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mt-2 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Ray 1: Parallel ⟹ F₂
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Ray 2: Optical Center O (Straight)
          </span>
          {lensType === 'convex' && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Ray 3: F₁ ⟹ Parallel
            </span>
          )}
        </div>
        <div>
          Power P = <span className="text-yellow-400 font-mono font-bold">{formatSigned(100 / f, 'D')}</span>
        </div>
      </div>
    </div>
  );
};
