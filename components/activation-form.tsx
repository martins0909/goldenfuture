'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ActivationForm({ token }: { token: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function activate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not activate your account.');
      await refresh();
      router.replace('/member');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not activate your account.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={activate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">Create password</Label>
        <Input id="new-password" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input id="confirm-password" type="password" autoComplete="new-password" minLength={12} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
      </div>
      <p className="text-xs text-muted-foreground">Use at least 12 characters. This setup link can only be used once and expires after 7 days.</p>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading || !token}>{loading ? 'Setting up account…' : 'Activate Member Account'}</Button>
    </form>
  );
}
