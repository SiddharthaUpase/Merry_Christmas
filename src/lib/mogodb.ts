import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const mongooseCache = cached as { conn: any; promise: any };

export async function connectToDatabase() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      dbName: 'MerryChristmas',
    };
    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts);
  }
  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}
