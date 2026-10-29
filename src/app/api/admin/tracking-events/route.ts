import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { addTrackingEvent } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      shipment_id, 
      status, 
      event_title, 
      event_description, 
      internal_note, 
      location_name, 
      city, 
      region, 
      country, 
      facility_name, 
      event_timestamp, 
      is_public, 
      notify_customer 
    } = body;

    if (!shipment_id || !status || !event_title || !location_name || !country) {
      return NextResponse.json(
        { error: 'Status, event title, location name, and country are required.' },
        { status: 400 }
      );
    }

    const eventId = addTrackingEvent({
      shipment_id,
      status,
      event_title,
      event_description,
      internal_note,
      location_name,
      city,
      region,
      country,
      facility_name,
      event_timestamp: event_timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_public: is_public !== false,
      created_by: session.email,
      notify_customer: !!notify_customer,
    });

    return NextResponse.json({
      success: true,
      event_id: eventId,
      message: 'Milestone event recorded and shipment location updated successfully.',
    });
  } catch (error: any) {
    console.error('Add tracking event error:', error);
    return NextResponse.json(
      { error: 'Failed to record tracking milestone.' },
      { status: 500 }
    );
  }
}
