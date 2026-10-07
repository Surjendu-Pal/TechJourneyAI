export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'problems' | 'dsa' | 'dev' | 'consistency';
  icon: string;
  conditionDescription: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'streak-7',
    title: '7 Day Streak',
    description: 'Maintained a consistent daily study discipline for 7 continuous days.',
    category: 'streak',
    icon: '🔥',
    conditionDescription: 'Study 7 days in a row',
  },
  {
    id: 'streak-14',
    title: '14 Day Streak',
    description: 'Two full weeks of unwavering dedication towards software mastery.',
    category: 'streak',
    icon: '⚡',
    conditionDescription: 'Study 14 days in a row',
  },
  {
    id: 'streak-30',
    title: '30 Day Streak',
    description: 'A complete month of daily habits! The neural pathways of a developer are solid.',
    category: 'streak',
    icon: '👑',
    conditionDescription: 'Study 30 days in a row',
  },
  {
    id: 'problems-10',
    title: 'Code Apprentice',
    description: 'Solved your first 10 technical coding challenges.',
    category: 'problems',
    icon: '🌱',
    conditionDescription: 'Solve 10 problems',
  },
  {
    id: 'problems-100',
    title: '100 Problems',
    description: 'Cracked 100 coding problems with rigorous time & space complexity analysis.',
    category: 'problems',
    icon: '💯',
    conditionDescription: 'Solve 100 problems',
  },
  {
    id: 'problems-500',
    title: '500 Problems',
    description: 'Grandmaster of data structures! 500 problems solved across all patterns.',
    category: 'problems',
    icon: '🏆',
    conditionDescription: 'Solve 500 problems',
  },
  {
    id: 'dsa-beginner',
    title: 'DSA Beginner',
    description: 'Mastered Arrays, Strings, Searching, and fundamental linear structures.',
    category: 'dsa',
    icon: '📘',
    conditionDescription: 'Complete first 5 beginner DSA modules',
  },
  {
    id: 'dsa-intermediate',
    title: 'DSA Intermediate',
    description: 'Conquered Two Pointers, Stacks, Queues, Recursion, Trees, and BST.',
    category: 'dsa',
    icon: '🚀',
    conditionDescription: 'Complete 10 DSA modules',
  },
  {
    id: 'dsa-advanced',
    title: 'DSA Advanced',
    description: 'Command of Graphs, Dynamic Programming, Heaps, and Tries.',
    category: 'dsa',
    icon: '🧠',
    conditionDescription: 'Complete all 20 DSA modules',
  },
  {
    id: 'night-reviewer',
    title: 'Night Reviewer',
    description: 'Closed the daily feedback loop by completing evening reflection.',
    category: 'consistency',
    icon: '🌙',
    conditionDescription: 'Complete a night review',
  },
  {
    id: 'active-learner',
    title: 'Active Thinker',
    description: 'Requested hints instead of looking up solutions, practicing genuine problem solving.',
    category: 'consistency',
    icon: '💡',
    conditionDescription: 'Solve problems using progressive hints',
  },
];
