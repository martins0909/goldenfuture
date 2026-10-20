'use client';

import { useEffect, useState } from 'react';
import { PortalLayout, adminNav } from '@/components/portal-layout';
import { PortalGuard, PageHeader, StatusBadge, EmptyState } from '@/components/portal-shared';
import { DataTable } from '@/components/data-table';
import { formatDate, titleCase } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileCheck, Search, CheckCircle2, XCircle, MessageSquareWarning } from 'lucide-react';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  occupation: string | null;
  membership_category: string | null;
  contribution_plan: string | null;
  residential_address: string | null;
  next_of_kin: string | null;
  date_of_birth: string | null;
  status: string;
  admin_notes: string | null;
  membership_number: string | null;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [membershipNumber, setMembershipNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activationLink, setActivationLink] = useState<string | null>(null);

  async function load() {
    try {
      const response = await fetch('/api/admin/applications', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load membership applications.');
      setItems(await response.json() as Application[]);
      setPageError(null);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Could not load membership applications.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    fetch('/api/admin/applications', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load membership applications.');
        return await response.json() as Application[];
      })
      .then((records) => {
        if (active) {
          setItems(records);
          setPageError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) setPageError(error instanceof Error ? error.message : 'Could not load membership applications.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = items.filter((a) => {
    const matchesSearch = !search || a.full_name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || (a.phone || '').includes(search);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function takeAction(status: 'approved' | 'rejected' | 'corrections_required') {
    if (!selected) return;
    setActionLoading(true);
    setPageError(null);
    try {
      const response = await fetch(`/api/admin/applications/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: notes, membership_number: membershipNumber }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update this application.');
      if (result.activationPath) setActivationLink(`${window.location.origin}${result.activationPath}`);
      setSelected(null);
      setNotes('');
      setMembershipNumber('');
      await load();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Could not update this application.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <PortalGuard portal="admin">
      <PortalLayout nav={adminNav} portal="admin" title="Membership Applications" subtitle="Review, approve, and reject prospective members">
        <PageHeader title="Membership Applications" description="All submitted applications awaiting or completed review." />

        {activationLink && (
          <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="font-semibold text-foreground">Member account invitation created</p>
            <p className="mt-1 text-muted-foreground">Share this one-time setup link securely with the approved member. It expires in 7 days.</p>
            <Input className="mt-3" readOnly value={activationLink} onFocus={(event) => event.currentTarget.select()} />
            <Button className="mt-3" variant="outline" onClick={() => navigator.clipboard.writeText(activationLink)}>Copy invitation link</Button>
          </div>
        )}
        {pageError && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{pageError}</p>}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="corrections_required">Corrections required</option>
          </select>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No applications found" description="New membership applications will appear here for review." icon={FileCheck} />
        ) : (
          <DataTable
            columns={[
              { key: 'full_name', header: 'Applicant' },
              { key: 'email', header: 'Email' },
              { key: 'occupation', header: 'Occupation', render: (r) => r.occupation || '—' },
              { key: 'membership_category', header: 'Category', render: (r) => r.membership_category || '—' },
              { key: 'created_at', header: 'Applied', render: (r) => formatDate(r.created_at) },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            data={filtered}
            onRowClick={setSelected}
          />
        )}

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Review — {selected?.full_name}</DialogTitle>
              <DialogDescription>Review the applicant&apos;s details and take an action.</DialogDescription>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{selected.email}</p></div>
                  <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selected.phone}</p></div>
                  <div><p className="text-xs text-muted-foreground">Occupation</p><p className="font-medium">{selected.occupation || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{selected.membership_category || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Contribution plan</p><p className="font-medium">{selected.contribution_plan || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Date of birth</p><p className="font-medium">{formatDate(selected.date_of_birth)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Next of kin</p><p className="font-medium">{selected.next_of_kin || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{selected.residential_address || '—'}</p></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memnum">Membership number (required for approval)</Label>
                  <Input id="memnum" placeholder="e.g. GF-00001" value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Internal notes</Label>
                  <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Review notes, corrections requested, etc." />
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => takeAction('corrections_required')} disabled={actionLoading || selected?.status !== 'pending'}>
                <MessageSquareWarning className="mr-1.5 h-4 w-4" /> Request Corrections
              </Button>
              <Button variant="destructive" onClick={() => takeAction('rejected')} disabled={actionLoading || selected?.status !== 'pending'}>
                <XCircle className="mr-1.5 h-4 w-4" /> Reject
              </Button>
              <Button onClick={() => takeAction('approved')} disabled={actionLoading || !membershipNumber || selected?.status !== 'pending'}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve &amp; Create Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PortalLayout>
    </PortalGuard>
  );
}
