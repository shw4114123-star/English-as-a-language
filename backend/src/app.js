import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/error.middleware.js';
import userRoutes from './routes/users.routes.js';
import wordsRoutes from './routes/words.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import progressRoutes from './routes/progress.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('English-as-a-language API is running...');
});

app.use(errorMiddleware);

export default app;
