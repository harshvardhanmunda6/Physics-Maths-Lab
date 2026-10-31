import React, { useRef, useState, useEffect } from 'react';
import { Vector3D, vDot, vMag, vAngleDeg, vProjection } from '../../utils/math';

interface Vector2DCanvasProps {
  vectorA: Vector3D;
  vectorB: Vector3D;
  showSum?: boolean;
  showDiff?: boolean;
  showProjection?: boolean;
  onChange: (updates: { vectorA?: Vector3D; vectorB?: Vector3D }) => void;
}

export const Vector2DCanvas: React.FC<Vector2DCanvasProps> = ({
  vectorA,
  vectorB,
  showSum = true,
  showDiff = false,
  showProjection = true,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 680, height: 340 });
  const [activeHandle, setActiveHandle] = useState<'a' | 'b' | null>(null);

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

  const cx = dimensions.width * 0.45;
  const cy = dimensions.height * 0.65;
  const scale = 28; // pixels per unit

  // Coordinates on canvas
  const ax = cx + vectorA.x * scale;
  const ay = cy - vectorA.y * scale;

  const bx = cx + vectorB.x * scale;
  const by = cy - vectorB.y * scale;

  // Sum
  const sumX = cx + (vectorA.x + vectorB.x) * scale;
  const sumY = cy - (vectorA.y + vectorB.y) * scale;

  // Projection of A on B
  const projScalar = vProjection(vectorA, vectorB);
  const magB = vMag(vectorB);
  const projNorm = magB > 0 ? projScalar / magB : 0;
  const projX = cx + vectorB.x * projNorm * scale;
  const projY = cy - vectorB.y * projNorm * scale;

  // Math
  const dot = vDot(vectorA, vectorB);
  const angle = vAngleDeg(vectorA, vectorB);

  const handlePointerDown = (which: 'a' | 'b') => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setActiveHandle(which);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeHandle || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const newX = Math.round(((touchX - cx) / scale) * 2) / 2;
    const newY = Math.round(((cy - touchY) / scale) * 2) / 2;

    const clampedX = Math.max(-8, Math.min(8, newX));
    const clampedY = Math.max(-6, Math.min(6, newY));

    if (activeHandle === 'a') {
      onChange({ vectorA: { ...vectorA, x: clampedX, y: clampedY } });
    } else {
      onChange({ vectorB: { ...vectorB, x: clampedX, y: clampedY } });
    }
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
  };

  return (
    <div className="w-full select-none" ref={containerRef}>
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
        <svg
          className="w-full block touch-none"
          style={{ height: dimensions.height }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Grid pattern */}
          <pattern id="vecGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#vecGrid)" />

          {/* Coordinate axes */}
          <line x1="0" y1={cy} x2={dimensions.width} y2={cy} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx} y1="0" x2={cx} y2={dimensions.height} stroke="#475569" strokeWidth="1.5" />

          {/* Origin O */}
          <circle cx={cx} cy={cy} r="4" fill="#64748b" />
          <text x={cx - 14} y={cy + 16} fill="#64748b" fontSize="11" fontWeight="bold">
            (0,0)
          </text>

          {/* Parallelogram dashed lines */}
          {showSum && (
            <>
              <line x1={ax} y1={ay} x2={sumX} y2={sumY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1={bx} y1={by} x2={sumX} y2={sumY} stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Sum vector (Emerald) */}
              <line x1={cx} y1={cy} x2={sumX} y2={sumY} stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <text x={sumX + 8} y={sumY - 8} fill="#34d399" fontSize="12" fontWeight="bold">
                a + b
              </text>
            </>
          )}

          {/* Projection dashed line from tip of A to vector B line */}
          {showProjection && (
            <>
              <line x1={ax} y1={ay} x2={projX} y2={projY} stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={projX} cy={projY} r="3" fill="#facc15" />
              {/* Projection segment on B */}
              <line x1={cx} y1={cy} x2={projX} y2={projY} stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
              <text x={projX + 6} y={projY + 16} fill="#facc15" fontSize="11">
                proj = {projScalar.toFixed(2)}
              </text>
            </>
          )}

          {/* VECTOR A (Blue) */}
          <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <g
            className="cursor-move"
            onPointerDown={handlePointerDown('a')}
          >
            <circle cx={ax} cy={ay} r="22" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx={ax} cy={ay} r="6" fill="#38bdf8" />
            <text x={ax + 8} y={ay - 8} fill="#38bdf8" fontSize="12" fontWeight="bold">
              a ({vectorA.x}, {vectorA.y})
            </text>
          </g>

          {/* VECTOR B (Orange) */}
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          <g
            className="cursor-move"
            onPointerDown={handlePointerDown('b')}
          >
            <circle cx={bx} cy={by} r="22" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx={bx} cy={by} r="6" fill="#f97316" />
            <text x={bx + 8} y={by - 8} fill="#fb923c" fontSize="12" fontWeight="bold">
              b ({vectorB.x}, {vectorB.y})
            </text>
          </g>

          {/* Interactive touch hint */}
          <g transform={`translate(16, ${dimensions.height - 24})`}>
            <rect width="210" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" />
            <text x="8" y="14" fill="#94a3b8" fontSize="10.5">
              Drag arrow heads of a or b to change
            </text>
          </g>

          {/* Math summary card */}
          <g transform={`translate(${dimensions.width - 230}, 20)`}>
            <rect width="210" height="84" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
            <text x="12" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold">
              a · b = {dot.toFixed(2)}
            </text>
            <text x="12" y="44" fill="#f97316" fontSize="12" fontWeight="bold">
              Angle θ = {angle.toFixed(1)}°
            </text>
            <text x="12" y="64" fill="#facc15" fontSize="11">
              |a| = {vMag(vectorA).toFixed(2)}, |b| = {vMag(vectorB).toFixed(2)}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
