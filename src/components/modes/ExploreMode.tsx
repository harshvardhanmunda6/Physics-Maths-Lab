import React, { useState } from 'react';
import { TopicId, SolverResult } from '../../types';
import { SphericalMirrorCanvas } from '../optics/SphericalMirrorCanvas';
import { PlaneMirrorCanvas } from '../optics/PlaneMirrorCanvas';
import { RefractionCanvas } from '../optics/RefractionCanvas';
import { LensCanvas } from '../optics/LensCanvas';
import { PrismCanvas } from '../optics/PrismCanvas';
import { Vector2DCanvas } from '../vectors/Vector2DCanvas';
import { Vector3DView } from '../vectors/Vector3DView';
import { CoordinateCanvas } from '../coordinate/CoordinateCanvas';
import { VerdictCard } from '../VerdictCard';
import {
  solveSphericalMirror,
  solveRefraction,
  solveLens,
  solvePrism,
  solveVectorOperations,
  solvePointAndPlane,
  solveSkewLines,
  solveConic,
  solveStraightLine,
} from '../../utils/solvers';
import { Vector3D, PlaneEquation, Line3D, formatSigned } from '../../utils/math';

interface ExploreModeProps {
  topicId: TopicId;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({ topicId }) => {
  // Optics State
  // Plane Mirror
  const [planeSubTopic, setPlaneSubTopic] = useState<'basic' | 'rotating' | 'two-mirrors'>('rotating');
  const [mirrorAngleDeg, setMirrorAngleDeg] = useState(15);
  const [inclinedAngleDeg, setInclinedAngleDeg] = useState(60);
  const [planeObjDist, setPlaneObjDist] = useState(25);

  // Spherical Mirror
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>('concave');
  const [mirrorFocal, setMirrorFocal] = useState(15);
  const [mirrorObjDist, setMirrorObjDist] = useState(30);
  const [mirrorObjHeight, setMirrorObjHeight] = useState(5);

  // Refraction
  const [refrN1, setRefrN1] = useState(1.50);
  const [refrN2, setRefrN2] = useState(1.00);
  const [refrI, setRefrI] = useState(45);
  const [refrMode, setRefrMode] = useState<'snell' | 'slab' | 'depth'>('snell');
  const [slabThickness, setSlabThickness] = useState(10);
  const [realDepth, setRealDepth] = useState(12);

  // Lenses
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [lensFocal, setLensFocal] = useState(20);
  const [lensObjDist, setLensObjDist] = useState(30);
  const [lensObjHeight, setLensObjHeight] = useState(5);
  const [isLensCombo, setIsLensCombo] = useState(false);
  const [lensFocal2, setLensFocal2] = useState(-40);
  const [isSilvered, setIsSilvered] = useState(false);

  // Prism
  const [prismApex, setPrismApex] = useState(60);
  const [prismIndex, setPrismIndex] = useState(1.50);
  const [prismI, setPrismI] = useState(45);

  // Vectors & 3D
  const [vecViewMode, setVecViewMode] = useState<'2D' | '3D'>('3D');
  const [vectorA, setVectorA] = useState<Vector3D>({ x: 3, y: 4, z: 2 });
  const [vectorB, setVectorB] = useState<Vector3D>({ x: 1, y: 3, z: 5 });
  const [vectorC, setVectorC] = useState<Vector3D>({ x: 2, y: 1, z: 0 });
  const [plane3D, setPlane3D] = useState<PlaneEquation>({ a: 2, b: 2, c: -1, d: 5 });
  const [pointP, setPointP] = useState<Vector3D>({ x: 2, y: 3, z: 4 });
  const [line1, setLine1] = useState<Line3D>({ p: { x: 0, y: 0, z: 0 }, d: { x: 2, y: 1, z: 2 } });
  const [line2, setLine2] = useState<Line3D>({ p: { x: 1, y: 0, z: -1 }, d: { x: -1, y: 2, z: 1 } });

  // Coordinate Geometry
  const [conicParamA, setConicParamA] = useState(4);
  const [conicParamB, setConicParamB] = useState(3);
  const [coordPointX, setCoordPointX] = useState(4);
  const [coordPointY, setCoordPointY] = useState(4);

  // Compute live solver result for Verdict Card
  const getLiveResult = (): SolverResult => {
    switch (topicId) {
      case 'plane-mirror': {
        if (planeSubTopic === 'rotating') {
          return {
            success: true,
            verdict: `Reflected ray deviates by δ = 2θ = ${2 * mirrorAngleDeg}° in the same sense of rotation.`,
            steps: [],
            numbers: [
              { label: 'Mirror rotation (θ)', value: `${mirrorAngleDeg}°` },
              { label: 'Reflected ray deviation (δ = 2θ)', value: `${2 * mirrorAngleDeg}°` },
            ],
          };
        }
        if (planeSubTopic === 'two-mirrors') {
          const m = 360 / inclinedAngleDeg;
          const numImages = Math.round(m) % 2 === 0 ? Math.round(m) - 1 : Math.round(m) - 1;
          return {
            success: true,
            verdict: `Two inclined mirrors at ${inclinedAngleDeg}° produce ${numImages} images on a circle of radius r = d.`,
            steps: [],
            numbers: [
              { label: 'Inclination angle (θ)', value: `${inclinedAngleDeg}°` },
              { label: '360° / θ', value: (360 / inclinedAngleDeg).toFixed(2) },
              { label: 'Total Images (n)', value: `${numImages}` },
            ],
          };
        }
        return {
          success: true,
          verdict: `Plane mirror forms virtual, erect image at v = +${planeObjDist} cm with magnification m = +1.0.`,
          steps: [],
          numbers: [
            { label: 'Object distance (u)', value: `-${planeObjDist} cm` },
            { label: 'Image distance (v)', value: `+${planeObjDist} cm` },
            { label: 'Magnification (m)', value: '+1.0' },
          ],
        };
      }
      case 'spherical-mirror': {
        return solveSphericalMirror({
          u: -mirrorObjDist,
          f: mirrorType === 'concave' ? -mirrorFocal : mirrorFocal,
          mirrorType,
        });
      }
      case 'refraction': {
        return solveRefraction({
          n1: refrN1,
          n2: refrN2,
          iDeg: refrI,
          thicknessCm: slabThickness,
          realDepthCm: realDepth,
        });
      }
      case 'lenses': {
        let f = lensType === 'convex' ? lensFocal : -lensFocal;
        if (isLensCombo) {
          const invF = (1 / f) + (1 / lensFocal2);
          if (Math.abs(invF) > 1e-4) f = 1 / invF;
        }
        return solveLens({
          lensType,
          u: -lensObjDist,
          f,
        });
      }
      case 'prism': {
        return solvePrism({
          aDeg: prismApex,
          n: prismIndex,
          iDeg: prismI,
        });
      }
      case 'vector-ops':
      case 'triple-products': {
        return solveVectorOperations(vectorA, vectorB, topicId === 'triple-products' ? vectorC : undefined);
      }
      case 'foot-image':
      case 'line-plane': {
        return solvePointAndPlane(pointP, plane3D);
      }
      case 'distances': {
        return solveSkewLines(line1, line2);
      }
      case 'parabola':
      case 'ellipse':
      case 'hyperbola': {
        return solveConic(topicId, conicParamA, conicParamB);
      }
      default: {
        return solveStraightLine({ a: 3, b: 4, c: -12 }, { a: 4, b: -3, c: 5 }, { x: 1, y: 2 });
      }
    }
  };

  const liveResult = getLiveResult();

  return (
    <div className="w-full space-y-4">
      {/* 1. Touch-Driven Diagram / Interactive Canvas */}
      <div className="w-full">
        {topicId === 'plane-mirror' && (
          <div className="space-y-2">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setPlaneSubTopic('basic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${planeSubTopic === 'basic' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Plane Mirror (m = +1)
              </button>
              <button
                onClick={() => setPlaneSubTopic('rotating')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${planeSubTopic === 'rotating' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Rotating Mirror (δ = 2θ)
              </button>
              <button
                onClick={() => setPlaneSubTopic('two-mirrors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${planeSubTopic === 'two-mirrors' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Two Mirrors (n = 360/θ - 1)
              </button>
            </div>
            <PlaneMirrorCanvas
              subTopic={planeSubTopic}
              mirrorAngleDeg={mirrorAngleDeg}
              inclinedAngleDeg={inclinedAngleDeg}
              objectDistanceCm={planeObjDist}
              onChange={(up) => {
                if (up.mirrorAngleDeg !== undefined) setMirrorAngleDeg(up.mirrorAngleDeg);
                if (up.inclinedAngleDeg !== undefined) setInclinedAngleDeg(up.inclinedAngleDeg);
                if (up.objectDistanceCm !== undefined) setPlaneObjDist(up.objectDistanceCm);
              }}
            />
          </div>
        )}

        {topicId === 'spherical-mirror' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => setMirrorType('concave')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mirrorType === 'concave' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Concave Mirror (f &lt; 0)
              </button>
              <button
                onClick={() => setMirrorType('convex')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mirrorType === 'convex' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Convex Mirror (f &gt; 0)
              </button>
            </div>
            <SphericalMirrorCanvas
              mirrorType={mirrorType}
              focalLength={mirrorFocal}
              objectDistance={mirrorObjDist}
              objectHeight={mirrorObjHeight}
              onChange={(up) => {
                if (up.objectDistance !== undefined) setMirrorObjDist(up.objectDistance);
                if (up.objectHeight !== undefined) setMirrorObjHeight(up.objectHeight);
                if (up.focalLength !== undefined) setMirrorFocal(up.focalLength);
              }}
            />
          </div>
        )}

        {topicId === 'refraction' && (
          <div className="space-y-2">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setRefrMode('snell')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${refrMode === 'snell' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Snell&apos;s Law &amp; TIR
              </button>
              <button
                onClick={() => setRefrMode('slab')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${refrMode === 'slab' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Glass Slab Lateral Shift
              </button>
              <button
                onClick={() => setRefrMode('depth')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${refrMode === 'depth' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Apparent Depth
              </button>
            </div>
            <RefractionCanvas
              n1={refrN1}
              n2={refrN2}
              incidentAngleDeg={refrI}
              mode={refrMode}
              thicknessCm={slabThickness}
              realDepthCm={realDepth}
              onChange={(up) => {
                if (up.incidentAngleDeg !== undefined) setRefrI(up.incidentAngleDeg);
                if (up.n1 !== undefined) setRefrN1(up.n1);
                if (up.n2 !== undefined) setRefrN2(up.n2);
              }}
            />
          </div>
        )}

        {topicId === 'lenses' && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <button
                onClick={() => setLensType('convex')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${lensType === 'convex' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Convex Lens (f &gt; 0)
              </button>
              <button
                onClick={() => setLensType('concave')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${lensType === 'concave' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Concave Lens (f &lt; 0)
              </button>
              <button
                onClick={() => setIsLensCombo(!isLensCombo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isLensCombo ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {isLensCombo ? 'Two Lenses in Contact (Active)' : '+ Add 2nd Lens in Contact'}
              </button>
              <button
                onClick={() => setIsSilvered(!isSilvered)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isSilvered ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {isSilvered ? 'Silvered Lens (Active)' : 'Silver One Face'}
              </button>
            </div>
            <LensCanvas
              lensType={lensType}
              focalLength={lensFocal}
              objectDistance={lensObjDist}
              objectHeight={lensObjHeight}
              isCombination={isLensCombo}
              focalLength2={lensFocal2}
              isSilvered={isSilvered}
              onChange={(up) => {
                if (up.objectDistance !== undefined) setLensObjDist(up.objectDistance);
                if (up.objectHeight !== undefined) setLensObjHeight(up.objectHeight);
                if (up.focalLength !== undefined) setLensFocal(up.focalLength);
                if (up.focalLength2 !== undefined) setLensFocal2(up.focalLength2);
              }}
            />
          </div>
        )}

        {topicId === 'prism' && (
          <PrismCanvas
            apexAngleDeg={prismApex}
            refractiveIndex={prismIndex}
            incidentAngleDeg={prismI}
            onChange={(up) => {
              if (up.incidentAngleDeg !== undefined) setPrismI(up.incidentAngleDeg);
              if (up.apexAngleDeg !== undefined) setPrismApex(up.apexAngleDeg);
              if (up.refractiveIndex !== undefined) setPrismIndex(up.refractiveIndex);
            }}
          />
        )}

        {/* Vectors & 3D Lab */}
        {topicId === 'vector-ops' && (
          <div className="space-y-2">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setVecViewMode('3D')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${vecViewMode === '3D' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Three.js 3D View (Touch Rotatable)
              </button>
              <button
                onClick={() => setVecViewMode('2D')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${vecViewMode === '2D' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                2D Touch Playground
              </button>
            </div>
            {vecViewMode === '3D' ? (
              <Vector3DView mode="vectors" vectorA={vectorA} vectorB={vectorB} />
            ) : (
              <Vector2DCanvas
                vectorA={vectorA}
                vectorB={vectorB}
                onChange={(up) => {
                  if (up.vectorA) setVectorA(up.vectorA);
                  if (up.vectorB) setVectorB(up.vectorB);
                }}
              />
            )}
          </div>
        )}

        {topicId === 'triple-products' && (
          <Vector3DView mode="vectors" vectorA={vectorA} vectorB={vectorB} />
        )}

        {(topicId === 'line-plane' || topicId === 'foot-image') && (
          <Vector3DView mode="plane" vectorA={vectorA} vectorB={vectorB} plane={plane3D} pointP={pointP} />
        )}

        {topicId === 'distances' && (
          <Vector3DView mode="skew" vectorA={vectorA} vectorB={vectorB} line1={line1} line2={line2} />
        )}

        {/* Coordinate Geometry Lab */}
        {(topicId === 'straight-lines' ||
          topicId === 'circles' ||
          topicId === 'parabola' ||
          topicId === 'ellipse' ||
          topicId === 'hyperbola') && (
          <CoordinateCanvas
            conicType={topicId === 'straight-lines' ? 'lines' : topicId === 'circles' ? 'circle' : topicId}
            paramA={conicParamA}
            paramB={conicParamB}
            pointX={coordPointX}
            pointY={coordPointY}
            onChange={(up) => {
              if (up.pointX !== undefined) setCoordPointX(up.pointX);
              if (up.pointY !== undefined) setCoordPointY(up.pointY);
              if (up.paramA !== undefined) setConicParamA(up.paramA);
              if (up.paramB !== undefined) setConicParamB(up.paramB);
            }}
          />
        )}
      </div>

      {/* 2. Interactive Parameter Sliders & Number Inputs (Touch Target >= 44px) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
          Adjust Parameters (Sliders + Inputs)
        </div>

        {/* Spherical Mirror Sliders */}
        {topicId === 'spherical-mirror' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Object Distance |u|</span>
                <span className="font-mono text-sky-400 font-bold">-{mirrorObjDist} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={mirrorObjDist}
                onChange={(e) => setMirrorObjDist(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Focal Length |f|</span>
                <span className="font-mono text-sky-400 font-bold">
                  {mirrorType === 'concave' ? `-${mirrorFocal}` : `+${mirrorFocal}`} cm
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={mirrorFocal}
                onChange={(e) => setMirrorFocal(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Object Height h_o</span>
                <span className="font-mono text-sky-400 font-bold">+{mirrorObjHeight} cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={mirrorObjHeight}
                onChange={(e) => setMirrorObjHeight(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Refraction Sliders */}
        {topicId === 'refraction' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Incident Angle (i)</span>
                <span className="font-mono text-yellow-400 font-bold">{refrI}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                value={refrI}
                onChange={(e) => setRefrI(Number(e.target.value))}
                className="w-full h-8 accent-yellow-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Medium 1 Index (n₁)</span>
                <span className="font-mono text-sky-400 font-bold">{refrN1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.4"
                step="0.05"
                value={refrN1}
                onChange={(e) => setRefrN1(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Medium 2 Index (n₂)</span>
                <span className="font-mono text-sky-400 font-bold">{refrN2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.4"
                step="0.05"
                value={refrN2}
                onChange={(e) => setRefrN2(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Lens Sliders */}
        {topicId === 'lenses' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Object Distance |u|</span>
                <span className="font-mono text-sky-400 font-bold">-{lensObjDist} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={lensObjDist}
                onChange={(e) => setLensObjDist(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Focal Length |f|</span>
                <span className="font-mono text-sky-400 font-bold">{lensFocal} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={lensFocal}
                onChange={(e) => setLensFocal(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Object Height h_o</span>
                <span className="font-mono text-sky-400 font-bold">+{lensObjHeight} cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={lensObjHeight}
                onChange={(e) => setLensObjHeight(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Prism Sliders */}
        {topicId === 'prism' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Angle of Incidence (i)</span>
                <span className="font-mono text-yellow-400 font-bold">{prismI}°</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={prismI}
                onChange={(e) => setPrismI(Number(e.target.value))}
                className="w-full h-8 accent-yellow-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Apex Angle (A)</span>
                <span className="font-mono text-sky-400 font-bold">{prismApex}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={prismApex}
                onChange={(e) => setPrismApex(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Prism Refractive Index (n)</span>
                <span className="font-mono text-sky-400 font-bold">{prismIndex.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.3"
                max="2.0"
                step="0.02"
                value={prismIndex}
                onChange={(e) => setPrismIndex(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Conics Sliders */}
        {(topicId === 'parabola' || topicId === 'ellipse' || topicId === 'hyperbola') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Parameter a</span>
                <span className="font-mono text-sky-400 font-bold">{conicParamA}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="0.5"
                value={conicParamA}
                onChange={(e) => setConicParamA(Number(e.target.value))}
                className="w-full h-8 accent-sky-500 cursor-pointer"
              />
            </div>
            {topicId !== 'parabola' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Parameter b</span>
                  <span className="font-mono text-sky-400 font-bold">{conicParamB}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={conicParamB}
                  onChange={(e) => setConicParamB(Number(e.target.value))}
                  className="w-full h-8 accent-sky-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Live Verdict Card with Plain Text Formulas & Numbers List */}
      <VerdictCard result={liveResult} />
    </div>
  );
};
