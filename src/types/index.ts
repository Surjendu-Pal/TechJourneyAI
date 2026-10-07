export type DeveloperLevelNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DeveloperLevelInfo {
  level: DeveloperLevelNumber;
  title: string;
  minXP: number;
  badge: string;
  perk: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  educationLevel: string;
  programmingExperience: string; // 'beginner' | 'intermediate' | 'advanced'
  preferredLanguage: string; // 'JavaScript' | 'Python' | 'TypeScript' | 'Java' | 'C++' | 'SQL'
  careerGoal: string; // e.g. 'Full-Stack Software Engineer'
  dailyAvailableTime: string; // '30 mins' | '1 hour' | '2 hours' | '3+ hours'
  dailyPreferredStudyTime: string; // 'Morning' | 'Afternoon' | 'Evening' | 'Night'
  dsaLevel: string; // 'Absolute Beginner' | 'Solved <50' | 'Solved 100+' | 'Intermediate'
  devLevel: string; // 'Beginner' | 'Built 1-2 projects' | 'Full stack experience'
  targetDate: string; // e.g. 'April 2027' or '2027-04-30'
  preferredLearningStyle: string; // 'Visual & Diagrams' | 'Hands-on Coding' | 'Theory First' | 'Socratic Challenge'
  streak: number;
  longestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  totalStudyMinutes: number;
  
  // Gamification & Social Identity
  xp: number;
  level: DeveloperLevelNumber;
  levelTitle: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isSuspended?: boolean;
  college?: string;
  country?: string;
  battleRating: number; // ELO rating (default: 1200)
  bio?: string;
  githubUsername?: string;
  portfolioUrl?: string;
  skills: string[];
  completedLessonsCount: number;
  completedProjectsCount: number;
  lastActiveLesson?: {
    topicId: string;
    topicTitle: string;
    step: number;
    totalSteps: number;
  };
  notificationPreferences?: {
    morning: boolean;
    evening: boolean;
    battles: boolean;
    opportunities: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

export interface XPHistoryEntry {
  id: string;
  amount: number;
  reason: string;
  category: 'lesson' | 'quiz' | 'problem' | 'mission' | 'project' | 'battle' | 'community' | 'daily_challenge';
  timestamp: string;
}

export interface DailyMission {
  id: string;
  number: number;
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  progressPercent: number;
  completed: boolean;
  category: 'learn' | 'practice' | 'review' | 'challenge';
  topicRef?: string;
  actionText: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  type: 'coding' | 'knowledge' | 'debug' | 'career';
  title: string;
  description: string;
  starterCode?: string;
  brokenCodeSnippet?: string;
  expectedOutput?: string;
  solutionSnippet?: string;
  options?: string[];
  correctOptionIndex?: number;
  rewardXP: number;
  completed: boolean;
  userAnswer?: string;
}

export interface MistakeRecord {
  id: string;
  userId: string;
  problemId: string;
  problemTitle: string;
  topic: string;
  userMistake: string;
  aiDiagnosis: string;
  conceptTag: string;
  scheduledReviewDate: string; // YYYY-MM-DD
  intervalStage: 1 | 3 | 7 | 14 | 30; // Spaced repetition stage
  reviewed: boolean;
  createdAt: string;
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  status: 'Not Started' | 'Learning' | 'Practicing' | 'Strong' | 'Mastered';
  topics: {
    id: string;
    title: string;
    completed: boolean;
    importance: 'Critical' | 'High' | 'Medium';
    status: 'Not Started' | 'Learning' | 'Practicing' | 'Strong' | 'Mastered';
  }[];
  completed: boolean;
}

export interface Roadmap {
  id?: string;
  userId: string;
  title: string;
  currentPhase: string;
  modules: RoadmapModule[];
  overallProgress: number; // 0 - 100
  generatedAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  type: 'revision' | 'dsa' | 'coding' | 'quiz' | 'interview' | 'project';
  title: string;
  allocatedMinutes: number;
  completed: boolean;
  topicRef?: string;
  description: string;
}

export interface DailyPlan {
  id?: string;
  userId: string;
  dayNumber: number;
  date: string; // 'YYYY-MM-DD'
  title: string;
  totalMinutes: number;
  tasks: DailyTask[];
  status: 'pending' | 'in_progress' | 'completed';
  dailyMission: string;
  checkInCompleted: boolean;
  nightReviewCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionClassification = 'Accepted' | 'Wrong Answer' | 'Time Limit' | 'Runtime Error' | 'Correct' | 'Almost correct' | 'Needs improvement' | 'Incorrect';

export interface TestCase {
  input: string;
  expected: string;
  isHidden?: boolean;
}

export interface ProblemAttempt {
  id?: string;
  userId: string;
  problemId: string;
  problemTitle: string;
  topic: string;
  language: string;
  code: string;
  explanation: string;
  approach: string;
  classification: SubmissionClassification;
  feedback: string;
  hintsGiven: number;
  executionTimeMs?: number;
  testsPassed?: number;
  totalTests?: number;
  xpEarned?: number;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface QuizAttempt {
  id?: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakConcepts: string[];
  completedAt: string;
}

export interface StudySession {
  id?: string;
  userId: string;
  durationMinutes: number;
  topic: string;
  category: string;
  completedAt: string;
  rating?: number;
}

export interface ProgressSummary {
  userId: string;
  overallProgress: number; // 0-100
  dsaProgress: number; // 0-100
  webDevProgress: number; // 0-100
  backendProgress: number; // 0-100
  databaseProgress: number; // 0-100
  gitProgress: number; // 0-100
  aiMlProgress: number; // 0-100
  systemDesignProgress: number; // 0-100
  projectsProgress: number; // 0-100
  interviewProgress: number; // 0-100

  devProgress: number; // legacy alias for web/backend
  problemsSolved: number;
  problemsAttempted: number;
  accuracy: number; // 0-100
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  weakTopics: string[];
  strongTopics: string[];
  revisionQueue: {
    topicId: string;
    topicTitle: string;
    dueDate: string;
    intervalDays: number;
    repetitionCount: number;
  }[];
  lastUpdated: string;
}

export interface Achievement {
  id?: string;
  userId: string;
  badgeId: string;
  title: string;
  description: string;
  category: 'streak' | 'problems' | 'dsa' | 'dev' | 'consistency' | 'community' | 'project';
  unlockedAt: string;
  icon?: string;
}

export interface NotificationItem {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'morning' | 'evening' | 'night' | 'achievement' | 'streak' | 'battle' | 'opportunity';
  scheduledTime: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIMemoryItem {
  id?: string;
  userId: string;
  concept: string;
  category: string;
  status: 'weak' | 'revising' | 'mastered';
  mistakeNotes: string;
  revisionCount: number;
  nextRevisionDate: string;
  lastAttemptScore: number;
  updatedAt: string;
}

export interface SystemActivity {
  id?: string;
  userId?: string;
  action: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  timestamp: string;
}

export interface DSATopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  simpleExplanation: string;
  visualAscii: string;
  mentalModel?: string;
  example: string;
  codeSnippets: Record<string, string>; // Language -> code
  predictOutput?: {
    codeSnippet: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  miniChallenge?: {
    prompt: string;
    task: string;
    hint: string;
    solution: string;
  };
  timeComplexity: string;
  spaceComplexity: string;
  practiceProblems: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    starterCode: Record<string, string>;
    testCases: TestCase[];
    hints: string[];
    solutionApproach: string;
    xp?: number;
  }[];
  quiz: QuizQuestion[];
  revisionTips: string[];
}

// Social, Competition & Opportunity Types
export interface KnowledgeReel {
  id: string;
  title: string;
  topic: string;
  category: 'DSA' | 'WebDev' | 'SystemDesign' | 'AI' | 'Career';
  durationSeconds: number;
  visualAscii: string;
  explanation: string;
  mentalModelTakeaway: string;
  challengeQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  likes: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CodingBattleState {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  timeLimitMinutes: number;
  problem: {
    title: string;
    description: string;
    starterCode: string;
    testCases: TestCase[];
  };
  opponent: {
    name: string;
    college: string;
    rating: number;
    avatar: string;
    progressPercent: number;
    status: 'coding' | 'submitted';
  };
  userCode: string;
  timeRemainingSeconds: number;
  status: 'matchmaking' | 'active' | 'finished';
  result?: {
    winner: 'user' | 'opponent' | 'draw';
    ratingChange: number;
    xpEarned: number;
    reason: string;
  };
}

export interface CodingPartner {
  id: string;
  name: string;
  avatar: string;
  college: string;
  country: string;
  languages: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: string;
  availability: string;
  rating: number;
  bio: string;
  status: 'online' | 'offline';
  connected?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorCollege?: string;
  authorLevel: string;
  category: 'DSA' | 'WebDev' | 'AI/ML' | 'Open Source' | 'Hackathons' | 'Career';
  title: string;
  content: string;
  codeSnippet?: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
  milestones: ProjectMilestone[];
  completed: boolean;
  githubUrl?: string;
  liveUrl?: string;
  aiCodeReviewFeedback?: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  companyOrOrg: string;
  type: 'Internship' | 'Job' | 'Hackathon' | 'Open Source' | 'Bounty' | 'Student Program';
  matchScore: number; // 0 - 100 based on user skills
  requiredSkills: string[];
  stipendOrPrize?: string;
  deadline: string;
  location: string; // 'Remote' | 'Bangalore, India' | etc.
  description: string;
  applyUrl: string;
  verified: boolean;
}

export interface WeeklyAIReview {
  id: string;
  userId: string;
  weekDate: string;
  learningHours: number;
  problemsSolved: number;
  accuracy: number;
  xpEarned: number;
  whatImproved: string;
  whatIsWeak: string;
  nextWeekFocus: string;
  streak: number;
}

// ---------------- Admin & CMS Types ----------------

export type ContentStatus = 'Draft' | 'Review' | 'Published' | 'Archived';
export type AdminRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string; // 'DSA' | 'WebDev' | 'Backend' | 'Databases' | 'AI/ML' | 'System Design' | 'Career'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  thumbnail?: string;
  content: string; // Markdown or detailed explanation
  status: ContentStatus;
  author: string;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDSAProblem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: {
    input: string;
    expected: string;
    isHidden?: boolean;
  }[];
  expectedOutput: string;
  starterCode: Record<string, string>; // Language -> code snippet
  supportedLanguages: string[];
  hints: string[];
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeFeedItem {
  id: string;
  title: string;
  category: 'DSA' | 'WebDev' | 'AI/ML' | 'Cybersecurity' | 'Cloud' | 'Programming' | 'Career' | 'Projects' | 'Entrepreneurship' | 'Hackathons' | 'Study Skills';
  content: string;
  codeSnippet?: string;
  author: string;
  authorRole?: string;
  status: ContentStatus;
  scheduledAt?: string;
  isPinned: boolean;
  isFeatured: boolean;
  likes: number;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'project';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reportedUserEmail?: string;
  reason: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';
  resolutionNotes?: string;
  actionTaken?: 'none' | 'removed_content' | 'suspended_user' | 'warned_user';
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface CompetitionItem {
  id: string;
  title: string;
  description: string;
  type: 'Daily Challenge' | 'Weekly Challenge' | 'Global Challenge' | 'College Competition' | 'Coding Battle' | 'Hackathon';
  startDate: string;
  endDate: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  problems: string[]; // Problem IDs
  eligibility: string;
  scoringRules: string;
  rewards: string;
  status: 'Draft' | 'Upcoming' | 'Live' | 'Completed';
  participantsCount: number;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'platform' | 'competition' | 'learning' | 'maintenance';
  targetAudience: 'All users' | 'New users' | 'Specific skill group' | 'Specific country' | 'Specific college' | 'Competition participants';
  scheduledTime?: string;
  isBroadcasted: boolean;
  createdAt: string;
}

export interface FeatureFlags {
  knowledgeFeed: boolean;
  community: boolean;
  globalChallenges: boolean;
  codingPartner: boolean;
  projects: boolean;
  opportunities: boolean;
  competitions: boolean;
  aiMentor: boolean;
  shorts: boolean;
  leaderboard: boolean;
}

export interface AISettingsConfig {
  mentorSystemPrompt: string;
  socraticPacing: 'patient' | 'balanced' | 'fast';
  difficultyProgression: 'adaptive' | 'linear' | 'challenging';
  weakTopicThreshold: number; // e.g. score < 60%
  spacedRepetitionIntervals: number[]; // e.g. [1, 3, 7, 14, 30]
  safetyRules: string;
  contentGenerationPromptTemplate: string;
  modelName: string;
  lastUpdated: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  adminUid: string;
  action: string;
  targetType: string;
  targetId: string;
  previousValue: string;
  newValue: string;
  timestamp: string;
}

