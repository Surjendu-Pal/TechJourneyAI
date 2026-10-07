import React, { useState } from 'react';
import {
  Flame,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  BookOpen,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  Code2,
  Tv,
  Check,
} from 'lucide-react';
import { DailyPlan, UserProfile, ProgressSummary, DailyTask, DeveloperLevelInfo } from '../types';
import { NavTab } from '../components/BottomNav';
import { DAILY_CHALLENGES } from '../data/socialFeedData';
import { AdBanner } from '../components/AdBanner';

interface HomeViewProps {
  profile: UserProfile | null;
  dailyPlan: DailyPlan | null;
  progress: ProgressSummary | null;
  levelInfo: DeveloperLevelInfo;
  onNavigateTab: (tab: NavTab) => void;
  onOpenCheckIn: () => void;
  onOpenNightReview: () => void;
  onOpenFocusMode: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onStartPracticeProblem: (problemId: string, topicId: string) => void;
  onEarnXP: (amount: number, reason: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  dailyPlan,
  progress,
  levelInfo,
  onNavigateTab,
  onOpenCheckIn,
  onOpenNightReview,
  onOpenFocusMode,
  onToggleTaskComplete,
  onOpenTopic,
  onStartPracticeProblem,
  onEarnXP,
}) => {
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});

  const studentName = profile?.name || 'Surjendu';
  const currentStreak = profile?.streak || 1;
  const currentLanguage = profile?.preferredLanguage || 'JavaScript';
  const targetDate = profile?.targetDate || 'April 2027';
  const totalXP = profile?.xp || 180;
  const weakTopic = progress?.weakTopics?.[0] || 'Dynamic Sliding Window';

  // Last active lesson
  const lastActive = profile?.lastActiveLesson || {
    topicId: 'arrays',
    topicTitle: 'Arrays → Sliding Window',
    step: 4,
    totalSteps: 7,
  };

  const handleCompleteDailyChallenge = (challengeId: string, rewardXP: number) => {
    if (completedChallenges[challengeId]) return;
    setCompletedChallenges((prev) => ({ ...prev, [challengeId]: true }));
    onEarnXP(rewardXP, 'Completed Daily Challenge');
  };

  // Missions
  const missions = [
    {
      id: 'm1',
      number: '01',
      title: 'Dynamic Sliding Window Invariant',
      time: '20 min',
      xp: '+40 XP',
      action: 'Start Learning',
      category: 'learn',
      topicId: 'sliding-window',
    },
    {
      id: 'm2',
      number: '02',
      title: 'Solve 2 Medium Problems',
      time: '30 min',
      xp: '+60 XP',
      action: 'Practice Arena',
      category: 'practice',
      topicId: 'two-pointers',
    },
    {
      id: 'm3',
      number: '03',
      title: `Review Weakness: ${weakTopic}`,
      time: '10 min',
      xp: '+20 XP',
      action: 'Review Now',
      category: 'review',
      topicId: 'sliding-window',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-md mx-auto text-left">
      {/* 1. GREETING & STATUS BANNER (Section 3) */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">
            Day {dailyPlan?.dayNumber || currentStreak} • {currentLanguage} Track
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">
            Good morning, {studentName} 👋
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            Ready by <strong className="text-slate-200">{targetDate}</strong> • +120 XP possible today
          </p>
        </div>

        {/* Level badge */}
        <div className="text-right">
          <div className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono">
            <span>{levelInfo.badge} Level {levelInfo.level}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
            {levelInfo.title}
          </span>
        </div>
      </div>

      {/* 2. CONTINUE LEARNING CARD (Section 29) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-500/30 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-blue-400 tracking-wider">
            Continue Where You Stopped
          </span>
          <h3 className="text-xs font-bold text-white leading-tight">
            {lastActive.topicTitle}
          </h3>
          <p className="text-[10px] text-slate-400">
            Step {lastActive.step} of {lastActive.totalSteps} • Code Example & Mini Challenge
          </p>
        </div>

        <button
          onClick={() => onOpenTopic(lastActive.topicId)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. TODAY'S STRUCTURED MISSIONS (Section 3) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Today's Mission Control
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            +120 XP Total
          </span>
        </div>

        <div className="space-y-2">
          {missions.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-mono text-slate-500 font-bold">MISSION {m.number}</span>
                  <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                    {m.xp}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{m.title}</h4>
                <span className="text-[10px] text-slate-400">{m.time} estimated</span>
              </div>

              <button
                onClick={() => {
                  if (m.category === 'learn') onOpenTopic(m.topicId);
                  else if (m.category === 'practice') onStartPracticeProblem('array-two-sum', m.topicId);
                  else onStartPracticeProblem('array-two-sum', m.topicId);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold whitespace-nowrap shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                {m.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DAILY CHALLENGES & FOCUS MODE (Section 13 & 30) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Focus Mode Card */}
        <div
          onClick={onOpenFocusMode}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col justify-between cursor-pointer hover:border-indigo-500/60 transition"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Distraction-Free</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Focus Mode</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">25m Pomodoro with muted notifications</p>
          </div>
          <span className="text-[10px] font-bold text-indigo-300 mt-2 flex items-center gap-1">
            <span>Enter Focus</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Daily Debug Challenge */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Daily Challenge</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs font-bold text-white line-clamp-1">Fix Broken Closure Bug</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">+50 XP reward</p>
          </div>

          <button
            onClick={() => handleCompleteDailyChallenge('dc-debug-1', 50)}
            disabled={completedChallenges['dc-debug-1']}
            className={`mt-2 py-1 px-2.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              completedChallenges['dc-debug-1']
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
            }`}
          >
            {completedChallenges['dc-debug-1'] ? (
              <>
                <Check className="w-3 h-3" />
                <span>Solved (+50 XP)</span>
              </>
            ) : (
              <span>Solve Challenge</span>
            )}
          </button>
        </div>
      </div>

      {/* 5. SPACED REPETITION WEAKNESS ALERT (Section 9) */}
      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Spaced Repetition Memory</span>
          </div>
          <p className="text-xs font-bold text-white">3 concepts need review today</p>
          <p className="text-[10px] text-slate-400">Sliding Window • Recursion • Graph Cycle Detection</p>
        </div>

        <button
          onClick={() => onStartPracticeProblem('array-two-sum', 'sliding-window')}
          className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 cursor-pointer"
        >
          Review Now
        </button>
      </div>

      {/* 6. MORNING CHECK-IN & NIGHT REVIEW DUAL BUTTONS */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenCheckIn}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition text-left cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Morning</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xs font-bold text-white">Daily Check-in</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Adapt today's mission</p>
        </button>

        <button
          onClick={onOpenNightReview}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition text-left cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase">Night</span>
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-xs font-bold text-white">Night Review</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Lock in learnings</p>
        </button>
      </div>

      {/* Sponsor / Ad Banner (Section 34, 35, 36) */}
      <AdBanner />
    </div>
  );
};
