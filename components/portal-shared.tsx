'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Logo } from '@/components/site-chrome';

interface GuardProps {
  portal: 'admin' | 'member';
  children: ReactNode;
}

export function PortalGuard({ portal, children }: GuardProps) {
  const router = useRouter();
  const { profile, member, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.replace('/login');
      return;
    }
    if (portal === 'admin' && profile.kind !== 'admin') {
      router.replace('/member');
      return;
    }
    if (portal === 'member' && profile.kind !== 'member') {
      router.replace('/admin');
      return;
    }
  }, [profile, member, loading, portal, router]);

  if (loading || !profile || (portal === 'admin' && profile.kind !== 'admin') || (portal === 'member' && profile.kind !== 'member')) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/30">
        <Logo />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Securing your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  tone?: 'default' | 'positive' | 'warning' | 'negative';
}

export function SummaryCard({ label, value, icon: Icon, hint, tone = 'default' }: SummaryCardProps) {
  const toneClass =
    tone === 'positive' ? 'text-primary' :
    tone === 'warning' ? 'text-accent-foreground bg-accent/20' :
    tone === 'negative' ? 'text-destructive' : 'text-primary';
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone === 'default' ? 'bg-primary/10' : toneClass}`}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <p className="mt-4 font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-primary/10 text-primary',
    paid: 'bg-primary/10 text-primary',
    successful: 'bg-primary/10 text-primary',
    approved: 'bg-primary/10 text-primary',
    pending: 'bg-accent/20 text-accent-foreground',
    overdue: 'bg-destructive/10 text-destructive',
    failed: 'bg-destructive/10 text-destructive',
    rejected: 'bg-destructive/10 text-destructive',
    closed: 'bg-secondary text-muted-foreground',
    suspended: 'bg-destructive/10 text-destructive',
    defaulted: 'bg-destructive/10 text-destructive',
    declared: 'bg-accent/20 text-accent-foreground',
    refunded: 'bg-secondary text-muted-foreground',
    reversed: 'bg-secondary text-muted-foreground',
    disputed: 'bg-destructive/10 text-destructive',
  };
  const cls = map[status?.toLowerCase()] || 'bg-secondary text-muted-foreground';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status?.replace(/_/g, ' ') || '—'}
    </span>
  );
}
