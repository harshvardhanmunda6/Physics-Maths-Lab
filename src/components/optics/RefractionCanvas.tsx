import React, { useRef, useState, useEffect } from 'react';

interface RefractionCanvasProps {
  n1: number;
  n2: number;
  incidentAngleDeg: number;
  mode: 'snell' | 'slab' | 'depth';
  thicknessCm: number;
  realDepthCm: number;
  onChange: (updates: { incidentAngleDeg?: number; n1?: number; n2?: number }) => void;
}

export const RefractionCanvas: React.FC<RefractionCanvasProps> = ({
  n1,
  n2,
  incidentAngleDeg,
  mode,
  thicknessCm,
  realDepthCm,
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

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    // In medium 1 (top half): angle with vertical normal (upward vector)
    const dx = cx - touchX;
    const dy = cy - touchY;
    if (dy > 0) {
      const angleRad = Math.atan2(dx, dy);
      const deg = Math.max(0, Math.min(88, Math.round((angleRad * 180) / Math.PI)));
      onChange({ incidentAngleDeg: deg });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;
  const rayLen = 170;

  // Snell's Law calculations
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinI = Math.sin(iRad);
  const sinR = (n1 * sinI) / n2;
  const isTIR = sinR > 1.0;

  let rRad = 0;
  let rDeg = 0;
  if (!isTIR) {
    rRad = Math.asin(sinR);
    rDeg = (rRad * 180) / Math.PI;
  }

  // Critical angle
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  // Brewster angle
  const brewsterAngleDeg = (Math.atan(n2 / n1) * 180) / Math.PI;

  // Incident ray start point
  const inX = cx - rayLen * Math.sin(iRad);
  const inY = cy - rayLen * Math.cos(iRad);

  // Refracted ray end point
  const refrX = cx + rayLen * Math.sin(rRad);
  const refrY = cy + rayLen * Math.cos(rRad);

  // Reflected ray
  const reflX = cx + rayLen * Math.sin(iRad);
  const reflY = cy - rayLen * Math.cos(iRad);

  // Lateral shift in slab
  const slabThicknessPx = 90;
  const lateralShiftPx = slabThicknessPx * (Math.sin(iRad - rRad) / Math.cos(rRad));
  const slabBottomY = cy + slabThicknessPx;

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
          {/* Medium 1 (Top) & Medium 2 (Bottom) Backgrounds */}
          <rect x="0" y="0" width={dimensions.width} height={cy} fill="rgba(30, 41, 59, 0.4)" />
          <rect x="0" y={cy} width={dimensions.width} height={dimensions.height - cy} fill="rgba(14, 116, 144, 0.15)" />

          {/* Interface Line */}
          <line x1="0" y1={cy} x2={dimensions.width} y2={cy} stroke="#38bdf8" strokeWidth="2.5" />

          {/* Normal Line */}
          <line x1={cx} y1={20} x2={cx} y2={dimensions.height - 20} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Medium Labels */}
          <text x="24" y="36" fill="#94a3b8" fontSize="13" fontWeight="bold">
            Medium 1 (n₁ = {n1.toFixed(2)})
          </text>
          <text x="24" y={cy + 36} fill="#38bdf8" fontSize="13" fontWeight="bold">
            Medium 2 (n₂ = {n2.toFixed(2)})
          </text>

          {/* Critical Angle Cones if n1 > n2 */}
          {criticalAngleDeg && (
            <g opacity="0.35">
              <line
                x1={cx}
                y1={cy}
                x2={cx - rayLen * Math.sin((criticalAngleDeg * Math.PI) / 180)}
                y2={cy - rayLen * Math.cos((criticalAngleDeg * Math.PI) / 180)}
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={cx - (rayLen - 20) * Math.sin((criticalAngleDeg * Math.PI) / 180) - 10}
                y={cy - (rayLen - 20) * Math.cos((criticalAngleDeg * Math.PI) / 180)}
                fill="#fda4af"
                fontSize="11"
              >
                θ_c = {criticalAngleDeg.toFixed(1)}°
              </text>
            </g>
          )}

          {/* Brewster Angle line */}
          <g opacity="0.3">
            <line
              x1={cx}
              y1={cy}
              x2={cx - rayLen * Math.sin((brewsterAngleDeg * Math.PI) / 180)}
              y2={cy - rayLen * Math.cos((brewsterAngleDeg * Math.PI) / 180)}
              stroke="#fbbf24"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </g>

          {/* INCIDENT RAY */}
          <line x1={inX} y1={inY} x2={cx} y2={cy} stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          {/* Arrow head */}
          <polygon
            points={`${cx - 30 * Math.sin(iRad)},${cy - 30 * Math.cos(iRad)} ${cx - 35 * Math.sin(iRad) - 5},${cy - 35 * Math.cos(iRad) + 5} ${cx - 35 * Math.sin(iRad) + 5},${cy - 35 * Math.cos(iRad) - 5}`}
            fill="#facc15"
          />

          {/* Draggable touch handle on incident ray */}
          <circle cx={inX} cy={inY} r="22" fill="rgba(250, 204, 21, 0.2)" stroke="#facc15" strokeWidth="2" className="cursor-move" />
          <circle cx={inX} cy={inY} r="5" fill="#facc15" />
          <text x={inX - 10} y={inY - 14} fill="#facc15" fontSize="12" fontWeight="bold">
            i = {incidentAngleDeg}°
          </text>

          {/* Incident Angle Arc */}
          <path
            d={`M ${cx - 35 * Math.sin(iRad)} ${cy - 35 * Math.cos(iRad)} A 35 35 0 0 1 ${cx} ${cy - 35}`}
            fill="none"
            stroke="#facc15"
            strokeWidth="1.5"
          />

          {/* REFRACTED RAY (if no TIR) */}
          {!isTIR ? (
            <>
              {mode === 'snell' ? (
                <>
                  <line x1={cx} y1={cy} x2={refrX} y2={refrY} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <polygon
                    points={`${cx + 50 * Math.sin(rRad)},${cy + 50 * Math.cos(rRad)} ${cx + 45 * Math.sin(rRad) - 5},${cy + 45 * Math.cos(rRad) - 5} ${cx + 45 * Math.sin(rRad) + 5},${cy + 45 * Math.cos(rRad) + 5}`}
                    fill="#38bdf8"
                  />
                  <text x={refrX + 10} y={refrY} fill="#38bdf8" fontSize="12" fontWeight="bold">
                    r = {rDeg.toFixed(1)}°
                  </text>
                  {/* Refracted angle arc */}
                  <path
                    d={`M ${cx} ${cy + 35} A 35 35 0 0 0 ${cx + 35 * Math.sin(rRad)} ${cy + 35 * Math.cos(rRad)}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                </>
              ) : mode === 'slab' ? (
                /* Slab mode: ray goes through slab, shifts laterally, emerges parallel */
                <>
                  {/* Slab boundaries */}
                  <rect x="0" y={cy} width={dimensions.width} height={slabThicknessPx} fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="24" y={cy + slabThicknessPx - 10} fill="#94a3b8" fontSize="11">
                    Parallel Slab (t = {thicknessCm} cm)
                  </text>
                  {/* Internal ray inside slab */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + slabThicknessPx * Math.tan(rRad)}
                    y2={slabBottomY}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  {/* Emergent ray (parallel to incident) */}
                  <line
                    x1={cx + slabThicknessPx * Math.tan(rRad)}
                    y1={slabBottomY}
                    x2={cx + slabThicknessPx * Math.tan(rRad) + 120 * Math.sin(iRad)}
                    y2={slabBottomY + 120 * Math.cos(iRad)}
                    stroke="#facc15"
                    strokeWidth="3"
                  />
                  {/* Dotted undeviated path */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + (slabThicknessPx + 80) * Math.sin(iRad)}
                    y2={cy + (slabThicknessPx + 80) * Math.cos(iRad)}
                    stroke="#64748b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Lateral shift indicator */}
                  <text x={cx + 50} y={slabBottomY + 28} fill="#ec4899" fontSize="12" fontWeight="bold">
                    Lateral Shift d_lat = {(thicknessCm * (Math.sin(iRad - rRad) / Math.cos(rRad))).toFixed(2)} cm
                  </text>
                </>
              ) : (
                /* Apparent depth mode */
                <>
                  <circle cx={cx} cy={cy + 100} r="7" fill="#fbbf24" />
                  <text x={cx + 14} y={cy + 105} fill="#fbbf24" fontSize="11" fontWeight="bold">
                    Real Object (d = {realDepthCm} cm)
                  </text>
                  <circle cx={cx} cy={cy + 100 * (n2 / n1)} r="6" fill="#a855f7" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x={cx + 14} y={cy + 100 * (n2 / n1) + 4} fill="#c084fc" fontSize="11" fontWeight="bold">
                    Apparent Position (d' = {(realDepthCm * (n2 / n1)).toFixed(1)} cm)
                  </text>
                </>
              )}

              {/* Partial reflection ray */}
              <line x1={cx} y1={cy} x2={reflX} y2={reflY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </>
          ) : (
            /* TOTAL INTERNAL REFLECTION (TIR) */
            <>
              {/* Reflected ray is 100% intensity, vibrant red/pink */}
              <line x1={cx} y1={cy} x2={reflX} y2={reflY} stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
              <polygon
                points={`${cx + 50 * Math.sin(iRad)},${cy - 50 * Math.cos(iRad)} ${cx + 45 * Math.sin(iRad) - 5},${cy - 45 * Math.cos(iRad) + 5} ${cx + 45 * Math.sin(iRad) + 5},${cy - 45 * Math.cos(iRad) - 5}`}
                fill="#f43f5e"
              />
              <text x={reflX - 10} y={reflY - 10} fill="#f43f5e" fontSize="13" fontWeight="bold">
                100% TIR Reflected Ray
              </text>
            </>
          )}

          {/* TIR Status Callout */}
          {isTIR && (
            <g transform={`translate(${dimensions.width - 260}, 24)`}>
              <rect width="240" height="74" rx="8" fill="rgba(225, 29, 72, 0.9)" />
              <text x="14" y="24" fill="#ffffff" fontSize="13" fontWeight="bold">
                TOTAL INTERNAL REFLECTION
              </text>
              <text x="14" y="44" fill="#ffe4e6" fontSize="11.5">
                sin r = {sinR.toFixed(3)} &gt; 1.00 (Impossible!)
              </text>
              <text x="14" y="62" fill="#ffffff" fontSize="11">
                i ({incidentAngleDeg}°) &gt; θ_c ({criticalAngleDeg?.toFixed(1)}°) ⟹ 100% Reflected
              </text>
            </g>
          )}

          {/* Touch instruction badge */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag yellow beam handle to change angle i
            </text>
          </g>
        </svg>
      </div>

      {/* Live Snell & Brewster readout */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mt-2 px-1">
        <div>
          Snell: <span className="font-mono text-slate-200">n₁ sin(i) = n₂ sin(r)</span> ⟹{' '}
          <span className="text-yellow-400">sin(r) = {isTIR ? `${sinR.toFixed(3)} (>1)` : sinR.toFixed(3)}</span>
        </div>
        {criticalAngleDeg && (
          <div>
            Critical angle: <span className="text-rose-400 font-bold font-mono">θ_c = {criticalAngleDeg.toFixed(2)}°</span>
          </div>
        )}
        <div>
          Brewster angle: <span className="text-amber-400 font-mono">θ_p = {brewsterAngleDeg.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
};
