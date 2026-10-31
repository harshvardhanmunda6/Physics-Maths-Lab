import React, { useState, useEffect } from 'react';
import { runAllUnitTests } from '../utils/tests';
import { UnitTestResult } from '../types';
import { CheckCircle2, XCircle, Play, X, RefreshCw } from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [tests, setTests] = useState<UnitTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runAllUnitTests();
      setTests(results);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    if (isOpen) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = tests.filter(t => t.passed).length;
  const totalCount = tests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Solver Formula Verification &amp; Unit Tests
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paraphrase-checks analytical solutions against standard textbook formulas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {passedCount} / {totalCount} Passed
            </span>
            {passedCount === totalCount && totalCount > 0 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All Solvers 100% Verified
              </span>
            ) : null}
          </div>
          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Rerun Tests
          </button>
        </div>

        {/* Tests List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded-lg border text-xs ${
                test.passed
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-200'
                  : 'bg-rose-950/20 border-rose-900/50 text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-200">{test.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{test.topic}</div>
                  </div>
                </div>
                <span className="font-mono text-slate-400 text-[10px] shrink-0">
                  {test.timeMs}ms
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 font-mono grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-400">Expected: </span>
                  <span className="text-emerald-300">{test.expected}</span>
                </div>
                <div>
                  <span className="text-slate-400">Actual: </span>
                  <span className={test.passed ? 'text-emerald-300' : 'text-rose-300'}>
                    {test.actual}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
