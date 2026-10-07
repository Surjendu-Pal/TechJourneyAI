import { Roadmap, DailyPlan, ProblemAttempt, SubmissionClassification } from '../types';

export interface EvaluationResult {
  classification: SubmissionClassification;
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  detailedFeedback: string;
  edgeCasesMissed: string[];
  nextStep: string;
}

export interface ProgressiveHintResult {
  hintNumber: number;
  hint: string;
  socraticQuestion: string;
}

export interface NightReviewResult {
  mentorFeedback: string;
  calculatedAccuracyEstimate: number;
  weaknessIdentified: string;
  tomorrowsPriority: string;
  streakPraise: string;
}

export interface CareerGuidanceResult {
  category: string;
  title: string;
  keyAdvice: string;
  actionItems: string[];
  exampleOrPrompt: string;
}

export const apiClient = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async generateRoadmap(profile: any): Promise<Roadmap> {
    const res = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async generateDailyPlan(data: {
    profile: any;
    dayNumber: number;
    weakConcepts: string[];
    recentMistakes: string[];
    streak: number;
    availableMinutes?: number;
  }): Promise<DailyPlan> {
    const res = await fetch('/api/generate-daily-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async evaluateProblem(data: {
    problemTitle: string;
    problemDescription: string;
    code: string;
    approach: string;
    explanation: string;
    language: string;
  }): Promise<EvaluationResult> {
    const res = await fetch('/api/evaluate-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getHint(data: {
    problemTitle: string;
    problemDescription: string;
    currentCode: string;
    hintsGiven: number;
    userQuestion?: string;
  }): Promise<ProgressiveHintResult> {
    const res = await fetch('/api/get-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async mentorChat(data: {
    message: string;
    history: { role: 'user' | 'model'; content: string }[];
    profile: any;
    currentTopic?: string;
  }): Promise<string> {
    const res = await fetch('/api/mentor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return json.reply;
  },

  async submitNightReview(data: {
    reflection: string;
    minutesStudied: number;
    tasksCompleted: number;
    problemsSolved: number;
    profile: any;
  }): Promise<NightReviewResult> {
    const res = await fetch('/api/night-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getCareerGuidance(data: {
    profile: any;
    progress: any;
    targetCategory: 'projects' | 'github' | 'resume' | 'internships' | 'interviews';
  }): Promise<CareerGuidanceResult> {
    const res = await fetch('/api/career-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
