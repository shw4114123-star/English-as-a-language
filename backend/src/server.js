import 'dotenv/config';
import app from './app.js';
import { connectToDb } from './db/mongodb.js';

const PORT = process.env.PORT || 5000;

await connectToDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
