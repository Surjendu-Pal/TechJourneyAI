import React, { useState } from 'react';
import { X, Moon, Award, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { NightReviewResult } from '../services/apiClient';

interface NightReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    reflection: string;
    minutesStudied: number;
    tasksCompleted: number;
    problemsSolved: number;
  }) => Promise<NightReviewResult>;
  initialMinutes?: number;
  initialTasksCompleted?: number;
  initialProblemsSolved?: number;
}

export const NightReviewModal: React.FC<NightReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialMinutes = 45,
  initialTasksCompleted = 4,
  initialProblemsSolved = 2,
}) => {
  const [reflection, setReflection] = useState('');
  const [minutes, setMinutes] = useState(initialMinutes);
  const [tasks, setTasks] = useState(initialTasksCompleted);
  const [problems, setProblems] = useState(initialProblemsSolved);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<NightReviewResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await onSubmit({
        reflection: reflection || 'Completed today with good focus.',
        minutesStudied: Number(minutes),
        tasksCompleted: Number(tasks),
        problemsSolved: Number(problems),
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Night Learning Review</h2>
              <p className="text-xs text-slate-400">Lock in today's knowledge & plan tomorrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {result ? (
          /* Result View */
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-slate-200">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI MENTOR EVALUATION</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                "{result.mentorFeedback}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Calculated Accuracy</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{result.calculatedAccuracyEstimate}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Priority Weakness</span>
                <p className="text-xs font-semibold text-amber-400 mt-1 truncate">{result.weaknessIdentified}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>TOMORROW'S #1 PRIORITY</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">{result.tomorrowsPriority}</p>
            </div>

            <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/20 text-orange-300 text-xs">
              <p className="font-semibold text-orange-200">{result.streakPraise}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
            >
              Done — Sleep Well & Ready for Tomorrow
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Minutes Studied</span>
                <input
                  type="number"
                  min="0"
                  max="600"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full mt-1 bg-transparent text-center font-bold text-base text-blue-400 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Tasks Done</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={tasks}
                  onChange={(e) => setTasks(Number(e.target.value))}
                  className="w-full mt-1 bg-transparent text-center font-bold text-base text-emerald-400 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Problems Solved</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={problems}
                  onChange={(e) => setProblems(Number(e.target.value))}
                  className="w-full mt-1 bg-transparent text-center font-bold text-base text-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                How did today feel? What was the biggest takeaway or mistake?
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="e.g. Mastered the two pointer convergence pattern, but got stuck on empty array edge cases..."
                rows={3}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>AI Mentor is Analyzing Your Day...</span>
              ) : (
                <>
                  <span>Calculate Day Review & Plan Tomorrow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
