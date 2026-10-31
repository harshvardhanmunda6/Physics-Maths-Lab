import React, { useRef, useState, useEffect } from 'react';

interface PrismCanvasProps {
  apexAngleDeg: number; // A (e.g. 60 deg)
  refractiveIndex: number; // n (e.g. 1.50)
  incidentAngleDeg: number; // i (e.g. 45 deg)
  onChange: (updates: { incidentAngleDeg?: number; apexAngleDeg?: number; refractiveIndex?: number }) => void;
}

export const PrismCanvas: React.FC<PrismCanvasProps> = ({
  apexAngleDeg,
  refractiveIndex,
  incidentAngleDeg,
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

    // Relative to first face incidence point
    const p1x = dimensions.width * 0.32;
    const p1y = dimensions.height * 0.58;
    const dx = p1x - touchX;
    const dy = p1y - touchY;

    if (dx > 0) {
      const angleRad = Math.atan2(dy, dx);
      // Face slant is (90 - A/2)
      const deg = Math.max(10, Math.min(85, Math.round(90 - (angleRad * 180) / Math.PI)));
      onChange({ incidentAngleDeg: deg });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Prism Geometry
  const cx = dimensions.width * 0.45;
  const cy = dimensions.height * 0.72; // base center
  const prismH = 180;
  const aRad = (apexAngleDeg * Math.PI) / 180;
  const halfBase = prismH * Math.tan(aRad / 2);

  const apexX = cx;
  const apexY = cy - prismH;
  const baseLeftX = cx - halfBase;
  const baseLeftY = cy;
  const baseRightX = cx + halfBase;
  const baseRightY = cy;

  // Face normal angle at left face: left face slant angle = 90 - A/2
  const faceSlantRad = Math.atan2(prismH, halfBase); // angle with horizontal

  // Incidence point on left face (approx midway)
  const p1x = apexX - halfBase * 0.55;
  const p1y = apexY + prismH * 0.55;

  // Face 1 normal direction (pointing outward-left)
  const n1Angle = faceSlantRad - Math.PI / 2;
  const normLen = 45;
  const n1x = p1x - normLen * Math.sin(aRad / 2);
  const n1y = p1y - normLen * Math.cos(aRad / 2);

  // Ray physics
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinR1 = Math.sin(iRad) / refractiveIndex;
  const r1Rad = Math.asin(Math.min(0.999, sinR1));
  const r1Deg = (r1Rad * 180) / Math.PI;

  const r2Deg = apexAngleDeg - r1Deg;
  const r2Rad = (r2Deg * Math.PI) / 180;

  const sinE = refractiveIndex * Math.sin(r2Rad);
  const isTIR2 = sinE > 1.0;
  const eRad = isTIR2 ? 0 : Math.asin(sinE);
  const eDeg = isTIR2 ? 0 : (eRad * 180) / Math.PI;

  const deltaDeg = isTIR2 ? 0 : incidentAngleDeg + eDeg - apexAngleDeg;
  const criticalAngleDeg = (Math.asin(1 / refractiveIndex) * 180) / Math.PI;

  // Ray coordinates
  // Incident ray coming to p1
  const rayInLen = 140;
  // Angle of ray with left normal is iRad
  const rayInAngle = faceSlantRad - Math.PI / 2 - iRad;
  const inX = p1x - rayInLen * Math.cos(rayInAngle);
  const inY = p1y - rayInLen * Math.sin(rayInAngle);

  // Point on second face p2
  const p2x = apexX + halfBase * 0.55;
  const p2y = apexY + prismH * 0.55;

  // Emergent ray
  const rayOutLen = 140;
  const rayOutAngle = Math.PI - faceSlantRad - Math.PI / 2 + eRad;
  const outX = p2x + rayOutLen * Math.cos(rayOutAngle);
  const outY = p2y + rayOutLen * Math.sin(rayOutAngle);

  // Minimum deviation
  const minDevDeg = (2 * Math.asin(refractiveIndex * Math.sin(aRad / 2)) * 180) / Math.PI - apexAngleDeg;

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
          <pattern id="prismGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#prismGrid)" />

          {/* PRISM TRIANGLE */}
          <polygon
            points={`${apexX},${apexY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
            fill="rgba(56, 189, 248, 0.12)"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Apex Angle Label */}
          <text x={apexX} y={apexY - 12} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
            A = {apexAngleDeg}°
          </text>
          <text x={cx} y={cy - 20} fill="#94a3b8" fontSize="11" textAnchor="middle">
            Glass (n = {refractiveIndex.toFixed(2)})
          </text>

          {/* Normals at faces */}
          {/* Normal 1 */}
          <line
            x1={p1x - 30 * Math.cos(faceSlantRad - Math.PI / 2)}
            y1={p1y - 30 * Math.sin(faceSlantRad - Math.PI / 2)}
            x2={p1x + 30 * Math.cos(faceSlantRad - Math.PI / 2)}
            y2={p1y + 30 * Math.sin(faceSlantRad - Math.PI / 2)}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Normal 2 */}
          <line
            x1={p2x - 30 * Math.cos(Math.PI - faceSlantRad + Math.PI / 2)}
            y1={p2y - 30 * Math.sin(Math.PI - faceSlantRad + Math.PI / 2)}
            x2={p2x + 30 * Math.cos(Math.PI - faceSlantRad + Math.PI / 2)}
            y2={p2y + 30 * Math.sin(Math.PI - faceSlantRad + Math.PI / 2)}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* INCIDENT RAY */}
          <line x1={inX} y1={inY} x2={p1x} y2={p1y} stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          {/* Drag Handle at incident ray */}
          <circle cx={inX} cy={inY} r="20" fill="rgba(250, 204, 21, 0.2)" stroke="#facc15" strokeWidth="2" className="cursor-move" />
          <circle cx={inX} cy={inY} r="5" fill="#facc15" />
          <text x={inX - 10} y={inY - 12} fill="#facc15" fontSize="12" fontWeight="bold">
            i = {incidentAngleDeg}°
          </text>

          {/* RAY INSIDE PRISM */}
          <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

          {/* SECOND FACE: EMERGENT RAY OR TIR */}
          {!isTIR2 ? (
            <>
              {/* Emergent Ray */}
              <line x1={p2x} y1={p2y} x2={outX} y2={outY} stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
              <text x={outX + 8} y={outY} fill="#f472b6" fontSize="12" fontWeight="bold">
                e = {eDeg.toFixed(1)}°
              </text>

              {/* Undeviated incident ray dashed extension */}
              <line
                x1={p1x}
                y1={p1y}
                x2={p1x + 220 * Math.cos(rayInAngle)}
                y2={p1y + 220 * Math.sin(rayInAngle)}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Backward extension of emergent ray */}
              <line
                x1={p2x}
                y1={p2y}
                x2={p2x - 120 * Math.cos(rayOutAngle)}
                y2={p2y - 120 * Math.sin(rayOutAngle)}
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
            </>
          ) : (
            /* TIR at second face */
            <>
              <line
                x1={p2x}
                y1={p2y}
                x2={p2x - 80}
                y2={p2y + 60}
                stroke="#f43f5e"
                strokeWidth="3.5"
              />
              <text x={p2x + 10} y={p2y + 10} fill="#f43f5e" fontSize="12" fontWeight="bold">
                TIR at 2nd Face!
              </text>
            </>
          )}

          {/* Deviation Stats Card */}
          <g transform={`translate(${dimensions.width - 230}, 24)`}>
            <rect width="210" height="96" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
            <text x="12" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold">
              δ = i + e - A = <span className="text-pink-400 font-bold">{isTIR2 ? 'TIR' : `${deltaDeg.toFixed(1)}°`}</span>
            </text>
            <text x="12" y="44" fill="#94a3b8" fontSize="11">
              r₁ = {r1Deg.toFixed(1)}°, r₂ = {r2Deg.toFixed(1)}°
            </text>
            <text x="12" y="64" fill="#4ade80" fontSize="12" fontWeight="bold">
              Min Deviation δ_m = {minDevDeg.toFixed(1)}°
            </text>
            <text x="12" y="84" fill="#fbbf24" fontSize="10.5">
              Critical θ_c = {criticalAngleDeg.toFixed(1)}°
            </text>
          </g>

          {/* Touch instruction badge */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag incident ray to change angle i
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
