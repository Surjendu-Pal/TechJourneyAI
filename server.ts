import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/apiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use('/api', apiRouter);

// Serve production static assets
app.use(express.static(path.resolve(__dirname, 'dist')));

// Fallback to index.html for SPA / PWA routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TechJourney AI server running at http://0.0.0.0:${PORT}`);
});
