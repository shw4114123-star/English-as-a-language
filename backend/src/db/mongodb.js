import { MongoClient } from 'mongodb';

let db;

export async function connectToDb() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/englishquest');
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

export { db };
