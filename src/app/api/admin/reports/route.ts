import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getReportsData } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const reports = getReportsData();
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Reports error:', error);
    return NextResponse.json({ error: 'Failed to compute reports.' }, { status: 500 });
  }
}
