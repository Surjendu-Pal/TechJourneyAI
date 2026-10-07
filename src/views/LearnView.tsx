import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Code2,
  Eye,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Layers,
  Map,
  Zap,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DSA_TOPICS } from '../data/dsaCurriculum';
import { DSATopic, QuizQuestion } from '../types';
import { AdBanner } from '../components/AdBanner';
import { getContentItems } from '../firebase/firestoreService';
import { TechJourneyLogo } from '../components/TechJourneyLogo';

interface LearnViewProps {
  onStartProblem: (problemId: string, topicId: string) => void;
  onSaveQuizResult: (topicId: string, topicTitle: string, score: number, total: number, weakConcepts: string[]) => void;
  selectedTopicId?: string | null;
  onEarnXP?: (amount: number, reason: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  onStartProblem,
  onSaveQuizResult,
  selectedTopicId,
  onEarnXP,
}) => {
  const [adminTopics, setAdminTopics] = useState<DSATopic[]>([]);

  useEffect(() => {
    getContentItems()
      .then((items) => {
        const published = items.filter((i) => i.status === 'Published');
        if (published.length > 0) {
          const mapped: DSATopic[] = published.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            difficulty: p.difficulty,
            simpleExplanation: p.description,
            visualExplanation: 'Interactive Master Path:\n[ ' + p.title + ' ] ---> ( Production Ready )',
            visualAscii: '[ ' + p.title + ' ] ===> ( State Invariant Satisfied )',
            mentalModel: p.description,
            example: 'Step-by-step example execution walkthrough.',
            realWorldExample: 'Deployed in high-performance production systems.',
            revisionTips: ['Revisit time complexity bounds', 'Test against edge-case inputs'],
            codeSnippets: {
              JavaScript: '// ' + p.title + '\nfunction solve() {\n  return "Ready";\n}',
              Python: '# ' + p.title + '\ndef solve():\n    return "Ready"',
            },
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(1)',
            practiceProblems: [],
            quiz: [
              {
                id: `quiz_${p.id}`,
                question: `What is the key takeaway of ${p.title}?`,
                options: ['Optimal algorithmic invariant', 'Random brute force', 'Ignoring constraints'],
                correctIndex: 0,
                explanation: 'Always maintain the algorithmic invariant.',
                conceptTag: p.title,
              },
            ],
            keyTakeaways: ['Study time and space trade-offs', 'Write clean modular implementations'],
          }));
          setAdminTopics(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const combinedTopics = [...DSA_TOPICS, ...adminTopics];

  const [activeTopic, setActiveTopic] = useState<DSATopic>(
    combinedTopics.find((t) => t.id === selectedTopicId) || combinedTopics[0]
  );
  const [learningStep, setLearningStep] = useState<number>(1); // 1 to 11
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [activeCodeLang, setActiveCodeLang] = useState<string>('JavaScript');

  // Predict output challenge state
  const [predictSelected, setPredictSelected] = useState<number | null>(null);
  const [predictSubmitted, setPredictSubmitted] = useState(false);

  // Mini question answer input
  const [miniAnswer, setMiniAnswer] = useState('');
  const [miniAnswerRevealed, setMiniAnswerRevealed] = useState(false);

  // Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const stepsList = [
    '1. Concept',
    '2. Simple Explanation',
    '3. Visual Diagram',
    '4. Mental Model',
    '5. Real Example',
    '6. Code Example',
    '7. Predict Output',
    '8. Mini Challenge',
    '9. Practice',
    '10. Quiz',
    '11. Summary',
  ];

  const filteredTopics = combinedTopics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || t.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleSelectTopic = (topic: DSATopic) => {
    setActiveTopic(topic);
    setLearningStep(1);
    setPredictSelected(null);
    setPredictSubmitted(false);
    setMiniAnswer('');
    setMiniAnswerRevealed(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    let correct = 0;
    const weak: string[] = [];

    activeTopic.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      } else {
        weak.push(q.conceptTag);
      }
    });

    onSaveQuizResult(activeTopic.id, activeTopic.title, correct, activeTopic.quiz.length, weak);
    if (onEarnXP) onEarnXP(15, `Passed ${activeTopic.title} Quiz`);
  };

  // Predict output mock/default if not present on topic
  const predictData = activeTopic.predictOutput || {
    codeSnippet: `let left = 0, right = 4;\nwhile (left < right) {\n  left++;\n  right--;\n}\nconsole.log(left, right);`,
    question: 'What are the final values printed to the console?',
    options: ['2 2', '2 1', '3 1', '1 3'],
    correctIndex: 0,
    explanation: 'Iteration 1: left=1, right=3. Iteration 2: left=2, right=2. Loop condition left < right (2 < 2) is false. Prints 2 2.',
  };

  // Mini challenge default if not present
  const miniChallengeData = activeTopic.miniChallenge || {
    prompt: 'Given an array of positive integers, how would you verify if sum of any 2 elements equals target without sorting?',
    task: 'State the required data structure and time complexity.',
    hint: 'Think about constant time existence check for target - x.',
    solution: 'Use a Hash Set. As you loop, check if target - x is in the set. If yes, found! Else add x. Time: O(N), Space: O(N).',
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-md mx-auto text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            11-Step Interactive Flow
          </span>
          <h1 className="text-xl font-black text-white">Learning Engine</h1>
        </div>

        {/* Toggle Knowledge Map */}
        <button
          onClick={() => setShowKnowledgeMap(!showKnowledgeMap)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            showKnowledgeMap
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>{showKnowledgeMap ? 'Hide Map' : 'Knowledge Map'}</span>
        </button>
      </div>

      {/* KNOWLEDGE MAP VIEW (Section 28) */}
      {showKnowledgeMap ? (
        <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-4 h-4 text-purple-400" />
              <span>Visual Developer Knowledge Map</span>
            </h2>
            <span className="text-[10px] font-mono text-purple-300">20 DSA Nodes</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            Track concept state: <strong className="text-emerald-400">Mastered</strong>, <strong className="text-blue-400">Practicing</strong>, or <strong className="text-amber-400">Learning</strong>.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {/* Tree Branch Visualizer */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-white font-bold block text-sm">Computer Science & Algorithms</span>
              <div className="pl-2 space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>├── Linear Structures (Arrays, Strings)</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">Mastered</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>│   ├── Two Pointers</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>│   └── Sliding Window</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-sans font-bold">Practicing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>├── Non-Linear (Trees, BST)</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans font-bold">Learning</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>├── Graphs & Dijkstra</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-sans font-bold">Next</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>└── Dynamic Programming (DP)</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-sans font-bold">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Search & Topic Selector Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Arrays, Trees, Recursion, DP..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {filteredTopics.map((topic, index) => {
            const isSelected = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                #{index + 1} {topic.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 11-STEP INTERACTIVE PROGRESS BAR */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white">{stepsList[learningStep - 1]}</span>
          <span className="text-blue-400 font-mono">Step {learningStep} of 11</span>
        </div>

        {/* Progress track */}
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setLearningStep(i + 1)}
              className={`h-2 rounded-full transition cursor-pointer ${
                learningStep === i + 1
                  ? 'bg-blue-500 ring-2 ring-blue-400'
                  : i + 1 < learningStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
              title={stepsList[i]}
            />
          ))}
        </div>
      </div>

      {/* INTERACTIVE STEP CONTENT CARD */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3.5 shadow-xl">
        {/* Step 1: Concept */}
        {learningStep === 1 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              1. Fundamental Concept
            </span>
            <h2 className="text-base font-black text-white">{activeTopic.title}</h2>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
              {activeTopic.simpleExplanation}
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 block font-bold">Time Complexity</span>
                <span className="text-blue-400 font-bold">{activeTopic.timeComplexity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 block font-bold">Space Complexity</span>
                <span className="text-purple-400 font-bold">{activeTopic.spaceComplexity}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Simple Explanation */}
        {learningStep === 2 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              2. Simple Explanation Without Jargon
            </span>
            <h3 className="text-sm font-bold text-white">How it works in plain language</h3>
            <p className="text-slate-200 leading-relaxed p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              {activeTopic.simpleExplanation}
            </p>
          </div>
        )}

        {/* Step 3: Visual Explanation */}
        {learningStep === 3 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              3. Visual Mental Layout
            </span>
            <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-normal whitespace-pre">
              {activeTopic.visualAscii}
            </pre>
          </div>
        )}

        {/* Step 4: Mental Model */}
        {learningStep === 4 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              4. The Core Mental Model
            </span>
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 leading-relaxed font-medium">
              "{activeTopic.mentalModel || 'Instead of recalculating everything, reuse what you already know.'}"
            </div>
          </div>
        )}

        {/* Step 5: Real-World Example */}
        {learningStep === 5 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              5. Real-World Analogy
            </span>
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-100 leading-relaxed">
              {activeTopic.example}
            </div>
          </div>
        )}

        {/* Step 6: Code Example */}
        {learningStep === 6 && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                6. Multi-Language Code Example
              </span>
              <div className="flex gap-1">
                {['JavaScript', 'Python'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                      activeCodeLang === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-200 overflow-x-auto whitespace-pre leading-relaxed">
              {activeTopic.codeSnippets[activeCodeLang] || activeTopic.codeSnippets['JavaScript']}
            </pre>
          </div>
        )}

        {/* Step 7: Predict the Output Challenge */}
        {learningStep === 7 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              7. Predict The Output (Active Thinking)
            </span>
            <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-purple-200 overflow-x-auto whitespace-pre leading-normal">
              {predictData.codeSnippet}
            </pre>
            <p className="font-bold text-white">{predictData.question}</p>

            <div className="grid grid-cols-2 gap-2">
              {predictData.options.map((opt, optIdx) => {
                const isSelected = predictSelected === optIdx;
                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300';
                if (predictSubmitted) {
                  if (optIdx === predictData.correctIndex) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else if (isSelected) {
                  btnStyle = 'bg-blue-600/30 border-blue-500 text-blue-200';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!predictSubmitted) setPredictSelected(optIdx);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-mono font-bold ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!predictSubmitted ? (
              <button
                onClick={() => {
                  if (predictSelected !== null) {
                    setPredictSubmitted(true);
                    if (predictSelected === predictData.correctIndex && onEarnXP) {
                      onEarnXP(10, 'Predicted Code Output Correctly');
                    }
                  }
                }}
                disabled={predictSelected === null}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Submit Prediction (+10 XP)
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-normal">
                <strong className="text-purple-400">Explanation: </strong>
                {predictData.explanation}
              </div>
            )}
          </div>
        )}

        {/* Step 8: Mini Challenge */}
        {learningStep === 8 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              8. Mini Challenge
            </span>
            <p className="font-bold text-white">{miniChallengeData.prompt}</p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <strong className="text-amber-400">Task: </strong>
              {miniChallengeData.task}
            </div>

            <textarea
              value={miniAnswer}
              onChange={(e) => setMiniAnswer(e.target.value)}
              placeholder="Type your reasoning..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />

            {!miniAnswerRevealed ? (
              <button
                onClick={() => {
                  setMiniAnswerRevealed(true);
                  if (onEarnXP) onEarnXP(10, 'Completed Mini Challenge');
                }}
                disabled={!miniAnswer.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                Reveal Model Solution & Earn +10 XP
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 space-y-1">
                <strong className="text-emerald-400 block">Model Solution:</strong>
                <p className="leading-relaxed">{miniChallengeData.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 9: Practice Problem Launcher */}
        {learningStep === 9 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              9. Hands-on Coding Practice
            </span>
            {activeTopic.practiceProblems.map((prob) => (
              <div key={prob.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{prob.title}</h4>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {prob.difficulty}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{prob.description}</p>
                <button
                  onClick={() => onStartProblem(prob.id, activeTopic.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Launch in Practice Arena</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 10: Quiz */}
        {learningStep === 10 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              10. Topic Comprehension Quiz
            </span>
            {activeTopic.quiz.map((q, qIndex) => (
              <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-bold text-white">Q{qIndex + 1}. {q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[q.id] === oIdx;
                    let style = 'bg-slate-900 border-slate-800 text-slate-300';
                    if (quizSubmitted) {
                      if (oIdx === q.correctIndex) style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      else if (isSelected) style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else if (isSelected) {
                      style = 'bg-blue-600/30 border-blue-500 text-blue-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          if (!quizSubmitted) setQuizAnswers((p) => ({ ...p, [q.id]: oIdx }));
                        }}
                        className={`w-full p-2 rounded-lg border text-left text-xs transition cursor-pointer flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && oIdx === q.correctIndex && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!quizSubmitted ? (
              <button
                onClick={handleGradeQuiz}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Grade Quiz & Save Results (+15 XP)
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Retake Quiz
              </button>
            )}
          </div>
        )}

        {/* Step 11: Summary & Spaced Repetition */}
        {learningStep === 11 && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              11. Topic Summary & Spaced Repetition Schedule
            </span>
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 space-y-1.5">
              <strong className="text-emerald-400 text-sm block">Concept Complete! 🎉</strong>
              <p>You have walked through all 11 phases of active learning for {activeTopic.title}.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
              <span className="font-bold text-white block">Key Revision Takeaways:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                {activeTopic.revisionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setLearningStep(1);
                if (onEarnXP) onEarnXP(25, `Mastered ${activeTopic.title}`);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Complete Topic & Add to Spaced Repetition (+25 XP)
            </button>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setLearningStep((p) => Math.max(1, p - 1))}
            disabled={learningStep === 1}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            Previous Step
          </button>

          <button
            onClick={() => {
              if (learningStep < 11) {
                setLearningStep((p) => p + 1);
                if (onEarnXP) onEarnXP(5, `Step ${learningStep} Completed`);
              }
            }}
            disabled={learningStep === 11}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40 shadow-sm shadow-blue-600/20"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AdBanner />
    </div>
  );
};
