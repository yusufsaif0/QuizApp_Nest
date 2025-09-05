// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add MONGODB_URI to .env.local");

// cached across lambda invocations / dev reloads
let cached = global._mongoClientPromise;

if (!cached) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  cached = client.connect();
  global._mongoClientPromise = cached;
}

export default cached; // a Promise<MongoClient>
