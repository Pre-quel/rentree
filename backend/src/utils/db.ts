import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db('rentry');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}