import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './firebase/authContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { LearnView } from './views/LearnView';
import { PracticeView } from './views/PracticeView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { CommunityView } from './views/CommunityView';
import { OnboardingView } from './views/OnboardingView';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { NightReviewModal } from './components/NightReviewModal';
import { MentorChatDrawer } from './components/MentorChatDrawer';
import { CareerMentorModal } from './components/CareerMentorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationsModal } from './components/NotificationsModal';
import { FocusModeModal } from './components/FocusModeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TechJourneyLogo } from './components/TechJourneyLogo';
import { AdminPortal } from './components/admin/AdminPortal';
import { AccessDeniedView } from './components/admin/AccessDeniedView';
import { getLevelFromXP } from './data/levelData';
import { apiClient } from './services/apiClient';
import {
  getRoadmap,
  saveRoadmap,
  getDailyPlan,
  saveDailyPlan,
  getProblemAttempts,
  saveProblemAttempt,
  getQuizAttempts,
  saveQuizAttempt,
  getProgressSummary,
  saveProgressSummary,
  getAchievements,
  unlockAchievement,
  getNotifications,
  saveNotification,
  getAIMemory,
  saveAIMemoryItem,
  logSystemActivity,
  saveUserProfile,
} from './firebase/firestoreService';
import {
  UserProfile,
  Roadmap,
  DailyPlan,
  ProblemAttempt,
  QuizAttempt,
  ProgressSummary,
  Achievement,
  NotificationItem,
  AIMemoryItem,
} from './types';
import { RefreshCw, Sparkles } from 'lucide-react';

function AppContent() {
  const { user, profile, loading: authLoading, role, isAdmin, isSuperAdmin, updateProfileState, signInWithGoogle, signInAsGuest, signOut } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [problemAttempts, setProblemAttempts] = useState<ProblemAttempt[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [aiMemory, setAiMemory] = useState<AIMemoryItem[]>([]);

  // Modals & Drawers
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isNightReviewOpen, setIsNightReviewOpen] = useState(false);
  const [isMentorChatOpen, setIsMentorChatOpen] = useState(false);
  const [isCareerMentorOpen, setIsCareerMentorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(
    typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#/admin' ||
        window.location.hash.startsWith('#admin'))
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
        setIsAdminRoute(true);
      }
    };
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Selected items across tabs
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [appInitializing, setAppInitializing] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const currentXP = profile?.xp ?? 180;
  const levelInfo = getLevelFromXP(currentXP);

  const handleEarnXP = async (amount: number, reason: string) => {
    if (!user || !profile) return;
    const newXP = (profile.xp || 0) + amount;
    const newLevelInfo = getLevelFromXP(newXP);
    await updateProfileState({
      xp: newXP,
      level: newLevelInfo.level,
      levelTitle: newLevelInfo.title,
    });
    logSystemActivity('XP Earned', 'success', `+${amount} XP (${reason}). Total: ${newXP}`, user.uid);
  };

  // Load user data on auth readiness
  useEffect(() => {
    if (!authLoading) {
      if (user && profile) {
        loadUserData(user.uid, profile);
      } else {
        setAppInitializing(false);
      }
    }
  }, [user, profile, authLoading]);

  const loadUserData = async (uid: string, userProfile: UserProfile) => {
    try {
      // 1. Load or Generate Roadmap
      let existingRoadmap = await getRoadmap(uid);
      if (!existingRoadmap) {
        try {
          existingRoadmap = await apiClient.generateRoadmap(userProfile);
          existingRoadmap.userId = uid;
          await saveRoadmap(uid, existingRoadmap);
          logSystemActivity('Roadmap Generated', 'success', `Generated roadmap: ${existingRoadmap.title}`, uid);
        } catch (e) {
          console.warn('Roadmap AI generation fallback:', e);
        }
      }
      setRoadmap(existingRoadmap);

      // 2. Load or Generate Today's Plan
      let existingPlan = await getDailyPlan(uid, todayStr);
      if (!existingPlan) {
        try {
          const generated = await apiClient.generateDailyPlan({
            profile: userProfile,
            dayNumber: userProfile.streak || 1,
            weakConcepts: [],
            recentMistakes: [],
            streak: userProfile.streak || 1,
            availableMinutes: 60,
          });
          generated.userId = uid;
          generated.date = todayStr;
          await saveDailyPlan(uid, generated);
          existingPlan = generated;
          logSystemActivity('Daily Plan Generated', 'success', `Day ${generated.dayNumber} created`, uid);
        } catch (e) {
          console.warn('Daily Plan AI generation fallback:', e);
        }
      }
      setDailyPlan(existingPlan);

      // 3. Load Problem Attempts & Quizzes
      const [attempts, quizzes, pSummary, userAchievements, userNotifs, memory] = await Promise.all([
        getProblemAttempts(uid).catch(() => []),
        getQuizAttempts(uid).catch(() => []),
        getProgressSummary(uid).catch(() => null),
        getAchievements(uid).catch(() => []),
        getNotifications(uid).catch(() => []),
        getAIMemory(uid).catch(() => []),
      ]);

      setProblemAttempts(attempts);
      setQuizAttempts(quizzes);
      setAchievements(userAchievements);
      setNotifications(userNotifs);
      setAiMemory(memory);

      if (pSummary) {
        setProgress(pSummary);
      } else {
        const initialProgress: ProgressSummary = {
          userId: uid,
          overallProgress: 15,
          dsaProgress: 20,
          webDevProgress: 15,
          backendProgress: 10,
          databaseProgress: 10,
          gitProgress: 25,
          aiMlProgress: 5,
          systemDesignProgress: 10,
          projectsProgress: 10,
          interviewProgress: 10,
          devProgress: 10,
          problemsSolved: attempts.filter((a) => a.classification === 'Correct').length,
          problemsAttempted: attempts.length,
          accuracy: 75,
          totalStudyHours: Math.round(userProfile.totalStudyMinutes / 60) || 4,
          currentStreak: userProfile.streak,
          longestStreak: userProfile.longestStreak,
          weakTopics: ['Two Pointers Boundary Condition'],
          strongTopics: ['Array Indexing'],
          revisionQueue: [
            {
              topicId: 'arrays',
              topicTitle: 'Array Invariants & Reversal',
              dueDate: 'Today',
              intervalDays: 1,
              repetitionCount: 1,
            },
          ],
          lastUpdated: new Date().toISOString(),
        };
        await saveProgressSummary(uid, initialProgress);
        setProgress(initialProgress);
      }

      // Check if welcome notification exists
      if (userNotifs.length === 0) {
        const welcomeNotif: NotificationItem = {
          userId: uid,
          title: `Day ${userProfile.streak} Mission Ready!`,
          message: 'Your personal AI mentor has prepared today’s DSA and coding challenge.',
          type: 'morning',
          scheduledTime: '08:00 AM',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        await saveNotification(uid, welcomeNotif);
        setNotifications([welcomeNotif]);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setAppInitializing(false);
    }
  };

  // Toggle daily task completed
  const handleToggleTask = async (taskId: string) => {
    if (!dailyPlan || !user) return;
    const updatedTasks = dailyPlan.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan: DailyPlan = {
      ...dailyPlan,
      tasks: updatedTasks,
      status: updatedTasks.every((t) => t.completed) ? 'completed' : 'in_progress',
      updatedAt: new Date().toISOString(),
    };
    setDailyPlan(updatedPlan);
    await saveDailyPlan(user.uid, updatedPlan);

    // Update study minutes
    const task = dailyPlan.tasks.find((t) => t.id === taskId);
    if (task && !task.completed && profile) {
      const addedMinutes = task.allocatedMinutes || 15;
      await updateProfileState({
        totalStudyMinutes: (profile.totalStudyMinutes || 0) + addedMinutes,
      });
    }
  };

  // Handle Morning Check-in Submit
  const handleCheckInSubmit = async (data: {
    availableMinutes: number;
    feeling: string;
    completedYesterday: string;
    struggleNotes: string;
  }) => {
    if (!user || !profile) return;
    try {
      const weakList = data.struggleNotes ? [data.struggleNotes] : progress?.weakTopics || [];
      const newPlan = await apiClient.generateDailyPlan({
        profile,
        dayNumber: profile.streak || 1,
        weakConcepts: weakList,
        recentMistakes: data.struggleNotes ? [data.struggleNotes] : [],
        streak: profile.streak || 1,
        availableMinutes: data.availableMinutes,
      });

      newPlan.userId = user.uid;
      newPlan.date = todayStr;
      newPlan.checkInCompleted = true;
      newPlan.notes = `Feeling: ${data.feeling}. Yesterday: ${data.completedYesterday}.`;

      setDailyPlan(newPlan);
      await saveDailyPlan(user.uid, newPlan);
      logSystemActivity('Daily Check-in Completed', 'success', `Plan adapted for ${data.availableMinutes} min`, user.uid);
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  // Handle Night Review Submit
  const handleNightReviewSubmit = async (data: {
    reflection: string;
    minutesStudied: number;
    tasksCompleted: number;
    problemsSolved: number;
  }) => {
    if (!user || !profile) throw new Error('User not loaded');

    const result = await apiClient.submitNightReview({
      reflection: data.reflection,
      minutesStudied: data.minutesStudied,
      tasksCompleted: data.tasksCompleted,
      problemsSolved: data.problemsSolved,
      profile,
    });

    if (dailyPlan) {
      const updatedPlan: DailyPlan = {
        ...dailyPlan,
        nightReviewCompleted: true,
        updatedAt: new Date().toISOString(),
      };
      setDailyPlan(updatedPlan);
      await saveDailyPlan(user.uid, updatedPlan);
    }

    // Update profile streak
    const newStreak = (profile.streak || 1) + 1;
    const newLongest = Math.max(newStreak, profile.longestStreak || 1);
    await updateProfileState({
      streak: newStreak,
      longestStreak: newLongest,
      totalStudyMinutes: (profile.totalStudyMinutes || 0) + data.minutesStudied,
      lastActiveDate: todayStr,
    });

    // Award night reviewer badge
    await unlockAchievement(user.uid, {
      userId: user.uid,
      badgeId: 'night-reviewer',
      title: 'Night Reviewer',
      description: 'Completed comprehensive evening reflection and planned tomorrow.',
      category: 'consistency',
      unlockedAt: new Date().toISOString(),
    });

    logSystemActivity('Night Review Logged', 'success', `Streak now ${newStreak} days`, user.uid);
    return result;
  };

  // Record a problem solving attempt
  const handleNewAttempt = async (attempt: ProblemAttempt) => {
    if (!user) return;
    attempt.userId = user.uid;
    const id = await saveProblemAttempt(user.uid, attempt);
    setProblemAttempts((prev) => [{ ...attempt, id }, ...prev]);

    // Recalculate progress summary
    if (progress) {
      const isCorrect = attempt.classification === 'Correct';
      const newSolved = isCorrect ? progress.problemsSolved + 1 : progress.problemsSolved;
      const newAttempted = progress.problemsAttempted + 1;
      const newAccuracy = Math.round((newSolved / newAttempted) * 100);

      const updatedProgress: ProgressSummary = {
        ...progress,
        problemsSolved: newSolved,
        problemsAttempted: newAttempted,
        accuracy: newAccuracy,
        overallProgress: Math.min(100, progress.overallProgress + 2),
        dsaProgress: Math.min(100, progress.dsaProgress + 3),
      };

      if (!isCorrect) {
        // Add to weak topics
        if (!updatedProgress.weakTopics.includes(attempt.topic)) {
          updatedProgress.weakTopics = [attempt.topic, ...updatedProgress.weakTopics.slice(0, 4)];
        }
        // Save to AI Memory for Spaced Repetition
        await saveAIMemoryItem(user.uid, {
          userId: user.uid,
          concept: attempt.topic,
          category: 'DSA',
          status: 'weak',
          mistakeNotes: attempt.feedback.substring(0, 300),
          revisionCount: 1,
          nextRevisionDate: todayStr,
          lastAttemptScore: 40,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Add to strong topics
        if (!updatedProgress.strongTopics.includes(attempt.topic)) {
          updatedProgress.strongTopics = [attempt.topic, ...updatedProgress.strongTopics.slice(0, 4)];
        }
      }

      setProgress(updatedProgress);
      await saveProgressSummary(user.uid, updatedProgress);
    }
  };

  // Record quiz result
  const handleSaveQuizResult = async (
    topicId: string,
    topicTitle: string,
    score: number,
    total: number,
    weakConcepts: string[]
  ) => {
    if (!user) return;
    const quizAtt: QuizAttempt = {
      userId: user.uid,
      topicId,
      topicTitle,
      score,
      totalQuestions: total,
      percentage: Math.round((score / total) * 100),
      weakConcepts,
      completedAt: new Date().toISOString(),
    };
    await saveQuizAttempt(user.uid, quizAtt);
    setQuizAttempts((prev) => [quizAtt, ...prev]);

    // Update AI Memory for weak concepts
    if (weakConcepts.length > 0) {
      for (const wc of weakConcepts) {
        await saveAIMemoryItem(user.uid, {
          userId: user.uid,
          concept: wc,
          category: topicTitle,
          status: 'weak',
          mistakeNotes: `Missed in ${topicTitle} comprehension quiz.`,
          revisionCount: 1,
          nextRevisionDate: todayStr,
          lastAttemptScore: Math.round((score / total) * 100),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };

  // Trigger simulated scheduled notifications
  const handleTriggerScheduleDemo = async (type: 'morning' | 'evening' | 'night') => {
    if (!user) return;
    const day = profile?.streak || 24;
    let title = '';
    let message = '';

    if (type === 'morning') {
      title = `GOOD MORNING • Day ${day}`;
      message = `Your Day ${day} DSA mission is ready. Let's conquer sliding window today!`;
    } else if (type === 'evening') {
      title = 'EVENING CHECK-IN';
      message = 'Have you completed today’s coding mission? Keep your streak alive!';
    } else {
      title = 'NIGHT REVIEW';
      message = 'Let’s review today’s progress, lock in the concepts, and plan tomorrow.';
    }

    const notif: NotificationItem = {
      userId: user.uid,
      title,
      message,
      type,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const notifId = await saveNotification(user.uid, notif);
    setNotifications((prev) => [{ ...notif, id: notifId }, ...prev]);
  };

  // Regenerate Adaptive Roadmap
  const handleRegenerateRoadmap = async () => {
    if (!user || !profile) return;
    const newRoadmap = await apiClient.generateRoadmap(profile);
    newRoadmap.userId = user.uid;
    await saveRoadmap(user.uid, newRoadmap);
    setRoadmap(newRoadmap);
  };

  // Protected Admin Route Check
  if (isAdminRoute || isAdminOpen) {
    if (!isAdmin && !isSuperAdmin) {
      return (
        <AccessDeniedView
          userEmail={user?.email || 'Guest User'}
          userRole={role || 'USER'}
          onReturn={() => {
            setIsAdminRoute(false);
            setIsAdminOpen(false);
            if (typeof window !== 'undefined' && window.location.hash.includes('admin')) {
              window.location.hash = '';
            }
          }}
        />
      );
    }
    return (
      <AdminPortal
        currentUserEmail={user?.email || 'enginnerboy079@gmail.com'}
        currentUserUid={user?.uid || 'super_admin'}
        currentUserRole={role}
        isSuperAdmin={isSuperAdmin}
        onExitToStudentApp={() => {
          setIsAdminRoute(false);
          setIsAdminOpen(false);
          if (typeof window !== 'undefined' && window.location.hash.includes('admin')) {
            window.location.hash = '';
          }
        }}
        onPlatformDataChanged={() => {
          if (user && profile) loadUserData(user.uid, profile);
        }}
      />
    );
  }

  // Account Suspension Barrier
  if (profile?.isSuspended) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <TechJourneyLogo size="lg" variant="app-icon" />
        <div className="mt-4 p-5 rounded-3xl bg-red-950/40 border border-red-500/30 text-red-200">
          <h2 className="text-base font-bold text-white">Account Temporarily Suspended</h2>
          <p className="text-xs mt-1 text-slate-300 leading-relaxed">
            Your learner account has been suspended by an administrator. Please reach out to support if you believe this was an error.
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If user is not yet logged in and no profile exists
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        {/* Official Brand Logo */}
        <TechJourneyLogo size="hero" showText={true} variant="app-icon" className="mb-5" />

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Guiding you every single day from absolute beginner to job-ready software developer with autonomous study missions, DSA training, and active Socratic feedback.
        </p>

        <div className="w-full mt-8 space-y-3">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-98 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <button
            onClick={() => signInAsGuest()}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-slate-300 font-semibold text-xs border border-slate-800 cursor-pointer"
          >
            Continue as Guest on Phone
          </button>
        </div>
      </div>
    );
  }

  // First-time Onboarding if profile is fresh
  if (profile && !profile.careerGoal) {
    return (
      <OnboardingView
        onComplete={async (data) => {
          await updateProfileState(data);
          if (user) {
            await loadUserData(user.uid, { ...profile, ...data } as UserProfile);
          }
        }}
      />
    );
  }

  if (appInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <TechJourneyLogo size="lg" variant="app-icon" className="mb-4 animate-pulse" />
        <h2 className="text-base font-bold text-white">Synthesizing Your Tech Journey...</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">Calibrating daily missions and verified DSA curriculum</p>
      </div>
    );
  }

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <OfflineIndicator />

      {/* Top Header */}
      <Header
        streak={profile?.streak || 1}
        xp={currentXP}
        levelInfo={levelInfo}
        onOpenMentorChat={() => setIsMentorChatOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        unreadCount={unreadNotifsCount}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Tab Screen */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {currentTab === 'home' && (
          <HomeView
            profile={profile}
            dailyPlan={dailyPlan}
            progress={progress}
            levelInfo={levelInfo}
            onNavigateTab={setCurrentTab}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenNightReview={() => setIsNightReviewOpen(true)}
            onOpenFocusMode={() => setIsFocusModeOpen(true)}
            onToggleTaskComplete={handleToggleTask}
            onOpenTopic={(topicId) => {
              setSelectedTopicId(topicId);
              setCurrentTab('learn');
            }}
            onStartPracticeProblem={(problemId, topicId) => {
              setSelectedProblemId(problemId);
              setSelectedTopicId(topicId);
              setCurrentTab('practice');
            }}
            onEarnXP={handleEarnXP}
          />
        )}

        {currentTab === 'learn' && (
          <LearnView
            selectedTopicId={selectedTopicId}
            onStartProblem={(probId, topId) => {
              setSelectedProblemId(probId);
              setSelectedTopicId(topId);
              setCurrentTab('practice');
            }}
            onSaveQuizResult={handleSaveQuizResult}
            onEarnXP={handleEarnXP}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            attempts={problemAttempts}
            onNewAttempt={handleNewAttempt}
            selectedProblemId={selectedProblemId}
            selectedTopicId={selectedTopicId}
            onEarnXP={handleEarnXP}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            onEarnXP={handleEarnXP}
            onOpenProblemInPractice={(problemId, topicId) => {
              setSelectedProblemId(problemId);
              setSelectedTopicId(topicId);
              setCurrentTab('practice');
            }}
            userCollege={profile?.college}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            profile={profile}
            progress={progress}
            levelInfo={levelInfo}
            achievements={achievements}
            onOpenCareerMentor={() => setIsCareerMentorOpen(true)}
            onGenerateWeeklyReview={() => {}}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            roadmap={roadmap}
            levelInfo={levelInfo}
            onSaveProfile={updateProfileState}
            onRegenerateRoadmap={handleRegenerateRoadmap}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onSignInGoogle={signInWithGoogle}
            onSignInGuest={signInAsGuest}
            onSignOut={signOut}
            isAdmin={isAdmin}
            onEarnXP={handleEarnXP}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Modals & Drawers */}
      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={handleCheckInSubmit}
        currentStreak={profile?.streak || 1}
      />

      <NightReviewModal
        isOpen={isNightReviewOpen}
        onClose={() => setIsNightReviewOpen(false)}
        onSubmit={handleNightReviewSubmit}
        initialMinutes={dailyPlan?.totalMinutes || 45}
        initialTasksCompleted={dailyPlan?.tasks.filter((t) => t.completed).length || 3}
        initialProblemsSolved={problemAttempts.length || 2}
      />

      <FocusModeModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onCompleteMission={(earnedXP) => handleEarnXP(earnedXP, 'Completed Focus Session')}
      />

      <MentorChatDrawer
        isOpen={isMentorChatOpen}
        onClose={() => setIsMentorChatOpen(false)}
        profile={profile}
        currentTopic={dailyPlan?.title || 'Data Structures & Algorithms'}
      />

      <CareerMentorModal
        isOpen={isCareerMentorOpen}
        onClose={() => setIsCareerMentorOpen(false)}
        profile={profile}
        progress={progress}
      />

      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={async (id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
        }}
        onTriggerScheduleDemo={handleTriggerScheduleDemo}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
