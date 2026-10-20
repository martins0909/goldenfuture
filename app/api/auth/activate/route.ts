import { createHash } from 'crypto';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase, getMongoClient } from '@/lib/mongodb';
import { createSession } from '@/lib/session';
import { serverError } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const input = z.object({
      token: z.string().min(32),
      password: z.string().min(12).max(200),
    }).safeParse(await request.json().catch(() => null));
    if (!input.success) {
      return NextResponse.json({ error: 'Use a valid invitation and a password with at least 12 characters.' }, { status: 400 });
    }
    const { token, password } = input.data;

    const db = await getDatabase();
    const client = await getMongoClient();
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const activationSession = client.startSession();
    let activated: { memberId: string; email: string } | undefined;
    try {
      activated = await activationSession.withTransaction(async () => {
        const member = await db.collection('members').findOneAndUpdate(
          { activationTokenHash: tokenHash, activationExpiresAt: { $gt: new Date() }, status: 'active' },
          { $unset: { activationTokenHash: '', activationExpiresAt: '' }, $set: { activatedAt: new Date() } },
          { session: activationSession, returnDocument: 'after' }
        );
        if (!member) throw new Error('INVITATION_INVALID');

        const passwordHash = await hash(password, 12);
        await db.collection('users').insertOne({
          email: member.email,
          passwordHash,
          fullName: member.fullName,
          kind: 'member',
          memberId: member._id.toString(),
          createdAt: new Date(),
        }, { session: activationSession });
        return { memberId: member._id.toString(), email: member.email as string };
      });
    } finally {
      await activationSession.endSession();
    }

    if (!activated) return NextResponse.json({ error: 'This invitation is invalid or has expired.' }, { status: 400 });
    const user = await db.collection('users').findOne({ email: activated.email }, { projection: { _id: 1 } });
    if (!user) throw new Error('Activated user could not be loaded.');
    await createSession({
      userId: user._id.toString(),
      email: activated.email,
      kind: 'member',
      memberId: activated.memberId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVITATION_INVALID') {
      return NextResponse.json({ error: 'This invitation is invalid or has expired.' }, { status: 400 });
    }
    return serverError(error, 'auth.activate');
  }
}
