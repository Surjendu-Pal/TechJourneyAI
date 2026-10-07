import React, { useState } from 'react';
import { X, Clock, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    availableMinutes: number;
    feeling: string;
    completedYesterday: string;
    struggleNotes: string;
  }) => Promise<void>;
  currentStreak: number;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentStreak,
}) => {
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [feeling, setFeeling] = useState('Focused 🎯');
  const [completedYesterday, setCompletedYesterday] = useState('Yes, completed all tasks');
  const [struggleNotes, setStruggleNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const feelings = [
    { label: 'Energized ⚡', desc: 'Ready for hard problems' },
    { label: 'Focused 🎯', desc: 'Ready for structured work' },
    { label: 'Normal 😊', desc: 'Consistent pace' },
    { label: 'Tired 😴', desc: 'Need lighter revision' },
  ];

  const times = [
    { label: '20 min', value: 20 },
    { label: '35 min', value: 35 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
    { label: '120 min', value: 120 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        availableMinutes,
        feeling,
        completedYesterday,
        struggleNotes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Daily Morning Check-in</h2>
              <p className="text-xs text-slate-400">Day {currentStreak} Autonomous Planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Question 1: Available Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              1. What is your available study time today?
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {times.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setAvailableMinutes(t.value)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition ${
                    availableMinutes === t.value
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Feeling */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. How are you feeling today?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feelings.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setFeeling(f.label)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    feeling === f.label
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{f.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Yesterday's Task */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              3. Did you complete yesterday's task?
            </label>
            <div className="space-y-1.5">
              {[
                'Yes, completed all tasks',
                'Completed partially (around 50-75%)',
                'Struggled / missed yesterday',
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition ${
                    completedYesterday === option
                      ? 'bg-blue-950/40 border-blue-500 text-blue-300 font-medium'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="yesterday"
                    checked={completedYesterday === option}
                    onChange={() => setCompletedYesterday(option)}
                    className="accent-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: Struggle Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              4. What problems or concepts did you struggle with?
            </label>
            <textarea
              value={struggleNotes}
              onChange={(e) => setStruggleNotes(e.target.value)}
              placeholder="e.g. Off-by-one in binary search, recursion base case in tree traversals..."
              rows={2}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>AI Mentor is Adapting Today's Mission...</span>
            ) : (
              <>
                <span>Generate Adapted Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
