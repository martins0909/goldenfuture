import { compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/mongodb';
import { createSession } from '@/lib/session';
import { serverError } from '@/lib/http';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email address and password.' }, { status: 400 });
    }
    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email });
    if (!user || typeof user.passwordHash !== 'string' || !(await compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const kind = user.kind === 'admin' ? 'admin' : 'member';
    if (kind === 'member') {
      if (typeof user.memberId !== 'string' || !ObjectId.isValid(user.memberId)) {
        return NextResponse.json({ error: 'This account is not linked to a valid member record.' }, { status: 403 });
      }
      const member = await db.collection('members').findOne({ _id: new ObjectId(user.memberId) });
      if (!member || member.status !== 'active') {
        return NextResponse.json({ error: 'This member account is not active.' }, { status: 403 });
      }
    }

    await createSession({
      userId: user._id.toString(),
      email,
      kind,
      memberId: user.memberId?.toString(),
      adminRole: typeof user.adminRole === 'string' ? user.adminRole : undefined,
    });
    return NextResponse.json({ kind });
  } catch (error) {
    return serverError(error, 'auth.login');
  }
}
