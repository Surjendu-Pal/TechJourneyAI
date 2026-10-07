import express, { Request, Response, Router } from 'express';
import {
  generateRoadmapAI,
  generateDailyPlanAI,
  evaluateProblemSubmissionAI,
  getProgressiveHintAI,
  chatWithMentorAI,
  processNightReviewAI,
  generateCareerGuidanceAI,
} from './aiMentorLogic';

export const apiRouter = Router();

apiRouter.use(express.json({ limit: '2mb' }));

// Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'TechJourney AI',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Generate personalized roadmap
apiRouter.post('/generate-roadmap', async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ error: 'Profile is required' });
    const roadmap = await generateRoadmapAI(profile);
    res.json(roadmap);
  } catch (error: any) {
    console.error('API /generate-roadmap error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate roadmap' });
  }
});

// Generate daily study plan
apiRouter.post('/generate-daily-plan', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const plan = await generateDailyPlanAI(data);
    res.json(plan);
  } catch (error: any) {
    console.error('API /generate-daily-plan error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate daily plan' });
  }
});

// Evaluate problem submission
apiRouter.post('/evaluate-problem', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const evaluation = await evaluateProblemSubmissionAI(data);
    res.json(evaluation);
  } catch (error: any) {
    console.error('API /evaluate-problem error:', error);
    res.status(500).json({ error: error?.message || 'Failed to evaluate problem' });
  }
});

// Get progressive hint
apiRouter.post('/get-hint', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const hint = await getProgressiveHintAI(data);
    res.json(hint);
  } catch (error: any) {
    console.error('API /get-hint error:', error);
    res.status(500).json({ error: error?.message || 'Failed to get hint' });
  }
});

// Mentor chat
apiRouter.post('/mentor-chat', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const reply = await chatWithMentorAI(data);
    res.json({ reply });
  } catch (error: any) {
    console.error('API /mentor-chat error:', error);
    res.status(500).json({ error: error?.message || 'Failed to chat with mentor' });
  }
});

// Night review
apiRouter.post('/night-review', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await processNightReviewAI(data);
    res.json(result);
  } catch (error: any) {
    console.error('API /night-review error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process night review' });
  }
});

// Career guidance
apiRouter.post('/career-guidance', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const guidance = await generateCareerGuidanceAI(data);
    res.json(guidance);
  } catch (error: any) {
    console.error('API /career-guidance error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate career guidance' });
  }
});
