import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getShipments, createShipment } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const service = searchParams.get('service') || undefined;
    const route = searchParams.get('route') || undefined;

    const shipments = getShipments({ search, status, service, route });
    return NextResponse.json({ success: true, shipments });
  } catch (error: any) {
    console.error('Shipments GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve shipments.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { shipment, packages } = body;

    if (!shipment || !packages || packages.length === 0) {
      return NextResponse.json(
        { error: 'Shipment data and at least one package item are required.' },
        { status: 400 }
      );
    }

    // Required fields check
    if (!shipment.sender_name || !shipment.sender_country || !shipment.sender_city || !shipment.sender_street) {
      return NextResponse.json(
        { error: 'Sender full name, country, city, and street address are required.' },
        { status: 400 }
      );
    }

    if (!shipment.receiver_name || !shipment.receiver_country || !shipment.receiver_city || !shipment.receiver_street) {
      return NextResponse.json(
        { error: 'Receiver full name, destination country, city, and delivery address are required.' },
        { status: 400 }
      );
    }

    if (!shipment.origin_country || !shipment.origin_city || !shipment.destination_country || !shipment.destination_city) {
      return NextResponse.json(
        { error: 'Origin and destination details are required.' },
        { status: 400 }
      );
    }

    const created = createShipment(
      {
        ...shipment,
        created_by: session.email,
        assigned_staff_name: session.full_name,
        assigned_staff_id: session.id,
      },
      packages
    );

    return NextResponse.json({
      success: true,
      id: created.id,
      tracking_number: created.tracking_number,
      message: 'Shipment successfully created and registered in database.',
    });
  } catch (error: any) {
    console.error('Shipment creation error:', error);
    return NextResponse.json({ error: 'Failed to create shipment. Please verify unique constraints.' }, { status: 500 });
  }
}
