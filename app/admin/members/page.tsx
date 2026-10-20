'use client';

import { useEffect, useState } from 'react';
import { PortalLayout, adminNav } from '@/components/portal-layout';
import { PortalGuard, PageHeader, StatusBadge, EmptyState } from '@/components/portal-shared';
import { DataTable } from '@/components/data-table';
import { formatDate } from '@/lib/format';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';

interface Member {
  id: string;
  membership_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  membership_category: string | null;
  status: string;
  date_joined: string;
}

export default function AdminMembersPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/members', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load member records.');
        setItems(await response.json() as Member[]);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load member records.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((m) =>
    !search ||
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.membership_number.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalGuard portal="admin">
      <PortalLayout nav={adminNav} portal="admin" title="Members" subtitle="Manage all approved cooperative members">
        <PageHeader title="Members" description="Search, view, and manage member records." />
        {error && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, membership number, or email" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {loading ? (
          <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No members yet" description="Approved membership applications will create member records here." icon={Users} />
        ) : (
          <DataTable
            columns={[
              { key: 'membership_number', header: 'Member No.' },
              { key: 'full_name', header: 'Full Name' },
              { key: 'email', header: 'Email' },
              { key: 'occupation', header: 'Occupation', render: (r) => r.occupation || '—' },
              { key: 'membership_category', header: 'Category', render: (r) => r.membership_category || '—' },
              { key: 'date_joined', header: 'Joined', render: (r) => formatDate(r.date_joined) },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            data={filtered}
          />
        )}
      </PortalLayout>
    </PortalGuard>
  );
}
