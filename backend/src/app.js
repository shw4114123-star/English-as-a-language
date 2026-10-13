import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { errorMiddleware } from './middleware/error.middleware.js';
import userRoutes from './routes/users.routes.js';
import wordsRoutes from './routes/words.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import progressRoutes from './routes/progress.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);

// Serve frontend static build if it exists
const distPath = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.send('English-as-a-language API is running...');
  });
}

app.use(errorMiddleware);

export default app;
