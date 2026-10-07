import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK with GEMINI_API_KEY from environment
const ai = new GoogleGenAI();

async function callGeminiWithFallback(contents: any, systemInstruction?: string): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      if (res.text) return res.text;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} request returned:`, err?.message || err);
      // Wait 300ms before trying next model
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastError || new Error('All model fallbacks unavailable');
}

// Clean markdown code blocks if the model outputs JSON in ```json blocks
function parseJSONFromResponse<T>(raw: string, fallback: T): T {
  try {
    const trimmed = raw.trim();
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const content = jsonMatch ? jsonMatch[1] : trimmed;
    return JSON.parse(content) as T;
  } catch (err) {
    console.error('Failed to parse AI JSON:', err, 'Raw text:', raw);
    return fallback;
  }
}

export async function generateRoadmapAI(profile: any) {
  const prompt = `You are TechJourney AI, a world-class principal engineer and personal mentor.
Analyze the following learner profile and generate an adaptive, deeply personalized software engineering roadmap to take them from their current stage to job-ready.

Learner Profile:
- Name: ${profile.name || 'Learner'}
- Education: ${profile.educationLevel || 'Beginner'}
- Programming Experience: ${profile.programmingExperience || 'Beginner'}
- Preferred Language: ${profile.preferredLanguage || 'JavaScript'}
- Career Goal: ${profile.careerGoal || 'Full-Stack Software Engineer'}
- Daily Available Time: ${profile.dailyAvailableTime || '1 hour'}
- Current DSA Level: ${profile.dsaLevel || 'Absolute Beginner'}
- Current Dev Level: ${profile.devLevel || 'Beginner'}
- Target Date: ${profile.targetDate || '6 months'}
- Learning Style: ${profile.preferredLearningStyle || 'Hands-on Coding'}

Generate a structured JSON response with exactly this format:
{
  "title": "${profile.preferredLanguage} Career Roadmap: Zero to Job-Ready",
  "currentPhase": "Phase 1: Foundations & Core Logic",
  "overallProgress": 0,
  "modules": [
    {
      "id": "module-1",
      "title": "Programming Fundamentals & Logic",
      "description": "Master syntax, control flow, functions, memory, and clean code in ${profile.preferredLanguage}",
      "estimatedHours": 20,
      "completed": false,
      "topics": [
        { "id": "top-1-1", "title": "Variables, Primitive Types & Memory", "completed": false, "importance": "Critical" },
        { "id": "top-1-2", "title": "Conditionals, Loops & Invariants", "completed": false, "importance": "Critical" },
        { "id": "top-1-3", "title": "Functions, Scope & Call Stack", "completed": false, "importance": "Critical" }
      ]
    },
    {
      "id": "module-2",
      "title": "Data Structures & Algorithmic Thinking",
      "description": "Arrays, Strings, Two Pointers, Hash Tables, and Big O Complexity",
      "estimatedHours": 30,
      "completed": false,
      "topics": [
        { "id": "top-2-1", "title": "Arrays & Dynamic Array Resizing", "completed": false, "importance": "Critical" },
        { "id": "top-2-2", "title": "Hash Tables & O(1) Lookups", "completed": false, "importance": "Critical" },
        { "id": "top-2-3", "title": "Two Pointers & Sliding Window", "completed": false, "importance": "Critical" }
      ]
    },
    {
      "id": "module-3",
      "title": "Web & Backend Engineering",
      "description": "REST APIs, Database schemas, Authentication, and HTTP",
      "estimatedHours": 25,
      "completed": false,
      "topics": [
        { "id": "top-3-1", "title": "Async Programming & Event Loop", "completed": false, "importance": "Critical" },
        { "id": "top-3-2", "title": "REST API Architecture & Validation", "completed": false, "importance": "High" },
        { "id": "top-3-3", "title": "Database Schema Design & Indexing", "completed": false, "importance": "Critical" }
      ]
    },
    {
      "id": "module-4",
      "title": "System Design Basics & Production Projects",
      "description": "Caching, Scalability, Git/GitHub hygiene, and Full-Stack Capstone",
      "estimatedHours": 25,
      "completed": false,
      "topics": [
        { "id": "top-4-1", "title": "Git & GitHub Collaboration", "completed": false, "importance": "High" },
        { "id": "top-4-2", "title": "System Design: Caching & Load Balancing", "completed": false, "importance": "High" },
        { "id": "top-4-3", "title": "Deploying Full-Stack Production Apps", "completed": false, "importance": "Critical" }
      ]
    },
    {
      "id": "module-5",
      "title": "Job Readiness, Resume & Technical Interviews",
      "description": "Resume crafting, mock behavioral and technical coding interviews",
      "estimatedHours": 15,
      "completed": false,
      "topics": [
        { "id": "top-5-1", "title": "Technical Resume Preparation", "completed": false, "importance": "Critical" },
        { "id": "top-5-2", "title": "Live Coding & Socratic Communication", "completed": false, "importance": "Critical" }
      ]
    }
  ]
}

Respond ONLY with valid JSON.`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      title: `${profile.preferredLanguage || 'Full-Stack'} Career Roadmap: Zero to Job-Ready`,
      currentPhase: 'Phase 1: Foundations & Core Logic',
      overallProgress: 0,
      modules: [
        {
          id: 'module-1',
          title: 'Programming Fundamentals & Logic',
          description: 'Master syntax, functions, memory, and clean code',
          estimatedHours: 20,
          completed: false,
          topics: [
            { id: 'top-1-1', title: 'Variables, Types & Memory', completed: false, importance: 'Critical' },
            { id: 'top-1-2', title: 'Conditionals & Loops', completed: false, importance: 'Critical' },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('generateRoadmapAI error, using fallback:', error);
    return {
      title: `${profile.preferredLanguage || 'Full-Stack'} Career Roadmap: Zero to Job-Ready`,
      currentPhase: 'Phase 1: Foundations & Core Logic',
      overallProgress: 0,
      modules: [
        {
          id: 'module-1',
          title: 'Programming Fundamentals & Memory',
          description: `Core syntax, call stack, and data structures in ${profile.preferredLanguage || 'JavaScript'}`,
          estimatedHours: 20,
          completed: false,
          topics: [
            { id: 'top-1-1', title: 'Variables, Primitives & Memory Model', completed: false, importance: 'Critical' },
            { id: 'top-1-2', title: 'Functions, Scope & Call Stack', completed: false, importance: 'Critical' },
          ],
        },
        {
          id: 'module-2',
          title: 'Data Structures & Algorithms (DSA)',
          description: 'Arrays, Two Pointers, Stacks, Trees, and Dynamic Programming',
          estimatedHours: 35,
          completed: false,
          topics: [
            { id: 'top-2-1', title: 'Arrays & Two Pointers', completed: false, importance: 'Critical' },
            { id: 'top-2-2', title: 'Hash Tables & O(1) Speed', completed: false, importance: 'Critical' },
            { id: 'top-2-3', title: 'Recursion & Trees', completed: false, importance: 'Critical' },
          ],
        },
        {
          id: 'module-3',
          title: 'Web & Backend Development',
          description: 'APIs, Databases, Cloud Deployment, and System Design',
          estimatedHours: 30,
          completed: false,
          topics: [
            { id: 'top-3-1', title: 'RESTful API Engineering', completed: false, importance: 'High' },
            { id: 'top-3-2', title: 'Databases & Relational Modeling', completed: false, importance: 'Critical' },
            { id: 'top-3-3', title: 'System Design Basics', completed: false, importance: 'High' },
          ],
        },
        {
          id: 'module-4',
          title: 'Portfolio, Resume & Interview Prep',
          description: 'GitHub projects, resume polishing, and mock technical interviews',
          estimatedHours: 15,
          completed: false,
          topics: [
            { id: 'top-4-1', title: 'Production Capstone Project', completed: false, importance: 'Critical' },
            { id: 'top-4-2', title: 'Mock Coding Interviews', completed: false, importance: 'Critical' },
          ],
        },
      ],
    };
  }
}

export async function generateDailyPlanAI(data: {
  profile: any;
  dayNumber: number;
  weakConcepts: string[];
  recentMistakes: string[];
  streak: number;
  availableMinutes?: number;
}) {
  const { profile, dayNumber, weakConcepts, recentMistakes, streak, availableMinutes = 60 } = data;
  const prompt = `You are TechJourney AI, a strict but deeply encouraging software mentor.
The learner is starting Day ${dayNumber}.
User Profile:
- Language: ${profile.preferredLanguage || 'JavaScript'}
- Target Role: ${profile.careerGoal || 'Software Engineer'}
- Streak: ${streak} days
- Available Study Time Today: ${availableMinutes} minutes
- Weak concepts / Revision queue: ${weakConcepts.length > 0 ? weakConcepts.join(', ') : 'None identified yet'}
- Recent Struggles: ${recentMistakes.length > 0 ? recentMistakes.join(', ') : 'None'}

Generate a personalized, time-chunked daily study plan that totals approximately ${availableMinutes} minutes.
Format example for Day ${dayNumber}:
- Revision of weak topics
- DSA concept deep-dive
- Coding problem practice
- Active recall quiz
- Technical / behavioral interview question

Return strictly valid JSON in this schema:
{
  "dayNumber": ${dayNumber},
  "title": "Day ${dayNumber}: Focus Title",
  "totalMinutes": ${availableMinutes},
  "dailyMission": "A motivating, specific 1-2 sentence mission for today.",
  "tasks": [
    {
      "id": "task-1",
      "type": "revision",
      "title": "15 min Revision: Two Pointers & Invariants",
      "allocatedMinutes": 15,
      "completed": false,
      "description": "Active recall of converging left/right pointers."
    },
    {
      "id": "task-2",
      "type": "dsa",
      "title": "20 min DSA: Sliding Window Mechanics",
      "allocatedMinutes": 20,
      "completed": false,
      "description": "Learn when to expand right and contract left."
    },
    {
      "id": "task-3",
      "type": "coding",
      "title": "15 min Challenge: Longest Substring Without Repeats",
      "allocatedMinutes": 15,
      "completed": false,
      "description": "Write code and analyze time/space complexity."
    },
    {
      "id": "task-4",
      "type": "quiz",
      "title": "5 min Rapid Comprehension Quiz",
      "allocatedMinutes": 5,
      "completed": false,
      "description": "Test edge cases on window boundaries."
    },
    {
      "id": "task-5",
      "type": "interview",
      "title": "5 min Mock Interview Question",
      "allocatedMinutes": 5,
      "completed": false,
      "description": "Explain how you optimize from O(N^2) to O(N)."
    }
  ]
}
Respond ONLY with valid JSON.`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      dayNumber,
      title: `Day ${dayNumber}: Daily Mission`,
      totalMinutes: availableMinutes,
      dailyMission: 'Complete your daily coding mission and conquer algorithmic thinking!',
      tasks: [
        {
          id: 'task-1',
          type: 'revision',
          title: '15 min Revision: Arrays & Two Pointers',
          allocatedMinutes: 15,
          completed: false,
          description: 'Review pointer convergence and boundary conditions.',
        },
        {
          id: 'task-2',
          type: 'dsa',
          title: '25 min DSA: Sliding Window Technique',
          allocatedMinutes: 25,
          completed: false,
          description: 'Understand expanding and contracting subarray windows.',
        },
        {
          id: 'task-3',
          type: 'coding',
          title: '15 min Problem Solving Challenge',
          allocatedMinutes: 15,
          completed: false,
          description: 'Implement two pointer solution without nested loops.',
        },
        {
          id: 'task-4',
          type: 'quiz',
          title: '5 min Active Recall Quiz',
          allocatedMinutes: 5,
          completed: false,
          description: 'Answer 2 multiple choice questions on complexity.',
        },
      ],
    });
  } catch (error) {
    console.error('generateDailyPlanAI error, using fallback:', error);
    return {
      dayNumber,
      title: `Day ${dayNumber}: Data Structures & Clean Code`,
      totalMinutes: availableMinutes,
      dailyMission: 'Master two-pointer convergence and build confidence with in-place array manipulation.',
      tasks: [
        {
          id: 'task-1',
          type: 'revision',
          title: '15 min Revision: Array Bounds & Index Arithmetic',
          allocatedMinutes: 15,
          completed: false,
          description: 'Active recall on O(1) memory addressing and off-by-one errors.',
        },
        {
          id: 'task-2',
          type: 'dsa',
          title: '20 min DSA: Two Pointers Deep-Dive',
          allocatedMinutes: 20,
          completed: false,
          description: 'Study how sorted order enables deterministic pointer movement.',
        },
        {
          id: 'task-3',
          type: 'coding',
          title: '15 min Practice: Container With Most Water',
          allocatedMinutes: 15,
          completed: false,
          description: 'Write the code and verify O(N) time and O(1) space.',
        },
        {
          id: 'task-4',
          type: 'quiz',
          title: '5 min Rapid Quiz',
          allocatedMinutes: 5,
          completed: false,
          description: 'Self-test on time complexity tradeoffs.',
        },
        {
          id: 'task-5',
          type: 'interview',
          title: '5 min Mock Interview Articulation',
          allocatedMinutes: 5,
          completed: false,
          description: 'Practice explaining why moving the shorter bar is mathematically sound.',
        },
      ],
    };
  }
}

export async function evaluateProblemSubmissionAI(data: {
  problemTitle: string;
  problemDescription: string;
  code: string;
  approach: string;
  explanation: string;
  language: string;
}) {
  const { problemTitle, problemDescription, code, approach, explanation, language } = data;
  const prompt = `You are TechJourney AI evaluating a student's technical problem submission.
Problem Title: "${problemTitle}"
Problem Description:
${problemDescription}

Student's Submitted Solution in ${language}:
\`\`\`${language}
${code}
\`\`\`

Student's Stated Approach:
"${approach || 'None provided'}"

Student's Explanation:
"${explanation || 'None provided'}"

Evaluate rigorously:
1. Classification: Must be strictly one of:
   - "Correct" (handles all test cases, optimal or valid complexity)
   - "Almost correct" (logic is sound but has small off-by-one, syntax typo, or missed edge case)
   - "Needs improvement" (working brute-force or high complexity, or significant logical gaps)
   - "Incorrect" (fails core premise, wrong algorithm, or infinite loop)
2. Explain any mistakes in SIMPLE, empathetic, mentor-style plain language (avoid jargon overload).
3. Compute exact Time and Space Complexity.
4. Highlight missing edge cases (e.g. empty array, duplicates, single element, negative numbers).
5. Give actionable guidance for the next revision.

Respond ONLY with valid JSON:
{
  "classification": "Correct" | "Almost correct" | "Needs improvement" | "Incorrect",
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "summary": "1-2 sentence high-level feedback",
  "detailedFeedback": "Clear step-by-step mentor explanation of what worked and what didn't.",
  "edgeCasesMissed": ["Edge case 1", "Edge case 2"],
  "nextStep": "What they should practice next."
}`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      classification: 'Almost correct',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      summary: 'Solid effort! Your core logic is on the right track.',
      detailedFeedback: 'Check loop boundary conditions and make sure empty inputs or single-element inputs do not cause runtime errors.',
      edgeCasesMissed: ['Empty input', 'Single element'],
      nextStep: 'Test with an array of duplicate numbers.',
    });
  } catch (error) {
    console.error('evaluateProblemSubmissionAI error, using fallback:', error);
    // Intelligent heuristic fallback
    const codeLen = code.trim().length;
    const isVeryShort = codeLen < 30;
    const classification = isVeryShort
      ? 'Needs improvement'
      : code.includes('while') || code.includes('for')
      ? 'Almost correct'
      : 'Needs improvement';

    return {
      classification: classification as any,
      timeComplexity: code.includes('for') && code.indexOf('for') !== code.lastIndexOf('for') ? 'O(N^2)' : 'O(N)',
      spaceComplexity: code.includes('Map') || code.includes('Set') ? 'O(N)' : 'O(1)',
      summary: isVeryShort
        ? 'Your attempt is a bit brief. Expand your loop and pointer condition.'
        : 'Good logic structure! You successfully articulated the main pass.',
      detailedFeedback:
        'Walk through your code line by line with an example input: verify what happens on the very first iteration and the very last iteration.',
      edgeCasesMissed: ['Empty list []', 'Negative target values', 'Exact duplicates'],
      nextStep: 'Try writing test assertions for negative and boundary values.',
    };
  }
}

export async function getProgressiveHintAI(data: {
  problemTitle: string;
  problemDescription: string;
  currentCode: string;
  hintsGiven: number;
  userQuestion?: string;
}) {
  const { problemTitle, problemDescription, currentCode, hintsGiven, userQuestion } = data;
  const prompt = `You are TechJourney AI, a Socratic technical mentor.
CRITICAL CONSTRAINT: You must NOT immediately reveal the full code or solution!
The student is stuck on "${problemTitle}".
Problem Description:
${problemDescription}

Student's Current Attempt:
\`\`\`
${currentCode || 'No code written yet'}
\`\`\`

Hints already given: ${hintsGiven}
Student question/doubt: "${userQuestion || 'I am stuck, give me a hint'}"

Provide Hint level ${hintsGiven + 1}:
- Level 1: Ask a targeted question about the invariant, mental model, or what data structure simplifies lookups.
- Level 2: Point out the pattern (e.g. Two pointers, Hash map, Sliding window) and how pointers should move.
- Level 3: Provide pseudo-code or boundary condition hint WITHOUT pasting the full completed code.

Return JSON:
{
  "hintNumber": ${hintsGiven + 1},
  "hint": "The guidance message.",
  "socraticQuestion": "A targeted question to get the student thinking actively."
}`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      hintNumber: hintsGiven + 1,
      hint: 'Think about how you would solve this by hand with a pencil and paper first.',
      socraticQuestion: 'What information do you need to remember as you iterate through the list?',
    });
  } catch (error) {
    console.error('getProgressiveHintAI error, using fallback:', error);
    const fallbackHints = [
      {
        hint: 'Before writing nested loops, ask yourself: if you are at element X, what exact counterpart value are you looking for?',
        socraticQuestion: 'Can a Hash Map remember previously seen items in O(1) time?',
      },
      {
        hint: 'If the data is sorted, can you place one pointer at index 0 and one at the end? Compare their sum to the target.',
        socraticQuestion: 'If the sum is too small, which pointer must move forward to increase the sum?',
      },
      {
        hint: 'Pseudo-code: While left < right: compute sum. If sum === target, return indices. Else if sum < target, left++ else right--.',
        socraticQuestion: 'What should your function return if no pair adds up to the target?',
      },
    ];
    const picked = fallbackHints[Math.min(hintsGiven, fallbackHints.length - 1)];
    return {
      hintNumber: hintsGiven + 1,
      hint: picked.hint,
      socraticQuestion: picked.socraticQuestion,
    };
  }
}

export async function chatWithMentorAI(data: {
  message: string;
  history: { role: 'user' | 'model'; content: string }[];
  profile: any;
  currentTopic?: string;
}) {
  const { message, history, profile, currentTopic } = data;

  const systemInstruction = `You are TechJourney AI, a strict, enthusiastic, and friendly personal software mentor.
The user is learning software development from an Android phone.
User Profile:
- Name: ${profile?.name || 'Friend'}
- Preferred Language: ${profile?.preferredLanguage || 'JavaScript'}
- Target Role: ${profile?.careerGoal || 'Software Developer'}
- Current Topic: ${currentTopic || 'General Development'}

Behavioral Rules:
1. Actively teach, question, test, and challenge. Never dump walls of passive textbook text.
2. If the user asks a question, explain the core intuition simply, then immediately ask a quick test question to verify they actually understand.
3. Be friendly, energetic, and push them to write real code.
4. Keep replies mobile-scannable with concise paragraphs, bullet points, and code snippets when necessary.`;

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const text = await callGeminiWithFallback(contents, systemInstruction);
    return text;
  } catch (error) {
    console.error('chatWithMentorAI error, using fallback:', error);
    return `That's a great question on ${currentTopic || 'algorithms'}! Here is the core intuition: focus on the state and invariant. For instance, in two pointers, ask yourself which condition guarantees that moving a pointer will never bypass a valid solution. What do you think happens if the array contains negative numbers?`;
  }
}

export async function processNightReviewAI(data: {
  reflection: string;
  minutesStudied: number;
  tasksCompleted: number;
  problemsSolved: number;
  profile: any;
}) {
  const { reflection, minutesStudied, tasksCompleted, problemsSolved, profile } = data;
  const prompt = `You are TechJourney AI conducting the student's Night Review.
User Profile: ${profile.name || 'Student'} (${profile.careerGoal || 'Developer'})
Today's Summary:
- Minutes Studied: ${minutesStudied} min
- Tasks Completed: ${tasksCompleted}
- Problems Solved: ${problemsSolved}
- Student's Reflection: "${reflection}"

Analyze their daily performance.
Return strictly JSON:
{
  "mentorFeedback": "Empathetic, honest, inspiring assessment of today's effort.",
  "calculatedAccuracyEstimate": 85,
  "weaknessIdentified": "Primary concept or habit needing reinforcement.",
  "tomorrowsPriority": "The #1 high-impact task for tomorrow morning.",
  "streakPraise": "A motivating shoutout for keeping the learning rhythm going."
}`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      mentorFeedback: 'Great job putting in the focused hours today. Consistency is what separates amateur coders from hireable engineers.',
      calculatedAccuracyEstimate: 85,
      weaknessIdentified: 'Array boundary conditions',
      tomorrowsPriority: 'Review sliding window problems and solve 1 medium challenge',
      streakPraise: 'Day logged! Rest well and come back sharp tomorrow.',
    });
  } catch (error) {
    console.error('processNightReviewAI error, using fallback:', error);
    return {
      mentorFeedback: `Awesome work investing ${minutesStudied} minutes today! Logging ${tasksCompleted} tasks and ${problemsSolved} problem attempts demonstrates genuine commitment to becoming a professional developer.`,
      calculatedAccuracyEstimate: Math.min(100, Math.max(65, 70 + problemsSolved * 5)),
      weaknessIdentified: 'Boundary index checks & empty test cases',
      tomorrowsPriority: 'Solve 1 Medium Two-Pointers problem without checking hints first',
      streakPraise: 'Streak preserved! Consistency compounds exponentially.',
    };
  }
}

export async function generateCareerGuidanceAI(data: {
  profile: any;
  progress: any;
  targetCategory: 'projects' | 'github' | 'resume' | 'internships' | 'interviews';
}) {
  const { profile, progress, targetCategory } = data;
  const prompt = `You are TechJourney AI Career Mentor.
The student is preparing for ${profile.careerGoal || 'Software Engineer'}.
Category: ${targetCategory}.
Progress: ${progress?.overallProgress || 30}% complete, ${progress?.problemsSolved || 15} problems solved.
Preferred language: ${profile.preferredLanguage || 'JavaScript'}.

Provide targeted, high-impact career guidance specifically for ${targetCategory}.
Return strictly JSON:
{
  "category": "${targetCategory}",
  "title": "Actionable Title",
  "keyAdvice": "Direct advice from a tech lead's perspective.",
  "actionItems": [
    "Concrete step 1",
    "Concrete step 2",
    "Concrete step 3"
  ],
  "exampleOrPrompt": "A real-world project specification, resume bullet formula, or mock interview scenario."
}`;

  try {
    const text = await callGeminiWithFallback(prompt);
    return parseJSONFromResponse(text, {
      category: targetCategory,
      title: 'Career Advancement Guide',
      keyAdvice: 'Focus on shipping real full-stack projects with automated tests and CI/CD.',
      actionItems: ['Build a portfolio app', 'Write clean README documentation', 'Practice explaining complexity'],
      exampleOrPrompt: 'Project Idea: Real-time distributed task queue with Redis and WebSockets.',
    });
  } catch (error) {
    console.error('generateCareerGuidanceAI error, using fallback:', error);
    const fallbacks: Record<string, any> = {
      projects: {
        category: 'projects',
        title: 'Full-Stack Distributed System Portfolio Project',
        keyAdvice: 'Employers ignore basic Todo apps. Build apps with real concurrency, auth, database indexing, and caching.',
        actionItems: [
          'Build a real-time collaborative workspace with WebSockets and Firestore/PostgreSQL',
          'Implement rate limiting and automated integration tests',
          'Deploy on Cloud Run or Vercel with a live custom domain',
        ],
        exampleOrPrompt: 'Specification: Build an uptime monitoring agent with cron alerts and status dashboards.',
      },
      github: {
        category: 'github',
        title: 'Professional GitHub Hygiene & Pin Showcase',
        keyAdvice: 'Your GitHub is your technical proof of work. Recruiters look for meaningful commit messages and clean architecture.',
        actionItems: [
          'Pin your top 3 completed full-stack projects with live demo links in the description',
          'Write comprehensive READMEs with architectural diagrams and setup guides',
          'Use conventional commits: `feat:`, `fix:`, `refactor:`',
        ],
        exampleOrPrompt: 'README Template: Problem statement, Architecture diagram, Tech stack, Performance metrics, Live URL.',
      },
      resume: {
        category: 'resume',
        title: 'Google XYZ Resume Bullet Formula',
        keyAdvice: 'Quantify your accomplishments using the formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
        actionItems: [
          'Keep your technical resume to strictly 1 single page',
          'List technical skills sorted by proficiency (Languages, Frameworks, Databases, Tools)',
          'Highlight algorithms and backend optimizations you implemented',
        ],
        exampleOrPrompt: 'Example Bullet: "Reduced API response latency by 45% (from 800ms to 440ms) by introducing Redis caching and SQL indexing on frequently queried foreign keys."',
      },
      internships: {
        category: 'internships',
        title: 'Direct Outreach & Technical Application Strategy',
        keyAdvice: 'Cold applying on job boards has a 2% response rate. Warm outreach to engineering leads yields 25%+ interviews.',
        actionItems: [
          'Find engineering managers and tech leads on LinkedIn for mid-size tech startups',
          'Send a 3-sentence message linking a project relevant to their company tech stack',
          'Target startups hiring for your specific language track',
        ],
        exampleOrPrompt: 'Message Draft: "Hi [Name], loved your recent release of [Product]. I built a similar system solving [Problem] using [Tech]. Would love to share a 2-minute demo if you are hiring software interns."',
      },
      interviews: {
        category: 'interviews',
        title: 'Socratic Technical Interview Articulation',
        keyAdvice: 'Interviewers grade communication more than raw code syntax. Think out loud, ask clarifying questions, and state complexity upfront.',
        actionItems: [
          'Spend the first 3 minutes asking clarifying questions about constraints and edge cases',
          'State brute-force complexity before writing optimal code',
          'Test your solution with an example trace before declaring you are done',
        ],
        exampleOrPrompt: 'Mock Prompt: "Design and implement a Least Recently Used (LRU) Cache supporting get and put in O(1) time. Explain your choice of Doubly Linked List + Hash Map."',
      },
    };
    return fallbacks[targetCategory] || fallbacks.projects;
  }
}
