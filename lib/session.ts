import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export type PortalKind = 'admin' | 'member';

export interface SessionClaims {
  userId: string;
  email: string;
  kind: PortalKind;
  memberId?: string;
  adminRole?: string;
}

const cookieName = 'goldenfuture_session';

function sessionSecret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters.');
  }
  return new TextEncoder().encode(value);
}

export async function createSession(claims: SessionClaims) {
  const token = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(sessionSecret());

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).set(cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionClaims | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  const secret = sessionSecret();
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      (payload.kind !== 'admin' && payload.kind !== 'member')
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      kind: payload.kind,
      memberId: typeof payload.memberId === 'string' ? payload.memberId : undefined,
      adminRole: typeof payload.adminRole === 'string' ? payload.adminRole : undefined,
    };
  } catch {
    return null;
  }
}
