import { hash } from 'bcryptjs';
import { MongoClient } from 'mongodb';

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const fullName = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const uri = process.env.MONGODB_URI;

if (!email || !fullName || !password || password.length < 12 || !uri) {
  console.error('Set MONGODB_URI, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_NAME, and a 12+ character BOOTSTRAP_ADMIN_PASSWORD.');
  process.exitCode = 1;
} else {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'goldenfuture');
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    const existing = await users.findOne({ email }, { projection: { _id: 1 } });
    if (existing) {
      throw new Error('An account with that email already exists; no administrator was changed.');
    }
    await users.insertOne({
      email,
      fullName,
      passwordHash: await hash(password, 12),
      kind: 'admin',
      adminRole: 'super_admin',
      createdAt: new Date(),
    });
    console.log(`Administrator account created for ${email}. Remove BOOTSTRAP_ADMIN_PASSWORD from your environment now.`);
  } catch (error) {
    console.error('Could not create the administrator account:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}
