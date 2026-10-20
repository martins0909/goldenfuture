import { createHash, randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { requireSession, serverError } from '@/lib/http';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export const runtime = 'nodejs';

const reviewStatuses = ['approved', 'rejected', 'corrections_required'] as const;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession('admin');
  if (auth.response) return auth.response;
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Provide a valid application decision.' }, { status: 400 });
    }
    const status = body.status;
    const notes = typeof body.admin_notes === 'string' ? body.admin_notes.trim().slice(0, 2000) : '';
    const membershipNumber = typeof body.membership_number === 'string' ? body.membership_number.trim() : '';
    if (!reviewStatuses.includes(status)) {
      return NextResponse.json({ error: 'Choose a valid application decision.' }, { status: 400 });
    }
    if (status === 'approved' && !/^[A-Za-z0-9-]{3,30}$/.test(membershipNumber)) {
      return NextResponse.json({ error: 'Enter a valid membership number.' }, { status: 400 });
    }

    const db = await getDatabase();
    const client = await getMongoClient();
    const applicationId = new ObjectId(id);
    const now = new Date();
    const invitationToken = status === 'approved' ? randomBytes(32).toString('base64url') : null;
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const application = await db.collection('membershipApplications').findOne(
          { _id: applicationId, status: 'pending' },
          { session }
        );
        if (!application) throw new Error('APPLICATION_NOT_PENDING');

        if (status === 'approved') {
          const duplicateNumber = await db.collection('members').findOne({ membershipNumber }, { session, projection: { _id: 1 } });
          const duplicateEmail = await db.collection('members').findOne({ email: application.email }, { session, projection: { _id: 1 } });
          if (duplicateNumber || duplicateEmail) throw new Error('MEMBER_ALREADY_EXISTS');

          const memberResult = await db.collection('members').insertOne({
            applicationId: applicationId.toString(),
            membershipNumber,
            fullName: application.full_name,
            email: application.email,
            phone: application.phone,
            dateOfBirth: application.date_of_birth ?? null,
            residentialAddress: application.residential_address ?? null,
            occupation: application.occupation ?? null,
            nextOfKin: application.next_of_kin ?? null,
            membershipCategory: application.membership_category ?? null,
            contributionPlan: application.contribution_plan ?? null,
            status: 'active',
            dateJoined: now,
            createdAt: now,
            activationTokenHash: createHash('sha256').update(invitationToken as string).digest('hex'),
            activationExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          }, { session });

          await db.collection('membershipApplications').updateOne(
            { _id: applicationId, status: 'pending' },
            { $set: { status, adminNotes: notes || null, membershipNumber, reviewedBy: auth.session.userId, reviewedAt: now, updatedAt: now } },
            { session }
          );
          await db.collection('auditLogs').insertOne({
            actorId: auth.session.userId,
            action: 'membership_application_approved',
            recordType: 'membershipApplication',
            recordId: applicationId.toString(),
            memberId: memberResult.insertedId.toString(),
            createdAt: now,
          }, { session });
        } else {
          await db.collection('membershipApplications').updateOne(
            { _id: applicationId, status: 'pending' },
            { $set: { status, adminNotes: notes || null, reviewedBy: auth.session.userId, reviewedAt: now, updatedAt: now } },
            { session }
          );
          await db.collection('auditLogs').insertOne({
            actorId: auth.session.userId,
            action: `membership_application_${status}`,
            recordType: 'membershipApplication',
            recordId: applicationId.toString(),
            createdAt: now,
          }, { session });
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      ok: true,
      activationPath: invitationToken ? `/activate?token=${encodeURIComponent(invitationToken)}` : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'APPLICATION_NOT_PENDING') {
      return NextResponse.json({ error: 'This application has already been reviewed.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'MEMBER_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'That email or membership number is already in use.' }, { status: 409 });
    }
    return serverError(error, 'admin.applications.review');
  }
}
