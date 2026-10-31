import React, { useRef, useState, useEffect } from 'react';

interface PlaneMirrorCanvasProps {
  subTopic: 'basic' | 'rotating' | 'two-mirrors';
  mirrorAngleDeg: number; // for rotating mirror, theta
  inclinedAngleDeg: number; // for two mirrors, e.g. 60 deg
  objectDistanceCm: number;
  onChange: (updates: { mirrorAngleDeg?: number; inclinedAngleDeg?: number; objectDistanceCm?: number }) => void;
}

export const PlaneMirrorCanvas: React.FC<PlaneMirrorCanvasProps> = ({
  subTopic,
  mirrorAngleDeg,
  inclinedAngleDeg,
  objectDistanceCm,
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

    if (subTopic === 'basic') {
      const cx = dimensions.width / 2;
      const d = Math.max(5, Math.min(60, Math.round((cx - touchX) / 5)));
      onChange({ objectDistanceCm: d });
    } else if (subTopic === 'rotating') {
      const cx = dimensions.width * 0.45;
      const cy = dimensions.height * 0.55;
      const angleRad = Math.atan2(touchY - cy, touchX - cx);
      let deg = Math.round((angleRad * 180) / Math.PI + 90);
      deg = Math.max(-45, Math.min(45, deg));
      onChange({ mirrorAngleDeg: deg });
    } else if (subTopic === 'two-mirrors') {
      const cx = dimensions.width * 0.35;
      const cy = dimensions.height * 0.5;
      const angleRad = Math.atan2(cy - touchY, touchX - cx);
      const deg = Math.max(30, Math.min(120, Math.round((angleRad * 180) / Math.PI)));
      onChange({ inclinedAngleDeg: deg });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Render subtopic views
  const renderBasic = () => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const scale = Math.min(dimensions.width / 140, 5);
    const objX = cx - objectDistanceCm * scale;
    const imgX = cx + objectDistanceCm * scale;
    const objH = 45;

    return (
      <>
        {/* Mirror Line */}
        <line x1={cx} y1={30} x2={cx} y2={dimensions.height - 30} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Silvering marks */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={cx}
            y1={40 + i * 14}
            x2={cx + 10}
            y2={40 + i * 14 - 8}
            stroke="#64748b"
            strokeWidth="2"
          />
        ))}

        {/* Normal line */}
        <line x1={30} y1={cy} x2={dimensions.width - 30} y2={cy} stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

        {/* Light Rays from object top */}
        {/* Ray 1: Normal incidence */}
        <line x1={objX} y1={cy - objH} x2={cx} y2={cy - objH} stroke="#38bdf8" strokeWidth="2" />
        <line x1={cx} y1={cy - objH} x2={imgX} y2={cy - objH} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />

        {/* Ray 2: Oblique incidence */}
        <line x1={objX} y1={cy - objH} x2={cx} y2={cy + 30} stroke="#38bdf8" strokeWidth="2" />
        <line x1={cx} y1={cy + 30} x2={objX - 60} y2={cy + 30 + (objH + 30) * 0.8} stroke="#38bdf8" strokeWidth="2" />
        <line x1={cx} y1={cy + 30} x2={imgX} y2={cy - objH} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />

        {/* Object Arrow (Draggable) */}
        <g className="cursor-move">
          <line x1={objX} y1={cy} x2={objX} y2={cy - objH} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <polygon points={`${objX},${cy - objH - 8} ${objX - 6},${cy - objH + 4} ${objX + 6},${cy - objH + 4}`} fill="#38bdf8" />
          <circle cx={objX} cy={cy - objH} r="22" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x={objX} y={cy - objH - 14} fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
            Real Object
          </text>
          <text x={objX} y={cy + 22} fill="#7dd3fc" fontSize="11" textAnchor="middle">
            u = -{objectDistanceCm} cm
          </text>
        </g>

        {/* Image Arrow (Virtual) */}
        <g>
          <line x1={imgX} y1={cy} x2={imgX} y2={cy - objH} stroke="#a855f7" strokeWidth="4" strokeDasharray="5 4" strokeLinecap="round" />
          <polygon points={`${imgX},${cy - objH - 8} ${imgX - 6},${cy - objH + 4} ${imgX + 6},${cy - objH + 4}`} fill="#a855f7" />
          <text x={imgX} y={cy - objH - 14} fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">
            Virtual Image (m = +1)
          </text>
          <text x={imgX} y={cy + 22} fill="#c084fc" fontSize="11" textAnchor="middle">
            v = +{objectDistanceCm} cm
          </text>
        </g>
      </>
    );
  };

  const renderRotating = () => {
    const cx = dimensions.width * 0.45;
    const cy = dimensions.height * 0.55;
    const rad = (mirrorAngleDeg * Math.PI) / 180;
    const mLen = 130;

    // Mirror endpoints
    const mx1 = cx - mLen * Math.sin(rad);
    const my1 = cy + mLen * Math.cos(rad);
    const mx2 = cx + mLen * Math.sin(rad);
    const my2 = cy - mLen * Math.cos(rad);

    // Fixed incident ray coming horizontally from left
    const inX = 60;
    const inY = cy;

    // Normal to rotated mirror
    const normalAngle = rad; // perpendicular
    const normLen = 100;
    const nx = cx - normLen * Math.cos(normalAngle);
    const ny = cy - normLen * Math.sin(normalAngle);

    // Initial reflected ray (when mirror vertical theta = 0)
    // Incident angle was 0, reflects straight back or downwards if angled
    // Reflected ray angle deviates by 2 * theta
    const devAngleRad = 2 * rad;
    const refLen = 170;
    const rx = cx - refLen * Math.cos(devAngleRad);
    const ry = cy - refLen * Math.sin(devAngleRad);

    return (
      <>
        {/* Original vertical mirror line for reference */}
        <line x1={cx} y1={cy - 120} x2={cx} y2={cy + 120} stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Rotated Mirror Surface */}
        <line x1={mx1} y1={my1} x2={mx2} y2={my2} stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        {/* Drag handle at top of mirror */}
        <circle cx={mx2} cy={my2} r="18" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="2" className="cursor-move" />

        {/* Normal line */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={nx - 10} y={ny - 5} fill="#94a3b8" fontSize="11">
          Normal
        </text>

        {/* Fixed Incident Ray */}
        <line x1={inX} y1={inY} x2={cx} y2={cy} stroke="#fbbf24" strokeWidth="2.5" />
        <polygon points={`${cx - 20},${cy - 5} ${cx - 5},${cy} ${cx - 20},${cy + 5}`} fill="#fbbf24" />
        <text x={inX + 10} y={inY - 10} fill="#fbbf24" fontSize="12" fontWeight="bold">
          Fixed Incident Ray
        </text>

        {/* Reflected Ray */}
        <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#ec4899" strokeWidth="3" />
        <polygon
          points={`${cx + (rx - cx) * 0.6},${cy + (ry - cy) * 0.6} ${cx + (rx - cx) * 0.5 - 6},${cy + (ry - cy) * 0.5 + 4} ${cx + (rx - cx) * 0.5 + 6},${cy + (ry - cy) * 0.5 - 4}`}
          fill="#ec4899"
        />
        <text x={rx - 10} y={ry + (mirrorAngleDeg >= 0 ? 20 : -10)} fill="#f472b6" fontSize="12" fontWeight="bold">
          Turned Reflected Ray
        </text>

        {/* Deviation Arc: 2*theta */}
        <g transform={`translate(${dimensions.width - 240}, 30)`}>
          <rect width="220" height="72" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
          <text x="12" y="24" fill="#38bdf8" fontSize="13" fontWeight="bold">
            Mirror Rotation: θ = {mirrorAngleDeg}°
          </text>
          <text x="12" y="46" fill="#f472b6" fontSize="13" fontWeight="bold">
            Reflected Ray Deviation: δ = 2θ
          </text>
          <text x="12" y="64" fill="#e2e8f0" fontSize="12">
            δ = 2 · ({mirrorAngleDeg}°) = <span className="text-pink-400 font-bold">{2 * mirrorAngleDeg}°</span>
          </text>
        </g>
      </>
    );
  };

  const renderTwoMirrors = () => {
    const cx = dimensions.width * 0.35;
    const cy = dimensions.height * 0.6;
    const mLen = 170;

    // Mirror 1 is horizontal
    const m1x2 = cx + mLen;
    const m1y2 = cy;

    // Mirror 2 inclined at angle theta
    const thetaRad = (inclinedAngleDeg * Math.PI) / 180;
    const m2x2 = cx + mLen * Math.cos(thetaRad);
    const m2y2 = cy - mLen * Math.sin(thetaRad);

    const m = 360 / inclinedAngleDeg;
    const isEven = Math.round(m) % 2 === 0;
    const numImages = isEven ? Math.round(m) - 1 : Math.round(m) - 1;

    // Object placed between mirrors on bisector
    const objDist = 80;
    const bisectorRad = thetaRad / 2;
    const ox = cx + objDist * Math.cos(bisectorRad);
    const oy = cy - objDist * Math.sin(bisectorRad);

    return (
      <>
        {/* Circular locus of images */}
        <circle cx={cx} cy={cy} r={objDist} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" />

        {/* Mirror 1 */}
        <line x1={cx} y1={cy} x2={m1x2} y2={m1y2} stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <text x={m1x2 + 10} y={m1y2 + 4} fill="#38bdf8" fontSize="12" fontWeight="bold">
          Mirror 1
        </text>

        {/* Mirror 2 */}
        <line x1={cx} y1={cy} x2={m2x2} y2={m2y2} stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        {/* Touch handle */}
        <circle cx={m2x2} cy={m2y2} r="18" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="2" className="cursor-move" />
        <text x={m2x2} y={m2y2 - 12} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
          Mirror 2 ({inclinedAngleDeg}°)
        </text>

        {/* Angle arc */}
        <path
          d={`M ${cx + 40} ${cy} A 40 40 0 0 0 ${cx + 40 * Math.cos(thetaRad)} ${cy - 40 * Math.sin(thetaRad)}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <text x={cx + 50} y={cy - 12} fill="#f59e0b" fontSize="12" fontWeight="bold">
          θ = {inclinedAngleDeg}°
        </text>

        {/* Object */}
        <circle cx={ox} cy={oy} r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x={ox} y={oy - 12} fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
          Object
        </text>

        {/* Computed images plotted on circle */}
        {Array.from({ length: Math.min(10, numImages) }).map((_, i) => {
          const imgAngle = (i + 1) * (thetaRad / 2) * (i % 2 === 0 ? 1 : -1) + (i % 2 === 0 ? 0 : thetaRad);
          const ix = cx + objDist * Math.cos(imgAngle);
          const iy = cy - objDist * Math.sin(imgAngle);
          return (
            <g key={i}>
              <circle cx={ix} cy={iy} r="4.5" fill="#a855f7" stroke="#c084fc" strokeWidth="1.5" />
              <text x={ix} y={iy + 14} fill="#c084fc" fontSize="10" textAnchor="middle">
                I_{i + 1}
              </text>
            </g>
          );
        })}

        {/* Formula breakdown card */}
        <g transform={`translate(${dimensions.width - 230}, 30)`}>
          <rect width="210" height="90" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
          <text x="12" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold">
            Inclination θ = {inclinedAngleDeg}°
          </text>
          <text x="12" y="44" fill="#94a3b8" fontSize="11">
            m = 360° / θ = {(360 / inclinedAngleDeg).toFixed(2)}
          </text>
          <text x="12" y="64" fill="#4ade80" fontSize="13" fontWeight="bold">
            Images n = {numImages}
          </text>
          <text x="12" y="80" fill="#94a3b8" fontSize="10">
            {isEven ? 'Even m ⟹ n = m - 1' : 'Symmetric ⟹ n = m - 1'}
          </text>
        </g>
      </>
    );
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
          <pattern id="planeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#planeGrid)" />

          {subTopic === 'basic' && renderBasic()}
          {subTopic === 'rotating' && renderRotating()}
          {subTopic === 'two-mirrors' && renderTwoMirrors()}

          {/* Touch instruction badge */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="230" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag object / mirror edge to interact
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
