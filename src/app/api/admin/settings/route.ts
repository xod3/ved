import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getCompanySettings, updateCompanySettings } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const settings = getCompanySettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve settings.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const body = await request.json();
    updateCompanySettings(body.settings);
    return NextResponse.json({ success: true, message: 'Settings saved to database.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
}
