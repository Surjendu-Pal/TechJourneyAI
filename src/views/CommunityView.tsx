import React, { useState } from 'react';
import {
  Users2,
  Tv,
  Swords,
  Trophy,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Play,
  Clock,
  Send,
  Zap,
  Globe,
  School,
  Flame,
  ArrowRight,
  Code2,
} from 'lucide-react';
import {
  KNOWLEDGE_REELS,
  CODING_PARTNERS,
  COMMUNITY_POSTS,
  LEADERBOARD_USERS,
} from '../data/socialFeedData';
import { KnowledgeReel, CodingPartner, CommunityPost, CodingBattleState } from '../types';
import { AdBanner } from '../components/AdBanner';
import { createModerationReport } from '../firebase/firestoreService';
import { TechJourneyLogo } from '../components/TechJourneyLogo';

interface CommunityViewProps {
  onEarnXP: (amount: number, reason: string) => void;
  onOpenProblemInPractice: (problemId: string, topicId: string) => void;
  userCollege?: string;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onEarnXP,
  onOpenProblemInPractice,
  userCollege = 'Asansol Engineering College',
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'battles' | 'leaderboard' | 'partners' | 'discussions'>('reels');

  // Reels State
  const [reels, setReels] = useState<KnowledgeReel[]>(KNOWLEDGE_REELS);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeRewardClaimed, setChallengeRewardClaimed] = useState(false);

  // 1v1 Battle State
  const [battleState, setBattleState] = useState<CodingBattleState | null>(null);
  const [battleLanguage, setBattleLanguage] = useState('JavaScript');
  const [battleDifficulty, setBattleDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [battleTopic, setBattleTopic] = useState('Arrays & Two Pointers');
  const [isMatchmaking, setIsMatchmaking] = useState(false);

  // Leaderboard Filter
  const [leaderboardFilter, setLeaderboardFilter] = useState<'Global' | 'India' | 'College'>('Global');

  // Partners Filter
  const [partnerLanguageFilter, setPartnerLanguageFilter] = useState('All');
  const [partners, setPartners] = useState<CodingPartner[]>(CODING_PARTNERS);

  // Discussions State
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'DSA' | 'WebDev' | 'AI/ML' | 'Open Source'>('DSA');
  const [isPosting, setIsPosting] = useState(false);

  const activeReel = reels[activeReelIndex] || reels[0];

  const handleNextReel = () => {
    setActiveReelIndex((prev) => (prev + 1) % reels.length);
    setSelectedChallengeOption(null);
    setChallengeSubmitted(false);
    setChallengeRewardClaimed(false);
  };

  const handlePrevReel = () => {
    setActiveReelIndex((prev) => (prev - 1 + reels.length) % reels.length);
    setSelectedChallengeOption(null);
    setChallengeSubmitted(false);
    setChallengeRewardClaimed(false);
  };

  const handleAnswerChallenge = (optionIdx: number) => {
    if (challengeSubmitted) return;
    setSelectedChallengeOption(optionIdx);
    setChallengeSubmitted(true);
    if (optionIdx === activeReel.challengeQuestion.correctIndex && !challengeRewardClaimed) {
      onEarnXP(10, `Solved Reel Challenge: ${activeReel.title}`);
      setChallengeRewardClaimed(true);
    }
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              likes: r.isLiked ? r.likes - 1 : r.likes + 1,
              isLiked: !r.isLiked,
            }
          : r
      )
    );
  };

  const handleStartBattleMatchmaking = () => {
    setIsMatchmaking(true);
    setTimeout(() => {
      setIsMatchmaking(false);
      setBattleState({
        id: `battle_${Date.now()}`,
        topic: battleTopic,
        difficulty: battleDifficulty,
        language: battleLanguage,
        timeLimitMinutes: 15,
        problem: {
          title: 'Container With Most Water',
          description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
          starterCode: `function maxArea(height) {\n  // Code your solution here\n  let left = 0, right = height.length - 1;\n  let maxWater = 0;\n  while (left < right) {\n    const w = right - left;\n    const h = Math.min(height[left], height[right]);\n    maxWater = Math.max(maxWater, w * h);\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxWater;\n}`,
          testCases: [
            { input: '[1,8,6,2,5,4,8,3,7]', expected: '49' },
            { input: '[1,1]', expected: '1' },
          ],
        },
        opponent: {
          name: 'Priya M.',
          college: 'Jadavpur University',
          rating: 1420,
          avatar: '👩‍💻',
          progressPercent: 40,
          status: 'coding',
        },
        userCode: `function maxArea(height) {\n  // Write solution\n}`,
        timeRemainingSeconds: 15 * 60,
        status: 'active',
      });
    }, 1800);
  };

  const handleFinishBattle = () => {
    if (!battleState) return;
    setBattleState({
      ...battleState,
      status: 'finished',
      result: {
        winner: 'user',
        ratingChange: +24,
        xpEarned: 60,
        reason: 'Optimal two-pointer approach passed 100% test cases faster!',
      },
    });
    onEarnXP(60, '1v1 Coding Battle Victory');
  };

  const handleTogglePartnerConnect = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? { ...p, connected: !p.connected }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: 'Surjendu Pal',
      authorCollege: userCollege,
      authorLevel: 'Level 1 • Code Starter',
      category: newPostCategory,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      tags: [newPostCategory, 'TechJourney'],
      likes: 1,
      commentsCount: 0,
      createdAt: 'Just now',
      isLiked: true,
    };
    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
    onEarnXP(20, 'Shared Knowledge in Community');
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-md mx-auto text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            Learning-First Social Network
          </span>
          <h1 className="text-xl font-black text-white">Community & Arena</h1>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5" />
          <span>Global Active</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {[
          { id: 'reels' as const, label: 'Knowledge Reels', icon: Tv },
          { id: 'battles' as const, label: '1v1 Battles', icon: Swords },
          { id: 'leaderboard' as const, label: 'Leaderboards', icon: Trophy },
          { id: 'partners' as const, label: 'Coding Partners', icon: UserPlus },
          { id: 'discussions' as const, label: 'Discussions', icon: MessageSquare },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. KNOWLEDGE REELS TAB */}
      {activeTab === 'reels' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold font-mono">
                {activeReel.category} • {activeReel.durationSeconds}s Micro-Lesson
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{activeReelIndex + 1} / {reels.length}</span>
              </div>
            </div>

            <h2 className="text-base font-black text-white leading-snug">
              {activeReel.title}
            </h2>

            {/* ASCII Interactive Animation Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-normal whitespace-pre">
              {activeReel.visualAscii}
            </div>

            {/* Concise Explanation */}
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeReel.explanation}
            </p>

            {/* Mental Model Callout */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
              <strong className="text-indigo-400">Mental Model: </strong>
              "{activeReel.mentalModelTakeaway}"
            </div>

            {/* Active Challenge End-Card */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Can you solve this? (+10 XP)
                </span>
                {challengeRewardClaimed && (
                  <span className="text-[10px] text-emerald-400 font-bold">✓ +10 XP Claimed!</span>
                )}
              </div>
              <p className="text-xs text-white font-medium">
                {activeReel.challengeQuestion.question}
              </p>

              <div className="space-y-1.5">
                {activeReel.challengeQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedChallengeOption === optIdx;
                  const isCorrect = optIdx === activeReel.challengeQuestion.correctIndex;
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300';
                  if (challengeSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-blue-600/30 border-blue-500 text-blue-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerChallenge(optIdx)}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {challengeSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeSubmitted && (
                <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] text-slate-300 border border-slate-800 leading-normal">
                  <strong className="text-blue-400">Answer Explanation: </strong>
                  {activeReel.challengeQuestion.explanation}
                </div>
              )}
            </div>

            {/* Reel Social Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLikeReel(activeReel.id)}
                  className={`flex items-center gap-1 p-1 rounded-lg hover:text-white transition cursor-pointer ${
                    activeReel.isLiked ? 'text-rose-500 font-bold' : ''
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${activeReel.isLiked ? 'fill-rose-500' : ''}`} />
                  <span>{activeReel.likes}</span>
                </button>
                <div className="flex items-center gap-1 p-1">
                  <Bookmark className="w-4 h-4" />
                  <span>{activeReel.saves}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevReel}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={handleNextReel}
                  className="px-3.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Next Reel
                </button>
              </div>
            </div>
          </div>

          <AdBanner />
        </div>
      )}

      {/* 2. 1v1 CODING BATTLES TAB */}
      {activeTab === 'battles' && (
        <div className="space-y-3">
          {battleState?.status === 'active' ? (
            /* Live Battle Arena */
            <div className="p-4 rounded-3xl bg-slate-900 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                    Live 1v1 Battle
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>14:42</span>
                </div>
              </div>

              {/* Matchup Banner */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase block">You</span>
                  <p className="font-bold text-white">Surjendu Pal</p>
                  <span className="text-[10px] text-slate-400">1200 Rating</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">Opponent</span>
                  <p className="font-bold text-white">{battleState.opponent.name}</p>
                  <span className="text-[10px] text-slate-400">{battleState.opponent.rating} Rating ({battleState.opponent.college})</span>
                </div>
              </div>

              {/* Problem Brief */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <h4 className="font-bold text-white">{battleState.problem.title}</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">{battleState.problem.description}</p>
              </div>

              {/* Code Editor */}
              <textarea
                value={battleState.problem.starterCode}
                rows={8}
                readOnly
                className="w-full bg-slate-950 font-mono text-xs text-blue-200 p-3 rounded-2xl border border-slate-800 focus:outline-none"
              />

              <button
                onClick={handleFinishBattle}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Solution & Claim Battle Victory</span>
              </button>
            </div>
          ) : battleState?.status === 'finished' ? (
            /* Battle Result Card */
            <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
                🏆
              </div>
              <h2 className="text-lg font-black text-white">Victory! You Won the Match!</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {battleState.result?.reason}
              </p>
              <div className="flex justify-center gap-3 font-mono font-bold text-xs py-1">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rating: +24 (Now 1224)
                </span>
                <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  +60 XP Earned
                </span>
              </div>
              <button
                onClick={() => setBattleState(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Return to Battle Matchmaking
              </button>
            </div>
          ) : (
            /* Matchmaking Setup */
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1v1 Real-Time Battle Arena</h3>
                  <p className="text-[10px] text-slate-400">Fair ELO matchmaking with developers worldwide</p>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Language</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['JavaScript', 'Python', 'Java', 'C++'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setBattleLanguage(lang)}
                      className={`py-1.5 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        battleLanguage === lang
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Difficulty</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setBattleDifficulty(diff)}
                      className={`py-1.5 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        battleDifficulty === diff
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matchmaking Action Button */}
              <button
                onClick={handleStartBattleMatchmaking}
                disabled={isMatchmaking}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition cursor-pointer disabled:opacity-50"
              >
                {isMatchmaking ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Finding Balanced Peer Opponent...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    <span>Enter 1v1 Coding Battle Queue (+60 XP)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. LEADERBOARDS TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {/* Leaderboard Filters */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'Global' as const, label: 'Global', icon: Globe },
              { id: 'India' as const, label: 'India', icon: Flame },
              { id: 'College' as const, label: 'My College', icon: School },
            ].map((f) => {
              const Icon = f.icon;
              const active = leaderboardFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setLeaderboardFilter(f.id)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span>RANK & DEVELOPER</span>
              <span>XP & RATING</span>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_USERS.filter((u) => {
                if (leaderboardFilter === 'India') return u.country === 'India';
                if (leaderboardFilter === 'College') return u.college.includes('Asansol');
                return true;
              }).map((u) => (
                <div
                  key={u.rank}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                    u.name === 'Surjendu Pal'
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-sm'
                      : 'bg-slate-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                        u.rank === 1
                          ? 'bg-amber-500 text-slate-950'
                          : u.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : u.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">{u.name}</span>
                        {u.name === 'Surjendu Pal' && (
                          <span className="text-[9px] px-1 rounded bg-blue-500 text-white font-bold">YOU</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {u.college} • {u.country}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-400 block">{u.xp} XP</span>
                    <span className="text-[10px] text-slate-500 font-mono">{u.rating} ELO</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CODING PARTNERS TAB */}
      {activeTab === 'partners' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/50 to-slate-900 border border-blue-500/30 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">
              Peer Accountability Matcher
            </span>
            <p className="leading-relaxed">
              Find peers targeting the same stack and practice together. Mutual review doubles concept retention!
            </p>
          </div>

          <div className="space-y-2.5">
            {partners.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-400">{p.college} • {p.country}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-blue-400 border border-slate-800">
                    {p.rating} ELO
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-snug">{p.bio}</p>

                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-indigo-300">
                    🎯 Goal: {p.goal}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-emerald-300">
                    🕒 {p.availability}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">
                    Languages: {p.languages.join(', ')}
                  </span>
                  <button
                    onClick={() => handleTogglePartnerConnect(p.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      p.connected
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {p.connected ? '✓ Connected' : 'Connect & Study'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DISCUSSIONS TAB */}
      {activeTab === 'discussions' && (
        <div className="space-y-3">
          {/* Post Creation Toggle */}
          {!isPosting ? (
            <button
              onClick={() => setIsPosting(true)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-left text-xs text-slate-400 flex items-center justify-between cursor-pointer transition"
            >
              <span>Share a mental model, tip, or question...</span>
              <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-[11px]">
                Create Post
              </span>
            </button>
          ) : (
            <form onSubmit={handleCreatePost} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Create Community Post</span>
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Title (e.g. How I mastered recursion base cases)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                placeholder="Share your insight or technical question..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                required
              />

              <div className="flex items-center justify-between">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-blue-400"
                >
                  <option value="DSA">DSA</option>
                  <option value="WebDev">WebDev</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Open Source">Open Source</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Publish (+20 XP)
                </button>
              </div>
            </form>
          )}

          {/* Posts Feed */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{post.authorName}</span>
                    <span className="text-[10px] text-slate-400">
                      {post.authorLevel} • {post.authorCollege}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white leading-snug">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>

                {post.codeSnippet && (
                  <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto">
                    {post.codeSnippet}
                  </pre>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {post.commentsCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{post.createdAt}</span>
                    <button
                      onClick={async () => {
                        const reason = prompt('Why are you reporting this post? (Spam, Harassment, Inappropriate, Plagiarism):', 'Inappropriate content');
                        if (!reason) return;
                        await createModerationReport({
                          targetType: 'post',
                          targetId: post.id,
                          targetTitle: post.title,
                          reportedBy: 'Student',
                          reportedUserEmail: post.authorName,
                          reason,
                          status: 'Pending',
                        });
                        alert('Report submitted to TechJourney Moderation Team for review.');
                      }}
                      className="text-[10px] text-slate-500 hover:text-red-400 cursor-pointer"
                      title="Report content to moderators"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
