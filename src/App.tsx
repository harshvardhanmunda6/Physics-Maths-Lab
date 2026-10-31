/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LabId, ModeId, TopicId } from './types';
import { LABS } from './data/curriculum';
import { Header } from './components/Header';
import { LabNav } from './components/LabNav';
import { ExamCallout } from './components/ExamCallout';
import { ExploreMode } from './components/modes/ExploreMode';
import { SolveMode } from './components/modes/SolveMode';
import { PracticeMode } from './components/modes/PracticeMode';
import { TestRunnerModal } from './components/TestRunnerModal';
import { SignConventionModal } from './components/SignConventionModal';
import { FormulaVaultModal } from './components/FormulaVaultModal';
import { BookOpen, CheckCircle2, ChevronRight, Compass, Layers, GitBranch, Sparkles } from 'lucide-react';

export default function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('optics');
  const [activeMode, setActiveMode] = useState<ModeId>('explore');
  const [activeTopicId, setActiveTopicId] = useState<TopicId>('spherical-mirror');

  // Modals
  const [isTestsOpen, setIsTestsOpen] = useState(false);
  const [isSignConventionOpen, setIsSignConventionOpen] = useState(false);
  const [isFormulaVaultOpen, setIsFormulaVaultOpen] = useState(false);

  // Dark/Light Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // When switching labs, select the first topic of that lab
  const currentLab = LABS.find((l) => l.id === activeLabId) || LABS[0];
  const currentTopic = currentLab.topics.find((t) => t.id === activeTopicId) || currentLab.topics[0];

  const handleSelectLab = (labId: LabId) => {
    setActiveLabId(labId);
    const newLab = LABS.find((l) => l.id === labId);
    if (newLab && newLab.topics.length > 0) {
      setActiveTopicId(newLab.topics[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors selection:bg-sky-500 selection:text-white">
      {/* App Header */}
      <Header
        activeLabId={activeLabId}
        onSelectLab={handleSelectLab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenTests={() => setIsTestsOpen(true)}
        onOpenSignConvention={() => setIsSignConventionOpen(true)}
        onOpenFormulaVault={() => setIsFormulaVaultOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Lab Overview Quick Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                {currentLab.badge}
              </span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="text-xs text-slate-400 font-mono">NCERT Cartesian Sign Convention</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">{currentLab.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{currentLab.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFormulaVaultOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-amber-950/30 border border-amber-850 hover:bg-amber-900/40 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Formula Vault
            </button>
            <button
              onClick={() => setIsSignConventionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/60"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              Sign Convention
            </button>
            <button
              onClick={() => setIsTestsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-emerald-950/30 border border-emerald-800/60 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Formula Tests
            </button>
          </div>
        </div>

        {/* Navigation Bar: Mode Switcher + Topic Chips Bar */}
        <LabNav
          topics={currentLab.topics}
          activeTopicId={currentTopic.id}
          onSelectTopic={(tId) => setActiveTopicId(tId)}
          activeMode={activeMode}
          onSelectMode={(m) => setActiveMode(m)}
        />

        {/* Exam Tip and Common Mistake (One line each) */}
        <ExamCallout
          examTip={currentTopic.examTip}
          commonMistake={currentTopic.commonMistake}
        />

        {/* Mode Views: (1) Explore, (2) Solve, (3) Practice */}
        <div className="w-full">
          {activeMode === 'explore' && <ExploreMode topicId={currentTopic.id} />}
          {activeMode === 'solve' && <SolveMode topicId={currentTopic.id} />}
          {activeMode === 'practice' && <PracticeMode topicId={currentTopic.id} />}
        </div>
      </main>

      {/* Modals */}
      <TestRunnerModal isOpen={isTestsOpen} onClose={() => setIsTestsOpen(false)} />
      <SignConventionModal isOpen={isSignConventionOpen} onClose={() => setIsSignConventionOpen(false)} />
      <FormulaVaultModal isOpen={isFormulaVaultOpen} onClose={() => setIsFormulaVaultOpen(false)} />
    </div>
  );
}
