import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getShipments, createShipment, generateNextTrackingNumber } from '@/lib/db';
import { isPostgresConfigured, createPostgresShipment, getPostgresShipments, generateUniqueTrackingNumber } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;

    // Fast endpoint to generate the next guaranteed-unique real-time tracking number
    if (searchParams.get('action') === 'next-tracking') {
      let trackingNumber = '';
      if (isPostgresConfigured()) {
        try {
          trackingNumber = await generateUniqueTrackingNumber();
        } catch (e) {
          console.warn('Postgres tracking generation note:', e);
        }
      }
      if (!trackingNumber) {
        try {
          trackingNumber = generateNextTrackingNumber();
        } catch (e) {
          const year = new Date().getFullYear();
          const rand = Math.floor(100100 + Math.random() * 899000);
          trackingNumber = `VED-${year}-${rand}`;
        }
      }
      return NextResponse.json({ success: true, tracking_number: trackingNumber });
    }

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const service = searchParams.get('service') || undefined;
    const route = searchParams.get('route') || undefined;

    if (isPostgresConfigured()) {
      try {
        const pgShipments = await getPostgresShipments({ search, status, service, route });
        if (pgShipments !== null) {
          return NextResponse.json({ success: true, shipments: pgShipments });
        }
      } catch (pgErr) {
        console.warn('Postgres GET shipments warning:', pgErr);
      }
    }

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

    const shipmentId = shipment.id || `ship-${Date.now()}`;
    const year = new Date().getFullYear();
    let trackingNumber = (shipment.tracking_number || '').trim().toUpperCase().replace(/\s+/g, '-').replace(/_+/g, '-');

    if (trackingNumber.includes('MOLESTIAS') || trackingNumber.includes('IPSUM') || trackingNumber.includes('QUO')) {
      trackingNumber = '';
    }

    if (!trackingNumber || !trackingNumber.startsWith('VED-')) {
      if (trackingNumber) {
        trackingNumber = `VED-${year}-${trackingNumber.replace(/[^A-Z0-9]/g, '')}`;
      } else {
        trackingNumber = isPostgresConfigured() ? await generateUniqueTrackingNumber() : generateNextTrackingNumber();
      }
    }

    if (isPostgresConfigured()) {
      const shipmentData = {
        ...shipment,
        id: shipmentId,
        tracking_number: trackingNumber,
        created_by: session.email,
        assigned_staff_name: session.full_name,
        assigned_staff_id: session.id,
      };

      const pgResult = await createPostgresShipment(shipmentData, packages);
      const finalTrackingNumber = pgResult?.tracking_number || trackingNumber;

      try {
        createShipment({ ...shipmentData, tracking_number: finalTrackingNumber }, packages);
      } catch (sqlErr) {
        console.warn('SQLite mirror notice:', sqlErr);
      }

      return NextResponse.json({
        success: true,
        id: shipmentId,
        tracking_number: finalTrackingNumber,
        message: 'Shipment successfully created and activated in real-time database.',
      });
    }

    const shipmentData = {
      ...shipment,
      id: shipmentId,
      tracking_number: trackingNumber,
      created_by: session.email,
      assigned_staff_name: session.full_name,
      assigned_staff_id: session.id,
    };

    const created = createShipment(shipmentData, packages);

    return NextResponse.json({
      success: true,
      id: created.id,
      tracking_number: created.tracking_number,
      message: 'Shipment successfully created and registered in database.',
    });
  } catch (error: any) {
    console.error('Shipment creation error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create shipment. Please verify unique constraints.' }, { status: 500 });
  }
}

