import React, { useState } from 'react';
import { X, Briefcase, Github, FileText, Trophy, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient, CareerGuidanceResult } from '../services/apiClient';
import { UserProfile, ProgressSummary } from '../types';

interface CareerMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  progress: ProgressSummary | null;
}

export const CareerMentorModal: React.FC<CareerMentorModalProps> = ({
  isOpen,
  onClose,
  profile,
  progress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'projects' | 'github' | 'resume' | 'internships' | 'interviews'>('projects');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<CareerGuidanceResult | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'github' as const, label: 'GitHub', icon: Github },
    { id: 'resume' as const, label: 'Resume', icon: FileText },
    { id: 'internships' as const, label: 'Internships', icon: Users },
    { id: 'interviews' as const, label: 'Interviews', icon: Trophy },
  ];

  const handleFetchGuidance = async (cat: typeof selectedCategory) => {
    setSelectedCategory(cat);
    setLoading(true);
    setGuidance(null);
    try {
      const res = await apiClient.getCareerGuidance({
        profile: profile || {},
        progress: progress || {},
        targetCategory: cat,
      });
      setGuidance(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Career Mentor</h2>
              <p className="text-xs text-slate-400">From code to hireable software engineer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleFetchGuidance(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
              <p className="text-xs font-medium">Generating senior engineer career roadmap...</p>
            </div>
          ) : guidance ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
                  STRATEGIC ADVICE
                </span>
                <h3 className="text-sm font-bold text-white mb-2">{guidance.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{guidance.keyAdvice}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-2">
                  ACTION ITEMS
                </span>
                <ul className="space-y-2">
                  {guidance.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                  PRACTICAL SPEC / PROMPT
                </span>
                <p className="text-xs font-mono text-indigo-200 whitespace-pre-wrap leading-relaxed">
                  {guidance.exampleOrPrompt}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs">Select any category above to generate custom career strategy tailored to your current progress.</p>
              <button
                onClick={() => handleFetchGuidance(selectedCategory)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/20"
              >
                Generate Guidance for {selectedCategory}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
