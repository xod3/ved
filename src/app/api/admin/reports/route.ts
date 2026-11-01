import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getReportsData } from '@/lib/db';
import { isPostgresConfigured, getPostgresReportsData } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    if (isPostgresConfigured()) {
      try {
        const pgReports = await getPostgresReportsData();
        if (pgReports) return NextResponse.json(pgReports);
      } catch (err) {
        console.warn('Postgres reports warning:', err);
      }
    }

    const reports = getReportsData();
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Reports error:', error);
    return NextResponse.json({ error: 'Failed to compute reports.' }, { status: 500 });
  }
}
