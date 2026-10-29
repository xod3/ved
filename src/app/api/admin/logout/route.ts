import { NextRequest, NextResponse } from 'next/server';
import { logoutAdminUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await logoutAdminUser();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
