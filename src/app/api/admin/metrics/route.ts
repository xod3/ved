import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDashboardMetrics } from '@/lib/db';
import { isPostgresConfigured, getPostgresDashboardMetrics } from '@/lib/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (isPostgresConfigured()) {
      try {
        const pgMetrics = await getPostgresDashboardMetrics();
        if (pgMetrics) {
          return NextResponse.json({ success: true, metrics: pgMetrics });
        }
      } catch (err) {
        console.warn('Postgres metrics API error:', err);
      }
    }

    const metrics = getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve dashboard metrics.' }, { status: 500 });
  }
}
