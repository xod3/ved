import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

export const isPostgresConfigured = Boolean(connectionString);

export const sql = isPostgresConfigured ? neon(connectionString) : null;

let tablesInitialized = false;

export async function initPostgresDb() {
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

    // 7. Seed default admin if missing
    const profiles = await sql`SELECT count(*)::int as count FROM profiles;`;
    if (profiles[0].count === 0) {
      await sql`
        INSERT INTO profiles (id, email, password_hash, full_name, role, phone)
        VALUES ('admin-01', 'admin@vedcourier.com', 'admin123', 'Chief Operations Director', 'super_admin', '+1 (800) 592-8334');
      `;
    }

    tablesInitialized = true;
    console.log('Postgres/Neon tables initialized successfully.');
  } catch (err) {
    console.warn('Postgres table initialization notice:', err);
  }
}
