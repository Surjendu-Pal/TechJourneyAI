import {
  KnowledgeReel,
  CodingPartner,
  CommunityPost,
  DailyChallenge,
  ProjectItem,
  OpportunityItem,
} from '../types';

export const KNOWLEDGE_REELS: KnowledgeReel[] = [
  {
    id: 'reel-binary-search',
    title: 'Why Binary Search Runs in O(log n)',
    topic: 'Binary Search',
    category: 'DSA',
    durationSeconds: 45,
    visualAscii: `
[ 1, 3, 5, 7, 9, 11, 13, 15 ]  (N = 8)
         ↓  Cut in half!
[ 9, 11, 13, 15 ]              (N = 4)
         ↓  Cut in half!
[ 13, 15 ]                     (N = 2)
         ↓  Target found!
[ 15 ]                         (N = 1)
Total divisions = log2(8) = 3 steps!
`,
    explanation:
      'Every single comparison eliminates 50% of the remaining search space. For 1,000,000 items, you reach the target in at most 20 comparisons!',
    mentalModelTakeaway: 'Divide and conquer: halving the search space repeatedly leads to logarithmic speed.',
    challengeQuestion: {
      question: 'If an array has 1,024 sorted elements, how many comparisons does binary search need in the worst case?',
      options: ['512 comparisons', '10 comparisons', '100 comparisons', '32 comparisons'],
      correctIndex: 1,
      explanation: '2^10 = 1,024, so log2(1024) = exactly 10 comparisons!',
    },
    likes: 342,
    saves: 189,
  },
  {
    id: 'reel-sliding-window',
    title: 'Stop Recalculating! The Sliding Window Secret',
    topic: 'Sliding Window',
    category: 'DSA',
    durationSeconds: 60,
    visualAscii: `
Window size K = 3
[ 2, 1, 5 ] 1  3  2  -> Sum = 8
  ↓ Slide right!
2 [ 1, 5, 1 ] 3  2  -> New Sum = 8 - 2 (left) + 1 (right) = 7!
`,
    explanation:
      'Instead of adding all elements inside the window on every shift (which takes O(N * K)), subtract the element that leaves the left and add the element entering from the right (O(1) transition!).',
    mentalModelTakeaway: 'Reuse what you already computed. Subtract the outgoing, add the incoming.',
    challengeQuestion: {
      question: 'What is the time complexity of finding the maximum sum subarray of size K using a sliding window across an array of length N?',
      options: ['O(N * K)', 'O(N^2)', 'O(N)', 'O(log N)'],
      correctIndex: 2,
      explanation: 'Every element enters and leaves the window at most once, resulting in linear O(N) time.',
    },
    likes: 512,
    saves: 290,
  },
  {
    id: 'reel-hashmap-collisions',
    title: 'How Hash Maps Handle Collisions in Memory',
    topic: 'Hash Tables',
    category: 'DSA',
    durationSeconds: 50,
    visualAscii: `
hash("cat") % 5  = Index 2
hash("dog") % 5  = Index 2  (Collision!)

Chaining Solution:
Bucket [ 2 ] -> [ "cat" : 12 ] -> [ "dog" : 42 ] -> null
`,
    explanation:
      'When two different keys hash to the same bucket index, modern languages resolve it using Separate Chaining (linked lists or balanced trees) or Open Addressing (probing next free slot).',
    mentalModelTakeaway: 'Hash maps distribute keys into buckets; collisions are resolved via chains or probing.',
    challengeQuestion: {
      question: 'What happens to Hash Map lookup complexity if all keys collide into the exact same bucket?',
      options: ['Remains O(1)', 'Degrades to O(N)', 'Crashes immediately', 'Becomes O(log log N)'],
      correctIndex: 1,
      explanation: 'If all keys collide into one bucket linked-list, you must linearly scan through all N elements, taking O(N) time.',
    },
    likes: 278,
    saves: 145,
  },
  {
    id: 'reel-react-fiber',
    title: 'How React Fiber Schedules Work Without Freezing the UI',
    topic: 'Web Development',
    category: 'WebDev',
    durationSeconds: 55,
    visualAscii: `
Main Thread: [ User Click 👆 ]  <-- High Priority
               ↓ Pauses background render!
Fiber Tree:  [ Render Component A ] -> [ Render Component B (Paused) ]
               ↓ Resumes when browser is idle!
`,
    explanation:
      'Before React 16, rendering was synchronous and recursive. Fiber broke virtual DOM reconciliation into interruptible units of work using requestIdleCallback time slicing.',
    mentalModelTakeaway: 'Time-slicing allows the browser to remain responsive to user taps while background trees render.',
    challengeQuestion: {
      question: 'What was the primary problem solved by React Fiber architecture?',
      options: ['Making CSS load faster', 'Preventing large renders from blocking user interactions', 'Adding Redux automatically', 'Compiling TypeScript to WebAssembly'],
      correctIndex: 1,
      explanation: 'Fiber breaks rendering into interruptible chunks so user inputs and animations never drop frames.',
    },
    likes: 419,
    saves: 230,
  },
];

export const CODING_PARTNERS: CodingPartner[] = [
  {
    id: 'partner-1',
    name: 'Aarav Sharma',
    avatar: '👨‍💻',
    college: 'Asansol Engineering College',
    country: 'India',
    languages: ['JavaScript', 'Python'],
    skillLevel: 'Intermediate',
    goal: 'Full-Stack & DSA 200+ Solved',
    availability: 'Evenings (7 PM - 10 PM IST)',
    rating: 1350,
    bio: 'Preparing for software developer internships. Looking for daily peer accountability on LeetCode Mediums.',
    status: 'online',
  },
  {
    id: 'partner-2',
    name: 'Priya Mukherjee',
    avatar: '👩‍💻',
    college: 'Jadavpur University',
    country: 'India',
    languages: ['C++', 'Python'],
    skillLevel: 'Advanced',
    goal: 'Competitive Programming & Graph Algorithms',
    availability: 'Mornings (6 AM - 8 AM IST)',
    rating: 1520,
    bio: 'Codeforces specialist. Let’s partner up for 1v1 mock technical battle sessions.',
    status: 'online',
  },
  {
    id: 'partner-3',
    name: 'Marcus Vance',
    avatar: '🚀',
    college: 'UC Berkeley',
    country: 'USA',
    languages: ['TypeScript', 'Go'],
    skillLevel: 'Intermediate',
    goal: 'Backend Engineering & Distributed Systems',
    availability: 'Weekends & Late Nights',
    rating: 1410,
    bio: 'Building full-stack real-time apps. Want to review each other’s GitHub PRs and code architecture.',
    status: 'offline',
  },
  {
    id: 'partner-4',
    name: 'Rohan Sen',
    avatar: '⚡',
    college: 'Heritage Institute of Technology',
    country: 'India',
    languages: ['Java', 'SQL'],
    skillLevel: 'Beginner',
    goal: 'Cracking First Dev Role & Java Spring Boot',
    availability: 'Daily 2 Hours',
    rating: 1180,
    bio: 'Consistent learner on Day 18 streak. Looking for a beginner partner to solve Arrays and Two Pointers together.',
    status: 'online',
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Surjendu Pal',
    authorCollege: 'Asansol Engineering College',
    authorLevel: 'Level 4 • Algorithm Builder',
    category: 'DSA',
    title: 'The exact two-pointer mental model that made LeetCode click for me',
    content:
      'Stop memorizing loops. Whenever an array is sorted, remember monotonicity: moving left increases the sum, moving right decreases the sum. You deterministically eliminate an entire row/column in O(1) time without guessing.',
    codeSnippet: `while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++; // Need larger sum!
  else right--; // Need smaller sum!
}`,
    tags: ['TwoPointers', 'DSA', 'Algorithms'],
    likes: 89,
    commentsCount: 14,
    createdAt: '2 hours ago',
  },
  {
    id: 'post-2',
    authorName: 'Ananya Gupta',
    authorCollege: 'IIT Kharagpur',
    authorLevel: 'Level 7 • Interview Ready',
    category: 'WebDev',
    title: 'Why every junior developer should build an API rate-limiter for their portfolio',
    content:
      'Recruiters review dozens of generic Todo lists and Netflix clones. Building a Token Bucket or Sliding Log Rate-Limiter using Redis demonstrates you understand concurrency, HTTP 429, and latency!',
    tags: ['Portfolio', 'SystemDesign', 'Backend'],
    likes: 142,
    commentsCount: 28,
    createdAt: '5 hours ago',
  },
  {
    id: 'post-3',
    authorName: 'Devansh Roy',
    authorCollege: 'VIT Vellore',
    authorLevel: 'Level 5 • Full Stack Builder',
    category: 'Open Source',
    title: 'Good First Issues on GitHub for October Hacktoberfest 🚀',
    content:
      'Curated a list of active repositories with verified "good first issue" tags in JavaScript and Python. Perfect for claiming your first Open Source Contributor badge on TechJourney AI!',
    tags: ['OpenSource', 'GitHub', 'Hacktoberfest'],
    likes: 67,
    commentsCount: 9,
    createdAt: '1 day ago',
  },
];

export const LEADERBOARD_USERS = [
  { rank: 1, name: 'Arjun Verma', college: 'IIT Bombay', country: 'India', xp: 14200, rating: 1840, level: 'Level 9: Elite Builder' },
  { rank: 2, name: 'Elena Rostova', college: 'TU Munich', country: 'Germany', xp: 13950, rating: 1810, level: 'Level 9: Elite Builder' },
  { rank: 3, name: 'Surjendu Pal', college: 'Asansol Engineering College', country: 'India', xp: 12450, rating: 1720, level: 'Level 8: Job Ready' },
  { rank: 4, name: 'Liam Chen', college: 'National Univ. Singapore', country: 'Singapore', xp: 11800, rating: 1690, level: 'Level 8: Job Ready' },
  { rank: 5, name: 'Priya Mukherjee', college: 'Jadavpur University', country: 'India', xp: 10900, rating: 1640, level: 'Level 7: Interview Ready' },
  { rank: 6, name: 'Carlos Mendez', college: 'Tec de Monterrey', country: 'Mexico', xp: 9800, rating: 1580, level: 'Level 7: Interview Ready' },
  { rank: 7, name: 'Aarav Sharma', college: 'Asansol Engineering College', country: 'India', xp: 9100, rating: 1520, level: 'Level 6: Project Engineer' },
  { rank: 8, name: 'Sarah Jenkins', college: 'Imperial College', country: 'UK', xp: 8700, rating: 1490, level: 'Level 6: Project Engineer' },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc-debug-1',
    date: new Date().toISOString().split('T')[0],
    type: 'debug',
    title: 'Daily Debug: Fix the Broken Closure Function',
    description: 'This counter generator has an asynchronous loop scope bug where every timer prints 3 instead of 0, 1, 2.',
    brokenCodeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    solutionSnippet: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    rewardXP: 50,
    completed: false,
  },
  {
    id: 'dc-coding-1',
    date: new Date().toISOString().split('T')[0],
    type: 'coding',
    title: 'Daily Coding: Maximum Subarray Product',
    description: 'Find the contiguous subarray within an array which has the largest product in O(N) time.',
    starterCode: `function maxProduct(nums) {\n  // Code here\n}`,
    rewardXP: 50,
    completed: false,
  },
  {
    id: 'dc-knowledge-1',
    date: new Date().toISOString().split('T')[0],
    type: 'knowledge',
    title: 'Daily Knowledge: Database Indexing Mechanics',
    description: 'Why do B-Tree indexes provide faster range queries compared to Hash indexes in PostgreSQL?',
    options: [
      'B-Trees store elements in sorted sequential leaf order',
      'Hash indexes are compressed with gzip',
      'B-Trees only run in CPU L1 cache',
      'PostgreSQL disables Hash indexes automatically',
    ],
    correctOptionIndex: 0,
    rewardXP: 30,
    completed: false,
  },
  {
    id: 'dc-career-1',
    date: new Date().toISOString().split('T')[0],
    type: 'career',
    title: 'Daily Career: The "Tell Me About Yourself" Pitch',
    description: 'Craft a 60-second elevator response structuring: Past education -> Present project -> Future contribution to the hiring team.',
    rewardXP: 40,
    completed: false,
  },
];

export const PROJECT_TEMPLATES: ProjectItem[] = [
  {
    id: 'proj-expense-tracker',
    title: 'Real-Time Collaborative Expense Tracker',
    category: 'Full-Stack Web',
    difficulty: 'Intermediate',
    description: 'A responsive full-stack finance dashboard with multi-currency balance graphs, receipt categorization, and instant Firestore live sync.',
    techStack: ['React', 'TypeScript', 'TailwindCSS', 'Firebase', 'Recharts'],
    completed: false,
    milestones: [
      { id: 'm1', title: 'Interactive Dashboard UI & Chart Components', description: 'Build mobile-first layout with balance cards and category filters.', xp: 100, completed: true },
      { id: 'm2', title: 'State Management & In-Memory Calculations', description: 'Track income, expense, and running balances with validation.', xp: 100, completed: true },
      { id: 'm3', title: 'Firestore Real-Time Data Synchronization', description: 'Connect real collections with optimistic UI updates.', xp: 100, completed: false },
      { id: 'm4', title: 'Google OAuth & Zero-Trust Security Rules', description: 'Ensure users can only view and mutate their own financial data.', xp: 100, completed: false },
      { id: 'm5', title: 'PWA Installability & Offline Caching', description: 'Provide offline receipt logging with background sync.', xp: 100, completed: false },
    ],
  },
  {
    id: 'proj-distributed-queue',
    title: 'Distributed Background Task Queue with Redis',
    category: 'Backend & Systems',
    difficulty: 'Advanced',
    description: 'An enterprise asynchronous job scheduler supporting job retries, priority weights, dead-letter queues, and health check dashboards.',
    techStack: ['Node.js', 'Express', 'Redis', 'Docker', 'Jest'],
    completed: false,
    milestones: [
      { id: 'dq-1', title: 'Producer API & Input Payload Validation', description: 'Accept jobs via REST API with idempotency tokens.', xp: 100, completed: false },
      { id: 'dq-2', title: 'Redis List & Sorted Set Queue Workers', description: 'Implement FIFO polling with exponential backoff retries.', xp: 100, completed: false },
      { id: 'dq-3', title: 'Dead-Letter Queue & Crash Recovery', description: 'Safely handle unhandled exceptions without losing tasks.', xp: 100, completed: false },
    ],
  },
];

export const OPPORTUNITIES_DATA: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Software Engineering Intern (Frontend / Full-Stack)',
    companyOrOrg: 'Razorpay DevLabs',
    type: 'Internship',
    matchScore: 92,
    requiredSkills: ['JavaScript', 'React', 'TypeScript', 'DSA'],
    stipendOrPrize: '₹45,000 / month',
    deadline: 'Oct 28, 2026',
    location: 'Bangalore / Hybrid (India)',
    description: 'Build merchant dashboard tooling and checkout UI modules with sub-second performance budgets.',
    applyUrl: 'https://careers.razorpay.com',
    verified: true,
  },
  {
    id: 'opp-2',
    title: 'Global Developer AI Hackathon 2026',
    companyOrOrg: 'Google Cloud & AI Studio',
    type: 'Hackathon',
    matchScore: 96,
    requiredSkills: ['TypeScript', 'Gemini API', 'Firebase', 'Full-Stack'],
    stipendOrPrize: '$50,000 in Prizes',
    deadline: 'Nov 15, 2026',
    location: 'Global (Online)',
    description: 'Build generative applications with Gemini 3.8 and server-side logic solving real user problems.',
    applyUrl: 'https://ai.google.dev',
    verified: true,
  },
  {
    id: 'opp-3',
    title: 'Open Source Documentation & Feature Bounty',
    companyOrOrg: 'Drizzle ORM & TypeScript Ecosystem',
    type: 'Bounty',
    matchScore: 88,
    requiredSkills: ['SQL', 'TypeScript', 'Database Design'],
    stipendOrPrize: '$400 Bounty',
    deadline: 'Rolling',
    location: 'Remote',
    description: 'Implement relational schema helpers and migration generators for Postgres and SQLite adapters.',
    applyUrl: 'https://github.com',
    verified: true,
  },
  {
    id: 'opp-4',
    title: 'Junior Backend Developer',
    companyOrOrg: 'Postman Innovation Lab',
    type: 'Job',
    matchScore: 84,
    requiredSkills: ['Node.js', 'APIs', 'Git', 'System Design'],
    stipendOrPrize: '₹12 - 16 LPA',
    deadline: 'Nov 05, 2026',
    location: 'Bangalore / Remote (India)',
    description: 'Scale API monitoring services handling millions of outbound webhook dispatches every hour.',
    applyUrl: 'https://postman.com/careers',
    verified: true,
  },
];
