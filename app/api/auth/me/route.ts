import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { serverError } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    const db = await getDatabase();
    if (!ObjectId.isValid(session.userId)) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { fullName: 1, email: 1, kind: 1, adminRole: 1, memberId: 1 } }
    );

    if (!user) return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    const profile = {
      id: user._id.toString(),
      kind: session.kind,
      admin_role: user.adminRole ?? null,
      full_name: user.fullName,
      phone: null,
    };
    let member = null;
    if (session.kind === 'member' && session.memberId) {
      if (!ObjectId.isValid(session.memberId)) {
        return NextResponse.json({ error: 'Member account is not linked correctly.' }, { status: 403 });
      }
      const record = await db.collection('members').findOne({ _id: new ObjectId(session.memberId) });
      if (record) {
        member = {
          id: record._id.toString(),
          membership_number: record.membershipNumber,
          full_name: record.fullName,
          email: record.email,
          phone: record.phone ?? null,
          occupation: record.occupation ?? null,
          membership_category: record.membershipCategory ?? null,
          contribution_plan: record.contributionPlan ?? null,
          status: record.status,
          date_joined: record.dateJoined,
        };
      }
    }
    return NextResponse.json({ user: { id: user._id.toString(), email: user.email }, profile, member });
  } catch (error) {
    return serverError(error, 'auth.me');
  }
}
