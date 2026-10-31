import React, { useState } from 'react';
import { X, Search, Sparkles, BookOpen, Layers, GitBranch } from 'lucide-react';

interface FormulaVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaVaultModal: React.FC<FormulaVaultModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'optics' | 'vectors' | 'coordinate'>('optics');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const sections = {
    optics: [
      {
        title: 'Spherical Mirrors & Reflection',
        formulas: [
          { name: 'Mirror Formula', expr: '1/v + 1/u = 1/f', note: 'NCERT sign convention: u is negative for real objects. f < 0 for concave, f > 0 for convex.' },
          { name: 'Transverse Magnification', expr: 'm = -v/u = f / (f - u) = (f - v) / f', note: 'm < 0: Inverted image; m > 0: Erect image; |m| > 1: Magnified.' },
          { name: 'Longitudinal Magnification', expr: 'm_L = dv/du = - (v/u)² = - m²', note: 'Valid for small linear objects along principal axis.' },
          { name: "Newton's Formula", expr: 'x₁ · x₂ = f²', note: 'x₁ and x₂ are distances of object and image from the focus (F).' },
          { name: 'Rotating Mirror Deviation', expr: 'δ = 2θ', note: 'Reflected ray turns by 2θ in same angular direction when mirror rotates by θ with fixed incident ray.' },
          { name: 'Number of Images (Two Mirrors)', expr: 'n = (360°/θ) - 1 (if even, or symmetric odd)', note: 'If 360°/θ is odd and object placed asymmetrically, n = 360°/θ.' },
        ],
      },
      {
        title: 'Refraction & TIR',
        formulas: [
          { name: "Snell's Law", expr: 'n₁ · sin(i) = n₂ · sin(r)', note: 'Light bends towards normal if n₂ > n₁; away if n₂ < n₁.' },
          { name: 'Critical Angle (TIR)', expr: 'sin(θ_c) = n_rarer / n_denser', note: 'TIR occurs ONLY if n₁ > n₂ and i > θ_c. 100% of light energy is reflected.' },
          { name: "Brewster's Law", expr: 'tan(θ_p) = n₂ / n₁', note: 'At Brewster angle, reflected ray is completely polarized perpendicular to plane of incidence and r + θ_p = 90°.' },
          { name: 'Apparent Depth', expr: "d' = d_real · (n_observer / n_object)", note: 'Shift = d_real · (1 - 1/n_rel).' },
          { name: 'Lateral Shift in Parallel Slab', expr: 'd_lat = t · sin(i - r) / cos(r)', note: 'For small angles (near normal incidence): d_lat ≈ t · i · (1 - 1/n).' },
        ],
      },
      {
        title: 'Lenses & Combinations',
        formulas: [
          { name: 'Thin Lens Formula', expr: '1/v - 1/u = 1/f', note: 'Convex lens f > 0; Concave lens f < 0. Real image formed has v > 0.' },
          { name: 'Magnification of Lens', expr: 'm = + v/u = f / (f + u)', note: 'Notice + sign for lens, unlike -v/u for mirror!' },
          { name: "Lens Maker's Formula", expr: '1/f = (n_lens/n_med - 1) · (1/R₁ - 1/R₂)', note: 'Substitute R₁ and R₂ with explicit Cartesian signs. For equiconvex: R₁ > 0, R₂ < 0 ⟹ 1/f = 2(n-1)/R.' },
          { name: 'Two Lenses in Contact', expr: '1/F = 1/f₁ + 1/f₂,  P = P₁ + P₂', note: 'Powers add directly in Dioptres (P = 100/f_cm).' },
          { name: 'Silvered Lens-Mirror', expr: 'P_eq = 2P_L + P_M  ⟹  1/F_eq = 2/f_L - 1/f_M', note: 'Combination acts as equivalent spherical mirror. Plano-convex silvered on plane face: f_eq = R / (2(n-1)).' },
          { name: 'Displacement Method', expr: 'f = (D² - d²) / (4D)', note: 'D is distance between screen and object (D ≥ 4f for real image). d is separation between two lens positions.' },
        ],
      },
      {
        title: 'Prism Dispersion & Deviation',
        formulas: [
          { name: 'Prism Ray Deviation', expr: 'δ = i + e - A,  r₁ + r₂ = A', note: 'A is prism apex angle.' },
          { name: 'Minimum Deviation Condition', expr: 'i = e,  r₁ = r₂ = A/2,  n = sin((A + δ_m)/2) / sin(A/2)', note: 'At δ_m, ray passes symmetrically parallel to prism base.' },
          { name: 'Thin Prism Approximation', expr: 'δ ≈ (n - 1) · A', note: 'Strictly valid for small apex angles A ≤ 10°.' },
          { name: 'Condition for No Emergence (TIR at 2nd face)', expr: 'A > 2 · θ_c', note: 'Ray suffers TIR at second face for all angles of incidence.' },
        ],
      },
    ],
    vectors: [
      {
        title: 'Vector Products & Invariants',
        formulas: [
          { name: 'Dot Product & Projection', expr: 'a · b = |a||b| cos θ,  proj_b(a) = (a · b) / |b|', note: 'a ⊥ b ⟺ a · b = 0.' },
          { name: 'Cross Product & Parallelogram Area', expr: 'a × b = |a||b| sin θ n̂,  Area = |a × b|', note: 'Anti-commutative: a × b = -(b × a). Triangle area = 1/2 |a × b|.' },
          { name: "Lagrange's Identity", expr: '|a × b|² + (a · b)² = |a|² |b|²', note: 'Useful for finding cross product magnitude when dot product is known.' },
          { name: 'Scalar Triple Product (Box Product)', expr: '[a b c] = a · (b × c) = det | a ; b ; c |', note: '[a b c] = Volume of parallelepiped. Tetrahedron volume = 1/6 |[a b c]|.' },
          { name: 'Coplanarity Condition', expr: '[a b c] = 0', note: 'Three vectors are coplanar if and only if their scalar triple product vanishes.' },
          { name: 'Vector Triple Product (BAC-CAB Rule)', expr: 'a × (b × c) = (a · c)b - (a · b)c', note: 'Middle vector b comes first with positive sign!' },
        ],
      },
      {
        title: '3D Lines, Planes & Distances',
        formulas: [
          { name: 'Symmetric Form of 3D Line', expr: '(x - x₁)/l = (y - y₁)/m = (z - z₁)/n = λ', note: 'Ensure coefficients of x, y, z are +1 before reading direction ratios.' },
          { name: 'Angle Between Line and Plane', expr: 'sin θ = |b · n| / (|b| |n|)', note: 'Notice sin θ, not cos θ! (Because n is normal to plane).' },
          { name: 'Point to Plane Distance', expr: 'd = |ax₀ + by₀ + cz₀ - d| / √(a² + b² + c²)', note: 'Foot of perpendicular: (x - x₀)/a = (y - y₀)/b = (z - z₀)/c = - (ax₀+by₀+cz₀-d)/(a²+b²+c²).' },
          { name: 'Image of Point in Plane', expr: 'Image = 2 · Foot - Point', note: 'Ratio parameter k for image is exactly 2 · k_foot.' },
          { name: 'Shortest Distance Between Skew Lines', expr: 'd = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|', note: 'If b₁ × b₂ = 0 (parallel lines): d = |(a₂ - a₁) × b| / |b|.' },
          { name: 'Distance Between Parallel Planes', expr: 'd = |d₁ - d₂| / √(a² + b² + c²)', note: 'Ensure normal vector coefficients a, b, c are scaled to be identical first.' },
        ],
      },
    ],
    coordinate: [
      {
        title: 'Straight Lines & Circles',
        formulas: [
          { name: 'Point to Line Distance', expr: 'd = |ax₀ + by₀ + c| / √(a² + b²)', note: 'Perpendicular distance from (x₀, y₀) to ax + by + c = 0.' },
          { name: 'Angle Between Lines', expr: 'tan θ = |(m₁ - m₂) / (1 + m₁ m₂)|', note: 'Lines are perpendicular if m₁ m₂ = -1 (a₁ a₂ + b₁ b₂ = 0).' },
          { name: 'Family of Lines', expr: 'L₁ + λ L₂ = 0', note: 'Passes through point of intersection of L₁ = 0 and L₂ = 0 for any parameter λ.' },
          { name: 'Length of Tangent to Circle', expr: 'L = √S₁ = √(x₁² + y₁² + 2gx₁ + 2fy₁ + c)', note: 'For circle x² + y² = r²: L = √(x₁² + y₁² - r²).' },
          { name: 'Condition of Tangency to Circle', expr: 'c² = r² (1 + m²)', note: 'Tangent line: y = mx ± r√(1 + m²).' },
          { name: 'Director Circle of Circle', expr: 'x² + y² = 2r²', note: 'Locus of intersection of perpendicular tangents. Radius is r√2.' },
          { name: 'Radical Axis of Two Circles', expr: 'S₁ - S₂ = 0', note: 'Locus of points from which lengths of tangents to both circles are equal.' },
        ],
      },
      {
        title: 'Conics: Parabola, Ellipse & Hyperbola',
        formulas: [
          { name: 'Parabola: y² = 4ax', expr: 'Focus (a, 0), Directrix x = -a, e = 1, LR = 4a', note: 'Focal chord parameters: t₁ t₂ = -1. Length of focal chord: a(t + 1/t)².' },
          { name: 'Parabola Tangent & Director Circle', expr: 'y = mx + a/m  or  ty = x + at²', note: 'Director circle of parabola is its directrix x = -a (perpendicular tangents intersect on directrix at 90°).' },
          { name: 'Ellipse: x²/a² + y²/b² = 1', expr: 'e = √(1 - b²/a²), Foci (±ae, 0), Directrices x = ±a/e', note: 'Sum of focal distances SP + S\'P = 2a. Latus rectum = 2b²/a.' },
          { name: 'Ellipse Tangent & Director Circle', expr: 'y = mx ± √(a² m² + b²),  Director: x² + y² = a² + b²', note: 'Auxiliary circle is x² + y² = a² (locus of feet of perpendiculars from foci onto any tangent).' },
          { name: 'Hyperbola: x²/a² - y²/b² = 1', expr: 'e = √(1 + b²/a²), Foci (±ae, 0), Asymptotes y = ±(b/a)x', note: 'Difference of focal distances |SP - S\'P| = 2a. Latus rectum = 2b²/a.' },
          { name: 'Conjugate Hyperbola Invariant', expr: '1/e₁² + 1/e₂² = 1', note: 'Golden JEE invariant: sum of reciprocal squares of eccentricities equals 1.' },
          { name: 'Rectangular Hyperbola', expr: 'a = b ⟹ e = √2, Asymptotes: x² - y² = 0 (at 90°)', note: 'Standard form xy = c² has eccentricity √2 and asymptotes as coordinate axes.' },
        ],
      },
    ],
  };

  const currentSections = sections[activeTab].map(sec => ({
    ...sec,
    formulas: sec.formulas.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.expr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.note.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(sec => sec.formulas.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                JEE &amp; NEET Formula Vault &amp; Shortcut Handbook
              </h3>
              <p className="text-[11px] text-slate-400">
                Class 11-12 high-yield formulas, invariants, and standard traps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Lab Tabs */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas, shortcuts, Newton's law, TIR, asymptotes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => setActiveTab('optics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'optics' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Lab 1: Optics (JEE + NEET)
            </button>
            <button
              onClick={() => setActiveTab('vectors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'vectors' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Lab 2: Vectors &amp; 3D (JEE Adv)
            </button>
            <button
              onClick={() => setActiveTab('coordinate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'coordinate' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Lab 3: Coordinate Geometry (JEE Adv)
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentSections.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No formulas match &quot;{searchQuery}&quot;. Try searching for &quot;mirror&quot;, &quot;focal&quot;, or &quot;tangent&quot;.
            </div>
          ) : (
            currentSections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                  {sec.title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {sec.formulas.map((item, j) => (
                    <div
                      key={j}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="font-mono text-sky-300 font-bold text-xs bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        {item.expr}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                        {item.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
          >
            Close Handbook
          </button>
        </div>
      </div>
    </div>
  );
};
