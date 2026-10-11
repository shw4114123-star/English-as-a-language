import 'dotenv/config';
import app from './app.js';
import { connectToDb } from './db/mongodb.js';
import { seedLessonsIfEmpty } from './utils/seedLessons.js';
import { seedAdminIfEmpty } from './utils/seedAdmin.js';

const PORT = process.env.PORT || 5000;

await connectToDb();
await seedLessonsIfEmpty();
await seedAdminIfEmpty();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
