import { Db, MongoClient } from 'mongodb';

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
  var mongoIndexesPromise: Promise<void> | undefined;
}

function getClientPromise() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  if (!mongoUri) {
    throw new Error('MONGODB_URI (or MONGODB_URL) is required. Configure your MongoDB Atlas connection string.');
  }

  if (!global.mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}

export async function getMongoClient() {
  return getClientPromise();
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || 'goldenfuture');

  if (!global.mongoIndexesPromise) {
    global.mongoIndexesPromise = Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('members').createIndex({ membershipNumber: 1 }, { unique: true }),
      db.collection('members').createIndex({ email: 1 }, { unique: true }),
      db.collection('membershipApplications').createIndex({ createdAt: -1 }),
      db.collection('membershipApplications').createIndex({ status: 1, createdAt: -1 }),
      db.collection('transactions').createIndex({ memberId: 1, createdAt: -1 }),
      db.collection('transactions').createIndex({ status: 1, category: 1, createdAt: -1 }),
      db.collection('investments').createIndex({ memberId: 1 }),
      db.collection('loans').createIndex({ memberId: 1, status: 1 }),
      db.collection('dividends').createIndex({ memberId: 1 }),
      db.collection('auditLogs').createIndex({ createdAt: -1 }),
    ]).then(() => undefined);
  }

  await global.mongoIndexesPromise;
  return db;
}
