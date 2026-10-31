import React from 'react';
import { LabId } from '../types';
import { LABS } from '../data/curriculum';
import { Sun, Moon, CheckCircle2, BookOpen, Compass, Layers, GitBranch } from 'lucide-react';

interface HeaderProps {
  activeLabId: LabId;
  onSelectLab: (labId: LabId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenTests: () => void;
  onOpenSignConvention: () => void;
  onOpenFormulaVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeLabId,
  onSelectLab,
  isDarkMode,
  onToggleTheme,
  onOpenTests,
  onOpenSignConvention,
  onOpenFormulaVault,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-lg">
                Φ
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Physics-Maths Lab
                </h1>
                <p className="text-[11px] text-slate-400">
                  Touch-Driven Laboratory • Class 11-12 JEE Advanced &amp; NEET
                </p>
              </div>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenFormulaVault}
                title="Formula Vault"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenTests}
                title="Solver Unit Tests"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleTheme}
                title="Toggle Theme"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              </button>
            </div>
          </div>

          {/* Desktop Right Actions & Quick Reference Links */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <button
              onClick={onOpenFormulaVault}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-amber-950/40 border border-amber-800/80 hover:bg-amber-900/50 text-amber-300 font-semibold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Formula Vault
            </button>
            <button
              onClick={onOpenSignConvention}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              NCERT Sign Convention
            </button>
            <button
              onClick={onOpenTests}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-emerald-950/40 border border-emerald-800/80 hover:bg-emerald-900/50 text-emerald-300 font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Formula Tests (10/10)
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* Lab Selector Navigation (Horizontal Segmented Bar) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LABS.map((lab) => {
            const isSelected = activeLabId === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => onSelectLab(lab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {lab.id === 'optics' && <Compass className="w-4 h-4" />}
                {lab.id === 'vectors' && <Layers className="w-4 h-4" />}
                {lab.id === 'coordinate' && <GitBranch className="w-4 h-4" />}
                <span>{lab.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 text-sky-200 uppercase font-mono">
                  {lab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
