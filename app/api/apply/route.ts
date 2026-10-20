import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/mongodb';
import { serverError } from '@/lib/http';

export const runtime = 'nodejs';

const applicationSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(40),
  date_of_birth: z.string().max(20).optional().nullable(),
  residential_address: z.string().trim().max(500).optional().nullable(),
  occupation: z.string().trim().min(2).max(120),
  next_of_kin: z.string().trim().max(200).optional().nullable(),
  membership_category: z.string().trim().min(2).max(80),
  contribution_plan: z.string().trim().min(2).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const input = applicationSchema.safeParse(await request.json().catch(() => null));
    if (!input.success) {
      return NextResponse.json({ error: 'Check the application details and try again.' }, { status: 400 });
    }

    const db = await getDatabase();
    const email = input.data.email.toLowerCase();
    const existingMember = await db.collection('members').findOne({ email }, { projection: { _id: 1 } });
    if (existingMember) {
      return NextResponse.json({ error: 'This email address already belongs to a cooperative member.' }, { status: 409 });
    }

    const now = new Date();
    await db.collection('membershipApplications').insertOne({
      ...input.data,
      email,
      status: 'pending',
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return serverError(error, 'applications.create');
  }
}
