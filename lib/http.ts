import { NextResponse } from 'next/server';
import { getSession, PortalKind, SessionClaims } from '@/lib/session';

export async function requireSession(kind?: PortalKind): Promise<
  { session: SessionClaims; response?: never } | { session?: never; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  }
  if (kind && session.kind !== kind) {
    return { response: NextResponse.json({ error: 'You are not authorized to perform this action.' }, { status: 403 }) };
  }
  return { session };
}

export function serverError(error: unknown, context: string) {
  console.error(`[${context}]`, error);
  return NextResponse.json({ error: 'The request could not be completed. Please try again.' }, { status: 500 });
}
