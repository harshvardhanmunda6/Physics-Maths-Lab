import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface ExamCalloutProps {
  examTip: string;
  commonMistake: string;
}

export const ExamCallout: React.FC<ExamCalloutProps> = ({ examTip, commonMistake }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
      {/* Exam Tip */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200">
        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-emerald-300 mr-1.5 uppercase tracking-wide">Exam Tip:</span>
          {examTip}
        </div>
      </div>

      {/* Common Mistake */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-amber-300 mr-1.5 uppercase tracking-wide">Common Mistake:</span>
          {commonMistake}
        </div>
      </div>
    </div>
  );
};
