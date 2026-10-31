import React, { useState } from 'react';
import { TopicId, PracticeQuestion } from '../../types';
import { getPracticeQuestionsForTopic } from '../../data/curriculum';
import { CheckCircle2, XCircle, HelpCircle, Eye, EyeOff, RotateCcw, Check, Sparkles } from 'lucide-react';

interface PracticeModeProps {
  topicId: TopicId;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ topicId }) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => getPracticeQuestionsForTopic(topicId));
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  // User input states: questionId -> value
  const [userSingleAnswers, setUserSingleAnswers] = useState<Record<string, number>>({});
  const [userMultiAnswers, setUserMultiAnswers] = useState<Record<string, number[]>>({});
  const [userNumberAnswers, setUserNumberAnswers] = useState<Record<string, string>>({});

  // Question submission & hint states
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [activeHints, setActiveHints] = useState<Record<string, number>>({}); // qId -> count of hints shown
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  const currentQ = questions[activeQuestionIdx] || questions[0];

  // Randomize / Refresh values
  const handleRegenerate = () => {
    const refreshed = getPracticeQuestionsForTopic(topicId);
    setQuestions(refreshed);
    setSubmitted({});
    setUserSingleAnswers({});
    setUserMultiAnswers({});
    setUserNumberAnswers({});
    setShowSolution({});
    setActiveHints({});
  };

  // Check correctness and compute marks
  const evaluateQuestion = (q: PracticeQuestion): { isCorrect: boolean; marks: number; partialNote?: string } => {
    if (!submitted[q.id]) return { isCorrect: false, marks: 0 };

    if (q.type === 'single-correct') {
      const correct = userSingleAnswers[q.id] === (q.correctAnswer as number);
      return { isCorrect: correct, marks: correct ? 3 : -1 };
    }
    if (q.type === 'multi-correct') {
      const selected = userMultiAnswers[q.id] || [];
      const correctArr = (q.correctAnswer as number[]) || [];
      const hasWrongChoice = selected.some(idx => !correctArr.includes(idx));

      if (hasWrongChoice) {
        return { isCorrect: false, marks: -2, partialNote: 'Incorrect option chosen: -2 marks' };
      }
      if (selected.length === correctArr.length && selected.every(v => correctArr.includes(v))) {
        return { isCorrect: true, marks: 4, partialNote: 'All correct options chosen: +4 marks' };
      }
      if (selected.length > 0) {
        return { isCorrect: false, marks: selected.length, partialNote: `Partial credit: +${selected.length} marks` };
      }
      return { isCorrect: false, marks: 0 };
    }
    if (q.type === 'integer') {
      const val = parseInt(userNumberAnswers[q.id] || '');
      const correct = val === (q.correctAnswer as number);
      return { isCorrect: correct, marks: correct ? 4 : 0 };
    }
    if (q.type === 'numerical') {
      const val = parseFloat(userNumberAnswers[q.id] || '');
      const target = q.correctAnswer as number;
      const tol = q.tolerance || 0.1;
      const correct = !Number.isNaN(val) && Math.abs(val - target) <= tol;
      return { isCorrect: correct, marks: correct ? 4 : 0 };
    }
    return { isCorrect: false, marks: 0 };
  };

  const isQuestionCorrect = (q: PracticeQuestion): boolean => {
    return evaluateQuestion(q).isCorrect;
  };

  // Submit current answer
  const handleSubmit = () => {
    if (!currentQ) return;
    setSubmitted(prev => ({ ...prev, [currentQ.id]: true }));
  };

  // Total session statistics
  const submittedQuestions = questions.filter(q => submitted[q.id]);
  const totalMarks = submittedQuestions.reduce((acc, q) => acc + evaluateQuestion(q).marks, 0);
  const totalCorrect = submittedQuestions.filter(q => isQuestionCorrect(q)).length;
  const accuracy = submittedQuestions.length > 0 ? Math.round((totalCorrect / submittedQuestions.length) * 100) : 0;

  const handleToggleMulti = (idx: number) => {
    if (!currentQ || submitted[currentQ.id]) return;
    const existing = userMultiAnswers[currentQ.id] || [];
    if (existing.includes(idx)) {
      setUserMultiAnswers({
        ...userMultiAnswers,
        [currentQ.id]: existing.filter(i => i !== idx),
      });
    } else {
      setUserMultiAnswers({
        ...userMultiAnswers,
        [currentQ.id]: [...existing, idx],
      });
    }
  };

  const currentSubmitted = submitted[currentQ.id];
  const currentCorrect = isQuestionCorrect(currentQ);
  const currentHintsCount = activeHints[currentQ.id] || 0;

  return (
    <div className="w-full space-y-4">
      {/* Live JEE Scorecard & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 font-medium">Session Score</div>
          <div className="text-base font-bold font-mono text-sky-400 mt-0.5">
            {totalMarks >= 0 ? `+${totalMarks}` : totalMarks} <span className="text-[11px] text-slate-500 font-sans">marks</span>
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 font-medium">Questions Attempted</div>
          <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
            {submittedQuestions.length} / {questions.length}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 font-medium">Accuracy</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            {accuracy}%
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-slate-400 font-medium">Exam Marking Rules</div>
          <div className="text-[10.5px] text-slate-300 font-mono">
            Single: +3/-1 • Multi: +4/-2 • Num: +4/0
          </div>
        </div>
      </div>

      {/* Top Question Navigation Chips & Regenerate Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {questions.map((q, idx) => {
            const isSub = submitted[q.id];
            const isCorr = isQuestionCorrect(q);
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-all ${
                  activeQuestionIdx === idx
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>Q{idx + 1}</span>
                {isSub && (
                  isCorr ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-300" />
                  )
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRegenerate}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          Regenerate Values
        </button>
      </div>

      {/* Active Question Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 space-y-4">
        {/* Question Header & Type Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Question {activeQuestionIdx + 1} of {questions.length}
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">{currentQ.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px] font-semibold border border-slate-700">
              {currentQ.type === 'single-correct' && '+3 / -1 marks'}
              {currentQ.type === 'multi-correct' && '+4 / -2 marks (partial)'}
              {(currentQ.type === 'integer' || currentQ.type === 'numerical') && '+4 / 0 marks'}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-400 font-mono text-xs font-semibold border border-slate-700">
              {currentQ.type.toUpperCase().replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Prompt */}
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
          {currentQ.prompt}
        </p>

        {/* Answer Options / Input Area */}
        <div className="space-y-2 pt-2">
          {currentQ.type === 'single-correct' && currentQ.options && (
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userSingleAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={currentSubmitted}
                    onClick={() => setUserSingleAnswers({ ...userSingleAnswers, [currentQ.id]: idx })}
                    className={`w-full text-left p-3 min-h-[44px] rounded-lg border text-xs sm:text-sm flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500 text-sky-100'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${
                      isSelected ? 'border-sky-400 bg-sky-500 text-white' : 'border-slate-600 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'multi-correct' && currentQ.options && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 italic mb-1">
                One or more options may be correct. Select all that apply:
              </div>
              {currentQ.options.map((opt, idx) => {
                const isSelected = (userMultiAnswers[currentQ.id] || []).includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={currentSubmitted}
                    onClick={() => handleToggleMulti(idx)}
                    className={`w-full text-left p-3 min-h-[44px] rounded-lg border text-xs sm:text-sm flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500 text-sky-100'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs border shrink-0 ${
                      isSelected ? 'border-sky-400 bg-sky-500 text-white' : 'border-slate-600 text-slate-400'
                    }`}>
                      {isSelected ? <Check className="w-3.5 h-3.5 text-white" /> : String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {(currentQ.type === 'integer' || currentQ.type === 'numerical') && (
            <div className="max-w-xs space-y-1">
              <label className="text-xs text-slate-400">
                {currentQ.type === 'integer' ? 'Enter Integer Answer:' : 'Enter Numerical Value (up to 2 decimals):'}
              </label>
              <input
                type="number"
                step={currentQ.type === 'numerical' ? '0.01' : '1'}
                disabled={currentSubmitted}
                value={userNumberAnswers[currentQ.id] || ''}
                onChange={(e) => setUserNumberAnswers({ ...userNumberAnswers, [currentQ.id]: e.target.value })}
                placeholder={currentQ.type === 'integer' ? 'e.g. 5' : 'e.g. 1.41'}
                className="w-full px-3 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Action Buttons: Submit, Hint, Worked Solution */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
          {!currentSubmitted ? (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 min-h-[44px] rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs sm:text-sm transition-colors shadow"
            >
              Submit Answer
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {(() => {
                const evalRes = evaluateQuestion(currentQ);
                return evalRes.isCorrect ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct! (+{evalRes.marks} marks awarded)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 font-bold text-xs">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>
                      {evalRes.partialNote || `Incorrect (${evalRes.marks >= 0 ? `+${evalRes.marks}` : evalRes.marks} marks)`}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Hint button */}
          {currentQ.hints.length > 0 && (
            <button
              onClick={() => setActiveHints({ ...activeHints, [currentQ.id]: Math.min(currentQ.hints.length, currentHintsCount + 1) })}
              className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
              {currentHintsCount === 0 ? 'Need a Hint?' : `Hint (${currentHintsCount}/${currentQ.hints.length})`}
            </button>
          )}

          {/* Worked Solution button */}
          <button
            onClick={() => setShowSolution({ ...showSolution, [currentQ.id]: !showSolution[currentQ.id] })}
            className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            {showSolution[currentQ.id] ? <EyeOff className="w-3.5 h-3.5 text-sky-400" /> : <Eye className="w-3.5 h-3.5 text-sky-400" />}
            {showSolution[currentQ.id] ? 'Hide Solution' : 'Worked Solution'}
          </button>
        </div>

        {/* Display Active Hints */}
        {currentHintsCount > 0 && (
          <div className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-900/40 space-y-1.5 text-xs text-yellow-200">
            <div className="font-bold text-yellow-300 uppercase tracking-wide">Hints:</div>
            {currentQ.hints.slice(0, currentHintsCount).map((h, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="font-mono text-yellow-400 font-bold">{i + 1}.</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Worked Solution Card */}
        {showSolution[currentQ.id] && (
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs text-slate-200">
            <div className="font-bold text-sky-400 text-sm uppercase tracking-wide">
              Step-by-Step Worked Solution
            </div>
            <div className="font-mono text-sky-300">
              Formula: {currentQ.workedSolution.formula}
            </div>
            <div className="space-y-1 pl-2 border-l-2 border-slate-700">
              {currentQ.workedSolution.steps.map((st, i) => (
                <div key={i} className="leading-relaxed text-slate-300">
                  {st}
                </div>
              ))}
            </div>
            <div className="font-bold text-emerald-400 pt-1">
              Final Answer: {currentQ.workedSolution.finalAnswer}
            </div>
            {currentQ.workedSolution.signConventionNote && (
              <div className="text-[11px] text-slate-400 italic">
                Sign Convention Note: {currentQ.workedSolution.signConventionNote}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
