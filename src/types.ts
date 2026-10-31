export type LabId = 'optics' | 'vectors' | 'coordinate';

export type ModeId = 'explore' | 'solve' | 'practice';

export type OpticsTopicId = 
  | 'plane-mirror' 
  | 'spherical-mirror' 
  | 'refraction' 
  | 'lenses' 
  | 'prism';

export type VectorsTopicId = 
  | 'vector-ops' 
  | 'triple-products' 
  | 'line-plane' 
  | 'distances' 
  | 'foot-image';

export type CoordinateTopicId = 
  | 'straight-lines' 
  | 'circles' 
  | 'parabola' 
  | 'ellipse' 
  | 'hyperbola';

export type TopicId = OpticsTopicId | VectorsTopicId | CoordinateTopicId;

export interface TopicMeta {
  id: TopicId;
  labId: LabId;
  title: string;
  subtitle: string;
  examTarget: 'JEE Advanced + NEET' | 'JEE Advanced';
  examTip: string;
  commonMistake: string;
}

export interface SolverStep {
  title: string;
  formula: string;
  substitution: string;
  result: string;
  note?: string;
}

export interface SolverResult {
  success: boolean;
  verdict: string;
  steps: SolverStep[];
  numbers: {
    label: string;
    value: string;
    unit?: string;
    signConvention?: string;
  }[];
  impossibleMessage?: string;
}

export type QuestionType = 'single-correct' | 'multi-correct' | 'integer' | 'numerical';

export interface PracticeQuestion {
  id: string;
  topicId: TopicId;
  title: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // For single and multi-correct
  correctAnswer: string | number | number[]; // Index, or integer number, or float number, or array of indices
  tolerance?: number; // For numerical (e.g., 0.05)
  hints: string[];
  workedSolution: {
    formula: string;
    steps: string[];
    finalAnswer: string;
    signConventionNote?: string;
  };
}

export interface UnitTestResult {
  id: string;
  topic: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  timeMs: number;
}
