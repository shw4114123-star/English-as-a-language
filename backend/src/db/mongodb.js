import { MongoClient } from 'mongodb';
import "dotenv/config"

let db;

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

export async function connectToDb() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017');
    db = client.db("English-as-a-language-db");
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

export { db };
