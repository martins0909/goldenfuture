import { NextResponse } from 'next/server';
import { requireSession, serverError } from '@/lib/http';
import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await requireSession('admin');
  if (auth.response) return auth.response;

  try {
    const db = await getDatabase();
    const records = await db.collection('members')
      .find({}, { projection: { membershipNumber: 1, fullName: 1, email: 1, phone: 1, occupation: 1, membershipCategory: 1, contributionPlan: 1, status: 1, dateJoined: 1 } })
      .sort({ dateJoined: -1 })
      .limit(1000)
      .toArray();
    return NextResponse.json(records.map((record) => ({
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
    })));
  } catch (error) {
    return serverError(error, 'admin.members.list');
  }
}
