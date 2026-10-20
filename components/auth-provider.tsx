'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ProfileKind = 'admin' | 'member';

export interface AppProfile {
  id: string;
  kind: ProfileKind;
  admin_role: string | null;
  full_name: string;
  phone: string | null;
}

export interface MemberRecord {
  id: string;
  membership_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  membership_category: string | null;
  contribution_plan: string | null;
  status: string;
  date_joined: string;
}

interface AuthContextValue {
  user: { id: string; email: string } | null;
  profile: AppProfile | null;
  member: MemberRecord | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  member: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

interface SessionResponse {
  user: { id: string; email: string };
  profile: AppProfile;
  member: MemberRecord | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [member, setMember] = useState<MemberRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const response = await fetch('/api/auth/me', { cache: 'no-store' });
    if (response.status === 401) {
      setUser(null);
      setProfile(null);
      setMember(null);
      return;
    }
    if (!response.ok) throw new Error('Could not load the signed-in account.');
    const data = await response.json() as SessionResponse;
    setUser(data.user);
    setProfile(data.profile);
    setMember(data.member);
  }

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) throw new Error('Could not load the signed-in account.');
        return response.json() as Promise<SessionResponse>;
      })
      .then((data) => {
        if (!active || !data) return;
        setUser(data.user);
        setProfile(data.profile);
        setMember(data.member);
      })
      .catch((error: unknown) => {
        console.error('[auth.session]', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  async function signOut() {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (!response.ok) throw new Error('Could not sign out.');
    setUser(null);
    setProfile(null);
    setMember(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, member, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
