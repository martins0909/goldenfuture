import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[health.check]', error);
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }
}
