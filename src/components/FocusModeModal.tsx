import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Sparkles, CheckCircle2, Bot, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { DSATopic } from '../types';

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: DSATopic | null;
  onCompleteMission: (earnedXP: number) => void;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  isOpen,
  onClose,
  topic,
  onCompleteMission,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60); // 25 min pomodoro
  const [isActive, setIsActive] = useState(true);
  const [step, setStep] = useState(1);
  const [scratchpadCode, setScratchpadCode] = useState(
    topic?.codeSnippets?.['JavaScript'] || '// Distraction-free scratchpad\nfunction solve(input) {\n  \n}'
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [mentorHintOpen, setMentorHintOpen] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0 && !isCompleted) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, isCompleted]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleFinish = () => {
    setIsCompleted(true);
    onCompleteMission(50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-2 sm:p-4 text-left">
      <div className="w-full max-w-lg h-[95vh] flex flex-col rounded-3xl bg-slate-950 border border-blue-500/30 shadow-2xl overflow-hidden relative">
        {/* Focus Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Focus Mode Active
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Feed, Leaderboards & Chat Muted
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Display */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 font-mono text-xs font-bold">
              <span>{timeFormatted}</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className="hover:text-white transition p-0.5 cursor-pointer"
              >
                {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
              🎉
            </div>
            <h2 className="text-xl font-black text-white">Mission Complete!</h2>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Incredible focus. You turned screen time into 25 minutes of deep algorithmic thinking.
            </p>
            <div className="px-4 py-2 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold font-mono text-sm">
              +50 XP Earned
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Return to Mission Control
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Topic Objective Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-0.5">
                Current Deep Objective
              </span>
              <h3 className="text-sm font-bold text-white">
                {topic?.title || 'Dynamic Sliding Window Invariant'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {topic?.simpleExplanation ||
                  'Understand when to expand the right pointer and shrink the left pointer without recalculating subarrays.'}
              </p>
            </div>

            {/* Mental Model Banner */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <strong className="text-indigo-400">Mental Model: </strong>
              "{topic?.mentalModel || 'Instead of recalculating everything, reuse what you already know.'}"
            </div>

            {/* Quick Practice Scratchpad */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Code Scratchpad</span>
                <button
                  onClick={() => setMentorHintOpen(!mentorHintOpen)}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{mentorHintOpen ? 'Hide Hint' : 'Mentor Hint'}</span>
                </button>
              </div>

              {mentorHintOpen && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                  💡 <strong>Mentor Nudge:</strong> Track the invariant. As `right` advances, add `nums[right]`. While the window is invalid, subtract `nums[left]` and advance `left`.
                </div>
              )}

              <textarea
                value={scratchpadCode}
                onChange={(e) => setScratchpadCode(e.target.value)}
                rows={10}
                className="w-full bg-slate-900 font-mono text-xs text-slate-200 p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Focus Footer */}
        {!isCompleted && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setSecondsRemaining(25 * 60)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Focus Session Complete (+50 XP)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
