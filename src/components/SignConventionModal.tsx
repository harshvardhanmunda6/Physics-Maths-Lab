import React from 'react';
import { X, Check } from 'lucide-react';

interface SignConventionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignConventionModal: React.FC<SignConventionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              NCERT Cartesian Sign Convention Reference
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard rules required for JEE Main, JEE Advanced, and NEET
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
            <div className="font-bold text-sky-400 text-sm">Fundamental Rules:</div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400 font-bold shrink-0">1.</span>
              <span>All optical distances are measured from the <strong>Pole (P)</strong> of the mirror or the <strong>Optical Center (O)</strong> of the lens taken as the origin (0, 0).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400 font-bold shrink-0">2.</span>
              <span>Distances measured in the direction of the incident ray (conventionally left-to-right, +x) are taken as <strong>POSITIVE (+)</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400 font-bold shrink-0">3.</span>
              <span>Distances measured against the direction of incident light (-x) are taken as <strong>NEGATIVE (-)</strong>. Hence, real object distance <strong>u is ALWAYS negative</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400 font-bold shrink-0">4.</span>
              <span>Heights measured upwards perpendicular to the principal axis (+y) are <strong>POSITIVE (+)</strong>; downwards (-y) are <strong>NEGATIVE (-)</strong>.</span>
            </div>
          </div>

          {/* Quick Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-800 text-left">
              <thead>
                <tr className="bg-slate-800/60 text-slate-200">
                  <th className="p-2 border border-slate-700">Optical Element</th>
                  <th className="p-2 border border-slate-700">Focal Length (f)</th>
                  <th className="p-2 border border-slate-700">Radius of Curvature (R)</th>
                  <th className="p-2 border border-slate-700">Formula</th>
                  <th className="p-2 border border-slate-700">Magnification (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-200 border border-slate-800">Concave Mirror</td>
                  <td className="p-2 text-rose-400 border border-slate-800">-ve (f &lt; 0)</td>
                  <td className="p-2 text-rose-400 border border-slate-800">-ve (R = 2f)</td>
                  <td className="p-2 text-slate-300 border border-slate-800">1/v + 1/u = 1/f</td>
                  <td className="p-2 text-amber-300 border border-slate-800">m = -v/u</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-200 border border-slate-800">Convex Mirror</td>
                  <td className="p-2 text-emerald-400 border border-slate-800">+ve (f &gt; 0)</td>
                  <td className="p-2 text-emerald-400 border border-slate-800">+ve (R = 2f)</td>
                  <td className="p-2 text-slate-300 border border-slate-800">1/v + 1/u = 1/f</td>
                  <td className="p-2 text-amber-300 border border-slate-800">m = -v/u</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-200 border border-slate-800">Convex (Converging) Lens</td>
                  <td className="p-2 text-emerald-400 border border-slate-800">+ve (f &gt; 0)</td>
                  <td className="p-2 text-slate-400 border border-slate-800">R₁ &gt; 0, R₂ &lt; 0</td>
                  <td className="p-2 text-slate-300 border border-slate-800">1/v - 1/u = 1/f</td>
                  <td className="p-2 text-amber-300 border border-slate-800">m = +v/u</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-200 border border-slate-800">Concave (Diverging) Lens</td>
                  <td className="p-2 text-rose-400 border border-slate-800">-ve (f &lt; 0)</td>
                  <td className="p-2 text-slate-400 border border-slate-800">R₁ &lt; 0, R₂ &gt; 0</td>
                  <td className="p-2 text-slate-300 border border-slate-800">1/v - 1/u = 1/f</td>
                  <td className="p-2 text-amber-300 border border-slate-800">m = +v/u</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-amber-200">
            <span className="font-bold">Crucial JEE/NEET Rule:</span> In lens problems, real images have <span className="font-mono text-emerald-300">v &gt; 0</span> (formed on opposite side) and <span className="font-mono text-rose-300">m &lt; 0</span> (inverted). In mirror problems, real images have <span className="font-mono text-rose-300">v &lt; 0</span> (formed in front) and <span className="font-mono text-rose-300">m &lt; 0</span>.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
