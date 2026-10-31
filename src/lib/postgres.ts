import { neon } from '@neondatabase/serverless';

function getConnectionString(): string {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
}

export function isPostgresConfigured(): boolean {
  return Boolean(getConnectionString());
}

export function getSql() {
  const conn = getConnectionString();
  if (!conn) return null;
  return neon(conn);
}

let tablesInitialized = false;

export async function initPostgresDb() {
  const sql = getSql();
  if (!sql || tablesInitialized) return;

  try {
    // 1. Profiles Table
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'logistics_staff',
        phone TEXT,
        active INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 2. Customers Table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        company_name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        city TEXT,
        country TEXT,
        customer_type TEXT DEFAULT 'individual',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 3. Shipments Table
    await sql`
      CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY,
        tracking_number TEXT UNIQUE NOT NULL,
        internal_reference TEXT,
        booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        estimated_delivery_date TEXT,
        actual_delivery_date TIMESTAMPTZ,
        sender_name TEXT NOT NULL,
        sender_company TEXT,
        sender_email TEXT,
        sender_phone TEXT,
        sender_country TEXT NOT NULL,
        sender_state TEXT,
        sender_city TEXT NOT NULL,
        sender_postal_code TEXT,
        sender_street TEXT NOT NULL,
        sender_pickup_address TEXT,
        receiver_name TEXT NOT NULL,
        receiver_company TEXT,
        receiver_email TEXT,
        receiver_phone TEXT,
        receiver_country TEXT NOT NULL,
        receiver_state TEXT,
        receiver_city TEXT NOT NULL,
        receiver_postal_code TEXT,
        receiver_street TEXT NOT NULL,
        delivery_instructions TEXT,
        origin_country TEXT NOT NULL,
        origin_city TEXT NOT NULL,
        origin_facility TEXT,
        destination_country TEXT NOT NULL,
        destination_city TEXT NOT NULL,
        destination_facility TEXT,
        transit_hubs TEXT,
        shipping_route TEXT,
        transport_mode TEXT NOT NULL DEFAULT 'Air Freight',
        service_type TEXT NOT NULL DEFAULT 'Express Courier',
        carrier_partner TEXT,
        flight_vessel_reference TEXT,
        current_status TEXT NOT NULL DEFAULT 'Shipment Created',
        current_recorded_location TEXT NOT NULL,
        last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        total_actual_weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
        weight_unit TEXT NOT NULL DEFAULT 'kg',
        total_volumetric_weight NUMERIC(10, 2) DEFAULT 0,
        chargeable_weight NUMERIC(10, 2) DEFAULT 0,
        declared_value NUMERIC(12, 2) DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'USD',
        shipping_fee NUMERIC(10, 2) DEFAULT 0,
        handling_fee NUMERIC(10, 2) DEFAULT 0,
        insurance_fee NUMERIC(10, 2) DEFAULT 0,
        customs_charges NUMERIC(10, 2) DEFAULT 0,
        discount NUMERIC(10, 2) DEFAULT 0,
        total_charge NUMERIC(12, 2) DEFAULT 0,
        amount_paid NUMERIC(12, 2) DEFAULT 0,
        payment_status TEXT NOT NULL DEFAULT 'Pending',
        payment_method TEXT DEFAULT 'Bank Transfer',
        customs_declaration_ref TEXT,
        hs_code TEXT,
        duty_status TEXT DEFAULT 'Unpaid',
        restricted_review_status TEXT DEFAULT 'Cleared',
        customer_notes TEXT,
        internal_notes TEXT,
        assigned_staff_name TEXT,
        assigned_staff_id TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 4. Shipment Packages
    await sql`
      CREATE TABLE IF NOT EXISTS shipment_packages (
        id TEXT PRIMARY KEY,
        shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
        package_reference TEXT,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        weight NUMERIC(10, 2) NOT NULL,
        weight_unit TEXT NOT NULL DEFAULT 'kg',
        length NUMERIC(10, 2),
        width NUMERIC(10, 2),
        height NUMERIC(10, 2),
        dimension_unit TEXT DEFAULT 'cm',
        volumetric_weight NUMERIC(10, 2),
        package_type TEXT DEFAULT 'Box / Carton',
        declared_value NUMERIC(12, 2) DEFAULT 0,
        fragile INTEGER DEFAULT 0,
        handling_instructions TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 5. Tracking Events
    await sql`
      CREATE TABLE IF NOT EXISTS tracking_events (
        id TEXT PRIMARY KEY,
        shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        event_title TEXT NOT NULL,
        event_description TEXT,
        internal_note TEXT,
        location_name TEXT NOT NULL,
        city TEXT,
        country TEXT NOT NULL,
        facility_name TEXT,
        event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        is_public INTEGER DEFAULT 1,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 6. Support Tickets
    await sql`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        tracking_number TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Open',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // Seed default admin if missing
    const profiles = await sql`SELECT count(*)::int as count FROM profiles;`;
    if (profiles[0].count === 0) {
      await sql`
        INSERT INTO profiles (id, email, password_hash, full_name, role, phone)
        VALUES ('admin-01', 'admin@vedcourier.com', 'admin123', 'Chief Operations Director', 'super_admin', '+1 (800) 592-8334');
      `;
    }

    tablesInitialized = true;
    console.log('Postgres/Neon tables ready.');
  } catch (err) {
    console.warn('Postgres table initialization note:', err);
  }
}

export async function createPostgresShipment(data: any, packages: any[]) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const shipmentId = data.id || `ship-${Date.now()}`;
  const trackingNumber = data.tracking_number;

  let totalActualWeight = 0;
  let totalVolumetricWeight = 0;
  for (const pkg of packages) {
    totalActualWeight += Number(pkg.weight || 0) * Number(pkg.quantity || 1);
    if (pkg.length && pkg.width && pkg.height) {
      const vol = (Number(pkg.length) * Number(pkg.width) * Number(pkg.height)) / 5000;
      totalVolumetricWeight += vol * Number(pkg.quantity || 1);
    }
  }

  const chargeableWeight = Math.max(totalActualWeight, totalVolumetricWeight);
  const totalCharge = (Number(data.shipping_fee || 0) + Number(data.handling_fee || 0) + Number(data.insurance_fee || 0) + Number(data.customs_charges || 0)) - Number(data.discount || 0);

  await sql`
    INSERT INTO shipments (
      id, tracking_number, internal_reference,
      sender_name, sender_company, sender_email, sender_phone, sender_country, sender_state, sender_city, sender_postal_code, sender_street, sender_pickup_address,
      receiver_name, receiver_company, receiver_email, receiver_phone, receiver_country, receiver_state, receiver_city, receiver_postal_code, receiver_street, delivery_instructions,
      origin_country, origin_city, origin_facility, destination_country, destination_city, destination_facility, transit_hubs, shipping_route, transport_mode, service_type, carrier_partner, flight_vessel_reference,
      current_status, current_recorded_location,
      total_actual_weight, weight_unit, total_volumetric_weight, chargeable_weight,
      declared_value, currency, shipping_fee, handling_fee, insurance_fee, customs_charges, discount, total_charge, amount_paid, payment_status, payment_method,
      customer_notes, internal_notes, assigned_staff_name, assigned_staff_id, created_by
    ) VALUES (
      ${shipmentId}, ${trackingNumber}, ${data.internal_reference || null},
      ${data.sender_name}, ${data.sender_company || null}, ${data.sender_email || null}, ${data.sender_phone || null}, ${data.sender_country}, ${data.sender_state || null}, ${data.sender_city}, ${data.sender_postal_code || null}, ${data.sender_street}, ${data.sender_pickup_address || null},
      ${data.receiver_name}, ${data.receiver_company || null}, ${data.receiver_email || null}, ${data.receiver_phone || null}, ${data.receiver_country}, ${data.receiver_state || null}, ${data.receiver_city}, ${data.receiver_postal_code || null}, ${data.receiver_street}, ${data.delivery_instructions || null},
      ${data.origin_country}, ${data.origin_city}, ${data.origin_facility || `${data.origin_city} Logistics Hub`}, ${data.destination_country}, ${data.destination_city}, ${data.destination_facility || `${data.destination_city} Central Delivery Depot`}, ${data.transit_hubs || null}, ${data.shipping_route || `${data.origin_country} → ${data.destination_country}`}, ${data.transport_mode || 'Air Freight'}, ${data.service_type || 'Express Courier'}, ${data.carrier_partner || 'VED Courier Global Line'}, ${data.flight_vessel_reference || null},
      'Shipment Created', ${`${data.origin_facility || data.origin_city}, ${data.origin_country}`},
      ${totalActualWeight}, ${data.weight_unit || 'kg'}, ${Number(totalVolumetricWeight.toFixed(2))}, ${Number(chargeableWeight.toFixed(2))},
      ${Number(data.declared_value || 0)}, ${data.currency || 'USD'}, ${Number(data.shipping_fee || 0)}, ${Number(data.handling_fee || 0)}, ${Number(data.insurance_fee || 0)}, ${Number(data.customs_charges || 0)}, ${Number(data.discount || 0)}, ${Number(totalCharge.toFixed(2))}, ${Number(data.amount_paid || 0)}, ${data.payment_status || 'Pending'}, ${data.payment_method || 'Bank Transfer'},
      ${data.customer_notes || null}, ${data.internal_notes || null}, ${data.assigned_staff_name || 'Staff Dispatch'}, ${data.assigned_staff_id || 'admin-01'}, ${data.created_by || 'admin@vedcourier.com'}
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  // Insert packages
  let pIdx = 1;
  for (const pkg of packages) {
    const pkgId = `pkg-${Date.now()}-${pIdx}`;
    const vol = (pkg.length && pkg.width && pkg.height) ? (Number(pkg.length) * Number(pkg.width) * Number(pkg.height)) / 5000 : 0;
    await sql`
      INSERT INTO shipment_packages (
        id, shipment_id, package_reference, description, quantity, weight, weight_unit, length, width, height, dimension_unit, volumetric_weight, package_type, declared_value, fragile, handling_instructions
      ) VALUES (
        ${pkgId}, ${shipmentId}, ${pkg.package_reference || `${trackingNumber}-P${pIdx}`}, ${pkg.description || 'General Cargo'}, ${Number(pkg.quantity || 1)}, ${Number(pkg.weight || 1)}, ${pkg.weight_unit || 'kg'}, ${pkg.length ? Number(pkg.length) : null}, ${pkg.width ? Number(pkg.width) : null}, ${pkg.height ? Number(pkg.height) : null}, ${pkg.dimension_unit || 'cm'}, ${Number(vol.toFixed(2))}, ${pkg.package_type || 'Box / Carton'}, ${Number(pkg.declared_value || 0)}, ${pkg.fragile ? 1 : 0}, ${pkg.handling_instructions || null}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    pIdx++;
  }

  // Insert initial tracking event
  const evtId = `evt-${Date.now()}`;
  await sql`
    INSERT INTO tracking_events (
      id, shipment_id, status, event_title, event_description, location_name, city, country, facility_name, is_public, created_by
    ) VALUES (
      ${evtId}, ${shipmentId}, 'Shipment Created', 'Shipment Order Created & Electronic Documentation Processed', 'Shipping order registered in system. Consignment preparing for facility dispatch.', ${`${data.origin_facility || data.origin_city}`}, ${data.origin_city}, ${data.origin_country}, ${data.origin_facility || `${data.origin_city} Intake Facility`}, 1, ${data.created_by || 'admin@vedcourier.com'}
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  return { id: shipmentId, tracking_number: trackingNumber };
}

export async function getPostgresShipmentById(idOrTracking: string) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const shipments = await sql`
    SELECT * FROM shipments WHERE id = ${idOrTracking} OR tracking_number = ${idOrTracking} LIMIT 1;
  `;
  if (!shipments || shipments.length === 0) return null;

  const shipment = shipments[0];
  const packages = await sql`SELECT * FROM shipment_packages WHERE shipment_id = ${shipment.id};`;
  const events = await sql`SELECT * FROM tracking_events WHERE shipment_id = ${shipment.id} ORDER BY event_timestamp ASC;`;

  return {
    ...shipment,
    packages: packages || [],
    events: events || [],
    documents: [],
  };
}

export async function getPostgresShipments() {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const shipments = await sql`
    SELECT * FROM shipments ORDER BY created_at DESC LIMIT 100;
  `;
  return shipments || [];
}
