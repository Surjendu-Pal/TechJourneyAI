import React, { useState, useEffect } from 'react';
import {
  Code2,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ChevronDown,
  Play,
  RotateCcw,
  Repeat,
  Lightbulb,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { DSA_TOPICS } from '../data/dsaCurriculum';
import { CodeEditorMobile } from '../components/CodeEditorMobile';
import { ProblemAttempt, SubmissionClassification, MistakeRecord } from '../types';
import { getAdminProblems } from '../firebase/firestoreService';
import { TechJourneyLogo } from '../components/TechJourneyLogo';

interface PracticeViewProps {
  attempts: ProblemAttempt[];
  onNewAttempt: (attempt: ProblemAttempt) => void;
  selectedProblemId?: string | null;
  selectedTopicId?: string | null;
  onEarnXP?: (amount: number, reason: string) => void;
  onLogMistake?: (mistake: MistakeRecord) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  attempts,
  onNewAttempt,
  selectedProblemId,
  selectedTopicId,
  onEarnXP,
  onLogMistake,
}) => {
  const [adminProblems, setAdminProblems] = useState<any[]>([]);

  useEffect(() => {
    getAdminProblems()
      .then((probs) => {
        const published = probs.filter((p) => p.status === 'Published');
        if (published.length > 0) {
          const mapped = published.map((p) => ({
            id: p.id,
            title: p.title,
            difficulty: p.difficulty,
            description: p.description,
            starterCode: p.starterCode || {
              JavaScript: '// ' + p.title + '\nfunction solve(input) {\n  \n}',
              Python: '# ' + p.title + '\ndef solve(input):\n    pass',
            },
            testCases: p.testCases || [{ input: 'example', expected: 'example' }],
            hints: p.hints || ['Break down the inputs and write step-by-step logic.'],
            topicId: p.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            topicTitle: p.category,
          }));
          setAdminProblems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Aggregate problems across all DSA topics and dynamic admin CMS
  const baseProblems = DSA_TOPICS.flatMap((t) =>
    t.practiceProblems.map((p) => ({
      ...p,
      topicId: t.id,
      topicTitle: t.title,
    }))
  );

  const allProblems = [...baseProblems, ...adminProblems];

  const initialProblem =
    allProblems.find((p) => p.id === selectedProblemId) || allProblems[0];

  const [activeProblem, setActiveProblem] = useState(initialProblem);
  const [viewTab, setViewTab] = useState<'editor' | 'history' | 'mistakes'>('editor');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');

  // Mistake Memory state
  const [mistakeRecords, setMistakeRecords] = useState<MistakeRecord[]>([
    {
      id: 'm-1',
      userId: 'current',
      problemId: 'array-two-sum',
      problemTitle: 'Two Sum Problem',
      topic: 'Hash Tables',
      userMistake: 'Forgot to check if complement exists in map before adding current index.',
      aiDiagnosis: 'Hash map single-pass lookup logic needs active practice.',
      conceptTag: 'Complement existence check',
      scheduledReviewDate: new Date().toISOString().split('T')[0],
      intervalStage: 1,
      reviewed: false,
      createdAt: 'Yesterday',
    },
    {
      id: 'm-2',
      userId: 'current',
      problemId: 'sw-longest-substring',
      problemTitle: 'Longest Substring Without Repeating Characters',
      topic: 'Sliding Window',
      userMistake: 'Did not advance the left pointer past duplicate index.',
      aiDiagnosis: 'Dynamic window contraction boundary error.',
      conceptTag: 'Window left bound contraction',
      scheduledReviewDate: new Date().toISOString().split('T')[0],
      intervalStage: 3,
      reviewed: false,
      createdAt: '3 days ago',
    },
  ]);

  const handleAttemptSuccess = (attemptData: {
    code: string;
    approach: string;
    explanation: string;
    classification: SubmissionClassification;
    feedback: string;
    hintsGiven: number;
  }) => {
    const isAccepted = attemptData.classification === 'Correct' || attemptData.classification === 'Accepted';
    const xpReward = isAccepted ? (activeProblem.difficulty === 'Hard' ? 50 : activeProblem.difficulty === 'Medium' ? 35 : 20) : 5;

    const newAttempt: ProblemAttempt = {
      userId: '',
      problemId: activeProblem.id,
      problemTitle: activeProblem.title,
      topic: activeProblem.topicTitle,
      language: selectedLanguage,
      code: attemptData.code,
      approach: attemptData.approach,
      explanation: attemptData.explanation,
      classification: attemptData.classification,
      feedback: attemptData.feedback,
      hintsGiven: attemptData.hintsGiven,
      executionTimeMs: Math.floor(Math.random() * 45) + 12,
      testsPassed: isAccepted ? 4 : 2,
      totalTests: 4,
      xpEarned: xpReward,
      timestamp: new Date().toISOString(),
    };

    onNewAttempt(newAttempt);

    if (isAccepted) {
      if (onEarnXP) onEarnXP(xpReward, `Solved ${activeProblem.title} in ${selectedLanguage}`);
    } else {
      // Record in Mistake Memory (Section 8)
      const mistake: MistakeRecord = {
        id: `mistake_${Date.now()}`,
        userId: 'current',
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        topic: activeProblem.topicTitle,
        userMistake: attemptData.explanation || 'Incorrect test output or logic discrepancy.',
        aiDiagnosis: attemptData.feedback.substring(0, 180),
        conceptTag: activeProblem.topicTitle,
        scheduledReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        intervalStage: 1,
        reviewed: false,
        createdAt: 'Just now',
      };
      setMistakeRecords([mistake, ...mistakeRecords]);
      if (onLogMistake) onLogMistake(mistake);
    }
  };

  const getStatusBadge = (c: SubmissionClassification) => {
    switch (c) {
      case 'Accepted':
      case 'Correct':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Accepted</span>;
      case 'Almost correct':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">Almost Correct</span>;
      case 'Needs improvement':
      case 'Wrong Answer':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">Wrong Answer</span>;
      case 'Time Limit':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">Time Limit</span>;
      case 'Runtime Error':
      case 'Incorrect':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">Runtime Error</span>;
    }
  };

  // Multi-language starter code generator
  const getLanguageStarterCode = (lang: string) => {
    if (activeProblem.starterCode[lang]) return activeProblem.starterCode[lang];
    if (lang === 'Python') return `def solve(nums, target):\n    # Write Python solution here\n    pass`;
    if (lang === 'Java') return `class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write Java solution\n        return new int[]{};\n    }\n}`;
    if (lang === 'C++') return `class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write C++ solution\n        return {};\n    }\n};`;
    if (lang === 'SQL') return `-- SQL Query\nSELECT id, name FROM users\nWHERE status = 'active'\nORDER BY created_at DESC;`;
    return activeProblem.starterCode['JavaScript'] || `function solve() {\n  // Write solution\n}`;
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-md mx-auto text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            Multi-Language Compiler & Evaluation
          </span>
          <h1 className="text-xl font-black text-white">Practice Arena</h1>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
          <button
            onClick={() => setViewTab('editor')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewTab === 'editor' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Solve
          </button>
          <button
            onClick={() => setViewTab('mistakes')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewTab === 'mistakes' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <span>Mistakes ({mistakeRecords.length})</span>
          </button>
          <button
            onClick={() => setViewTab('history')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewTab === 'history' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>({attempts.length})</span>
          </button>
        </div>
      </div>

      {/* Problem Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-left cursor-pointer hover:border-slate-700 transition"
        >
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              {activeProblem.topicTitle}
            </span>
            <h3 className="text-xs font-bold text-white mt-0.5 truncate">{activeProblem.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                activeProblem.difficulty === 'Easy'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : activeProblem.difficulty === 'Medium'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {activeProblem.difficulty}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1">
            {allProblems.map((prob) => (
              <button
                key={prob.id}
                onClick={() => {
                  setActiveProblem(prob);
                  setDropdownOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition cursor-pointer flex items-center justify-between ${
                  activeProblem.id === prob.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="text-[9px] opacity-70 block">{prob.topicTitle}</span>
                  <span>{prob.title}</span>
                </div>
                <span className="text-[9px] opacity-80">{prob.difficulty}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: SOLVE (CODE EDITOR) */}
      {viewTab === 'editor' && (
        <div className="space-y-3.5">
          {/* Problem Statement Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">{activeProblem.title}</h2>
              <span className="text-xs font-mono font-bold text-blue-400">
                +{activeProblem.difficulty === 'Hard' ? 50 : activeProblem.difficulty === 'Medium' ? 35 : 20} XP
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeProblem.description}</p>

            {/* Test Cases & Constraints */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sample Test Cases
              </span>
              {activeProblem.testCases.map((tc: any, idx: number) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300">
                  <span className="text-slate-400">Input: </span>
                  <span className="text-blue-300">{tc.input}</span>
                  <br />
                  <span className="text-slate-400">Expected: </span>
                  <span className="text-emerald-300">{tc.expected}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Language Selector Toolbar */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-300 pl-1">Target Language:</span>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {['JavaScript', 'Python', 'Java', 'C++', 'SQL'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Code Editor with Progressive Hints (NO ADS IN EDITOR) */}
          <CodeEditorMobile
            key={`${activeProblem.id}-${selectedLanguage}`}
            problemTitle={activeProblem.title}
            problemDescription={activeProblem.description}
            initialCode={getLanguageStarterCode(selectedLanguage)}
            defaultLanguage={selectedLanguage}
            testCases={activeProblem.testCases}
            staticHints={activeProblem.hints}
            onSubmitSuccess={handleAttemptSuccess}
          />
        </div>
      )}

      {/* TAB 2: MISTAKE MEMORY & SPACED REPETITION (Section 8 & 9) */}
      {viewTab === 'mistakes' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Continuous Mistake Memory Engine</span>
            </div>
            <p className="leading-relaxed">
              Every failed attempt is automatically logged. The AI diagnoses your root concept gap and reschedules it on Day 1, 3, 7, 14, and 30 intervals.
            </p>
          </div>

          <div className="space-y-2.5">
            {mistakeRecords.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{m.problemTitle}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                    Interval Stage: Day {m.intervalStage}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <p className="text-rose-300">
                    <strong className="text-rose-400">Your Mistake: </strong>
                    {m.userMistake}
                  </p>
                  <p className="text-indigo-200 pt-1 border-t border-slate-800/60">
                    <strong className="text-indigo-400">AI Diagnosis: </strong>
                    {m.aiDiagnosis}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Topic: {m.topic}</span>
                  <button
                    onClick={() => {
                      const found = allProblems.find((p) => p.id === m.problemId);
                      if (found) {
                        setActiveProblem(found);
                        setViewTab('editor');
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer"
                  >
                    Review & Retest Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSION HISTORY */}
      {viewTab === 'history' && (
        <div className="space-y-3">
          {attempts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No problem attempts logged yet. Solve your first problem in the Solve tab!
            </div>
          ) : (
            attempts.map((att, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{att.problemTitle}</span>
                  {getStatusBadge(att.classification)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Language: <strong className="text-blue-300">{att.language || 'JavaScript'}</strong></span>
                  <span className="font-mono text-emerald-400 font-bold">+{att.xpEarned || 20} XP</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 text-[11px] text-slate-300 font-mono">
                  {att.feedback}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                  <span>Hints used: {att.hintsGiven}</span>
                  <span>{new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
