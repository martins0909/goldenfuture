import { NextResponse } from 'next/server';
import { requireSession, serverError } from '@/lib/http';
import { getDatabase } from '@/lib/mongodb';
import { addKobo, readKobo, subtractKobo } from '@/lib/money';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await requireSession('admin');
  if (auth.response) return auth.response;

  try {
    const db = await getDatabase();
    const [
      members,
      applications,
      transactions,
      expenses,
      investments,
      loans,
      repayments,
      dividends,
      bankAccounts,
    ] = await Promise.all([
      db.collection('members').find({}, { projection: { status: 1, dateJoined: 1 } }).toArray(),
      db.collection('membershipApplications').find({}, { projection: { status: 1 } }).toArray(),
      db.collection('transactions').find({ status: 'successful' }).toArray(),
      db.collection('expenses').find({ status: { $ne: 'voided' } }).toArray(),
      db.collection('investments').find({}).toArray(),
      db.collection('loans').find({}).toArray(),
      db.collection('loanRepayments').find({}).toArray(),
      db.collection('dividends').find({}).toArray(),
      db.collection('bankAccounts').find({ status: { $ne: 'closed' } }).toArray(),
    ]);

    const totalSavings = transactions.reduce((sum, record) =>
      addKobo(sum, record.category === 'savings' ? readKobo(record, 'amountKobo') : 0), 0);
    const totalContributions = transactions.reduce((sum, record) =>
      addKobo(sum, record.category === 'contribution' ? readKobo(record, 'amountKobo') : 0), 0);
    const confirmedPayments = transactions.reduce((sum, record) => addKobo(sum, readKobo(record, 'amountKobo')), 0);
    const outstandingLoans = loans.reduce((sum, record) =>
      addKobo(sum, record.status === 'active' ? readKobo(record, 'outstandingPrincipalKobo') : 0), 0);
    const loanRepayments = repayments.reduce((sum, record) => addKobo(sum, readKobo(record, 'amountKobo')), 0);
    const approvedInvestments = investments.reduce((sum, record) =>
      addKobo(sum, ['approved', 'funded', 'active', 'matured', 'closed'].includes(String(record.status)) ? readKobo(record, 'amountInvestedKobo') : 0), 0);
    const currentInvestmentValue = investments.reduce((sum, record) =>
      addKobo(sum, readKobo(record, 'currentValuationKobo', true)), 0);
    const dividendsDeclared = dividends.reduce((sum, record) => addKobo(sum, readKobo(record, 'declaredAmountKobo')), 0);
    const totalIncome = transactions.reduce((sum, record) =>
      addKobo(sum, ['income', 'fees', 'interest'].includes(String(record.category)) ? readKobo(record, 'amountKobo') : 0), 0);
    const totalExpenses = expenses.reduce((sum, record) => addKobo(sum, readKobo(record, 'amountKobo')), 0);
    const cashAndBank = bankAccounts.reduce((sum, record) => addKobo(sum, readKobo(record, 'balanceKobo')), 0);
    const unpaidDividends = dividends.reduce((sum, record) => {
      const remaining = Math.max(0, subtractKobo(
        readKobo(record, 'declaredAmountKobo'),
        readKobo(record, 'paidAmountKobo', true)
      ));
      return addKobo(sum, remaining);
    }, 0);
    const liabilities = addKobo(addKobo(totalSavings, totalContributions), unpaidDividends);

    const now = new Date();
    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    const monthlyData = monthKeys.map((key) => ({
      month: new Date(`${key}-01T00:00:00`).toLocaleString('en', { month: 'short' }),
      contributions: 0,
      income: 0,
      expenses: 0,
    }));
    transactions.forEach((record) => {
      const date = record.createdAt instanceof Date ? record.createdAt : new Date(String(record.createdAt ?? ''));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const index = monthKeys.indexOf(key);
      if (index < 0) return;
      if (record.category === 'contribution') monthlyData[index].contributions = addKobo(monthlyData[index].contributions, readKobo(record, 'amountKobo'));
      if (['income', 'fees', 'interest'].includes(String(record.category))) monthlyData[index].income = addKobo(monthlyData[index].income, readKobo(record, 'amountKobo'));
    });
    expenses.forEach((record) => {
      const date = record.expenseDate instanceof Date ? record.expenseDate : new Date(String(record.expenseDate ?? record.createdAt ?? ''));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const index = monthKeys.indexOf(key);
      if (index >= 0) monthlyData[index].expenses = addKobo(monthlyData[index].expenses, readKobo(record, 'amountKobo'));
    });

    const investmentsByCategory = new Map<string, number>();
    investments.forEach((record) => {
      const category = typeof record.category === 'string' ? record.category : 'Uncategorized';
      investmentsByCategory.set(category, addKobo(investmentsByCategory.get(category) ?? 0, readKobo(record, 'amountInvestedKobo', true)));
    });
    const growth = monthKeys.map((key) => {
      const date = new Date(`${key}-01T00:00:00`);
      const joinedInMonth = members.filter((member) => {
        const joined = member.dateJoined instanceof Date ? member.dateJoined : new Date(String(member.dateJoined ?? ''));
        return joined.getFullYear() === date.getFullYear() && joined.getMonth() === date.getMonth();
      }).length;
      return { key, month: date.toLocaleString('en', { month: 'short' }), joinedInMonth };
    });
    let runningMembers = members.filter((member) => {
      const joined = member.dateJoined instanceof Date ? member.dateJoined : new Date(String(member.dateJoined ?? ''));
      return joined < new Date(`${monthKeys[0]}-01T00:00:00`);
    }).length;
    const membershipGrowth = growth.map(({ month, joinedInMonth }) => {
      runningMembers += joinedInMonth;
      return { month, members: runningMembers };
    });

    return NextResponse.json({
      stats: {
        totalMembers: members.length,
        pendingApplications: applications.filter((record) => record.status === 'pending').length,
        activeMembers: members.filter((record) => record.status === 'active').length,
        totalSavings,
        totalContributions,
        confirmedPayments,
        outstandingLoans,
        loanRepayments,
        approvedInvestments,
        currentInvestmentValue,
        dividendsDeclared,
        totalIncome,
        totalExpenses,
        cashAndBank,
        outstandingLiabilities: liabilities,
        netAssets: subtractKobo(addKobo(addKobo(cashAndBank, currentInvestmentValue), outstandingLoans), liabilities),
      },
      monthlyData,
      investmentData: Array.from(investmentsByCategory, ([name, value]) => ({ name, value })),
      loanData: [
        { name: 'Active', active: loans.filter((record) => record.status === 'active').length, closed: 0 },
        { name: 'Closed', active: 0, closed: loans.filter((record) => record.status === 'closed').length },
        { name: 'Defaulted', active: loans.filter((record) => record.status === 'defaulted').length, closed: 0 },
      ],
      membershipGrowth,
    });
  } catch (error) {
    return serverError(error, 'admin.dashboard');
  }
}
