import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define a type for the mongoose cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Declare the global variable without creating a new type
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const mongooseCache = cached as MongooseCache;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      dbName: 'MerryChristmas',
    };
    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
  }
  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}
