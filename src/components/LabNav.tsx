import React from 'react';
import { ModeId, TopicId, TopicMeta } from '../types';
import { Compass, Calculator, GraduationCap } from 'lucide-react';

interface LabNavProps {
  topics: TopicMeta[];
  activeTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  activeMode: ModeId;
  onSelectMode: (mode: ModeId) => void;
}

export const LabNav: React.FC<LabNavProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  activeMode,
  onSelectMode,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* 1. Mode Switcher (Explore, Solve, Practice) */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="grid grid-cols-3 gap-1.5 w-full">
          <button
            onClick={() => onSelectMode('explore')}
            className={`flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'explore'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>(1) Explore</span>
          </button>

          <button
            onClick={() => onSelectMode('solve')}
            className={`flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'solve'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>(2) Solve</span>
          </button>

          <button
            onClick={() => onSelectMode('practice')}
            className={`flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'practice'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>(3) Practice</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Topic Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {topics.map((t) => {
          const isSelected = activeTopicId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t.id)}
              className={`flex flex-col items-start px-3.5 py-2 min-h-[44px] rounded-lg text-left transition-all shrink-0 border ${
                isSelected
                  ? 'bg-sky-950/70 border-sky-500 text-sky-100 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold leading-tight">{t.title}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">{t.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
