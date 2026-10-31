import { NextRequest, NextResponse } from 'next/server';
import { getShipmentByTrackingNumber } from '@/lib/db';
import { isPostgresConfigured, getPostgresShipmentById } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingId = searchParams.get('id');

    if (!trackingId || !trackingId.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid tracking number.' },
        { status: 400 }
      );
    }

    const raw = trackingId.trim();
    const normalized = raw.toUpperCase().replace(/\s+/g, '-').replace(/_+/g, '-');

    let rawShipment: any = null;

    if (isPostgresConfigured()) {
      try {
        rawShipment = await getPostgresShipmentById(normalized);
        if (!rawShipment && raw !== normalized) {
          rawShipment = await getPostgresShipmentById(raw);
        }
      } catch (pgErr) {
        console.warn('Postgres tracking lookup warning:', pgErr);
      }
    }

    if (!rawShipment) {
      rawShipment = getShipmentByTrackingNumber(normalized);
      if (!rawShipment && raw !== normalized) {
        rawShipment = getShipmentByTrackingNumber(raw);
      }
    }

    if (!rawShipment) {
      return NextResponse.json(
        { 
          error: 'Shipment record not found. Please verify the tracking number and try again.',
          notFound: true 
        },
        { status: 404 }
      );
    }

    // Sanitize and protect privacy: NEVER expose private contact info, internal notes, or financial amounts
    const publicData = {
      tracking_number: rawShipment.tracking_number,
      current_status: rawShipment.current_status,
      current_recorded_location: rawShipment.current_recorded_location,
      last_updated_at: rawShipment.last_updated_at,
      booking_date: rawShipment.booking_date,
      estimated_delivery_date: rawShipment.estimated_delivery_date,
      actual_delivery_date: rawShipment.actual_delivery_date,
      
      // Sanitized origin & destination (City and Country only)
      origin_city: rawShipment.origin_city,
      origin_country: rawShipment.origin_country,
      origin_facility: rawShipment.origin_facility,
      destination_city: rawShipment.destination_city,
      destination_country: rawShipment.destination_country,
      destination_facility: rawShipment.destination_facility,
      shipping_route: rawShipment.shipping_route,
      transit_hubs: rawShipment.transit_hubs,

      // Transit details
      transport_mode: rawShipment.transport_mode,
      service_type: rawShipment.service_type,
      carrier_partner: rawShipment.carrier_partner,
      flight_vessel_reference: rawShipment.flight_vessel_reference,

      // Weight & parcel count
      total_actual_weight: rawShipment.total_actual_weight,
      weight_unit: rawShipment.weight_unit,
      total_volumetric_weight: rawShipment.total_volumetric_weight,
      package_count: rawShipment.packages ? rawShipment.packages.length : 1,

      // Customs status
      customs_declaration_ref: rawShipment.customs_declaration_ref,
      duty_status: rawShipment.duty_status,
      restricted_review_status: rawShipment.restricted_review_status,

      // Customer approved package descriptions
      packages: (rawShipment.packages || []).map((pkg: any) => ({
        description: pkg.description,
        quantity: pkg.quantity,
        weight: pkg.weight,
        weight_unit: pkg.weight_unit,
        package_type: pkg.package_type,
      })),

      // Public chronological timeline events only
      events: (rawShipment.events || []).map((evt: any) => ({
        id: evt.id,
        status: evt.status,
        event_title: evt.event_title,
        event_description: evt.event_description,
        location_name: evt.location_name,
        city: evt.city,
        region: evt.region,
        country: evt.country,
        facility_name: evt.facility_name,
        event_timestamp: evt.event_timestamp,
      })),
    };

    return NextResponse.json({ success: true, shipment: publicData });
  } catch (error: any) {
    console.error('Error fetching tracking info:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while looking up the tracking record.' },
      { status: 500 }
    );
  }
}
