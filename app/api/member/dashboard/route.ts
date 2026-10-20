import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireSession, serverError } from '@/lib/http';
import { getDatabase } from '@/lib/mongodb';
import { addKobo, readKobo } from '@/lib/money';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await requireSession('member');
  if (auth.response) return auth.response;
  if (!auth.session.memberId) {
    return NextResponse.json({ error: 'Your account is not connected to a member record.' }, { status: 403 });
  }

  try {
    const db = await getDatabase();
    if (!ObjectId.isValid(auth.session.memberId)) {
      return NextResponse.json({ error: 'An active member record could not be found.' }, { status: 404 });
    }
    const member = await db.collection('members').findOne({ _id: new ObjectId(auth.session.memberId) });
    if (!member || member.status !== 'active') {
      return NextResponse.json({ error: 'An active member record could not be found.' }, { status: 404 });
    }

    const [transactions, investments, loans, dividends] = await Promise.all([
      db.collection('transactions').find({ memberId: auth.session.memberId, status: 'successful' }).sort({ createdAt: -1 }).limit(100).toArray(),
      db.collection('investments').find({ memberId: auth.session.memberId }).toArray(),
      db.collection('loans').find({ memberId: auth.session.memberId }).toArray(),
      db.collection('dividends').find({ memberId: auth.session.memberId }).toArray(),
    ]);

    return NextResponse.json({
      member: {
        membershipNumber: member.membershipNumber,
        fullName: member.fullName,
        email: member.email,
        status: member.status,
        dateJoined: member.dateJoined,
        membershipCategory: member.membershipCategory ?? null,
        contributionPlan: member.contributionPlan ?? null,
      },
      totals: {
        savings: transactions.reduce((sum, record) =>
          addKobo(sum, record.category === 'savings' ? readKobo(record, 'amountKobo') : 0), 0),
        contributions: transactions.reduce((sum, record) =>
          addKobo(sum, record.category === 'contribution' ? readKobo(record, 'amountKobo') : 0), 0),
        investmentPrincipal: investments.reduce((sum, record) => addKobo(sum, readKobo(record, 'amountInvestedKobo')), 0),
        investmentValue: investments.reduce((sum, record) => addKobo(sum, readKobo(record, 'currentValuationKobo', true)), 0),
        dividendsDeclared: dividends.reduce((sum, record) => addKobo(sum, readKobo(record, 'declaredAmountKobo')), 0),
        dividendsPaid: dividends.reduce((sum, record) => addKobo(sum, readKobo(record, 'paidAmountKobo', true)), 0),
        outstandingLoans: loans.reduce((sum, record) =>
          addKobo(sum, record.status === 'active' ? readKobo(record, 'outstandingPrincipalKobo') : 0), 0),
      },
      recentTransactions: transactions.slice(0, 10).map((record) => ({
        id: record._id.toString(),
        reference: record.reference ?? '—',
        category: record.category ?? 'transaction',
        description: record.description ?? '',
        amountKobo: readKobo(record, 'amountKobo'),
        status: record.status,
        createdAt: record.createdAt,
      })),
    });
  } catch (error) {
    return serverError(error, 'member.dashboard');
  }
}
