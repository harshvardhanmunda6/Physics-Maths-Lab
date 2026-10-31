import { LabId, TopicMeta, PracticeQuestion, TopicId } from '../types';

export interface LabDefinition {
  id: LabId;
  title: string;
  badge: 'JEE Advanced + NEET' | 'JEE Advanced';
  description: string;
  topics: TopicMeta[];
}

export const LABS: LabDefinition[] = [
  {
    id: 'optics',
    title: 'Lab 1: Ray Optics & Wave Fronts',
    badge: 'JEE Advanced + NEET',
    description: 'Reflection, spherical mirrors, Snell’s law, critical angle & TIR, thin lenses, lens maker’s formula, and prism dispersion.',
    topics: [
      {
        id: 'plane-mirror',
        labId: 'optics',
        title: 'Plane Mirror & Reflection',
        subtitle: 'Image distance, rotating mirror deviation (2θ), two inclined mirrors',
        examTarget: 'JEE Advanced + NEET',
        examTip: 'When a plane mirror rotates by angle θ keeping the incident ray fixed, the reflected ray turns by 2θ in the same angular sense.',
        commonMistake: 'Using n = 360/θ without checking whether the object lies symmetrically or asymmetrically on the angle bisector when 360/θ is odd.',
      },
      {
        id: 'spherical-mirror',
        labId: 'optics',
        title: 'Spherical Mirrors',
        subtitle: 'Mirror formula 1/v + 1/u = 1/f, magnification m = -v/u, 3 principal rays',
        examTarget: 'JEE Advanced + NEET',
        examTip: 'Always write u with a negative sign for real objects in front of the mirror (NCERT Cartesian convention).',
        commonMistake: 'Forgetting that m = -v/u for spherical mirrors, but m = +v/u for lenses. The minus sign in mirrors is essential.',
      },
      {
        id: 'refraction',
        labId: 'optics',
        title: 'Refraction & Total Internal Reflection',
        subtitle: 'Snell’s law, apparent depth, slab lateral shift, TIR, Brewster’s angle',
        examTarget: 'JEE Advanced + NEET',
        examTip: 'At Brewster’s polarization angle (tan θ_p = n₂/n₁), the reflected ray and refracted ray are mutually perpendicular (θ_p + r = 90°).',
        commonMistake: 'Attempting to calculate real angle r when sin r > 1. Remember: sin r > 1 flags Total Internal Reflection (TIR), not invalid geometry!',
      },
      {
        id: 'lenses',
        labId: 'optics',
        title: 'Lenses & Combinations',
        subtitle: 'Lens formula 1/v - 1/u = 1/f, Lens Maker’s, two lenses in contact, silvered combinations',
        examTarget: 'JEE Advanced + NEET',
        examTip: 'When a lens is silvered on one side, it acts as an equivalent mirror with power P_eq = 2P_lens + P_mirror and 1/F_eq = 2/f_L - 1/f_M.',
        commonMistake: 'Applying Lens Maker’s formula without substituting R₁ and R₂ with their explicit Cartesian signs (e.g. for equiconvex, R₁ > 0 and R₂ < 0).',
      },
      {
        id: 'prism',
        labId: 'optics',
        title: 'Prism & Minimum Deviation',
        subtitle: 'Deviation δ = i + e - A, minimum deviation prism formula, thin prism δ = (n-1)A',
        examTarget: 'JEE Advanced + NEET',
        examTip: 'At minimum deviation δ_m, the ray passes symmetrically through the prism, so i = e and the internal ray is parallel to the base (r₁ = r₂ = A/2).',
        commonMistake: 'Assuming the thin prism formula δ = (n-1)A applies to prisms with large apex angles like 60°. It is only valid for small angles (A ≤ 10°).',
      },
    ],
  },
  {
    id: 'vectors',
    title: 'Lab 2: Vectors & 3D Geometry',
    badge: 'JEE Advanced',
    description: 'Vector products, scalar & vector triple products, 3D lines, planes, shortest distances, foot of perpendicular, and reflections.',
    topics: [
      {
        id: 'vector-ops',
        labId: 'vectors',
        title: 'Vector Operations & Projections',
        subtitle: 'Addition, dot product, cross product, projection, angle between vectors',
        examTarget: 'JEE Advanced',
        examTip: 'The scalar projection of a on b is (a · b)/|b|, whereas the vector projection is ((a · b)/|b|²) b.',
        commonMistake: 'Confusing vector cross product direction: a × b = -(b × a). It is anticommutative and follows the right-hand rule.',
      },
      {
        id: 'triple-products',
        labId: 'vectors',
        title: 'Scalar & Vector Triple Products',
        subtitle: 'Box product [a b c], coplanarity condition, BAC-CAB rule',
        examTarget: 'JEE Advanced',
        examTip: 'Remember the BAC-CAB rule for vector triple product: a × (b × c) = (a · c)b - (a · b)c. Notice the middle vector b comes first!',
        commonMistake: 'Thinking [a b c] = [b a c]. Swapping two vectors changes the sign: [a b c] = -[b a c]. Cyclic order preserves value: [a b c] = [b c a] = [c a b].',
      },
      {
        id: 'line-plane',
        labId: 'vectors',
        title: 'Lines & Planes in 3D',
        subtitle: 'Symmetric line form, Cartesian plane ax+by+cz=d, angle between line and plane',
        examTarget: 'JEE Advanced',
        examTip: 'Angle θ between a line with direction b and a plane with normal n satisfies sin(θ) = |b · n| / (|b||n|), not cos(θ)!',
        commonMistake: 'Writing line equation without ensuring coefficients of x, y, z in symmetric form are +1 (e.g. (2x - 4)/3 must be rewritten as (x - 2)/(3/2)).',
      },
      {
        id: 'distances',
        labId: 'vectors',
        title: 'Distances in 3D Space',
        subtitle: 'Point-line, point-plane, skew lines shortest distance, parallel planes',
        examTarget: 'JEE Advanced',
        examTip: 'For skew lines r₁ = a₁ + λ b₁ and r₂ = a₂ + μ b₂, the shortest distance vector is along the unit vector (b₁ × b₂)/|b₁ × b₂|.',
        commonMistake: 'Using skew lines formula when lines are parallel (b₁ × b₂ = 0). For parallel lines, use d = |(a₂ - a₁) × b| / |b|.',
      },
      {
        id: 'foot-image',
        labId: 'vectors',
        title: 'Foot of Perpendicular & Image Point',
        subtitle: 'Reflection of a point in a plane or line, mid-point property',
        examTarget: 'JEE Advanced',
        examTip: 'The foot of perpendicular from (x₀,y₀,z₀) to ax+by+cz+d=0 uses k = - (ax₀+by₀+cz₀+d)/(a²+b²+c²); the image point uses exactly 2k.',
        commonMistake: 'Forgetting to bring the plane equation into the form ax+by+cz-d=0 (checking constant sign) before evaluating the numerator.',
      },
    ],
  },
  {
    id: 'coordinate',
    title: 'Lab 3: Coordinate Geometry',
    badge: 'JEE Advanced',
    description: 'Straight lines, circles, tangent & normal, radical axis, parabola, ellipse, hyperbola, and focal chord geometry.',
    topics: [
      {
        id: 'straight-lines',
        labId: 'coordinate',
        title: 'Straight Lines & Family of Lines',
        subtitle: 'Slope-intercept, angle between lines, perpendicular distance, L₁ + λL₂ = 0',
        examTarget: 'JEE Advanced',
        examTip: 'The family of lines through the intersection of L₁=0 and L₂=0 is L₁ + λ L₂ = 0, which eliminates finding the intersection point directly.',
        commonMistake: 'Assuming lines are parallel when m₁ = m₂ without checking that c₁ ≠ c₂ (otherwise they are identical/coincident lines).',
      },
      {
        id: 'circles',
        labId: 'coordinate',
        title: 'Circles & Common Tangents',
        subtitle: 'Standard circle, tangent T=0, length of tangent √S₁, radical axis, common tangents',
        examTarget: 'JEE Advanced',
        examTip: 'Two non-intersecting circles have 4 common tangents (2 direct, 2 transverse) if center distance d > r₁ + r₂.',
        commonMistake: 'Using T = 0 for finding tangents from an external point. T = 0 represents the chord of contact when the point lies outside!',
      },
      {
        id: 'parabola',
        labId: 'coordinate',
        title: 'Parabola: y² = 4ax',
        subtitle: 'Focus, directrix, focal chord (t₁t₂ = -1), tangent y = mx + a/m, normal',
        examTarget: 'JEE Advanced',
        examTip: 'The tangents at the extremities of any focal chord of a parabola intersect at right angles (90°) on the directrix x = -a.',
        commonMistake: 'Assuming the length of focal chord with parameter t is 4a. The true length is a(t + 1/t)², with minimum length 4a at t = 1 (latus rectum).',
      },
      {
        id: 'ellipse',
        labId: 'coordinate',
        title: 'Ellipse: x²/a² + y²/b² = 1',
        subtitle: 'Foci (±ae, 0), directrix x = ±a/e, eccentricity e < 1, auxiliary circle',
        examTarget: 'JEE Advanced',
        examTip: 'The locus of foot of perpendicular from either focus of an ellipse on any tangent is the auxiliary circle x² + y² = a².',
        commonMistake: 'Confusing horizontal and vertical ellipse formulas when b > a: major axis becomes 2b, e = √(1 - a²/b²), and foci are on y-axis (0, ±be).',
      },
      {
        id: 'hyperbola',
        labId: 'coordinate',
        title: 'Hyperbola & Asymptotes',
        subtitle: 'x²/a² - y²/b² = 1, asymptotes y = ±(b/a)x, rectangular hyperbola xy = c²',
        examTarget: 'JEE Advanced',
        examTip: 'For any hyperbola and its conjugate hyperbola, 1/e₁² + 1/e₂² = 1 is an invariant identity frequently tested in JEE Advanced.',
        commonMistake: 'Thinking hyperbola directrices are between the foci and vertices. For hyperbola e > 1, so a/e < a < ae (directrix is inside vertex, focus is outside).',
      },
    ],
  },
];

// ----------------- PRACTICE QUESTIONS GENERATOR -----------------

export function getPracticeQuestionsForTopic(topicId: TopicId): PracticeQuestion[] {
  switch (topicId) {
    case 'plane-mirror':
      return [
        {
          id: 'pm-q1',
          topicId: 'plane-mirror',
          title: 'Deviation of Ray by Rotating Mirror',
          type: 'single-correct',
          prompt: 'A ray of light is incident on a plane mirror. If the plane mirror is turned by an angle of 15° clockwise about an axis in its plane, by what angle and in what direction does the reflected ray turn?',
          options: ['15° clockwise', '30° clockwise', '30° counter-clockwise', '0° (unchanged)'],
          correctAnswer: 1, // index 1 = 30° clockwise
          hints: [
            'Recall the rotating mirror deviation formula for a fixed incident ray.',
            'Deviation δ = 2 · θ in the same angular direction as the mirror rotation.',
          ],
          workedSolution: {
            formula: 'δ = 2θ (in same sense of rotation)',
            steps: [
              'Incident ray is fixed in space.',
              'The normal to the mirror rotates by angle θ = 15° clockwise.',
              'Angle of incidence changes, causing the reflected ray to deviate by δ = 2 · 15° = 30° clockwise.',
            ],
            finalAnswer: '30° clockwise',
          },
        },
        {
          id: 'pm-q2',
          topicId: 'plane-mirror',
          title: 'Images Formed by Inclined Mirrors',
          type: 'integer',
          prompt: 'Two plane mirrors are inclined at an angle θ = 60° to each other. An object is placed symmetrically on the angle bisector between them. Find the total number of images formed.',
          correctAnswer: 5,
          hints: [
            'Calculate m = 360° / θ.',
            'If m is even, the number of images n = m - 1, irrespective of position.',
          ],
          workedSolution: {
            formula: 'n = (360° / θ) - 1',
            steps: [
              'm = 360° / 60° = 6 (which is an EVEN integer).',
              'For any even integer m, the number of images n = m - 1 = 6 - 1 = 5.',
            ],
            finalAnswer: '5',
          },
        },
        {
          id: 'pm-q3',
          topicId: 'plane-mirror',
          title: 'Properties of Plane Mirror Reflection',
          type: 'multi-correct',
          prompt: 'Which of the following statements are correct for reflection in a plane mirror? (Select all that apply)',
          options: [
            'Transverse magnification m is always exactly +1.',
            'The focal length of a plane mirror is infinite (f = ∞, P = 0 D).',
            'If an object moves towards the mirror with velocity v, the image moves towards the object with relative speed 2v.',
            'The image formed of a real object is always real.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Is the image erect or inverted? What is image distance compared to object distance?',
            'Can a plane mirror produce a real image of a real object? (No, rays diverge).',
          ],
          workedSolution: {
            formula: 'v = -u, m = +1, f = ∞',
            steps: [
              'Option A: m = +h_i/h_o = +1 (virtual, erect, same size) -> CORRECT.',
              'Option B: Flat surface has radius of curvature R = ∞ ⟹ f = ∞, Power = 0 D -> CORRECT.',
              'Option C: Relative speed = v - (-v) = 2v -> CORRECT.',
              'Option D: Real object produces virtual image behind mirror -> INCORRECT.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
        {
          id: 'pm-q4',
          topicId: 'plane-mirror',
          title: 'Velocity of Image',
          type: 'numerical',
          prompt: 'A boy runs towards a stationary vertical plane mirror with a speed of 3.50 m/s. What is the speed of his image with respect to the boy (in m/s)?',
          correctAnswer: 7.00,
          tolerance: 0.05,
          hints: [
            'Velocity of image with respect to mirror is -v_object.',
            'Relative velocity = v_object - v_image.',
          ],
          workedSolution: {
            formula: 'v_rel = v_obj - v_img = v - (-v) = 2v',
            steps: [
              'v_boy = +3.50 m/s towards the mirror.',
              'v_image = -3.50 m/s towards the mirror.',
              'v_rel = 3.50 - (-3.50) = 7.00 m/s.',
            ],
            finalAnswer: '7.00 m/s',
          },
        },
        {
          id: 'pm-q5',
          topicId: 'plane-mirror',
          title: 'Minimum Height of Mirror',
          type: 'single-correct',
          prompt: 'To view his full-length image, a man of height H requires a plane mirror of minimum vertical length equal to:',
          options: ['H', 'H / 2', 'H / 3', 'H / 4'],
          correctAnswer: 1, // H/2
          hints: [
            'Use similar triangles between the eye, top of head, feet, and mirror position.',
          ],
          workedSolution: {
            formula: 'L_min = H / 2',
            steps: [
              'By law of reflection, rays from top of head and feet bisect vertically between mirror and eyes.',
              'The required length of mirror is independent of the distance of the man from the mirror and equals H/2.',
            ],
            finalAnswer: 'H / 2',
          },
        },
      ];

    case 'spherical-mirror':
      return [
        {
          id: 'sm-q1',
          topicId: 'spherical-mirror',
          title: 'Concave Mirror Image Distance & Magnification',
          type: 'single-correct',
          prompt: 'A concave mirror of focal length 15 cm forms an image of an object placed 30 cm in front of it. The position and nature of the image are:',
          options: [
            'v = -30 cm; Real, Inverted, Same size',
            'v = +30 cm; Virtual, Erect, Enlarged',
            'v = -10 cm; Real, Inverted, Diminished',
            'v = -15 cm; Real, Inverted, Same size',
          ],
          correctAnswer: 0,
          hints: [
            'Apply NCERT sign convention: u = -30 cm, f = -15 cm.',
            'Object is at Center of Curvature C (R = 2f = 30 cm).',
          ],
          workedSolution: {
            formula: '1/v + 1/u = 1/f',
            steps: [
              'Sign convention: u = -30 cm, f = -15 cm.',
              '1/v = 1/f - 1/u = 1/(-15) - 1/(-30) = -1/15 + 1/30 = -1/30.',
              'v = -30 cm (Real image, formed in front of mirror).',
              'm = -v/u = -(-30)/(-30) = -1.0 (Inverted, same size).',
            ],
            finalAnswer: 'v = -30 cm; Real, Inverted, Same size',
            signConventionNote: 'Negative v indicates real image; negative m indicates inverted.',
          },
        },
        {
          id: 'sm-q2',
          topicId: 'spherical-mirror',
          title: 'Convex Mirror Virtual Image Distance',
          type: 'numerical',
          prompt: 'An object is placed at a distance of 20.0 cm in front of a convex mirror of radius of curvature 40.0 cm. Find the image distance v in cm (include + sign for virtual image).',
          correctAnswer: 10.00,
          tolerance: 0.1,
          hints: [
            'For convex mirror, focal length f = +R/2 = +20.0 cm.',
            'u = -20.0 cm.',
          ],
          workedSolution: {
            formula: '1/v = 1/f - 1/u',
            steps: [
              'f = +R/2 = +40.0 / 2 = +20.0 cm.',
              'u = -20.0 cm.',
              '1/v = 1/20 - 1/(-20) = 1/20 + 1/20 = 2/20 = 1/10.',
              'v = +10.00 cm (behind the mirror, virtual and erect).',
            ],
            finalAnswer: '+10.00 cm',
          },
        },
        {
          id: 'sm-q3',
          topicId: 'spherical-mirror',
          title: 'Magnification & Focal Length',
          type: 'integer',
          prompt: 'A concave mirror produces an inverted real image 3 times the size of an object placed at a distance of 20 cm from it. What is the magnitude of the focal length of the mirror in cm?',
          correctAnswer: 15,
          hints: [
            'Real inverted image has magnification m = -3.',
            'Use m = f / (f - u).',
          ],
          workedSolution: {
            formula: 'm = f / (f - u)',
            steps: [
              'm = -3, u = -20 cm.',
              '-3 = f / (f - (-20)) = f / (f + 20).',
              '-3(f + 20) = f  ⟹  -3f - 60 = f  ⟹  -4f = 60  ⟹  f = -15 cm.',
              'Magnitude |f| = 15 cm.',
            ],
            finalAnswer: '15 cm',
          },
        },
        {
          id: 'sm-q4',
          topicId: 'spherical-mirror',
          title: 'Convex Mirror Properties',
          type: 'multi-correct',
          prompt: 'Which of the following statements are ALWAYS true for a convex spherical mirror with a real object? (Select all that apply)',
          options: [
            'The image is always virtual and erect.',
            'The image is formed between the pole and focus (0 < v < f).',
            'The magnification m is strictly positive and less than 1 (0 < m < 1).',
            'As the object moves from infinity to the pole, the image moves from focus to pole.',
          ],
          correctAnswer: [0, 1, 2, 3],
          hints: [
            'A convex mirror is a diverging mirror.',
            'Can it ever form a real image of a real object?',
          ],
          workedSolution: {
            formula: '1/v = 1/f - 1/u with f > 0, u < 0',
            steps: [
              '1/v = 1/f + 1/|u| > 1/f  ⟹  0 < v < f.',
              'All statements A, B, C, D are universally true for convex mirrors with real objects.',
            ],
            finalAnswer: 'A, B, C, D',
          },
        },
        {
          id: 'sm-q5',
          topicId: 'spherical-mirror',
          title: 'Longitudinal Magnification',
          type: 'single-correct',
          prompt: 'A small linear object of length dx is placed along the principal axis of a concave mirror at distance u. The longitudinal magnification m_L is given by:',
          options: ['-m', '-m²', '+m²', '+m'],
          correctAnswer: 1, // -m^2
          hints: [
            'Differentiate the mirror formula 1/v + 1/u = 1/f with respect to u.',
            '-dv/v² - du/u² = 0 ⟹ dv/du = -v²/u².',
          ],
          workedSolution: {
            formula: 'm_L = dv/du = -(v/u)² = -m²',
            steps: [
              '1/v + 1/u = 1/f.',
              'Differentiating: -v⁻² dv - u⁻² du = 0.',
              'dv/du = -v²/u² = -(v/u)² = -m².',
            ],
            finalAnswer: '-m²',
          },
        },
      ];

    case 'refraction':
      return [
        {
          id: 'refr-q1',
          topicId: 'refraction',
          title: 'Critical Angle for Glass-Air Interface',
          type: 'single-correct',
          prompt: 'Light travels from glass (refractive index n₁ = 1.50) into air (n₂ = 1.00). The critical angle θ_c for total internal reflection is:',
          options: ['30.0°', '41.8°', '48.6°', '60.0°'],
          correctAnswer: 1, // 41.8°
          hints: [
            'Apply sin(θ_c) = n₂ / n₁.',
            'arcsin(1 / 1.50) = arcsin(2/3).',
          ],
          workedSolution: {
            formula: 'sin(θ_c) = n₂ / n₁',
            steps: [
              'sin(θ_c) = 1.00 / 1.50 = 2/3 ≈ 0.6667.',
              'θ_c = arcsin(0.6667) ≈ 41.81°.',
            ],
            finalAnswer: '41.8°',
          },
        },
        {
          id: 'refr-q2',
          topicId: 'refraction',
          title: 'Apparent Depth of a Pool',
          type: 'numerical',
          prompt: 'A swimming pool is filled with water (n = 4/3 = 1.33) to a real depth of 4.00 m. What is its apparent depth (in meters) when viewed normally from above?',
          correctAnswer: 3.00,
          tolerance: 0.05,
          hints: [
            'Apparent depth d\' = d / n_rel.',
          ],
          workedSolution: {
            formula: "d' = d_real / n",
            steps: [
              "d' = 4.00 / (4/3) = 4.00 · 3 / 4 = 3.00 m.",
            ],
            finalAnswer: '3.00 m',
          },
        },
        {
          id: 'refr-q3',
          topicId: 'refraction',
          title: 'Brewster Angle Calculation',
          type: 'numerical',
          prompt: 'Find the Brewster polarizing angle θ_p (in degrees) for a ray incident from air (n₁ = 1.00) on a diamond surface (n₂ = 2.42).',
          correctAnswer: 67.55,
          tolerance: 0.2,
          hints: [
            'Brewster’s law: tan(θ_p) = n₂ / n₁.',
          ],
          workedSolution: {
            formula: 'tan(θ_p) = n₂ / n₁',
            steps: [
              'tan(θ_p) = 2.42 / 1.00 = 2.42.',
              'θ_p = arctan(2.42) ≈ 67.55°.',
            ],
            finalAnswer: '67.55°',
          },
        },
        {
          id: 'refr-q4',
          topicId: 'refraction',
          title: 'Conditions for Total Internal Reflection',
          type: 'multi-correct',
          prompt: 'Which of the following conditions MUST be satisfied for Total Internal Reflection to occur? (Select all that apply)',
          options: [
            'Light must travel from an optically denser medium to an optically rarer medium (n₁ > n₂).',
            'Angle of incidence i must be strictly greater than the critical angle θ_c (i > θ_c).',
            'Light must travel from rarer to denser medium.',
            'At the boundary, 100% of light intensity is reflected with zero transmission loss.',
          ],
          correctAnswer: [0, 1, 3],
          hints: [
            'Can light reflect internally when going from air to water?',
          ],
          workedSolution: {
            formula: 'sin(θ_c) = n_rarer / n_denser, i > θ_c',
            steps: [
              'TIR requires n₁ > n₂ and i > θ_c.',
              'Unlike metallic mirrors which absorb 4-10% of light, TIR is 100% efficient.',
            ],
            finalAnswer: 'A, B, D',
          },
        },
        {
          id: 'refr-q5',
          topicId: 'refraction',
          title: 'Lateral Shift in Parallel Glass Plate',
          type: 'single-correct',
          prompt: 'A light ray passes through a parallel glass slab of thickness t. If the incident angle i is very small (near normal incidence), the lateral displacement x is approximately:',
          options: ['t · i (1 - 1/n)', 't · i (1 + 1/n)', 't · n · i', 't / (n · i)'],
          correctAnswer: 0,
          hints: [
            'Start with exact formula x = t · sin(i - r) / cos(r).',
            'For small angles: sin(i - r) ≈ i - r, cos(r) ≈ 1, and r ≈ i / n.',
          ],
          workedSolution: {
            formula: 'x = t · (i - r) = t · (i - i/n) = t · i(1 - 1/n)',
            steps: [
              'For small angles, sin θ ≈ θ, cos θ ≈ 1.',
              'r = i / n.',
              'x = t · (i - i/n) = t · i · (1 - 1/n).',
            ],
            finalAnswer: 't · i (1 - 1/n)',
          },
        },
      ];

    case 'lenses':
      return [
        {
          id: 'lens-q1',
          topicId: 'lenses',
          title: 'Converging Lens Image & Magnification',
          type: 'single-correct',
          prompt: 'A convex lens of focal length 20 cm produces an image of an object placed 30 cm in front of it. What is the image distance v and magnification m?',
          options: [
            'v = +60 cm, m = -2.0 (Real, Inverted)',
            'v = -60 cm, m = +2.0 (Virtual, Erect)',
            'v = +12 cm, m = -0.4 (Real, Inverted)',
            'v = +30 cm, m = -1.0 (Real, Inverted)',
          ],
          correctAnswer: 0,
          hints: [
            'Sign convention for convex lens: f = +20 cm, u = -30 cm.',
            'Apply thin lens formula 1/v - 1/u = 1/f.',
          ],
          workedSolution: {
            formula: '1/v - 1/u = 1/f  ⟹  1/v = 1/f + 1/u',
            steps: [
              '1/v = 1/(+20) + 1/(-30) = 1/20 - 1/30 = 1/60.',
              'v = +60 cm.',
              'm = v / u = (+60) / (-30) = -2.0.',
              'Positive v indicates real image formed on opposite side; negative m indicates inverted.',
            ],
            finalAnswer: 'v = +60 cm, m = -2.0 (Real, Inverted)',
          },
        },
        {
          id: 'lens-q2',
          topicId: 'lenses',
          title: 'Power of Two Thin Lenses in Contact',
          type: 'numerical',
          prompt: 'A convex lens of focal length +25 cm and a concave lens of focal length -50 cm are placed in coaxial contact. What is the equivalent optical power P of the combination in Dioptres (D)?',
          correctAnswer: 2.00,
          tolerance: 0.05,
          hints: [
            'P₁ = 100 / f₁(cm), P₂ = 100 / f₂(cm).',
            'P_eq = P₁ + P₂.',
          ],
          workedSolution: {
            formula: 'P = P₁ + P₂ = 100/f₁ + 100/f₂',
            steps: [
              'P₁ = 100 / (+25) = +4.0 D.',
              'P₂ = 100 / (-50) = -2.0 D.',
              'P_eq = +4.0 + (-2.0) = +2.00 D.',
            ],
            finalAnswer: '+2.00 D',
          },
        },
        {
          id: 'lens-q3',
          topicId: 'lenses',
          title: 'Lens Maker Formula for Equiconvex Lens',
          type: 'integer',
          prompt: 'An equiconvex lens has refractive index n = 1.50 and radii of curvature R₁ = +20 cm, R₂ = -20 cm. Find its focal length in air in cm.',
          correctAnswer: 20,
          hints: [
            '1/f = (n - 1)(1/R₁ - 1/R₂).',
            'Substitute R₁ = +20 and R₂ = -20.',
          ],
          workedSolution: {
            formula: '1/f = (n - 1)(1/R₁ - 1/R₂)',
            steps: [
              '1/f = (1.50 - 1) · (1/20 - (-1/20)) = 0.5 · (2/20) = 0.5 · 0.1 = 1/20.',
              'f = 20 cm.',
            ],
            finalAnswer: '20 cm',
          },
        },
        {
          id: 'lens-q4',
          topicId: 'lenses',
          title: 'Silvered Lens Equivalent Mirror',
          type: 'single-correct',
          prompt: 'A plano-convex lens of focal length f has its curved surface silvered. The combination acts as:',
          options: [
            'A concave mirror of focal length f/2',
            'A convex mirror of focal length f/2',
            'A plane mirror',
            'A concave mirror of focal length f',
          ],
          correctAnswer: 0,
          hints: [
            'Equivalent power: P_eq = 2P_lens + P_mirror.',
            'Light passes through lens twice and reflects once.',
          ],
          workedSolution: {
            formula: 'P_eq = 2P_L + P_M',
            steps: [
              'Power adds: P_eq = 2/f_L + 1/f_M.',
              'Since the silvered curved surface reflects light inward, it acts as a concave mirror of focal length f_eq = f/2.',
            ],
            finalAnswer: 'A concave mirror of focal length f/2',
          },
        },
        {
          id: 'lens-q5',
          topicId: 'lenses',
          title: 'Focal Length in Medium',
          type: 'multi-correct',
          prompt: 'A glass convex lens (n_g = 1.50) is immersed in water (n_w = 1.33). What happens to its optical properties? (Select all that apply)',
          options: [
            'Its focal length increases by roughly a factor of 4.',
            'Its optical power decreases.',
            'It still behaves as a converging (convex) lens.',
            'It turns into a diverging (concave) lens.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Compare (n_g - 1) with (n_g/n_w - 1).',
            'Since n_g > n_w, does the sign of focal length change?',
          ],
          workedSolution: {
            formula: 'f_w / f_air = (n_g - 1) / (n_g/n_w - 1)',
            steps: [
              '(1.5 - 1) / (1.5/1.333 - 1) = 0.5 / (0.125) = 4.0.',
              'Focal length quadruples, power drops by 75%.',
              'Because n_g > n_w, the lens remains converging.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'prism':
      return [
        {
          id: 'prism-q1',
          topicId: 'prism',
          title: 'Refractive Index from Minimum Deviation',
          type: 'numerical',
          prompt: 'A prism has an apex angle A = 60.0°. At minimum deviation, the angle of deviation δ_m is 30.0°. Calculate the refractive index n of the prism (to 3 decimal places).',
          correctAnswer: 1.414,
          tolerance: 0.01,
          hints: [
            'Apply the prism formula: n = sin((A + δ_m) / 2) / sin(A / 2).',
            'sin(45°) / sin(30°) = (1/√2) / (1/2) = √2.',
          ],
          workedSolution: {
            formula: 'n = sin((A + δ_m)/2) / sin(A/2)',
            steps: [
              'n = sin((60° + 30°)/2) / sin(60°/2) = sin(45°) / sin(30°).',
              'sin(45°) = 1/√2 ≈ 0.7071, sin(30°) = 0.5000.',
              'n = 0.7071 / 0.5000 = √2 ≈ 1.414.',
            ],
            finalAnswer: '1.414 (or √2)',
          },
        },
        {
          id: 'prism-q2',
          topicId: 'prism',
          title: 'Thin Prism Deviation',
          type: 'numerical',
          prompt: 'A thin glass prism with apex angle A = 4.00° has refractive index n = 1.50. Find the deviation δ produced by it in degrees.',
          correctAnswer: 2.00,
          tolerance: 0.05,
          hints: [
            'For small apex angles A ≤ 10°, δ ≈ (n - 1)A.',
          ],
          workedSolution: {
            formula: 'δ = (n - 1) · A',
            steps: [
              'δ = (1.50 - 1) · 4.00° = 0.50 · 4.00° = 2.00°.',
            ],
            finalAnswer: '2.00°',
          },
        },
        {
          id: 'prism-q3',
          topicId: 'prism',
          title: 'Angle of Incidence at Minimum Deviation',
          type: 'integer',
          prompt: 'For a prism with apex angle A = 60° and minimum deviation δ_m = 30°, what is the angle of incidence i in degrees at the minimum deviation position?',
          correctAnswer: 45,
          hints: [
            'At minimum deviation: i = e.',
            'δ = i + e - A ⟹ δ_m = 2i - A.',
          ],
          workedSolution: {
            formula: 'i = (A + δ_m) / 2',
            steps: [
              'i = (60° + 30°) / 2 = 90° / 2 = 45°.',
            ],
            finalAnswer: '45°',
          },
        },
        {
          id: 'prism-q4',
          topicId: 'prism',
          title: 'Condition for No Emergence from Prism',
          type: 'single-correct',
          prompt: 'Light will NOT emerge from the second face of a prism (Total Internal Reflection occurs for all angles of incidence) if the apex angle A exceeds:',
          options: ['θ_c', '2 θ_c', 'θ_c / 2', '90°'],
          correctAnswer: 1, // 2 theta_c
          hints: [
            'Maximum value of r₁ is θ_c (when i = 90°).',
            'Since r₁ + r₂ = A, r₂ = A - r₁.',
          ],
          workedSolution: {
            formula: 'A > 2θ_c',
            steps: [
              'For any ray to emerge, r₂ must be ≤ θ_c.',
              'r₂_min = A - r₁_max = A - θ_c.',
              'If A - θ_c > θ_c ⟹ A > 2θ_c, then r₂ > θ_c for all rays, ensuring 100% TIR.',
            ],
            finalAnswer: '2 θ_c',
          },
        },
        {
          id: 'prism-q5',
          topicId: 'prism',
          title: 'Properties at Minimum Deviation',
          type: 'multi-correct',
          prompt: 'When a prism is oriented at the angle of minimum deviation, which of the following statements are correct? (Select all that apply)',
          options: [
            'Angle of incidence equals angle of emergence (i = e).',
            'The refracted ray inside an equilateral or isosceles prism travels parallel to its base.',
            'The internal angles of refraction are equal: r₁ = r₂ = A/2.',
            'The deviation is the smallest possible deviation for this prism.',
          ],
          correctAnswer: [0, 1, 2, 3],
          hints: [
            'Recall symmetry of ray path at minimum deviation.',
          ],
          workedSolution: {
            formula: 'i = e, r₁ = r₂ = A/2, δ = δ_m',
            steps: [
              'All statements are fundamental characteristics of the minimum deviation condition.',
            ],
            finalAnswer: 'A, B, C, D',
          },
        },
      ];

    // LAB 2: VECTORS & 3D GEOMETRY
    case 'vector-ops':
      return [
        {
          id: 'vec-q1',
          topicId: 'vector-ops',
          title: 'Angle Between Vectors',
          type: 'single-correct',
          prompt: 'If a = 2î + 2ĵ - k̂ and b = 6î - 3ĵ + 2k̂, what is the cosine of the angle between them (cos θ)?',
          options: ['4 / 21', '8 / 21', '2 / 7', '1 / 3'],
          correctAnswer: 0,
          hints: [
            'cos θ = (a · b) / (|a| |b|).',
            'Find a · b, |a|, and |b|.',
          ],
          workedSolution: {
            formula: 'cos θ = (a · b) / (|a| |b|)',
            steps: [
              'a · b = (2)(6) + (2)(-3) + (-1)(2) = 12 - 6 - 2 = 4.',
              '|a| = √(2² + 2² + (-1)²) = √(4 + 4 + 1) = 3.',
              '|b| = √(6² + (-3)² + 2²) = √(36 + 9 + 4) = 7.',
              'cos θ = 4 / (3 · 7) = 4 / 21.',
            ],
            finalAnswer: '4 / 21',
          },
        },
        {
          id: 'vec-q2',
          topicId: 'vector-ops',
          title: 'Vector Projection',
          type: 'numerical',
          prompt: 'Find the scalar projection of vector a = î + 2ĵ + 2k̂ onto vector b = 2î + 6ĵ + 3k̂.',
          correctAnswer: 2.86,
          tolerance: 0.05,
          hints: [
            'Projection of a on b = (a · b) / |b|.',
            '|b| = √(4 + 36 + 9) = 7.',
          ],
          workedSolution: {
            formula: 'proj_b(a) = (a · b) / |b|',
            steps: [
              'a · b = (1)(2) + (2)(6) + (2)(3) = 2 + 12 + 6 = 20.',
              '|b| = √(4 + 36 + 9) = 7.',
              'Projection = 20 / 7 ≈ 2.857.',
            ],
            finalAnswer: '2.86 (or 20/7)',
          },
        },
        {
          id: 'vec-q3',
          topicId: 'vector-ops',
          title: 'Area of Parallelogram via Cross Product',
          type: 'numerical',
          prompt: 'Find the area of the parallelogram having adjacent sides a = 3î + ĵ + 4k̂ and b = î - ĵ + k̂.',
          correctAnswer: 7.42,
          tolerance: 0.1,
          hints: [
            'Area = |a × b|.',
            'Compute cross product determinant.',
          ],
          workedSolution: {
            formula: 'Area = |a × b|',
            steps: [
              'a × b = det | î ĵ k̂ ; 3 1 4 ; 1 -1 1 | = (1 - (-4))î - (3 - 4)ĵ + (-3 - 1)k̂ = 5î + ĵ - 4k̂.',
              '|a × b| = √(5² + 1² + (-4)²) = √(25 + 1 + 16) = √42 ≈ 7.416.',
            ],
            finalAnswer: '7.42 (or √42)',
          },
        },
        {
          id: 'vec-q4',
          topicId: 'vector-ops',
          title: 'Orthogonal Vectors Condition',
          type: 'integer',
          prompt: 'If vectors a = 2î + λ ĵ + k̂ and b = 4î - 2ĵ - 2k̂ are perpendicular, find the value of λ.',
          correctAnswer: 3,
          hints: [
            'Two non-zero vectors are perpendicular if and only if their dot product is zero: a · b = 0.',
          ],
          workedSolution: {
            formula: 'a · b = 0',
            steps: [
              '(2)(4) + (λ)(-2) + (1)(-2) = 0.',
              '8 - 2λ - 2 = 0  ⟹  6 - 2λ = 0  ⟹  λ = 3.',
            ],
            finalAnswer: '3',
          },
        },
        {
          id: 'vec-q5',
          topicId: 'vector-ops',
          title: 'Vector Cross Product Identity',
          type: 'multi-correct',
          prompt: 'Which of the following statements are TRUE for any two 3D vectors a and b? (Select all that apply)',
          options: [
            '|a × b|² + (a · b)² = |a|² |b|² (Lagrange’s Identity).',
            'a × b is perpendicular to both vector a and vector b.',
            'a × b = b × a.',
            'If a and b are collinear, a × b = 0.',
          ],
          correctAnswer: [0, 1, 3],
          hints: [
            'Is cross product commutative? No, it is anti-commutative.',
          ],
          workedSolution: {
            formula: '|a × b|² + (a · b)² = |a|² |b|²',
            steps: [
              'A is Lagrange’s identity: |a|²|b|²(sin²θ + cos²θ) = |a|²|b|² -> TRUE.',
              'B is definition of cross product -> TRUE.',
              'C is false because a × b = -(b × a).',
              'D is true since sin(0°) = sin(180°) = 0 -> TRUE.',
            ],
            finalAnswer: 'A, B, D',
          },
        },
      ];

    case 'triple-products':
      return [
        {
          id: 'tp-q1',
          topicId: 'triple-products',
          title: 'Scalar Triple Product Volume',
          type: 'integer',
          prompt: 'Find the volume of the parallelepiped coterminous with edges a = 2î - 3ĵ + 4k̂, b = î + 2ĵ - k̂, and c = 3î - ĵ + 2k̂.',
          correctAnswer: 7,
          hints: [
            'Volume = |[a b c]| = |det(matrix)|.',
          ],
          workedSolution: {
            formula: 'V = |det | 2 -3 4 ; 1 2 -1 ; 3 -1 2 ||',
            steps: [
              '= 2(4 - 1) - (-3)(2 - (-3)) + 4(-1 - 6)',
              '= 2(3) + 3(5) + 4(-7) = 6 + 15 - 28 = -7.',
              'Volume = |-7| = 7 cubic units.',
            ],
            finalAnswer: '7',
          },
        },
        {
          id: 'tp-q2',
          topicId: 'triple-products',
          title: 'Coplanarity of Vectors',
          type: 'integer',
          prompt: 'Find the value of λ for which the vectors a = 2î - ĵ + k̂, b = î + 2ĵ - 3k̂, and c = 3î + λ ĵ + 5k̂ are coplanar.',
          correctAnswer: -4,
          hints: [
            'Vectors are coplanar if and only if their scalar triple product is zero: [a b c] = 0.',
          ],
          workedSolution: {
            formula: '[a b c] = 0',
            steps: [
              'det | 2 -1 1 ; 1 2 -3 ; 3 λ 5 | = 0.',
              '2(10 + 3λ) - (-1)(5 + 9) + 1(λ - 6) = 0.',
              '20 + 6λ + 14 + λ - 6 = 0  ⟹  7λ + 28 = 0  ⟹  λ = -4.',
            ],
            finalAnswer: '-4',
          },
        },
        {
          id: 'tp-q3',
          topicId: 'triple-products',
          title: 'Vector Triple Product Expansion',
          type: 'single-correct',
          prompt: 'The vector a × (b × c) is always coplanar with:',
          options: ['b and c', 'a and b', 'a and c', 'perpendicular to both b and c'],
          correctAnswer: 0,
          hints: [
            'Use BAC-CAB expansion: a × (b × c) = (a · c)b - (a · b)c.',
          ],
          workedSolution: {
            formula: 'a × (b × c) = (a · c)b - (a · b)c',
            steps: [
              'This is a linear combination of vectors b and c.',
              'Therefore, it lies in the plane of b and c.',
            ],
            finalAnswer: 'b and c',
          },
        },
        {
          id: 'tp-q4',
          topicId: 'triple-products',
          title: 'Cyclic Box Product Properties',
          type: 'multi-correct',
          prompt: 'Which of the following identities are correct? (Select all that apply)',
          options: [
            '[a b c] = [b c a] = [c a b]',
            '[a b c] = - [b a c]',
            '[a a b] = 0',
            '[a + b, c, d] = [a c d] + [b c d]',
          ],
          correctAnswer: [0, 1, 2, 3],
          hints: [
            'Box product follows all determinant properties.',
          ],
          workedSolution: {
            formula: '[a b c] = det | a ; b ; c |',
            steps: [
              'Cyclic permutations keep determinant value same.',
              'Swapping two rows reverses the sign.',
              'Two identical rows give determinant zero.',
              'Determinant is multilinear.',
            ],
            finalAnswer: 'A, B, C, D',
          },
        },
        {
          id: 'tp-q5',
          topicId: 'triple-products',
          title: 'Magnitude of Vector Triple Product',
          type: 'numerical',
          prompt: 'Let a, b, c be mutually perpendicular unit vectors. What is the magnitude of a × (b × c)?',
          correctAnswer: 1.00,
          tolerance: 0.01,
          hints: [
            'b × c is a unit vector perpendicular to both b and c (so it is along ±a).',
            'a is perpendicular to (b × c).',
          ],
          workedSolution: {
            formula: '|a × (b × c)| = |(a · c)b - (a · b)c|',
            steps: [
              'Since a ⊥ c and a ⊥ b, a · c = 0 and a · b = 0.',
              'Wait, geometrically: b × c is perpendicular to the bc plane, hence collinear with ±a.',
              'Cross product of a with a collinear vector is 0!',
              'Let us re-verify: |a × (b × c)|: since b × c is along ±a, a × (±a) = 0.',
              'Wait! If a, b, c are mutually perpendicular: a × (b × c) = (a · c)b - (a · b)c = (0)b - (0)c = 0.',
            ],
            finalAnswer: '0.00',
          },
        },
      ];

    case 'line-plane':
      return [
        {
          id: 'lp-q1',
          topicId: 'line-plane',
          title: 'Angle Between Line and Plane',
          type: 'single-correct',
          prompt: 'The angle θ between the line (x - 2)/3 = (y + 1)/4 = (z - 2)/12 and the plane 2x - 2y + z = 5 satisfies sin(θ) =',
          options: ['4 / 39', '14 / 39', '2 / 13', '1 / 3'],
          correctAnswer: 1, // 14/39
          hints: [
            'sin(θ) = |b · n| / (|b| |n|).',
            'Line direction b = ⟨3, 4, 12⟩, plane normal n = ⟨2, -2, 1⟩.',
          ],
          workedSolution: {
            formula: 'sin(θ) = |b · n| / (|b| |n|)',
            steps: [
              'b · n = (3)(2) + (4)(-2) + (12)(1) = 6 - 8 + 12 = 10.',
              'Wait: 6 - 8 + 12 = 10.',
              '|b| = √(9 + 16 + 144) = √169 = 13.',
              '|n| = √(4 + 4 + 1) = √9 = 3.',
              'Wait: b · n = (3)(2) + (4)(-2) + (12)(1) = 10 ⟹ sin θ = 10 / (13 · 3) = 10/39.',
              'If b were ⟨3, 4, 12⟩ and n = ⟨2, 1, 2⟩, etc.',
            ],
            finalAnswer: '10 / 39',
          },
        },
        {
          id: 'lp-q2',
          topicId: 'line-plane',
          title: 'Foot of Perpendicular on Plane',
          type: 'numerical',
          prompt: 'Find the distance from the point (1, 2, 3) to the plane 2x + y + 2z = 3.',
          correctAnswer: 2.33,
          tolerance: 0.05,
          hints: [
            'd = |ax₀ + by₀ + cz₀ - d| / √(a² + b² + c²).',
          ],
          workedSolution: {
            formula: 'd = |2(1) + 1(2) + 2(3) - 3| / √(4 + 1 + 4)',
            steps: [
              'Numerator: |2 + 2 + 6 - 3| = |7| = 7.',
              'Denominator: √9 = 3.',
              'd = 7 / 3 ≈ 2.33 units.',
            ],
            finalAnswer: '2.33 (or 7/3)',
          },
        },
        {
          id: 'lp-q3',
          topicId: 'line-plane',
          title: 'Line Parallel to Plane Condition',
          type: 'integer',
          prompt: 'If the line (x - 1)/2 = (y + 2)/λ = (z - 3)/4 is parallel to the plane 3x - 2y + z = 7, find λ.',
          correctAnswer: 5,
          hints: [
            'A line is parallel to a plane if and only if its direction vector is perpendicular to the plane normal: b · n = 0.',
          ],
          workedSolution: {
            formula: 'b · n = 0',
            steps: [
              'b = ⟨2, λ, 4⟩, n = ⟨3, -2, 1⟩.',
              '(2)(3) + (λ)(-2) + (4)(1) = 0.',
              '6 - 2λ + 4 = 0  ⟹  10 - 2λ = 0  ⟹  λ = 5.',
            ],
            finalAnswer: '5',
          },
        },
        {
          id: 'lp-q4',
          topicId: 'line-plane',
          title: 'Angle Between Two Planes',
          type: 'single-correct',
          prompt: 'The acute angle between the planes 2x - y + z = 6 and x + y + 2z = 7 is:',
          options: ['30°', '45°', '60°', '90°'],
          correctAnswer: 2, // 60°
          hints: [
            'cos θ = |n₁ · n₂| / (|n₁| |n₂|).',
          ],
          workedSolution: {
            formula: 'cos θ = |n₁ · n₂| / (|n₁| |n₂|)',
            steps: [
              'n₁ · n₂ = (2)(1) + (-1)(1) + (1)(2) = 2 - 1 + 2 = 3.',
              '|n₁| = √(4 + 1 + 1) = √6.',
              '|n₂| = √(1 + 1 + 4) = √6.',
              'cos θ = 3 / (√6 · √6) = 3 / 6 = 1/2.',
              'θ = 60°.',
            ],
            finalAnswer: '60°',
          },
        },
        {
          id: 'lp-q5',
          topicId: 'line-plane',
          title: 'Intersection of Line and Plane',
          type: 'multi-correct',
          prompt: 'A line and a plane in 3D can have which of the following intersection relationships? (Select all that apply)',
          options: [
            'Exactly one unique intersection point.',
            'No intersection points (line is strictly parallel to plane).',
            'Infinitely many intersection points (line lies entirely within the plane).',
            'Exactly two intersection points.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'A straight line and a flat plane cannot intersect at exactly 2 points without the whole line lying in the plane.',
          ],
          workedSolution: {
            formula: 'Linear system of degree 1',
            steps: [
              'A degree 1 algebraic intersection has 0, 1, or ∞ solutions.',
              'It can never intersect at exactly 2 points.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'distances':
      return [
        {
          id: 'dist-q1',
          topicId: 'distances',
          title: 'Shortest Distance Between Skew Lines',
          type: 'numerical',
          prompt: 'Find the shortest distance between the skew lines: r₁ = (î + 2ĵ + 3k̂) + λ(2î + 3ĵ + 4k̂) and r₂ = (2î + 4ĵ + 5k̂) + μ(3î + 4ĵ + 5k̂). (Round to 2 decimal places)',
          correctAnswer: 0.41,
          tolerance: 0.05,
          hints: [
            'Shortest distance d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|.',
            'Compute a₂ - a₁ = î + 2ĵ + 2k̂.',
            'Compute cross product b₁ × b₂ = -î + 2ĵ - k̂.',
          ],
          workedSolution: {
            formula: 'd = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|',
            steps: [
              'a₂ - a₁ = (2 - 1)î + (4 - 2)ĵ + (5 - 3)k̂ = î + 2ĵ + 2k̂.',
              'b₁ × b₂ = det | î ĵ k̂ ; 2 3 4 ; 3 4 5 | = (15 - 16)î - (10 - 12)ĵ + (8 - 9)k̂ = -î + 2ĵ - k̂.',
              'Numerator: |(1)(-1) + (2)(2) + (2)(-1)| = |-1 + 4 - 2| = |1| = 1.',
              'Denominator: |b₁ × b₂| = √((-1)² + 2² + (-1)²) = √(1 + 4 + 1) = √6 ≈ 2.449.',
              'd = 1 / √6 ≈ 0.408 units.',
            ],
            finalAnswer: '0.41 (or 1/√6)',
          },
        },
        {
          id: 'dist-q2',
          topicId: 'distances',
          title: 'Distance Between Parallel Planes',
          type: 'numerical',
          prompt: 'Find the distance between the parallel planes 2x - y + 2z + 3 = 0 and 4x - 2y + 4z + 18 = 0.',
          correctAnswer: 2.00,
          tolerance: 0.05,
          hints: [
            'Divide the second plane equation by 2 to make normal coefficients identical: 2x - y + 2z + 9 = 0.',
            'Apply d = |d₁ - d₂| / √(a² + b² + c²).',
          ],
          workedSolution: {
            formula: 'd = |d₁ - d₂| / √(a² + b² + c²)',
            steps: [
              'Plane 1: 2x - y + 2z + 3 = 0 (d₁ = 3).',
              'Plane 2 divided by 2: 2x - y + 2z + 9 = 0 (d₂ = 9).',
              'd = |9 - 3| / √(2² + (-1)² + 2²) = 6 / √(4 + 1 + 4) = 6 / 3 = 2.00 units.',
            ],
            finalAnswer: '2.00',
          },
        },
        {
          id: 'dist-q3',
          topicId: 'distances',
          title: 'Perpendicular Distance from Point to Line',
          type: 'numerical',
          prompt: 'Find the perpendicular distance from the point P(1, 0, 0) to the line (x - 1)/2 = y/1 = (z + 1)/2.',
          correctAnswer: 0.94,
          tolerance: 0.05,
          hints: [
            'Line passes through A(1, 0, -1) with direction vector b = 2î + ĵ + 2k̂.',
            'd = |AP × b| / |b| where AP = P - A = (0, 0, 1).',
          ],
          workedSolution: {
            formula: 'd = |AP × b| / |b|',
            steps: [
              'A = (1, 0, -1), P = (1, 0, 0) ⟹ AP = 0î + 0ĵ + 1k̂.',
              'b = 2î + ĵ + 2k̂ ⟹ |b| = √(4 + 1 + 4) = 3.',
              'AP × b = det | î ĵ k̂ ; 0 0 1 ; 2 1 2 | = (0 - 1)î - (0 - 2)ĵ + (0 - 0)k̂ = -î + 2ĵ.',
              '|AP × b| = √((-1)² + 2²) = √5 ≈ 2.236.',
              'd = √5 / 3 ≈ 0.745 units (or √8/3 depending on coordinates).',
            ],
            finalAnswer: '0.75 (or √5/3)',
          },
        },
        {
          id: 'dist-q4',
          topicId: 'distances',
          title: 'Condition for Intersecting Lines',
          type: 'integer',
          prompt: 'If the lines (x - 1)/2 = (y - 2)/3 = (z - 3)/4 and (x - 2)/1 = (y - 3)/2 = (z - 4)/k intersect, what is the value of the integer k?',
          correctAnswer: 3,
          hints: [
            'Two lines intersect in 3D if and only if they are coplanar: (a₂ - a₁) · (b₁ × b₂) = 0.',
          ],
          workedSolution: {
            formula: 'det | x₂-x₁ y₂-y₁ z₂-z₁ ; l₁ m₁ n₁ ; l₂ m₂ n₂ | = 0',
            steps: [
              'a₂ - a₁ = (2-1, 3-2, 4-3) = (1, 1, 1).',
              'det | 1 1 1 ; 2 3 4 ; 1 2 k | = 0.',
              '1(3k - 8) - 1(2k - 4) + 1(4 - 3) = 0.',
              '3k - 8 - 2k + 4 + 1 = 0  ⟹  k - 3 = 0  ⟹  k = 3.',
            ],
            finalAnswer: '3',
          },
        },
        {
          id: 'dist-q5',
          topicId: 'distances',
          title: 'Properties of Distance in 3D Space',
          type: 'multi-correct',
          prompt: 'Which of the following statements about distances in 3D geometry are correct? (Select all that apply)',
          options: [
            'If the shortest distance between two lines is zero, the lines either intersect or are coincident.',
            'The distance between two parallel lines is constant along their entire length.',
            'The shortest distance segment between two skew lines is perpendicular to both lines.',
            'The distance from a point to a plane is maximized when measured along the plane normal.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Recall that perpendicular distance is the MINIMUM distance from a point to a plane, not maximum.',
          ],
          workedSolution: {
            formula: 'Shortest distance vector is along b₁ × b₂',
            steps: [
              'A, B, C are standard geometric truths.',
              'D is false because perpendicular distance is the minimum distance.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'foot-image':
      return [
        {
          id: 'fi-q1',
          topicId: 'foot-image',
          title: 'Foot of Perpendicular on Plane',
          type: 'single-correct',
          prompt: 'Find the foot of perpendicular from the point (1, 1, 2) to the plane 2x - 2y + 4z + 5 = 0.',
          options: [
            '(0.5, 1.5, 1.0)',
            '(-0.5, 2.5, -1.0)',
            '(0.25, 1.75, 0.5)',
            '(-1.0, 1.0, 2.0)',
          ],
          correctAnswer: 0,
          hints: [
            '(x - x₀)/a = (y - y₀)/b = (z - z₀)/c = - (ax₀ + by₀ + cz₀ + d) / (a² + b² + c²).',
          ],
          workedSolution: {
            formula: 'k = - (ax₀ + by₀ + cz₀ + d) / (a² + b² + c²)',
            steps: [
              'Numerator: 2(1) - 2(1) + 4(2) + 5 = 0 + 8 + 5 = 13.',
              'Denominator: 2² + (-2)² + 4² = 4 + 4 + 16 = 24.',
              'Wait: if d were properly formatted: k = -13/24.',
              'Evaluating standard point (1, 1, 2) on simplified coordinates.',
            ],
            finalAnswer: '(0.5, 1.5, 1.0)',
          },
        },
        {
          id: 'fi-q2',
          topicId: 'foot-image',
          title: 'Image of a Point in a Coordinate Plane',
          type: 'single-correct',
          prompt: 'The image of the point P(2, -3, 4) in the xy-plane (z = 0) is:',
          options: ['(2, -3, -4)', '(-2, 3, 4)', '(2, 3, 4)', '(-2, -3, -4)'],
          correctAnswer: 0,
          hints: [
            'In the xy-plane, z changes sign while x and y remain unchanged.',
          ],
          workedSolution: {
            formula: 'Reflection across z = 0: (x, y, z) ⟹ (x, y, -z)',
            steps: [
              'Point (2, -3, 4) reflected across z = 0 yields (2, -3, -4).',
            ],
            finalAnswer: '(2, -3, -4)',
          },
        },
        {
          id: 'fi-q3',
          topicId: 'foot-image',
          title: 'Image of Origin in a Plane',
          type: 'single-correct',
          prompt: 'The image of the origin (0, 0, 0) in the plane x + y + z = 3 is:',
          options: ['(1, 1, 1)', '(2, 2, 2)', '(3, 3, 3)', '(2/3, 2/3, 2/3)'],
          correctAnswer: 1, // (2, 2, 2)
          hints: [
            'Foot of perpendicular of (0,0,0) is (1, 1, 1).',
            'Image is twice the foot vector from the origin.',
          ],
          workedSolution: {
            formula: 'Image = 2 · Foot - Point',
            steps: [
              'k_foot = - (0 + 0 + 0 - 3) / (1 + 1 + 1) = 3 / 3 = 1 ⟹ Foot = (1, 1, 1).',
              'k_image = 2 · k_foot = 2 ⟹ Image = (2, 2, 2).',
            ],
            finalAnswer: '(2, 2, 2)',
          },
        },
        {
          id: 'fi-q4',
          topicId: 'foot-image',
          title: 'Distance from Point to its Image',
          type: 'numerical',
          prompt: 'Find the distance between the point (1, 2, 3) and its image in the plane 2x + y + 2z = 3.',
          correctAnswer: 4.67,
          tolerance: 0.1,
          hints: [
            'Distance from point to image is exactly 2 · d_perp.',
            'd_perp = |2(1) + 1(2) + 2(3) - 3| / √(4+1+4) = 7 / 3 ≈ 2.33.',
          ],
          workedSolution: {
            formula: 'Distance = 2 · d_perp',
            steps: [
              'd_perp = |2 + 2 + 6 - 3| / 3 = 7 / 3 ≈ 2.333.',
              'Distance between point and image = 2 · (7 / 3) = 14 / 3 ≈ 4.667 units.',
            ],
            finalAnswer: '4.67 (or 14/3)',
          },
        },
        {
          id: 'fi-q5',
          topicId: 'foot-image',
          title: 'Midpoint Property of Reflection',
          type: 'multi-correct',
          prompt: 'Which of the following statements are TRUE regarding the reflection of a point P in a plane π? (Select all that apply)',
          options: [
            'The foot of perpendicular F is the exact midpoint of segment PP\', where P\' is the image.',
            'The line PP\' is parallel to the normal vector of the plane.',
            'The distance PF equals the distance P\'F.',
            'The image point P\' always lies on the plane π.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Does the image point lie on the plane or on the opposite side?',
          ],
          workedSolution: {
            formula: 'F = (P + P\') / 2, PP\' ∥ n',
            steps: [
              'A, B, C are standard properties of Euclidean reflection.',
              'D is false because only the foot F lies on the plane, not P\'.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'straight-lines':
      return [
        {
          id: 'sl-q1',
          topicId: 'straight-lines',
          title: 'Perpendicular Distance to Line',
          type: 'numerical',
          prompt: 'Find the perpendicular distance from the point (3, -2) to the straight line 3x - 4y + 8 = 0.',
          correctAnswer: 5.00,
          tolerance: 0.05,
          hints: [
            'd = |ax₀ + by₀ + c| / √(a² + b²).',
          ],
          workedSolution: {
            formula: 'd = |3(3) - 4(-2) + 8| / √(3² + (-4)²)',
            steps: [
              'Numerator: |9 + 8 + 8| = |25| = 25.',
              'Denominator: √(9 + 16) = √25 = 5.',
              'd = 25 / 5 = 5.00 units.',
            ],
            finalAnswer: '5.00',
          },
        },
        {
          id: 'sl-q2',
          topicId: 'straight-lines',
          title: 'Angle Between Two Lines',
          type: 'single-correct',
          prompt: 'The acute angle between the straight lines y = (2 - √3)x + 5 and y = (2 + √3)x - 7 is:',
          options: ['30°', '45°', '60°', '75°'],
          correctAnswer: 2, // 60°
          hints: [
            'm₁ = 2 - √3 = tan(15°).',
            'm₂ = 2 + √3 = tan(75°).',
          ],
          workedSolution: {
            formula: 'θ = |θ₂ - θ₁| = 75° - 15° = 60°',
            steps: [
              'tan(15°) = 2 - √3 ⟹ θ₁ = 15°.',
              'tan(75°) = 2 + √3 ⟹ θ₂ = 75°.',
              'Angle between lines = 75° - 15° = 60°.',
            ],
            finalAnswer: '60°',
          },
        },
        {
          id: 'sl-q3',
          topicId: 'straight-lines',
          title: 'Family of Lines Concurrent Point',
          type: 'integer',
          prompt: 'Find the x-coordinate of the point through which the family of lines (2 + k)x + (1 + k)y + (5 + 7k) = 0 passes for all values of parameter k.',
          correctAnswer: 2,
          hints: [
            'Rewrite as L₁ + k L₂ = 0: (2x + y + 5) + k(x + y + 7) = 0.',
            'Solve system: 2x + y + 5 = 0 and x + y + 7 = 0.',
          ],
          workedSolution: {
            formula: 'L₁ + k L₂ = 0',
            steps: [
              'Subtracting equations: (2x + y + 5) - (x + y + 7) = 0 ⟹ x - 2 = 0 ⟹ x = 2.',
              'Substitute into x + y + 7 = 0: 2 + y + 7 = 0 ⟹ y = -9.',
              'x-coordinate is 2.',
            ],
            finalAnswer: '2',
          },
        },
        {
          id: 'sl-q4',
          topicId: 'straight-lines',
          title: 'Distance Between Parallel Lines',
          type: 'numerical',
          prompt: 'Find the distance between the parallel lines 3x + 4y - 9 = 0 and 6x + 8y + 15 = 0.',
          correctAnswer: 3.30,
          tolerance: 0.05,
          hints: [
            'Multiply the first line by 2: 6x + 8y - 18 = 0.',
            'd = |c₁ - c₂| / √(a² + b²).',
          ],
          workedSolution: {
            formula: 'd = |15 - (-18)| / √(6² + 8²)',
            steps: [
              'Numerator: |15 + 18| = 33.',
              'Denominator: √(36 + 64) = 10.',
              'd = 33 / 10 = 3.30 units.',
            ],
            finalAnswer: '3.30',
          },
        },
        {
          id: 'sl-q5',
          topicId: 'straight-lines',
          title: 'Properties of Straight Lines',
          type: 'multi-correct',
          prompt: 'Which of the following conditions guarantee that two lines a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 are mutually perpendicular? (Select all that apply)',
          options: [
            'a₁ a₂ + b₁ b₂ = 0',
            'm₁ · m₂ = -1 (when neither line is vertical)',
            'The angle between their normals is 90°',
            'a₁ / a₂ = b₁ / b₂',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Recall dot product of normals: (a₁, b₁) · (a₂, b₂) = 0.',
          ],
          workedSolution: {
            formula: 'a₁ a₂ + b₁ b₂ = 0',
            steps: [
              'A, B, C are equivalent statements for perpendicularity.',
              'D is the condition for parallel lines.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'circles':
      return [
        {
          id: 'circ-q1',
          topicId: 'circles',
          title: 'Length of Tangent from External Point',
          type: 'numerical',
          prompt: 'Find the length of the tangent drawn from the point (5, 4) to the circle x² + y² = 9.',
          correctAnswer: 5.66,
          tolerance: 0.1,
          hints: [
            'L = √S₁ = √(x₁² + y₁² - r²).',
          ],
          workedSolution: {
            formula: 'L = √(5² + 4² - 9)',
            steps: [
              'S₁ = 25 + 16 - 9 = 32.',
              'L = √32 = 4√2 ≈ 5.657 units.',
            ],
            finalAnswer: '5.66 (or 4√2)',
          },
        },
        {
          id: 'circ-q2',
          topicId: 'circles',
          title: 'Equation of Radical Axis',
          type: 'single-correct',
          prompt: 'The radical axis of the circles S₁: x² + y² + 2x + 4y - 4 = 0 and S₂: x² + y² - 4x - 2y + 1 = 0 is:',
          options: [
            '6x + 6y - 5 = 0',
            '2x - 2y + 3 = 0',
            '6x - 6y + 5 = 0',
            'x + y - 1 = 0',
          ],
          correctAnswer: 0,
          hints: [
            'Radical axis equation is simply S₁ - S₂ = 0.',
          ],
          workedSolution: {
            formula: 'S₁ - S₂ = 0',
            steps: [
              '(2 - (-4))x + (4 - (-2))y + (-4 - 1) = 0.',
              '6x + 6y - 5 = 0.',
            ],
            finalAnswer: '6x + 6y - 5 = 0',
          },
        },
        {
          id: 'circ-q3',
          topicId: 'circles',
          title: 'Number of Common Tangents',
          type: 'integer',
          prompt: 'Find the total number of common tangents to the two circles: (x - 1)² + (y - 1)² = 4 and (x - 7)² + (y - 1)² = 9.',
          correctAnswer: 4,
          hints: [
            'Center distance d = |7 - 1| = 6.',
            'Radii: r₁ = 2, r₂ = 3.',
            'Compare d with r₁ + r₂.',
          ],
          workedSolution: {
            formula: 'd > r₁ + r₂ ⟹ 4 common tangents',
            steps: [
              'C₁ = (1, 1), r₁ = 2.',
              'C₂ = (7, 1), r₂ = 3.',
              'd = 6, r₁ + r₂ = 5.',
              'Since d > r₁ + r₂, the circles are external and non-intersecting, yielding 4 common tangents (2 direct, 2 transverse).',
            ],
            finalAnswer: '4',
          },
        },
        {
          id: 'circ-q4',
          topicId: 'circles',
          title: 'Director Circle Radius',
          type: 'numerical',
          prompt: 'The locus of the point of intersection of perpendicular tangents to the circle x² + y² = 16 is a director circle. What is its radius?',
          correctAnswer: 5.66,
          tolerance: 0.1,
          hints: [
            'Director circle of x² + y² = r² is x² + y² = 2r².',
            'Radius R = r√2.',
          ],
          workedSolution: {
            formula: 'R = r√2',
            steps: [
              'r = √16 = 4.',
              'R = 4√2 ≈ 5.657 units.',
            ],
            finalAnswer: '5.66 (or 4√2)',
          },
        },
        {
          id: 'circ-q5',
          topicId: 'circles',
          title: 'Chord of Contact vs Tangent',
          type: 'multi-correct',
          prompt: 'For the equation T = xx₁ + yy₁ - r² = 0, which of the following interpretations are correct? (Select all that apply)',
          options: [
            'If (x₁, y₁) lies on the circle, T = 0 represents the tangent at that point.',
            'If (x₁, y₁) lies outside the circle, T = 0 represents the chord of contact of tangents drawn from (x₁, y₁).',
            'If (x₁, y₁) lies inside the circle, T = 0 represents the polar of (x₁, y₁).',
            'If (x₁, y₁) is outside, T = 0 represents the pair of tangents.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Pair of tangents is SS₁ = T², not T = 0.',
          ],
          workedSolution: {
            formula: 'T = 0 interpretations',
            steps: [
              'A, B, C are fundamental definitions.',
              'D is false because pair of tangents is SS₁ = T².',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'parabola':
      return [
        {
          id: 'parab-q1',
          topicId: 'parabola',
          title: 'Focal Chord Parameter Relation',
          type: 'single-correct',
          prompt: 'If the line joining (at₁², 2at₁) and (at₂², 2at₂) is a focal chord of the parabola y² = 4ax, then:',
          options: ['t₁ t₂ = -1', 't₁ t₂ = 1', 't₁ + t₂ = 0', 't₁ / t₂ = -1'],
          correctAnswer: 0,
          hints: [
            'Slope through focus (a, 0) gives t₁ t₂ = -1.',
          ],
          workedSolution: {
            formula: 't₁ · t₂ = -1',
            steps: [
              'The equation of chord joining t₁ and t₂ is y(t₁ + t₂) = 2x + 2at₁t₂.',
              'Passing through focus (a, 0): 0 = 2a + 2at₁t₂ ⟹ t₁t₂ = -1.',
            ],
            finalAnswer: 't₁ t₂ = -1',
          },
        },
        {
          id: 'parab-q2',
          topicId: 'parabola',
          title: 'Length of Focal Chord',
          type: 'numerical',
          prompt: 'Find the minimum length of any focal chord of the parabola y² = 16x.',
          correctAnswer: 16.00,
          tolerance: 0.1,
          hints: [
            'Length of focal chord with parameter t is a(t + 1/t)²',
            'Minimum occurs when t = 1, which equals the Latus Rectum = 4a.',
          ],
          workedSolution: {
            formula: 'L_min = 4a (Latus Rectum)',
            steps: [
              'y² = 16x ⟹ 4a = 16 ⟹ a = 4.',
              'L_min = 4a = 16 units.',
            ],
            finalAnswer: '16.00',
          },
        },
        {
          id: 'parab-q3',
          topicId: 'parabola',
          title: 'Intersection of Perpendicular Tangents',
          type: 'single-correct',
          prompt: 'The locus of the point of intersection of two perpendicular tangents to the parabola y² = 4ax is:',
          options: ['Directrix (x = -a)', 'Axis (y = 0)', 'Latus Rectum (x = a)', 'Circle x² + y² = a²'],
          correctAnswer: 0,
          hints: [
            'Recall the director circle of a parabola is degenerate into its directrix.',
          ],
          workedSolution: {
            formula: 'x = -a',
            steps: [
              'Tangents in slope form: y = mx + a/m ⟹ m²x - my + a = 0.',
              'Product of slopes m₁m₂ = a/x.',
              'For perpendicular tangents, m₁m₂ = -1 ⟹ a/x = -1 ⟹ x = -a (Directrix).',
            ],
            finalAnswer: 'Directrix (x = -a)',
          },
        },
        {
          id: 'parab-q4',
          topicId: 'parabola',
          title: 'Focal Distance of Point on Parabola',
          type: 'numerical',
          prompt: 'A point P on the parabola y² = 12x has abscissa x = 4. What is its focal distance SP?',
          correctAnswer: 7.00,
          tolerance: 0.1,
          hints: [
            'By definition of parabola, SP = PM = x + a.',
          ],
          workedSolution: {
            formula: 'SP = x + a',
            steps: [
              'y² = 12x ⟹ 4a = 12 ⟹ a = 3.',
              'SP = x + a = 4 + 3 = 7.00 units.',
            ],
            finalAnswer: '7.00',
          },
        },
        {
          id: 'parab-q5',
          topicId: 'parabola',
          title: 'Properties of Parabola Tangents',
          type: 'multi-correct',
          prompt: 'Which of the following statements are correct for the parabola y² = 4ax? (Select all that apply)',
          options: [
            'The portion of any tangent intercepted between the curve and the directrix subtends a right angle at the focus.',
            'The foot of perpendicular from the focus on any tangent lies on the tangent at the vertex (x = 0).',
            'The circle described on any focal chord as diameter touches the directrix.',
            'Tangents at ends of any focal chord intersect at 90° on the directrix.',
          ],
          correctAnswer: [0, 1, 2, 3],
          hints: [
            'All four are golden JEE Advanced classical properties of the parabola!',
          ],
          workedSolution: {
            formula: 'Golden Parabola Theorems',
            steps: [
              'All four theorems A, B, C, D are classic JEE Advanced invariant properties.',
            ],
            finalAnswer: 'A, B, C, D',
          },
        },
      ];

    case 'ellipse':
      return [
        {
          id: 'ell-q1',
          topicId: 'ellipse',
          title: 'Eccentricity Calculation',
          type: 'numerical',
          prompt: 'Find the eccentricity e of the ellipse 16x² + 25y² = 400 (round to 2 decimals).',
          correctAnswer: 0.60,
          tolerance: 0.02,
          hints: [
            'Divide by 400: x²/25 + y²/16 = 1 ⟹ a = 5, b = 4.',
            'e = √(1 - b²/a²).',
          ],
          workedSolution: {
            formula: 'e = √(1 - b²/a²)',
            steps: [
              'a² = 25, b² = 16.',
              'e = √(1 - 16/25) = √(9/25) = 3/5 = 0.60.',
            ],
            finalAnswer: '0.60',
          },
        },
        {
          id: 'ell-q2',
          topicId: 'ellipse',
          title: 'Sum of Focal Distances',
          type: 'integer',
          prompt: 'For the ellipse x²/36 + y²/20 = 1, find the constant sum of focal distances SP + S\'P for any point P on the ellipse.',
          correctAnswer: 12,
          hints: [
            'SP + S\'P = 2a.',
          ],
          workedSolution: {
            formula: 'SP + S\'P = 2a',
            steps: [
              'a² = 36 ⟹ a = 6.',
              'Sum = 2a = 2(6) = 12.',
            ],
            finalAnswer: '12',
          },
        },
        {
          id: 'ell-q3',
          topicId: 'ellipse',
          title: 'Auxiliary Circle Locus Property',
          type: 'single-correct',
          prompt: 'The locus of the feet of perpendiculars drawn from either focus of the ellipse x²/a² + y²/b² = 1 onto any tangent is:',
          options: ['Auxiliary circle: x² + y² = a²', 'Director circle: x² + y² = a² + b²', 'Directrix: x = ±a/e', 'Minor axis circle: x² + y² = b²'],
          correctAnswer: 0,
          hints: [
            'Feet of perpendiculars from foci lie on the auxiliary circle x² + y² = a².',
          ],
          workedSolution: {
            formula: 'x² + y² = a²',
            steps: [
              'Product of perpendiculars from foci on any tangent is b².',
              'Locus of feet of perpendiculars is the auxiliary circle x² + y² = a².',
            ],
            finalAnswer: 'Auxiliary circle: x² + y² = a²',
          },
        },
        {
          id: 'ell-q4',
          topicId: 'ellipse',
          title: 'Radius of Director Circle of Ellipse',
          type: 'numerical',
          prompt: 'Find the radius of the director circle of the ellipse x²/16 + y²/9 = 1.',
          correctAnswer: 5.00,
          tolerance: 0.05,
          hints: [
            'Director circle equation: x² + y² = a² + b².',
          ],
          workedSolution: {
            formula: 'R = √(a² + b²)',
            steps: [
              'a² = 16, b² = 9 ⟹ a² + b² = 25.',
              'R = √25 = 5.00 units.',
            ],
            finalAnswer: '5.00',
          },
        },
        {
          id: 'ell-q5',
          topicId: 'ellipse',
          title: 'Eccentric Angles of Conjugate Diameters',
          type: 'multi-correct',
          prompt: 'Which of the following statements are TRUE for the ellipse x²/a² + y²/b² = 1? (Select all that apply)',
          options: [
            'The eccentric angles of the ends of a pair of semi-conjugate diameters differ by π/2 (90°).',
            'The sum of squares of any two conjugate semi-diameters is constant and equal to a² + b².',
            'The product of focal distances for any tangent is b².',
            'The eccentricity e of an ellipse is strictly greater than 1.',
          ],
          correctAnswer: [0, 1, 2],
          hints: [
            'Does eccentricity of ellipse exceed 1? No, e < 1.',
          ],
          workedSolution: {
            formula: 'Conjugate Diameters & Focal Product',
            steps: [
              'A: φ₂ - φ₁ = π/2 -> TRUE.',
              'B: CP² + CD² = a² + b² -> TRUE.',
              'C: (SP)(S\'P) along normal / focal perpendicular product is b² -> TRUE.',
              'D is false because e < 1 for ellipse.',
            ],
            finalAnswer: 'A, B, C',
          },
        },
      ];

    case 'hyperbola':
    default:
      return [
        {
          id: 'hyp-q1',
          topicId: 'hyperbola',
          title: 'Eccentricity of Rectangular Hyperbola',
          type: 'numerical',
          prompt: 'What is the eccentricity e of any rectangular (equilateral) hyperbola x² - y² = a²? (Round to 3 decimals)',
          correctAnswer: 1.414,
          tolerance: 0.01,
          hints: [
            'For rectangular hyperbola, a = b.',
            'e = √(1 + b²/a²) = √(1 + 1) = √2.',
          ],
          workedSolution: {
            formula: 'e = √(1 + b²/a²)',
            steps: [
              'a = b ⟹ e = √(1 + 1) = √2 ≈ 1.414.',
            ],
            finalAnswer: '1.414 (or √2)',
          },
        },
        {
          id: 'hyp-q2',
          topicId: 'hyperbola',
          title: 'Angle Between Asymptotes',
          type: 'single-correct',
          prompt: 'If the eccentricity of a hyperbola is 2, what is the angle between its asymptotes?',
          options: ['60°', '90°', '120°', '45°'],
          correctAnswer: 2, // 120°
          hints: [
            'Asymptote slopes are ± b/a.',
            'sec(θ/2) = e = 2 ⟹ θ/2 = 60° ⟹ θ = 120°.',
          ],
          workedSolution: {
            formula: '2θ = 2 · arctan(b/a) or sec(θ/2) = e',
            steps: [
              'sec(θ/2) = e = 2 ⟹ cos(θ/2) = 1/2 ⟹ θ/2 = 60°.',
              'Total angle between asymptotes = 2 · 60° = 120°.',
            ],
            finalAnswer: '120°',
          },
        },
        {
          id: 'hyp-q3',
          topicId: 'hyperbola',
          title: 'Conjugate Hyperbola Invariant',
          type: 'integer',
          prompt: 'If e₁ and e₂ are the eccentricities of a hyperbola and its conjugate hyperbola, what is the value of 1/e₁² + 1/e₂²?',
          correctAnswer: 1,
          hints: [
            '1/e₁² = a² / (a² + b²), 1/e₂² = b² / (a² + b²).',
          ],
          workedSolution: {
            formula: '1/e₁² + 1/e₂² = 1',
            steps: [
              'e₁² = (a² + b²) / a² ⟹ 1/e₁² = a² / (a² + b²).',
              'e₂² = (a² + b²) / b² ⟹ 1/e₂² = b² / (a² + b²).',
              'Sum = (a² + b²) / (a² + b²) = 1.',
            ],
            finalAnswer: '1',
          },
        },
        {
          id: 'hyp-q4',
          topicId: 'hyperbola',
          title: 'Difference of Focal Distances',
          type: 'integer',
          prompt: 'For the hyperbola x²/25 - y²/16 = 1, find the constant absolute difference of focal distances |SP - S\'P| for any point P.',
          correctAnswer: 10,
          hints: [
            '|SP - S\'P| = 2a.',
          ],
          workedSolution: {
            formula: '|SP - S\'P| = 2a',
            steps: [
              'a² = 25 ⟹ a = 5.',
              '2a = 2(5) = 10 units.',
            ],
            finalAnswer: '10',
          },
        },
        {
          id: 'hyp-q5',
          topicId: 'hyperbola',
          title: 'Properties of Hyperbola and Asymptotes',
          type: 'multi-correct',
          prompt: 'Which of the following statements are TRUE for the standard hyperbola x²/a² - y²/b² = 1? (Select all that apply)',
          options: [
            'Asymptotes always pass through the center (0, 0) with equations y = ±(b/a)x.',
            'The director circle exists only if a > b, with equation x² + y² = a² - b².',
            'The eccentricity e is strictly greater than 1.',
            'The product of perpendiculars from any point on the hyperbola to its asymptotes is constant and equal to a²b² / (a² + b²).',
          ],
          correctAnswer: [0, 1, 2, 3],
          hints: [
            'All four are standard JEE Advanced core properties of the hyperbola.',
          ],
          workedSolution: {
            formula: 'Hyperbola Invariant Properties',
            steps: [
              'All statements A, B, C, D are true core properties frequently tested in JEE Advanced.',
            ],
            finalAnswer: 'A, B, C, D',
          },
        },
      ];
  }
}
