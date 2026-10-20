'use client';

import { useEffect, useState } from 'react';
import { PortalLayout, adminNav } from '@/components/portal-layout';
import { PortalGuard, SummaryCard, PageHeader, EmptyState } from '@/components/portal-shared';
import { formatNaira, formatNumber } from '@/lib/format';
import {
  Users, FileCheck, PiggyBank, CreditCard, Briefcase, TrendingUp,
  Landmark, ArrowDownCircle, ArrowUpCircle, Wallet, Scale,
  PieChart as PieChartIcon, BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

interface Stats {
  totalMembers: number;
  pendingApplications: number;
  activeMembers: number;
  totalSavings: number;
  totalContributions: number;
  confirmedPayments: number;
  outstandingLoans: number;
  loanRepayments: number;
  approvedInvestments: number;
  currentInvestmentValue: number;
  dividendsDeclared: number;
  totalIncome: number;
  totalExpenses: number;
  cashAndBank: number;
  outstandingLiabilities: number;
  netAssets: number;
}

const empty: Stats = {
  totalMembers: 0, pendingApplications: 0, activeMembers: 0, totalSavings: 0,
  totalContributions: 0, confirmedPayments: 0, outstandingLoans: 0,
  loanRepayments: 0, approvedInvestments: 0, currentInvestmentValue: 0,
  dividendsDeclared: 0,   totalIncome: 0, totalExpenses: 0, cashAndBank: 0, outstandingLiabilities: 0, netAssets: 0,
};

const PIE_COLORS = ['hsl(158 64% 22%)', 'hsl(43 74% 50%)', 'hsl(197 37% 35%)', 'hsl(12 76% 61%)', 'hsl(280 65% 60%)'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(empty);
  const [monthlyData, setMonthlyData] = useState<{ month: string; contributions: number; income: number; expenses: number }[]>([]);
  const [investmentData, setInvestmentData] = useState<{ name: string; value: number }[]>([]);
  const [loanData, setLoanData] = useState<{ name: string; active: number; closed: number }[]>([]);
  const [membershipGrowth, setMembershipGrowth] = useState<{ month: string; members: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load cooperative figures.');
        const data = await response.json();
        setStats(data.stats);
        setMonthlyData(data.monthlyData);
        setInvestmentData(data.investmentData);
        setLoanData(data.loanData);
        setMembershipGrowth(data.membershipGrowth);
      } catch (error) {
        console.error('[admin.dashboard]', error);
        setDashboardError(error instanceof Error ? error.message : 'Could not load cooperative figures.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PortalGuard portal="admin">
      <PortalLayout nav={adminNav} portal="admin" title="Admin Dashboard" subtitle="Cooperative overview and financial health">
        {dashboardError && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{dashboardError}</p>}
        <PageHeader
          title="Welcome back"
          description="A real-time overview of your cooperative's operations, calculated from underlying records."
        />

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Members" value={formatNumber(stats.totalMembers)} icon={Users} hint={`${stats.activeMembers} active`} />
          <SummaryCard label="Pending Applications" value={formatNumber(stats.pendingApplications)} icon={FileCheck} tone={stats.pendingApplications > 0 ? 'warning' : 'default'} />
          <SummaryCard label="Member Savings" value={formatNaira(stats.totalSavings)} icon={PiggyBank} />
          <SummaryCard label="Contributions Received" value={formatNaira(stats.totalContributions)} icon={ArrowDownCircle} />
          <SummaryCard label="Confirmed Payments" value={formatNaira(stats.confirmedPayments)} icon={CreditCard} />
          <SummaryCard label="Outstanding Loans" value={formatNaira(stats.outstandingLoans)} icon={Landmark} tone={stats.outstandingLoans > 0 ? 'negative' : 'default'} />
          <SummaryCard label="Loan Repayments" value={formatNaira(stats.loanRepayments)} icon={ArrowUpCircle} />
          <SummaryCard label="Approved Investments" value={formatNaira(stats.approvedInvestments)} icon={Briefcase} />
          <SummaryCard label="Investment Value" value={formatNaira(stats.currentInvestmentValue)} icon={TrendingUp} />
          <SummaryCard label="Dividends Declared" value={formatNaira(stats.dividendsDeclared)} icon={TrendingUp} />
          <SummaryCard label="Total Income" value={formatNaira(stats.totalIncome)} icon={ArrowDownCircle} tone="positive" />
          <SummaryCard label="Total Expenses" value={formatNaira(stats.totalExpenses)} icon={ArrowUpCircle} tone="negative" />
          <SummaryCard label="Cash & Bank Balances" value={formatNaira(stats.cashAndBank)} icon={Wallet} />
          <SummaryCard label="Outstanding Liabilities" value={formatNaira(stats.outstandingLiabilities)} icon={Scale} tone="negative" />
          <SummaryCard label="Net Assets / Equity" value={formatNaira(stats.netAssets)} icon={Scale} tone="positive" />
          <SummaryCard label="Active Members" value={formatNumber(stats.activeMembers)} icon={Users} />
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Monthly Contributions, Income & Expenses</h3>
            </div>
            {monthlyData.every((m) => m.contributions === 0 && m.income === 0 && m.expenses === 0) ? (
              <EmptyState title="No transaction data yet" description="Charts will populate as payments and expenses are recorded." icon={BarChart3} />
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 100000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatNaira(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="contributions" name="Contributions" fill="hsl(158 64% 22%)" radius={[4,4,0,0]} />
                  <Bar dataKey="income" name="Income" fill="hsl(43 74% 50%)" radius={[4,4,0,0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(12 76% 61%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Investment Allocation</h3>
            </div>
            {investmentData.length === 0 ? (
              <EmptyState title="No investments yet" description="Approved investments will appear here by category." icon={Briefcase} />
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <PieChart>
                  <Pie data={investmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(e) => e.name}>
                    {investmentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatNaira(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Loan Performance</h3>
            </div>
            {loanData.every((l) => l.active === 0 && l.closed === 0) ? (
              <EmptyState title="No loans recorded" description="Loan portfolio data will appear here." icon={Landmark} />
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <BarChart data={loanData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="active" name="Active" fill="hsl(158 64% 22%)" radius={[4,4,0,0]} />
                  <Bar dataKey="closed" name="Closed" fill="hsl(43 74% 50%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Membership Growth</h3>
            </div>
            {membershipGrowth.every((m) => m.members === 0) ? (
              <EmptyState title="No members yet" description="Member growth will be tracked here as members are approved." icon={Users} />
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <AreaChart data={membershipGrowth}>
                  <defs>
                    <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(158 64% 22%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(158 64% 22%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="members" name="Members" stroke="hsl(158 64% 22%)" fill="url(#memGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </PortalLayout>
    </PortalGuard>
  );
}
