import { NextResponse } from 'next/server';
import { requireSession, serverError } from '@/lib/http';
import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await requireSession('admin');
  if (auth.response) return auth.response;

  try {
    const db = await getDatabase();
    const records = await db.collection('membershipApplications')
      .find({}, { projection: { full_name: 1, email: 1, phone: 1, occupation: 1, membership_category: 1, contribution_plan: 1, residential_address: 1, next_of_kin: 1, date_of_birth: 1, status: 1, adminNotes: 1, membershipNumber: 1, createdAt: 1, reviewedAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    return NextResponse.json(records.map((record) => ({
      id: record._id.toString(),
      full_name: record.full_name,
      email: record.email,
      phone: record.phone,
      occupation: record.occupation ?? null,
      membership_category: record.membership_category ?? null,
      contribution_plan: record.contribution_plan ?? null,
      residential_address: record.residential_address ?? null,
      next_of_kin: record.next_of_kin ?? null,
      date_of_birth: record.date_of_birth ?? null,
      status: record.status,
      admin_notes: record.adminNotes ?? null,
      membership_number: record.membershipNumber ?? null,
      created_at: record.createdAt,
      reviewed_at: record.reviewedAt ?? null,
    })));
  } catch (error) {
    return serverError(error, 'admin.applications.list');
  }
}
