import { MongoClient } from 'mongodb';
import "dotenv/config"

let db;

const MONGODB_URI = process.env.MONGODB_URI

export async function connectToDb() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

export { db };
