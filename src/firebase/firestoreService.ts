import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import {
  UserProfile,
  Roadmap,
  DailyPlan,
  ProblemAttempt,
  QuizAttempt,
  StudySession,
  ProgressSummary,
  Achievement,
  NotificationItem,
  AIMemoryItem,
  SystemActivity,
  ContentItem,
  AdminDSAProblem,
  KnowledgeFeedItem,
  ModerationReport,
  CompetitionItem,
  AnnouncementItem,
  FeatureFlags,
  AISettingsConfig,
  AdminAuditLog,
  AdminRole,
} from '../types';

// ================= USER PROFILE =================
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= ROADMAPS =================
export async function getRoadmap(userId: string): Promise<Roadmap | null> {
  const path = `users/${userId}/roadmaps`;
  try {
    const q = query(collection(db, 'users', userId, 'roadmaps'), orderBy('generatedAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return { id: docData.id, ...docData.data() } as Roadmap;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveRoadmap(userId: string, roadmap: Roadmap): Promise<string> {
  const roadmapId = roadmap.id || `roadmap_${Date.now()}`;
  const path = `users/${userId}/roadmaps/${roadmapId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'roadmaps', roadmapId), {
      ...roadmap,
      userId,
      updatedAt: new Date().toISOString(),
    });
    return roadmapId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= DAILY PLANS =================
export async function getDailyPlan(userId: string, dateStr: string): Promise<DailyPlan | null> {
  const path = `users/${userId}/dailyPlans`;
  try {
    const q = query(
      collection(db, 'users', userId, 'dailyPlans'),
      where('date', '==', dateStr),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as DailyPlan;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveDailyPlan(userId: string, plan: DailyPlan): Promise<string> {
  const planId = plan.id || `plan_${plan.date}`;
  const path = `users/${userId}/dailyPlans/${planId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'dailyPlans', planId), {
      ...plan,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return planId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= PROBLEM ATTEMPTS =================
export async function saveProblemAttempt(userId: string, attempt: ProblemAttempt): Promise<string> {
  const attemptId = attempt.id || `attempt_${Date.now()}`;
  const path = `users/${userId}/problemAttempts/${attemptId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'problemAttempts', attemptId), {
      ...attempt,
      userId,
      timestamp: attempt.timestamp || new Date().toISOString(),
    });
    return attemptId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getProblemAttempts(userId: string): Promise<ProblemAttempt[]> {
  const path = `users/${userId}/problemAttempts`;
  try {
    const q = query(collection(db, 'users', userId, 'problemAttempts'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProblemAttempt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= QUIZ ATTEMPTS =================
export async function saveQuizAttempt(userId: string, attempt: QuizAttempt): Promise<string> {
  const attemptId = attempt.id || `quiz_${Date.now()}`;
  const path = `users/${userId}/quizAttempts/${attemptId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'quizAttempts', attemptId), {
      ...attempt,
      userId,
      completedAt: attempt.completedAt || new Date().toISOString(),
    });
    return attemptId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  const path = `users/${userId}/quizAttempts`;
  try {
    const q = query(collection(db, 'users', userId, 'quizAttempts'), orderBy('completedAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizAttempt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= STUDY SESSIONS =================
export async function saveStudySession(userId: string, session: StudySession): Promise<string> {
  const sessionId = session.id || `session_${Date.now()}`;
  const path = `users/${userId}/studySessions/${sessionId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'studySessions', sessionId), {
      ...session,
      userId,
      completedAt: session.completedAt || new Date().toISOString(),
    });
    return sessionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= PROGRESS SUMMARY & SPACED REVISION =================
export async function getProgressSummary(userId: string): Promise<ProgressSummary | null> {
  const path = `users/${userId}/progress/summary`;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'progress', 'summary'));
    if (!snap.exists()) return null;
    return snap.data() as ProgressSummary;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveProgressSummary(userId: string, progress: ProgressSummary): Promise<void> {
  const path = `users/${userId}/progress/summary`;
  try {
    await setDoc(doc(db, 'users', userId, 'progress', 'summary'), {
      ...progress,
      userId,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= ACHIEVEMENTS =================
export async function getAchievements(userId: string): Promise<Achievement[]> {
  const path = `users/${userId}/achievements`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'achievements'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
  const path = `users/${userId}/achievements/${achievement.badgeId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'achievements', achievement.badgeId), {
      ...achievement,
      userId,
      unlockedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= AI MEMORY (Spaced repetition & weak topics) =================
export async function getAIMemory(userId: string): Promise<AIMemoryItem[]> {
  const path = `users/${userId}/aiMemory`;
  try {
    const q = query(collection(db, 'users', userId, 'aiMemory'), orderBy('updatedAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AIMemoryItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveAIMemoryItem(userId: string, item: AIMemoryItem): Promise<void> {
  const memoryId = item.id || `mem_${item.concept.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const path = `users/${userId}/aiMemory/${memoryId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'aiMemory', memoryId), {
      ...item,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= NOTIFICATIONS =================
export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  const path = `users/${userId}/notifications`;
  try {
    const q = query(collection(db, 'users', userId, 'notifications'), orderBy('createdAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveNotification(userId: string, notification: NotificationItem): Promise<string> {
  const notifId = notification.id || `notif_${Date.now()}`;
  const path = `users/${userId}/notifications/${notifId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'notifications', notifId), {
      ...notification,
      userId,
      createdAt: new Date().toISOString(),
    });
    return notifId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= SYSTEM ACTIVITIES (Admin audit logs) =================
export async function logSystemActivity(action: string, status: 'success' | 'warning' | 'error', details: string, userId?: string): Promise<void> {
  const activityId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `systemActivities/${activityId}`;
  try {
    await setDoc(doc(db, 'systemActivities', activityId), {
      action,
      status,
      details,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('System log skipped or denied:', error);
  }
}

export async function getAllSystemActivities(): Promise<SystemActivity[]> {
  const path = 'systemActivities';
  try {
    const q = query(collection(db, 'systemActivities'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SystemActivity));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= RBAC & USER SUSPENSION =================
export async function getUserRole(userId: string): Promise<AdminRole> {
  const path = `roles/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'roles', userId));
    if (!snap.exists()) return 'USER';
    return (snap.data().role as AdminRole) || 'USER';
  } catch (error) {
    return 'USER';
  }
}

export async function setUserRole(userId: string, role: AdminRole, adminEmail: string): Promise<void> {
  const path = `roles/${userId}`;
  try {
    await setDoc(doc(db, 'roles', userId), {
      userId,
      role,
      assignedBy: adminEmail,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    // Also mirror to user profile
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function toggleUserSuspension(userId: string, isSuspended: boolean): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      isSuspended,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= FEATURE FLAGS =================
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  knowledgeFeed: true,
  community: true,
  globalChallenges: true,
  codingPartner: true,
  projects: true,
  opportunities: true,
  competitions: true,
  aiMentor: true,
  shorts: true,
  leaderboard: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const path = 'feature_flags/current';
  try {
    const snap = await getDoc(doc(db, 'feature_flags', 'current'));
    if (!snap.exists()) return DEFAULT_FEATURE_FLAGS;
    return { ...DEFAULT_FEATURE_FLAGS, ...snap.data() } as FeatureFlags;
  } catch (error) {
    return DEFAULT_FEATURE_FLAGS;
  }
}

export async function saveFeatureFlags(flags: FeatureFlags): Promise<void> {
  const path = 'feature_flags/current';
  try {
    await setDoc(doc(db, 'feature_flags', 'current'), {
      ...flags,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= AI CONFIGURATION SETTINGS =================
export const DEFAULT_AI_SETTINGS: AISettingsConfig = {
  mentorSystemPrompt: 'You are TechJourney AI, a world-class senior software engineer and empathetic Socratic mentor. Do not give direct solutions immediately; guide the student through conceptual hints, algorithmic invariants, and edge cases.',
  socraticPacing: 'balanced',
  difficultyProgression: 'adaptive',
  weakTopicThreshold: 60,
  spacedRepetitionIntervals: [1, 3, 7, 14, 30],
  safetyRules: 'Strict educational guidance only. Do not provide answers for active graded assessments without progressive hints.',
  contentGenerationPromptTemplate: 'Create a hands-on developer lesson with intuition, visual ASCII mental models, time complexity, and practice problems.',
  modelName: 'gemini-3.8-flash',
  lastUpdated: new Date().toISOString(),
};

export async function getAISettings(): Promise<AISettingsConfig> {
  const path = 'ai_settings/global';
  try {
    const snap = await getDoc(doc(db, 'ai_settings', 'global'));
    if (!snap.exists()) return DEFAULT_AI_SETTINGS;
    return { ...DEFAULT_AI_SETTINGS, ...snap.data() } as AISettingsConfig;
  } catch (error) {
    return DEFAULT_AI_SETTINGS;
  }
}

export async function saveAISettings(settings: AISettingsConfig): Promise<void> {
  const path = 'ai_settings/global';
  try {
    await setDoc(doc(db, 'ai_settings', 'global'), {
      ...settings,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= CMS: LESSONS & CONTENT ITEMS =================
export async function getContentItems(): Promise<ContentItem[]> {
  const path = 'content_items';
  try {
    const snap = await getDocs(collection(db, 'content_items'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem));
  } catch (error) {
    return [];
  }
}

export async function saveContentItem(item: ContentItem): Promise<string> {
  const itemId = item.id || `item_${Date.now()}`;
  const path = `content_items/${itemId}`;
  try {
    await setDoc(doc(db, 'content_items', itemId), {
      ...item,
      id: itemId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return itemId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteContentItem(itemId: string): Promise<void> {
  const path = `content_items/${itemId}`;
  try {
    await deleteDoc(doc(db, 'content_items', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= DSA PROBLEMS REPOSITORY =================
export async function getAdminProblems(): Promise<AdminDSAProblem[]> {
  const path = 'dsa_problems';
  try {
    const snap = await getDocs(collection(db, 'dsa_problems'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminDSAProblem));
  } catch (error) {
    return [];
  }
}

export async function saveAdminProblem(problem: AdminDSAProblem): Promise<string> {
  const probId = problem.id || `prob_${Date.now()}`;
  const path = `dsa_problems/${probId}`;
  try {
    await setDoc(doc(db, 'dsa_problems', probId), {
      ...problem,
      id: probId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return probId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAdminProblem(probId: string): Promise<void> {
  const path = `dsa_problems/${probId}`;
  try {
    await deleteDoc(doc(db, 'dsa_problems', probId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= KNOWLEDGE FEED & SHORTS =================
export async function getKnowledgeFeedItems(): Promise<KnowledgeFeedItem[]> {
  const path = 'knowledge_feed';
  try {
    const snap = await getDocs(collection(db, 'knowledge_feed'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as KnowledgeFeedItem));
  } catch (error) {
    return [];
  }
}

export async function saveKnowledgeFeedItem(item: KnowledgeFeedItem): Promise<string> {
  const feedId = item.id || `feed_${Date.now()}`;
  const path = `knowledge_feed/${feedId}`;
  try {
    await setDoc(doc(db, 'knowledge_feed', feedId), {
      ...item,
      id: feedId,
    }, { merge: true });
    return feedId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteKnowledgeFeedItem(feedId: string): Promise<void> {
  const path = `knowledge_feed/${feedId}`;
  try {
    await deleteDoc(doc(db, 'knowledge_feed', feedId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= COMMUNITY MODERATION =================
export async function getModerationReports(): Promise<ModerationReport[]> {
  const path = 'community_moderation';
  try {
    const snap = await getDocs(collection(db, 'community_moderation'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ModerationReport));
  } catch (error) {
    return [];
  }
}

export async function createModerationReport(report: Omit<ModerationReport, 'id' | 'createdAt'>): Promise<string> {
  const repId = `rep_${Date.now()}`;
  const path = `community_moderation/${repId}`;
  try {
    await setDoc(doc(db, 'community_moderation', repId), {
      ...report,
      id: repId,
      createdAt: new Date().toISOString(),
    });
    return repId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function resolveModerationReport(
  reportId: string,
  status: 'Resolved' | 'Rejected',
  notes: string,
  actionTaken: 'none' | 'removed_content' | 'suspended_user' | 'warned_user',
  adminEmail: string
): Promise<void> {
  const path = `community_moderation/${reportId}`;
  try {
    await updateDoc(doc(db, 'community_moderation', reportId), {
      status,
      resolutionNotes: notes,
      actionTaken,
      resolvedBy: adminEmail,
      resolvedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= COMPETITIONS =================
export async function getCompetitions(): Promise<CompetitionItem[]> {
  const path = 'competitions';
  try {
    const snap = await getDocs(collection(db, 'competitions'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CompetitionItem));
  } catch (error) {
    return [];
  }
}

export async function saveCompetition(comp: CompetitionItem): Promise<string> {
  const compId = comp.id || `comp_${Date.now()}`;
  const path = `competitions/${compId}`;
  try {
    await setDoc(doc(db, 'competitions', compId), {
      ...comp,
      id: compId,
    }, { merge: true });
    return compId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCompetition(compId: string): Promise<void> {
  const path = `competitions/${compId}`;
  try {
    await deleteDoc(doc(db, 'competitions', compId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= ANNOUNCEMENTS =================
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const path = 'announcements';
  try {
    const snap = await getDocs(collection(db, 'announcements'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AnnouncementItem));
  } catch (error) {
    return [];
  }
}

export async function saveAnnouncement(announcement: AnnouncementItem): Promise<string> {
  const annId = announcement.id || `ann_${Date.now()}`;
  const path = `announcements/${annId}`;
  try {
    await setDoc(doc(db, 'announcements', annId), {
      ...announcement,
      id: annId,
      createdAt: announcement.createdAt || new Date().toISOString(),
    }, { merge: true });
    return annId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= AUDIT LOGS =================
export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const path = 'admin_audit_logs';
  try {
    const q = query(collection(db, 'admin_audit_logs'), orderBy('timestamp', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAuditLog));
  } catch (error) {
    return [];
  }
}

export async function recordAdminAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<void> {
  const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `admin_audit_logs/${logId}`;
  try {
    await setDoc(doc(db, 'admin_audit_logs', logId), {
      ...log,
      id: logId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Audit log write error:', error);
  }
}

