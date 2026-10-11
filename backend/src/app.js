import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger to see every incoming request
app.use((req, res, next) => {
    console.log(`[HTTP Incoming] ${req.method} ${req.url}`);
    next();
});

// Routes
import userRoutes from './routes/users.routes.js';
import wordsRoutes from './routes/words.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import progressRoutes from './routes/progress.routes.js';

app.use('/api/users', userRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('EnglishQuest API is running...');
});

// Error Middleware (must be last)
app.use(errorMiddleware);

export default app;
