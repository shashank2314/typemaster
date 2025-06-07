// database.js
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI ;
const client = new MongoClient(uri);
const dbName = 'typingApp';

let db;
let collections = {};

export async function connectToDatabase() {
  await client.connect();
  db = client.db(dbName);

  collections.users = db.collection('users');
  collections.testResults = db.collection('test_results');
  collections.preferences = db.collection('user_preferences');

  return collections;
}

export { ObjectId };
