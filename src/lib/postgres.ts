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
        VALUES ('admin-01', 'admin@vedcourier.com', 'admin123', 'Chief Operations Director', 'super_admin', '+1 (808) 301-0314');
      `;
    }

    // Seed initial shipments if table is empty
    const shipmentCount = await sql`SELECT count(*)::int as count FROM shipments;`;
    if (shipmentCount[0].count === 0) {
      await seedPostgresShipments(sql);
    } else {
      // Migrate existing records to replace Nigeria with United Kingdom
      await sql`
        UPDATE shipments
        SET receiver_country = 'United Kingdom',
            destination_country = 'United Kingdom',
            shipping_route = REPLACE(shipping_route, 'Nigeria', 'United Kingdom'),
            receiver_city = CASE WHEN receiver_city = 'Lagos' THEN 'London' WHEN receiver_city = 'Abuja' THEN 'Manchester' WHEN receiver_city = 'Kano' THEN 'Birmingham' ELSE receiver_city END,
            destination_city = CASE WHEN destination_city = 'Lagos' THEN 'London' WHEN destination_city = 'Abuja' THEN 'Manchester' WHEN destination_city = 'Kano' THEN 'Birmingham' ELSE destination_city END,
            destination_facility = CASE WHEN destination_facility LIKE '%Murtala%' THEN 'Heathrow World Cargo Centre (LHR)' WHEN destination_facility LIKE '%Nnamdi%' THEN 'Manchester Airport World Freight Terminal (MAN)' WHEN destination_facility LIKE '%Kano%' THEN 'Birmingham Airport Cargo Terminal (BHX)' ELSE destination_facility END
        WHERE destination_country = 'Nigeria' OR receiver_country = 'Nigeria';
      `;
      await sql`
        UPDATE tracking_events
        SET country = 'United Kingdom',
            city = CASE WHEN city = 'Lagos' THEN 'London' WHEN city = 'Abuja' THEN 'Manchester' ELSE city END,
            event_title = REPLACE(event_title, 'Nigeria', 'United Kingdom'),
            event_description = REPLACE(REPLACE(event_description, 'Nigeria', 'United Kingdom'), 'Lagos', 'London')
        WHERE country = 'Nigeria';
      `;
    }

    // Purge rogue / placeholder test tracking IDs (e.g. QUO-MOLESTIAS-IPSUM or anything not following VED format)
    try {
      await sql`
        DELETE FROM tracking_events
        WHERE shipment_id IN (
          SELECT id FROM shipments 
          WHERE tracking_number NOT LIKE 'VED-%'
             OR UPPER(tracking_number) LIKE '%MOLESTIAS%'
             OR UPPER(tracking_number) LIKE '%QUO%'
             OR UPPER(tracking_number) LIKE '%IPSUM%'
        );
      `;
      await sql`
        DELETE FROM shipment_packages
        WHERE shipment_id IN (
          SELECT id FROM shipments 
          WHERE tracking_number NOT LIKE 'VED-%'
             OR UPPER(tracking_number) LIKE '%MOLESTIAS%'
             OR UPPER(tracking_number) LIKE '%QUO%'
             OR UPPER(tracking_number) LIKE '%IPSUM%'
        );
      `;
      await sql`
        DELETE FROM shipments
        WHERE tracking_number NOT LIKE 'VED-%'
           OR UPPER(tracking_number) LIKE '%MOLESTIAS%'
           OR UPPER(tracking_number) LIKE '%QUO%'
           OR UPPER(tracking_number) LIKE '%IPSUM%';
      `;
    } catch (purgeErr) {
      console.warn('Postgres cleanup notice:', purgeErr);
    }

    tablesInitialized = true;
    console.log('Postgres/Neon tables ready.');
  } catch (err) {
    console.warn('Postgres table initialization note:', err);
  }
}

async function seedPostgresShipments(sql: any) {
  try {
    const seedList = [
      {
        id: 'ship-001',
        tracking_number: 'VED-2026-000101',
        sender_name: 'Apex Precision Technologies Inc.',
        sender_city: 'New York',
        sender_country: 'United States',
        sender_street: '450 West 33rd Street',
        receiver_name: 'Shanghai Semiconductor Systems Ltd.',
        receiver_city: 'Shanghai',
        receiver_country: 'China',
        receiver_street: 'Building 8, Zhangjiang Hi-Tech Park',
        origin_city: 'New York',
        origin_country: 'United States',
        origin_facility: 'JFK Air Freight Cargo Terminal 4',
        destination_city: 'Shanghai',
        destination_country: 'China',
        destination_facility: 'Shanghai Pudong Airport Customs Center',
        shipping_route: 'United States → China',
        transport_mode: 'Air Freight',
        service_type: 'Priority Air Express',
        current_status: 'Customs Cleared',
        current_recorded_location: 'Shanghai Pudong International Hub, China',
        total_actual_weight: 42.5,
      },
      {
        id: 'ship-002',
        tracking_number: 'VED-2026-000102',
        sender_name: 'Guangzhou Electronic Components Corp.',
        sender_city: 'Guangzhou',
        sender_country: 'China',
        sender_street: 'No. 88 Baiyun Industrial Zone',
        receiver_name: 'London Tech Hub & Devices Ltd',
        receiver_city: 'London',
        receiver_country: 'United Kingdom',
        receiver_street: '14 High Holborn, Camden',
        origin_city: 'Guangzhou',
        origin_country: 'China',
        origin_facility: 'Guangzhou Baiyun Freight Terminal',
        destination_city: 'London',
        destination_country: 'United Kingdom',
        destination_facility: 'Heathrow World Cargo Centre (LHR)',
        shipping_route: 'China → United Kingdom',
        transport_mode: 'Air Freight',
        service_type: 'Express Courier',
        current_status: 'In Transit',
        current_recorded_location: 'In Transit to London LHR',
        total_actual_weight: 120.0,
      },
      {
        id: 'ship-003',
        tracking_number: 'VED-2026-000103',
        sender_name: 'Continental Medical Supplies LLC',
        sender_city: 'Houston',
        sender_country: 'United States',
        sender_street: '1200 Post Oak Blvd',
        receiver_name: 'Manchester Specialist Clinic & Diagnostics',
        receiver_city: 'Manchester',
        receiver_country: 'United Kingdom',
        receiver_street: 'Unit 4, Oxford Road Health Park',
        origin_city: 'Houston',
        origin_country: 'United States',
        origin_facility: 'George Bush Intercontinental Cargo Facility',
        destination_city: 'Manchester',
        destination_country: 'United Kingdom',
        destination_facility: 'Manchester Airport World Freight Terminal (MAN)',
        shipping_route: 'United States → United Kingdom',
        transport_mode: 'Air Freight',
        service_type: 'Priority Medical Express',
        current_status: 'Out for Delivery',
        current_recorded_location: 'Manchester Dispatch Depot',
        total_actual_weight: 18.5,
      },
      {
        id: 'ship-004',
        tracking_number: 'VED-2026-000104',
        sender_name: 'Seoul Energy Battery Solutions',
        sender_city: 'Seoul',
        sender_country: 'South Korea',
        sender_street: '72 Teheran-ro, Gangnam-gu',
        receiver_name: 'Pacific Electric Mobility Inc.',
        receiver_city: 'Los Angeles',
        receiver_country: 'United States',
        receiver_street: '1900 Ocean Avenue, Long Beach',
        origin_city: 'Seoul',
        origin_country: 'South Korea',
        origin_facility: 'Incheon International Air Freight Cargo Station',
        destination_city: 'Los Angeles',
        destination_country: 'United States',
        destination_facility: 'Port of Long Beach Freight Center',
        shipping_route: 'South Korea → United States',
        transport_mode: 'Sea Freight',
        service_type: 'Standard Container Freight',
        current_status: 'Delivered',
        current_recorded_location: 'Los Angeles Consignee Warehouse',
        total_actual_weight: 850.0,
      },
      {
        id: 'ship-005',
        tracking_number: 'VED-2026-000105',
        sender_name: 'Atlantic Trade & Express Partners',
        sender_city: 'Atlanta',
        sender_country: 'United States',
        sender_street: '3400 Peachtree Road NE',
        receiver_name: 'Birmingham Commercial Trading Emporium',
        receiver_city: 'Birmingham',
        receiver_country: 'United Kingdom',
        receiver_street: 'Unit 12, Heartlands Industrial Estate',
        origin_city: 'Atlanta',
        origin_country: 'United States',
        origin_facility: 'Hartsfield-Jackson Atlanta Air Logistics Depot',
        destination_city: 'Birmingham',
        destination_country: 'United Kingdom',
        destination_facility: 'Birmingham Airport Cargo Terminal (BHX)',
        shipping_route: 'United States → United Kingdom',
        transport_mode: 'Air Freight',
        service_type: 'Express Courier',
        current_status: 'Shipment Created',
        current_recorded_location: 'Atlanta Gateway Cargo Terminal, GA',
        total_actual_weight: 35.0,
      },
      {
        id: 'ship-006',
        tracking_number: 'VED-2026-000106',
        sender_name: 'Global Commerce Dispatch Services',
        sender_city: 'Dallas',
        sender_country: 'United States',
        sender_street: '2100 Ross Avenue, Suite 1800',
        receiver_name: 'Canary Wharf Corporate Logistics',
        receiver_city: 'London',
        receiver_country: 'United Kingdom',
        receiver_street: '25 Bank Street, Canary Wharf',
        origin_city: 'Dallas',
        origin_country: 'United States',
        origin_facility: 'DFW International Air Freight Hub',
        destination_city: 'London',
        destination_country: 'United Kingdom',
        destination_facility: 'Heathrow International Cargo Complex',
        shipping_route: 'United States → United Kingdom',
        transport_mode: 'Air Freight',
        service_type: 'Express Courier',
        current_status: 'In Transit',
        current_recorded_location: 'In Transit — Trans-Atlantic Air Corridor',
        total_actual_weight: 28.0,
      },
    ];

    for (const s of seedList) {
      await sql`
        INSERT INTO shipments (
          id, tracking_number, sender_name, sender_city, sender_country, sender_street,
          receiver_name, receiver_city, receiver_country, receiver_street,
          origin_city, origin_country, origin_facility, destination_city, destination_country, destination_facility,
          shipping_route, transport_mode, service_type, current_status, current_recorded_location,
          total_actual_weight, created_by
        ) VALUES (
          ${s.id}, ${s.tracking_number}, ${s.sender_name}, ${s.sender_city}, ${s.sender_country}, ${s.sender_street},
          ${s.receiver_name}, ${s.receiver_city}, ${s.receiver_country}, ${s.receiver_street},
          ${s.origin_city}, ${s.origin_country}, ${s.origin_facility}, ${s.destination_city}, ${s.destination_country}, ${s.destination_facility},
          ${s.shipping_route}, ${s.transport_mode}, ${s.service_type}, ${s.current_status}, ${s.current_recorded_location},
          ${s.total_actual_weight}, 'admin@vedcourier.com'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // Seed package
      await sql`
        INSERT INTO shipment_packages (
          id, shipment_id, package_reference, description, quantity, weight, package_type
        ) VALUES (
          ${`pkg-${s.id}-1`}, ${s.id}, ${`${s.tracking_number}-P1`}, 'Consolidated Commercial Cargo', 1, ${s.total_actual_weight}, 'Box / Carton'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // Seed event
      await sql`
        INSERT INTO tracking_events (
          id, shipment_id, status, event_title, event_description, location_name, city, country, is_public, created_by
        ) VALUES (
          ${`evt-${s.id}-1`}, ${s.id}, ${s.current_status}, ${`Consignment ${s.current_status}`}, ${`Shipment registered and active at ${s.current_recorded_location}`}, ${s.origin_facility}, ${s.origin_city}, ${s.origin_country}, 1, 'admin@vedcourier.com'
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  } catch (err) {
    console.warn('Seed postgres shipments notice:', err);
  }
}

export async function generateUniqueTrackingNumber(requested?: string): Promise<string> {
  const sql = getSql();

  if (requested && requested.trim()) {
    let clean = requested.trim().toUpperCase().replace(/[\s_]+/g, '-');
    if (!clean.startsWith('VED-')) {
      clean = `VED-${clean.replace(/[^A-Z0-9-]/g, '')}`;
    }
    if (sql) {
      try {
        const rows = await sql`SELECT id FROM shipments WHERE tracking_number = ${clean} LIMIT 1;`;
        if (rows.length === 0) return clean;
        const suffix = Math.floor(1000 + Math.random() * 9000);
        return `${clean}-${suffix}`;
      } catch {
        return clean;
      }
    }
    return clean;
  }

  // Generate randomized non-sequential waybill number
  if (sql) {
    for (let i = 0; i < 10; i++) {
      const block1 = Math.floor(1000 + Math.random() * 9000);
      const block2 = Math.floor(10000 + Math.random() * 90000);
      const candidate = `VED-${block1}-${block2}`;
      try {
        const rows = await sql`SELECT id FROM shipments WHERE tracking_number = ${candidate} LIMIT 1;`;
        if (rows.length === 0) return candidate;
      } catch {
        return candidate;
      }
    }
  }

  const block1 = Math.floor(1000 + Math.random() * 9000);
  const block2 = Math.floor(10000 + Math.random() * 90000);
  return `VED-${block1}-${block2}`;
}

export async function createPostgresShipment(data: any, packages: any[]) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const shipmentId = data.id || `ship-${Date.now()}`;
  const year = new Date().getFullYear();
  let trackingNumber = (data.tracking_number || '').trim().toUpperCase().replace(/\s+/g, '-');
  
  if (!trackingNumber || !trackingNumber.startsWith('VED-')) {
    if (trackingNumber) {
      trackingNumber = `VED-${trackingNumber.replace(/[^A-Z0-9-]/g, '')}`;
    } else {
      trackingNumber = await generateUniqueTrackingNumber();
    }
  }

  // Ensure uniqueness
  const existing = await sql`SELECT id FROM shipments WHERE tracking_number = ${trackingNumber} LIMIT 1;`;
  if (existing && existing.length > 0 && existing[0].id !== shipmentId) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    trackingNumber = `${trackingNumber}-${suffix}`;
  }

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

  const initialStatus = data.current_status || 'Shipment Created';
  const initialLocation = data.current_recorded_location || `${data.origin_facility || data.origin_city}, ${data.origin_country}`;

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
      ${initialStatus}, ${initialLocation},
      ${totalActualWeight}, ${data.weight_unit || 'kg'}, ${Number(totalVolumetricWeight.toFixed(2))}, ${Number(chargeableWeight.toFixed(2))},
      ${Number(data.declared_value || 0)}, ${data.currency || 'USD'}, ${Number(data.shipping_fee || 0)}, ${Number(data.handling_fee || 0)}, ${Number(data.insurance_fee || 0)}, ${Number(data.customs_charges || 0)}, ${Number(data.discount || 0)}, ${Number(totalCharge.toFixed(2))}, ${Number(data.amount_paid || 0)}, ${data.payment_status || 'Pending'}, ${data.payment_method || 'Bank Transfer'},
      ${data.customer_notes || null}, ${data.internal_notes || null}, ${data.assigned_staff_name || 'Staff Dispatch'}, ${data.assigned_staff_id || 'admin-01'}, ${data.created_by || 'admin@vedcourier.com'}
    )
    ON CONFLICT (id) DO UPDATE SET
      tracking_number = EXCLUDED.tracking_number,
      current_status = EXCLUDED.current_status,
      current_recorded_location = EXCLUDED.current_recorded_location,
      last_updated_at = NOW();
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
  const evtTitle = data.initial_event_title || `Shipment ${initialStatus}`;
  const evtDesc = data.initial_event_description || `Consignment registered in dispatch system with real-time tracking. Active at ${initialLocation}.`;

  await sql`
    INSERT INTO tracking_events (
      id, shipment_id, status, event_title, event_description, location_name, city, country, facility_name, is_public, created_by
    ) VALUES (
      ${evtId}, ${shipmentId}, ${initialStatus}, ${evtTitle}, ${evtDesc},
      ${data.origin_facility || data.origin_city}, ${data.origin_city}, ${data.origin_country},
      ${data.origin_facility || `${data.origin_city} Intake Facility`}, 1, ${data.created_by || 'admin@vedcourier.com'}
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  return { id: shipmentId, tracking_number: trackingNumber };
}

export async function getPostgresShipmentById(idOrTracking: string) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const raw = (idOrTracking || '').trim();
  const normalized = raw.toUpperCase().replace(/\s+/g, '-').replace(/_+/g, '-');
  if (normalized.includes('MOLESTIAS') || normalized.includes('IPSUM')) {
    return null;
  }
  const alphanumeric = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const shipments = await sql`
    SELECT * FROM shipments 
    WHERE tracking_number = ${normalized}
       OR id = ${raw}
       OR tracking_number = ${raw}
       OR REPLACE(REPLACE(UPPER(tracking_number), '-', ''), ' ', '') = ${alphanumeric}
    LIMIT 1;
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

export async function getPostgresShipments(filter?: { search?: string; status?: string; service?: string; route?: string }) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const rows = await sql`
    SELECT * FROM shipments 
    WHERE tracking_number LIKE 'VED-%'
    ORDER BY created_at DESC 
    LIMIT 250;
  `;
  if (!rows) return [];
  let results = rows.filter((s: any) => s.tracking_number && s.tracking_number.startsWith('VED-'));

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    results = results.filter((s: any) =>
      (s.tracking_number && s.tracking_number.toLowerCase().includes(q)) ||
      (s.sender_name && s.sender_name.toLowerCase().includes(q)) ||
      (s.receiver_name && s.receiver_name.toLowerCase().includes(q)) ||
      (s.shipping_route && s.shipping_route.toLowerCase().includes(q)) ||
      (s.destination_city && s.destination_city.toLowerCase().includes(q))
    );
  }
  if (filter?.status && filter.status !== 'all') {
    results = results.filter((s: any) => s.current_status && s.current_status.toLowerCase() === filter.status!.toLowerCase());
  }
  if (filter?.service && filter.service !== 'all') {
    results = results.filter((s: any) => s.service_type && s.service_type.toLowerCase() === filter.service!.toLowerCase());
  }
  if (filter?.route && filter.route !== 'all') {
    results = results.filter((s: any) => s.shipping_route && s.shipping_route.toLowerCase().includes(filter.route!.toLowerCase()));
  }
  return results;
}

export async function getPostgresDashboardMetrics() {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const rows = await sql`
    SELECT * FROM shipments 
    WHERE tracking_number LIKE 'VED-%'
    ORDER BY created_at DESC;
  `;

  const allShipments = (rows || []).filter((s: any) => s.tracking_number && s.tracking_number.startsWith('VED-'));
  const totalShipments = allShipments.length;

  const inTransit = allShipments.filter((s: any) => 
    ['In Transit', 'Departed Origin', 'Arrived at Transit Hub'].includes(s.current_status)
  ).length;

  const customs = allShipments.filter((s: any) => 
    ['Customs Clearance', 'Customs Hold', 'Customs Cleared'].includes(s.current_status)
  ).length;

  const outForDelivery = allShipments.filter((s: any) => 
    ['Out for Delivery', 'Arrived at Local Facility'].includes(s.current_status)
  ).length;

  const delivered = allShipments.filter((s: any) => 
    s.current_status === 'Delivered'
  ).length;

  const delayed = allShipments.filter((s: any) => 
    ['Delayed', 'Delivery Exception', 'Customs Hold'].includes(s.current_status)
  ).length;

  const awaitingPickup = allShipments.filter((s: any) => 
    ['Shipment Created', 'Awaiting Pickup'].includes(s.current_status)
  ).length;

  let openTickets = 0;
  try {
    const tickets = await sql`SELECT count(*)::int as count FROM support_tickets WHERE status != 'resolved' AND status != 'closed';`;
    openTickets = tickets[0]?.count || 0;
  } catch {}

  const recentShipments = allShipments.slice(0, 8);

  let recentEvents: any[] = [];
  try {
    const evts = await sql`
      SELECT e.*, s.tracking_number, s.shipping_route
      FROM tracking_events e
      JOIN shipments s ON e.shipment_id = s.id
      WHERE s.tracking_number LIKE 'VED-%'
      ORDER BY e.recorded_at DESC 
      LIMIT 6;
    `;
    recentEvents = evts || [];
  } catch {}

  return {
    totalShipments,
    inTransit,
    customs,
    outForDelivery,
    delivered,
    delayed,
    awaitingPickup,
    openTickets,
    recentShipments,
    recentEvents,
  };
}

export async function getPostgresReportsData() {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const rows = await sql`
    SELECT * FROM shipments 
    WHERE tracking_number LIKE 'VED-%';
  `;
  const all = (rows || []).filter((s: any) => s.tracking_number && s.tracking_number.startsWith('VED-'));

  const routeMap: Record<string, { count: number; total_weight: number; total_revenue: number }> = {};
  const statusMap: Record<string, number> = {};
  const serviceMap: Record<string, number> = {};
  let totalRevenue = 0;
  let totalWeight = 0;

  for (const s of all) {
    const route = s.shipping_route || 'Other Corridors';
    if (!routeMap[route]) routeMap[route] = { count: 0, total_weight: 0, total_revenue: 0 };
    routeMap[route].count += 1;
    routeMap[route].total_weight += Number(s.total_actual_weight || 0);
    routeMap[route].total_revenue += Number(s.total_charge || 0);

    const status = s.current_status || 'Unknown';
    statusMap[status] = (statusMap[status] || 0) + 1;

    const service = s.service_type || 'Standard';
    serviceMap[service] = (serviceMap[service] || 0) + 1;

    totalRevenue += Number(s.total_charge || 0);
    totalWeight += Number(s.total_actual_weight || 0);
  }

  const routeStats = Object.entries(routeMap).map(([shipping_route, data]) => ({
    shipping_route,
    count: data.count,
    total_weight: data.total_weight,
    total_revenue: data.total_revenue,
  })).sort((a, b) => b.count - a.count);

  const statusStats = Object.entries(statusMap).map(([current_status, count]) => ({
    current_status,
    count,
  })).sort((a, b) => b.count - a.count);

  const serviceStats = Object.entries(serviceMap).map(([service_type, count]) => ({
    service_type,
    count,
  })).sort((a, b) => b.count - a.count);

  return {
    routeStats,
    statusStats,
    serviceStats,
    totalRevenue,
    totalWeight,
  };
}

export async function addPostgresTrackingEvent(data: {
  shipment_id: string;
  status: string;
  event_title: string;
  event_description?: string;
  internal_note?: string;
  location_name: string;
  city?: string;
  region?: string;
  country: string;
  facility_name?: string;
  event_timestamp?: string;
  is_public?: boolean;
  created_by?: string;
}) {
  const sql = getSql();
  if (!sql) return null;
  await initPostgresDb();

  const eventId = `evt-${Date.now()}`;
  const isPub = data.is_public !== false ? 1 : 0;
  const recordedLocation = [data.location_name || data.city, data.country].filter(Boolean).join(', ');

  await sql`
    INSERT INTO tracking_events (
      id, shipment_id, status, event_title, event_description, internal_note,
      location_name, city, country, facility_name, is_public, created_by
    ) VALUES (
      ${eventId}, ${data.shipment_id}, ${data.status}, ${data.event_title},
      ${data.event_description || null}, ${data.internal_note || null},
      ${data.location_name}, ${data.city || null}, ${data.country},
      ${data.facility_name || null}, ${isPub}, ${data.created_by || 'admin@vedcourier.com'}
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  await sql`
    UPDATE shipments
    SET current_status = ${data.status},
        current_recorded_location = ${recordedLocation},
        last_updated_at = NOW()
    WHERE id = ${data.shipment_id} OR tracking_number = ${data.shipment_id};
  `;

  return eventId;
}
