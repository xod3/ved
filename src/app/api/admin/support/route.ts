import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getSupportTickets, updateSupportTicketStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const status = request.nextUrl.searchParams.get('status') || undefined;
    const tickets = getSupportTickets({ status });
    return NextResponse.json({ success: true, tickets });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve tickets.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required.' }, { status: 400 });

    updateSupportTicketStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update ticket.' }, { status: 500 });
  }
}
