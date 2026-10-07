import { DeveloperLevelInfo, DeveloperLevelNumber } from '../types';

export const DEVELOPER_LEVELS: DeveloperLevelInfo[] = [
  {
    level: 1,
    title: 'Code Starter',
    minXP: 0,
    badge: '🌱',
    perk: 'Unlocked Daily Missions, DSA Teacher & AI Mentor',
  },
  {
    level: 2,
    title: 'Problem Solver',
    minXP: 250,
    badge: '🧩',
    perk: 'Unlocked 1v1 Coding Battles & Community Feed',
  },
  {
    level: 3,
    title: 'DSA Explorer',
    minXP: 600,
    badge: '🗺️',
    perk: 'Unlocked Spaced Repetition Memory & Partner Matching',
  },
  {
    level: 4,
    title: 'Algorithm Builder',
    minXP: 1200,
    badge: '⚡',
    perk: 'Unlocked College Tournaments & Fast Hints',
  },
  {
    level: 5,
    title: 'Full Stack Builder',
    minXP: 2200,
    badge: '🛠️',
    perk: 'Unlocked Project Milestone Mode with AI Code Review',
  },
  {
    level: 6,
    title: 'Project Engineer',
    minXP: 3600,
    badge: '🏗️',
    perk: 'Unlocked Developer Passport Public Verification',
  },
  {
    level: 7,
    title: 'Interview Ready',
    minXP: 5500,
    badge: '🎯',
    perk: 'Unlocked AI Technical Mock Interviews',
  },
  {
    level: 8,
    title: 'Job Ready',
    minXP: 8000,
    badge: '💼',
    perk: 'Unlocked Verified Opportunity Center Matching',
  },
  {
    level: 9,
    title: 'Elite Builder',
    minXP: 12000,
    badge: '🚀',
    perk: 'Unlocked Global Hackathon Mentorship & Bounties',
  },
  {
    level: 10,
    title: 'TechJourney Champion',
    minXP: 18000,
    badge: '👑',
    perk: 'Grandmaster Status on Global & College Leaderboards',
  },
];

export function getLevelFromXP(xp: number): DeveloperLevelInfo {
  let currentLevel = DEVELOPER_LEVELS[0];
  for (const lvl of DEVELOPER_LEVELS) {
    if (xp >= lvl.minXP) {
      currentLevel = lvl;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevelInfo(xp: number): {
  nextLevel: DeveloperLevelInfo | null;
  xpNeeded: number;
  progressPercent: number;
} {
  const current = getLevelFromXP(xp);
  const next = DEVELOPER_LEVELS.find((l) => l.level === (current.level + 1) as DeveloperLevelNumber) || null;

  if (!next) {
    return { nextLevel: null, xpNeeded: 0, progressPercent: 100 };
  }

  const range = next.minXP - current.minXP;
  const earned = xp - current.minXP;
  const percent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));
  const needed = Math.max(0, next.minXP - xp);

  return { nextLevel: next, xpNeeded: needed, progressPercent: percent };
}

export const XP_REWARDS = {
  LESSON_STEP: 10,
  QUIZ_PASSED: 15,
  PROBLEM_SOLVED_EASY: 20,
  PROBLEM_SOLVED_MEDIUM: 35,
  PROBLEM_SOLVED_HARD: 50,
  DAILY_MISSION_STEP: 20,
  DAILY_CHALLENGE: 50,
  PROJECT_MILESTONE: 100,
  BATTLE_VICTORY: 60,
  BATTLE_PARTICIPATION: 20,
  HELP_COMMUNITY: 20,
  STREAK_BONUS_7D: 70,
};
