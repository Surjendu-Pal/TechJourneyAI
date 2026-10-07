import React, { useState } from 'react';
import { Play, Lightbulb, CheckCircle2, AlertTriangle, XCircle, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { apiClient, EvaluationResult, ProgressiveHintResult } from '../services/apiClient';
import { SubmissionClassification } from '../types';

interface CodeEditorMobileProps {
  problemTitle: string;
  problemDescription: string;
  initialCode?: string;
  defaultLanguage?: string;
  testCases?: { input: string; expected: string }[];
  staticHints?: string[];
  onSubmitSuccess: (attemptData: {
    code: string;
    approach: string;
    explanation: string;
    classification: SubmissionClassification;
    feedback: string;
    hintsGiven: number;
  }) => void;
}

export const CodeEditorMobile: React.FC<CodeEditorMobileProps> = ({
  problemTitle,
  problemDescription,
  initialCode = '',
  defaultLanguage = 'JavaScript',
  testCases = [],
  staticHints = [],
  onSubmitSuccess,
}) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(initialCode);
  const [approach, setApproach] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hintsGiven, setHintsGiven] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [gettingHint, setGettingHint] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Mobile quick keys
  const quickKeys = ['{ }', '[ ]', '( )', '=>', '===', ';', 'return', 'let', 'const', 'nums'];

  const insertSnippet = (snippet: string) => {
    setCode((prev) => prev + (prev.endsWith(' ') || prev.endsWith('\n') ? '' : ' ') + snippet);
  };

  const handleRequestHint = async () => {
    if (gettingHint) return;

    // If static hints are available and we haven't exhausted them, use them first, otherwise call Gemini
    if (hintsGiven < staticHints.length) {
      setActiveHint(staticHints[hintsGiven]);
      setHintsGiven((prev) => prev + 1);
      return;
    }

    setGettingHint(true);
    try {
      const res = await apiClient.getHint({
        problemTitle,
        problemDescription,
        currentCode: code,
        hintsGiven,
      });
      setActiveHint(`${res.hint}\n\nMentor Question: ${res.socraticQuestion}`);
      setHintsGiven((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setActiveHint('Focus on the relationship between the target and each visited element.');
      setHintsGiven((prev) => prev + 1);
    } finally {
      setGettingHint(false);
    }
  };

  const handleEvaluate = async () => {
    if (!code.trim() || evaluating) return;
    setEvaluating(true);
    setEvaluation(null);

    try {
      const result = await apiClient.evaluateProblem({
        problemTitle,
        problemDescription,
        code,
        approach,
        explanation,
        language,
      });

      setEvaluation(result);
      onSubmitSuccess({
        code,
        approach,
        explanation,
        classification: result.classification,
        feedback: `${result.summary}\n${result.detailedFeedback}`,
        hintsGiven,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const getBadgeStyle = (classification: SubmissionClassification) => {
    switch (classification) {
      case 'Correct':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Almost correct':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Needs improvement':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Incorrect':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-3">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-t-2xl bg-slate-900 border-t border-x border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Editor</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 text-blue-400 border border-slate-800 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none"
          >
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
        </div>

        {/* Progressive Hint Button */}
        <button
          onClick={handleRequestHint}
          disabled={gettingHint}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 fill-amber-400" />
          <span>{gettingHint ? 'Thinking...' : `Hint ${hintsGiven > 0 ? `(${hintsGiven})` : ''}`}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Type your solution here..."
          rows={12}
          spellCheck={false}
          className="w-full bg-slate-950 font-mono text-xs text-slate-200 px-3 py-3 border-x border-b border-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed resize-y selection:bg-blue-600"
        />

        {/* Quick mobile keys accessory bar */}
        <div className="overflow-x-auto py-1.5 px-2 bg-slate-900/90 border border-slate-800 flex gap-1.5 no-scrollbar rounded-b-xl">
          {quickKeys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => insertSnippet(k)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 active:scale-95 text-[11px] font-mono text-slate-300 transition"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Active Hint Card */}
      {activeHint && (
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Lightbulb className="w-4 h-4 fill-amber-400" />
            <span>AI Mentor Progressive Hint #{hintsGiven}</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-amber-100">{activeHint}</p>
        </div>
      )}

      {/* Approach & Explanation Section */}
      <div className="space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
        <label className="block text-xs font-semibold text-slate-300">
          Your Approach & Complexity Reasoning (Optional)
        </label>
        <input
          type="text"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          placeholder="e.g. Two-pointer convergence, Hash map frequency table"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain your thinking in simple language..."
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Submit Evaluation Button */}
      <button
        onClick={handleEvaluate}
        disabled={evaluating || !code.trim()}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50"
      >
        {evaluating ? (
          <>
            <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
            <span>AI Mentor Evaluating Code & Complexity...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" />
            <span>Submit Solution for AI Evaluation</span>
          </>
        )}
      </button>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">AI Mentor Assessment</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(
                evaluation.classification
              )}`}
            >
              {evaluation.classification}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Time Complexity</span>
              <span className="text-blue-400 font-bold">{evaluation.timeComplexity}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block">Space Complexity</span>
              <span className="text-purple-400 font-bold">{evaluation.spaceComplexity}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
            <p className="font-semibold text-white mb-1">{evaluation.summary}</p>
            <p className="text-slate-300 whitespace-pre-wrap">{evaluation.detailedFeedback}</p>
          </div>

          {evaluation.edgeCasesMissed && evaluation.edgeCasesMissed.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
              <span className="font-semibold text-amber-300 block mb-1">Watch out for Edge Cases:</span>
              <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 text-[11px]">
                {evaluation.edgeCasesMissed.map((ec, idx) => (
                  <li key={idx}>{ec}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.nextStep && (
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/30 p-2.5 rounded-xl border border-blue-500/20">
              <ChevronRight className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{evaluation.nextStep}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
