'use client';

import { useEffect, useState } from 'react';
import { PortalLayout, memberNav } from '@/components/portal-layout';
import { PortalGuard, EmptyState, PageHeader, StatusBadge, SummaryCard } from '@/components/portal-shared';
import { DataTable } from '@/components/data-table';
import { formatDate, formatNaira } from '@/lib/format';
import { ArrowDownCircle, Briefcase, Landmark, PiggyBank, Receipt, TrendingUp } from 'lucide-react';

interface Dashboard {
  member: {
    membershipNumber: string;
    fullName: string;
    email: string;
    status: string;
    dateJoined: string;
    membershipCategory: string | null;
    contributionPlan: string | null;
  };
  totals: {
    savings: number;
    contributions: number;
    investmentPrincipal: number;
    investmentValue: number;
    dividendsDeclared: number;
    dividendsPaid: number;
    outstandingLoans: number;
  };
  recentTransactions: {
    id: string;
    reference: string;
    category: string;
    description: string;
    amountKobo: number;
    status: string;
    createdAt: string;
  }[];
}

export default function MemberDashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/member/dashboard', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load your account information.');
        setDashboard(result as Dashboard);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load your account information.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalGuard portal="member">
      <PortalLayout nav={memberNav} portal="member" title="My Cooperative Account" subtitle="Your personal membership and financial overview">
        {loading ? (
          <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : error || !dashboard ? (
          <EmptyState title="Account information unavailable" description={error || 'No member account is linked to this login.'} icon={Receipt} />
        ) : (
          <>
            <PageHeader
              title={`Welcome, ${dashboard.member.fullName}`}
              description={`Membership ${dashboard.member.membershipNumber} · Joined ${formatDate(dashboard.member.dateJoined)} · ${dashboard.member.membershipCategory || 'Cooperative member'}`}
            />
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm">
              <span className="text-muted-foreground">Membership status</span>
              <StatusBadge status={dashboard.member.status} />
              {dashboard.member.contributionPlan && <span className="text-muted-foreground">Contribution plan: <strong className="text-foreground">{dashboard.member.contributionPlan}</strong></span>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SummaryCard label="Confirmed Savings" value={formatNaira(dashboard.totals.savings)} icon={PiggyBank} hint="Your recorded savings balance" />
              <SummaryCard label="Contributions" value={formatNaira(dashboard.totals.contributions)} icon={ArrowDownCircle} hint="Confirmed contributions only" />
              <SummaryCard label="Investment Principal" value={formatNaira(dashboard.totals.investmentPrincipal)} icon={Briefcase} />
              <SummaryCard label="Investment Value" value={formatNaira(dashboard.totals.investmentValue)} icon={TrendingUp} hint="Based on recorded valuations" />
              <SummaryCard label="Dividends Declared" value={formatNaira(dashboard.totals.dividendsDeclared)} icon={TrendingUp} hint={`${formatNaira(dashboard.totals.dividendsPaid)} paid`} />
              <SummaryCard label="Outstanding Loan" value={formatNaira(dashboard.totals.outstandingLoans)} icon={Landmark} />
            </div>

            <section className="mt-8">
              <PageHeader title="My confirmed transactions" description="Only transactions associated with your own membership account are shown." />
              {dashboard.recentTransactions.length === 0 ? (
                <EmptyState title="No confirmed transactions yet" description="Once the cooperative records a confirmed transaction for your membership, it will appear here." icon={Receipt} />
              ) : (
                <DataTable
                  columns={[
                    { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
                    { key: 'reference', header: 'Reference' },
                    { key: 'category', header: 'Type', render: (row) => row.category.replace(/_/g, ' ') },
                    { key: 'description', header: 'Details', render: (row) => row.description || '—' },
                    { key: 'amountKobo', header: 'Amount', render: (row) => formatNaira(row.amountKobo) },
                    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                  ]}
                  data={dashboard.recentTransactions}
                />
              )}
            </section>
            <p className="mt-6 text-xs text-muted-foreground">
              Financial figures are based on confirmed records linked to your account. Investment values are shown only where a valuation has been recorded; figures are not promises of returns.
            </p>
          </>
        )}
      </PortalLayout>
    </PortalGuard>
  );
}
