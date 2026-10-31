import React from 'react';
import { SolverResult } from '../types';

interface VerdictCardProps {
  result: SolverResult;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  return (
    <div className="w-full rounded-xl bg-slate-900/90 dark:bg-slate-900 border border-slate-800 text-slate-100 p-4 shadow-sm">
      {/* 1. Verdict Line */}
      <div className={`flex items-start gap-3 pb-3 border-b ${result.impossibleMessage ? 'border-rose-900/40' : 'border-slate-800'}`}>
        <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${result.impossibleMessage ? 'bg-rose-500' : 'bg-emerald-400'}`} />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            Verdict
          </div>
          <p className={`text-sm md:text-base font-medium ${result.impossibleMessage ? 'text-rose-300' : 'text-slate-100'}`}>
            {result.verdict}
          </p>
          {result.impossibleMessage && (
            <p className="text-xs text-rose-400/90 mt-1 font-mono">
              Notice: {result.impossibleMessage}
            </p>
          )}
        </div>
      </div>

      {/* 2. Numbers List */}
      {result.numbers.length > 0 && (
        <div className="pt-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Parameters &amp; Computed Values
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {result.numbers.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-base font-mono font-bold text-sky-400 mt-0.5">
                  {item.value}
                </div>
                {item.signConvention && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    {item.signConvention}
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
