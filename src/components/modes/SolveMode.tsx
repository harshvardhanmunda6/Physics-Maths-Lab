import React, { useState } from 'react';
import { TopicId, SolverResult } from '../../types';
import {
  solveSphericalMirror,
  solveRefraction,
  solveLens,
  solvePrism,
  solveVectorOperations,
  solvePointAndPlane,
  solveSkewLines,
  solveStraightLine,
  solveConic,
} from '../../utils/solvers';
import { VerdictCard } from '../VerdictCard';
import { Calculator, ArrowRight, Sparkles, Check, AlertCircle } from 'lucide-react';

interface SolveModeProps {
  topicId: TopicId;
}

export const SolveMode: React.FC<SolveModeProps> = ({ topicId }) => {
  // Solver State for various topics
  // Spherical Mirror
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>('concave');
  const [mirrorU, setMirrorU] = useState<string>('-30');
  const [mirrorV, setMirrorV] = useState<string>('');
  const [mirrorF, setMirrorF] = useState<string>('-15');

  // Refraction
  const [refrN1, setRefrN1] = useState<string>('1.50');
  const [refrN2, setRefrN2] = useState<string>('1.00');
  const [refrI, setRefrI] = useState<string>('50');

  // Prism
  const [prismA, setPrismA] = useState<string>('60');
  const [prismDm, setPrismDm] = useState<string>('30');
  const [prismN, setPrismN] = useState<string>('');
  const [prismI, setPrismI] = useState<string>('');

  // Lens
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [lensU, setLensU] = useState<string>('-30');
  const [lensV, setLensV] = useState<string>('');
  const [lensF, setLensF] = useState<string>('20');
  const [lensR1, setLensR1] = useState<string>('20');
  const [lensR2, setLensR2] = useState<string>('-20');
  const [lensIndex, setLensIndex] = useState<string>('1.5');

  // Vectors
  const [vecAx, setVecAx] = useState<string>('1');
  const [vecAy, setVecAy] = useState<string>('2');
  const [vecAz, setVecAz] = useState<string>('3');
  const [vecBx, setVecBx] = useState<string>('4');
  const [vecBy, setVecBy] = useState<string>('5');
  const [vecBz, setVecBz] = useState<string>('6');
  const [vecCx, setVecCx] = useState<string>('1');
  const [vecCy, setVecCy] = useState<string>('1');
  const [vecCz, setVecCz] = useState<string>('0');

  // 3D Point and Plane
  const [pointPx, setPointPx] = useState<string>('1');
  const [pointPy, setPointPy] = useState<string>('2');
  const [pointPz, setPointPz] = useState<string>('3');
  const [planeA, setPlaneA] = useState<string>('2');
  const [planeB, setPlaneB] = useState<string>('2');
  const [planeC, setPlaneC] = useState<string>('-1');
  const [planeD, setPlaneD] = useState<string>('5');

  // Conics
  const [conicParamA, setConicParamA] = useState<string>('4');
  const [conicParamB, setConicParamB] = useState<string>('3');

  // Quick Preset Loader
  const loadPreset = (presetName: string) => {
    if (presetName === 'mirror-c') {
      setMirrorType('concave');
      setMirrorU('-30');
      setMirrorF('-15');
      setMirrorV('');
    } else if (presetName === 'prism-min-dev') {
      setPrismA('60');
      setPrismDm('30');
      setPrismN('');
      setPrismI('');
    } else if (presetName === 'tir-test') {
      setRefrN1('1.50');
      setRefrN2('1.00');
      setRefrI('50');
    } else if (presetName === 'lens-maker') {
      setLensType('convex');
      setLensU('-30');
      setLensF('');
      setLensR1('20');
      setLensR2('-20');
      setLensIndex('1.5');
    }
  };

  // Compute solver result based on active topic
  const calculateResult = (): SolverResult => {
    switch (topicId) {
      case 'spherical-mirror': {
        const u = mirrorU !== '' ? parseFloat(mirrorU) : undefined;
        const v = mirrorV !== '' ? parseFloat(mirrorV) : undefined;
        const f = mirrorF !== '' ? parseFloat(mirrorF) : undefined;
        return solveSphericalMirror({ u, v, f, mirrorType });
      }
      case 'refraction': {
        const n1 = parseFloat(refrN1) || 1;
        const n2 = parseFloat(refrN2) || 1;
        const iDeg = parseFloat(refrI) || 0;
        return solveRefraction({ n1, n2, iDeg });
      }
      case 'prism': {
        const aDeg = parseFloat(prismA) || 60;
        const deltaMDeg = prismDm !== '' ? parseFloat(prismDm) : undefined;
        const n = prismN !== '' ? parseFloat(prismN) : undefined;
        const iDeg = prismI !== '' ? parseFloat(prismI) : undefined;
        return solvePrism({ aDeg, deltaMDeg, n, iDeg });
      }
      case 'lenses': {
        const u = lensU !== '' ? parseFloat(lensU) : undefined;
        const v = lensV !== '' ? parseFloat(lensV) : undefined;
        const f = lensF !== '' ? parseFloat(lensF) : undefined;
        const r1 = lensR1 !== '' ? parseFloat(lensR1) : undefined;
        const r2 = lensR2 !== '' ? parseFloat(lensR2) : undefined;
        const nLens = parseFloat(lensIndex) || 1.5;
        return solveLens({ lensType, u, v, f, r1, r2, nLens });
      }
      case 'vector-ops':
      case 'triple-products': {
        const a = { x: parseFloat(vecAx) || 0, y: parseFloat(vecAy) || 0, z: parseFloat(vecAz) || 0 };
        const b = { x: parseFloat(vecBx) || 0, y: parseFloat(vecBy) || 0, z: parseFloat(vecBz) || 0 };
        const c = { x: parseFloat(vecCx) || 0, y: parseFloat(vecCy) || 0, z: parseFloat(vecCz) || 0 };
        return solveVectorOperations(a, b, c);
      }
      case 'foot-image':
      case 'line-plane': {
        const p = { x: parseFloat(pointPx) || 0, y: parseFloat(pointPy) || 0, z: parseFloat(pointPz) || 0 };
        const pl = {
          a: parseFloat(planeA) || 1,
          b: parseFloat(planeB) || 0,
          c: parseFloat(planeC) || 0,
          d: parseFloat(planeD) || 0,
        };
        return solvePointAndPlane(p, pl);
      }
      case 'distances': {
        const l1 = { p: { x: 0, y: 0, z: 0 }, d: { x: 1, y: 2, z: 2 } };
        const l2 = { p: { x: 2, y: 1, z: 0 }, d: { x: 2, y: 1, z: -1 } };
        return solveSkewLines(l1, l2);
      }
      case 'parabola':
      case 'ellipse':
      case 'hyperbola': {
        const a = parseFloat(conicParamA) || 4;
        const b = parseFloat(conicParamB) || 3;
        return solveConic(topicId as 'parabola' | 'ellipse' | 'hyperbola', a, b);
      }
      default: {
        return solveStraightLine({ a: 3, b: 4, c: -12 }, { a: 4, b: -3, c: 5 }, { x: 1, y: 2 });
      }
    }
  };

  const result = calculateResult();

  return (
    <div className="w-full space-y-5">
      {/* Quick Example Scenarios Banner */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Quick Test Examples:
        </span>
        <button
          onClick={() => loadPreset('mirror-c')}
          className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono transition-colors"
        >
          u = -30 cm, f = -15 cm (Mirror)
        </button>
        <button
          onClick={() => loadPreset('prism-min-dev')}
          className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono transition-colors"
        >
          A = 60°, δ_m = 30° ⟹ n (Prism)
        </button>
        <button
          onClick={() => loadPreset('tir-test')}
          className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono transition-colors"
        >
          sin r &gt; 1 (TIR Flag)
        </button>
        <button
          onClick={() => loadPreset('lens-maker')}
          className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono transition-colors"
        >
          Lens Maker (R₁=+20, R₂=-20)
        </button>
      </div>

      {/* Input Parameters Form (Touch-Friendly min 44px) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Enter Given Values (Leave target unknown blank)
        </div>

        {/* Spherical Mirror Form */}
        {topicId === 'spherical-mirror' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400">Mirror Type:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMirrorType('concave')}
                  className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    mirrorType === 'concave' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Concave (f &lt; 0)
                </button>
                <button
                  type="button"
                  onClick={() => setMirrorType('convex')}
                  className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    mirrorType === 'convex' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Convex (f &gt; 0)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Object distance u (cm) <span className="text-sky-400 font-bold">[NCERT: -ve]</span>
                </label>
                <input
                  type="number"
                  value={mirrorU}
                  onChange={(e) => setMirrorU(e.target.value)}
                  placeholder="e.g. -30 (or leave blank)"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Focal length f (cm)
                </label>
                <input
                  type="number"
                  value={mirrorF}
                  onChange={(e) => setMirrorF(e.target.value)}
                  placeholder="e.g. -15 (or leave blank)"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Image distance v (cm)
                </label>
                <input
                  type="number"
                  value={mirrorV}
                  onChange={(e) => setMirrorV(e.target.value)}
                  placeholder="Leave blank to solve"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Refraction Form */}
        {topicId === 'refraction' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Medium 1 Index n₁</label>
              <input
                type="number"
                step="0.01"
                value={refrN1}
                onChange={(e) => setRefrN1(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Medium 2 Index n₂</label>
              <input
                type="number"
                step="0.01"
                value={refrN2}
                onChange={(e) => setRefrN2(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Incident Angle i (deg)</label>
              <input
                type="number"
                value={refrI}
                onChange={(e) => setRefrI(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* Prism Form */}
        {topicId === 'prism' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Apex Angle A (deg)</label>
              <input
                type="number"
                value={prismA}
                onChange={(e) => setPrismA(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Min Deviation δ_m (deg)</label>
              <input
                type="number"
                value={prismDm}
                onChange={(e) => setPrismDm(e.target.value)}
                placeholder="Leave blank or enter"
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Refractive Index n</label>
              <input
                type="number"
                step="0.001"
                value={prismN}
                onChange={(e) => setPrismN(e.target.value)}
                placeholder="Leave blank to solve"
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Incidence i (deg)</label>
              <input
                type="number"
                value={prismI}
                onChange={(e) => setPrismI(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* Lenses Form */}
        {topicId === 'lenses' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLensType('convex')}
                className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold ${lensType === 'convex' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Convex (f &gt; 0)
              </button>
              <button
                type="button"
                onClick={() => setLensType('concave')}
                className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold ${lensType === 'concave' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Concave (f &lt; 0)
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Object distance u (cm)</label>
                <input
                  type="number"
                  value={lensU}
                  onChange={(e) => setLensU(e.target.value)}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Focal length f (cm)</label>
                <input
                  type="number"
                  value={lensF}
                  onChange={(e) => setLensF(e.target.value)}
                  placeholder="Or use Lens Maker"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Lens Index n</label>
                <input
                  type="number"
                  step="0.01"
                  value={lensIndex}
                  onChange={(e) => setLensIndex(e.target.value)}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Radius R₁ (cm) [Cartesian sign]</label>
                <input
                  type="number"
                  value={lensR1}
                  onChange={(e) => setLensR1(e.target.value)}
                  placeholder="e.g. +20"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Radius R₂ (cm) [Cartesian sign]</label>
                <input
                  type="number"
                  value={lensR2}
                  onChange={(e) => setLensR2(e.target.value)}
                  placeholder="e.g. -20"
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Vectors Form */}
        {(topicId === 'vector-ops' || topicId === 'triple-products') && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-sky-400 font-semibold mb-1">Vector a (x, y, z):</div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={vecAx} onChange={(e) => setVecAx(e.target.value)} placeholder="x" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={vecAy} onChange={(e) => setVecAy(e.target.value)} placeholder="y" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={vecAz} onChange={(e) => setVecAz(e.target.value)} placeholder="z" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
              </div>
            </div>
            <div>
              <div className="text-xs text-orange-400 font-semibold mb-1">Vector b (x, y, z):</div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={vecBx} onChange={(e) => setVecBx(e.target.value)} placeholder="x" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={vecBy} onChange={(e) => setVecBy(e.target.value)} placeholder="y" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={vecBz} onChange={(e) => setVecBz(e.target.value)} placeholder="z" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
              </div>
            </div>
            {topicId === 'triple-products' && (
              <div>
                <div className="text-xs text-emerald-400 font-semibold mb-1">Vector c (x, y, z):</div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={vecCx} onChange={(e) => setVecCx(e.target.value)} placeholder="x" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                  <input type="number" value={vecCy} onChange={(e) => setVecCy(e.target.value)} placeholder="y" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                  <input type="number" value={vecCz} onChange={(e) => setVecCz(e.target.value)} placeholder="z" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3D Point and Plane Form */}
        {(topicId === 'foot-image' || topicId === 'line-plane') && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-amber-400 font-semibold mb-1">Point P(x, y, z):</div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={pointPx} onChange={(e) => setPointPx(e.target.value)} placeholder="x" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={pointPy} onChange={(e) => setPointPy(e.target.value)} placeholder="y" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={pointPz} onChange={(e) => setPointPz(e.target.value)} placeholder="z" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
              </div>
            </div>
            <div>
              <div className="text-xs text-sky-400 font-semibold mb-1">Plane ax + by + cz = d:</div>
              <div className="grid grid-cols-4 gap-2">
                <input type="number" value={planeA} onChange={(e) => setPlaneA(e.target.value)} placeholder="a" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={planeB} onChange={(e) => setPlaneB(e.target.value)} placeholder="b" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={planeC} onChange={(e) => setPlaneC(e.target.value)} placeholder="c" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
                <input type="number" value={planeD} onChange={(e) => setPlaneD(e.target.value)} placeholder="d" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono" />
              </div>
            </div>
          </div>
        )}

        {/* Conic Form */}
        {(topicId === 'parabola' || topicId === 'ellipse' || topicId === 'hyperbola') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Parameter a (semi-major axis / focal parameter)</label>
              <input
                type="number"
                value={conicParamA}
                onChange={(e) => setConicParamA(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            {topicId !== 'parabola' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Parameter b (semi-minor axis)</label>
                <input
                  type="number"
                  value={conicParamB}
                  onChange={(e) => setConicParamB(e.target.value)}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result Card: Verdict Line + Numbers List */}
      <VerdictCard result={result} />

      {/* Step-by-Step Mathematical Derivation */}
      {result.steps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-sky-400" />
            Step-by-Step Analytical Solution
          </div>

          <div className="space-y-3">
            {result.steps.map((step, idx) => (
              <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 flex items-center justify-center text-[11px] border border-sky-800 shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </div>
                <div className="font-mono text-sky-300 pl-7 text-[11.5px]">
                  Formula: {step.formula}
                </div>
                <div className="font-mono text-slate-300 pl-7 text-[11.5px]">
                  Substitution: {step.substitution}
                </div>
                <div className="font-mono font-bold text-emerald-400 pl-7 text-xs">
                  Result: {step.result}
                </div>
                {step.note && (
                  <div className="text-[11px] text-slate-400 pl-7 italic">
                    Note: {step.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
