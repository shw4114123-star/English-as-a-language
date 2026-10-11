import 'dotenv/config';
import app from './app.js';
import { connectToDb } from './db/mongodb.js';
import { seedLessonsIfEmpty } from './utils/seedLessons.js';
import { seedAdminIfEmpty } from './utils/seedAdmin.js';

const PORT = process.env.PORT || 3000;

await connectToDb();
await seedLessonsIfEmpty();
await seedAdminIfEmpty();

app.listen(PORT, (e) => {
  if (e) {
    console.error("Server failed to start", e);
  }
  console.log(`Server running on port ${PORT}`);
});
