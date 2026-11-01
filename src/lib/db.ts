import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Determine writable database directory (Vercel Serverless read-only filesystem requires os.tmpdir())
function getDatabaseInstance() {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  let baseDir = path.join(process.cwd(), 'data');

  // If in Vercel or read-only filesystem, use os.tmpdir()
  if (isVercel) {
    baseDir = path.join(os.tmpdir(), 'ved_data');
  }

  if (!fs.existsSync(baseDir)) {
    try {
      fs.mkdirSync(baseDir, { recursive: true });
    } catch {
      // If mkdir in process.cwd failed due to EROFS, fallback to tmpdir
      baseDir = path.join(os.tmpdir(), 'ved_data');
      if (!fs.existsSync(baseDir)) {
        try {
          fs.mkdirSync(baseDir, { recursive: true });
        } catch {
          // ignore
        }
      }
    }
  }

  const dbPath = path.join(baseDir, 'ved_courier.db');

  try {
    const instance = new Database(dbPath);
    try {
      instance.pragma('journal_mode = WAL');
      instance.pragma('foreign_keys = ON');
    } catch {
      // In some serverless environments WAL mode is not permitted, proceed standard
    }
    return instance;
  } catch (err) {
    console.warn('Could not open file database, falling back to in-memory SQLite:', err);
    try {
      return new Database(':memory:');
    } catch (e2) {
      console.error('Fatal: better-sqlite3 failed to initialize:', e2);
      throw e2;
    }
  }
}

declare global {
  var __ved_db: any;
}

const db = global.__ved_db || (global.__ved_db = getDatabaseInstance());

// Initialize database schema
export function initDb() {
  db.exec(`
    -- Profiles / Staff / Admins
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'logistics_staff',
      phone TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Customers
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
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Shipments
    CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      tracking_number TEXT UNIQUE NOT NULL,
      internal_reference TEXT,
      booking_date TEXT NOT NULL,
      estimated_delivery_date TEXT,
      actual_delivery_date TEXT,

      -- Sender Details
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

      -- Receiver Details
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

      -- Route & Transport
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

      -- Status & Current Location
      current_status TEXT NOT NULL DEFAULT 'Shipment Created',
      current_recorded_location TEXT NOT NULL,
      last_updated_at TEXT NOT NULL DEFAULT (datetime('now')),

      -- Weights & Measures
      total_actual_weight REAL NOT NULL DEFAULT 0,
      weight_unit TEXT NOT NULL DEFAULT 'kg',
      total_volumetric_weight REAL DEFAULT 0,
      chargeable_weight REAL DEFAULT 0,

      -- Value & Billing
      declared_value REAL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      shipping_fee REAL DEFAULT 0,
      handling_fee REAL DEFAULT 0,
      insurance_fee REAL DEFAULT 0,
      customs_charges REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total_charge REAL DEFAULT 0,
      amount_paid REAL DEFAULT 0,
      payment_status TEXT NOT NULL DEFAULT 'Pending',
      payment_method TEXT DEFAULT 'Bank Transfer',

      -- Customs & Compliance
      customs_declaration_ref TEXT,
      hs_code TEXT,
      duty_status TEXT DEFAULT 'Unpaid',
      restricted_review_status TEXT DEFAULT 'Cleared',

      -- Notes
      customer_notes TEXT,
      internal_notes TEXT,

      -- Management
      assigned_staff_name TEXT,
      assigned_staff_id TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Packages in a shipment
    CREATE TABLE IF NOT EXISTS shipment_packages (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      package_reference TEXT,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      weight REAL NOT NULL,
      weight_unit TEXT NOT NULL DEFAULT 'kg',
      length REAL,
      width REAL,
      height REAL,
      dimension_unit TEXT DEFAULT 'cm',
      volumetric_weight REAL,
      package_type TEXT DEFAULT 'Box / Carton',
      declared_value REAL DEFAULT 0,
      fragile INTEGER DEFAULT 0,
      temperature_sensitive INTEGER DEFAULT 0,
      handling_instructions TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
    );

    -- Tracking events / timeline milestones (Append-only)
    CREATE TABLE IF NOT EXISTS tracking_events (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      status TEXT NOT NULL,
      event_title TEXT NOT NULL,
      event_description TEXT,
      internal_note TEXT,
      location_name TEXT NOT NULL,
      city TEXT,
      region TEXT,
      country TEXT NOT NULL,
      facility_name TEXT,
      latitude REAL,
      longitude REAL,
      event_timestamp TEXT NOT NULL,
      recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
      time_zone TEXT DEFAULT 'UTC',
      is_public INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL,
      correction_of_event_id TEXT,
      FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
    );

    -- Documents attached to shipment
    CREATE TABLE IF NOT EXISTS shipment_documents (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      document_type TEXT NOT NULL,
      title TEXT NOT NULL,
      file_path TEXT,
      file_name TEXT,
      access_level TEXT DEFAULT 'internal_only',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
    );

    -- Notifications log
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      recipient TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'email',
      subject TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'sent',
      provider_response TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
    );

    -- Support Tickets
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      tracking_number TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      priority TEXT NOT NULL DEFAULT 'normal',
      assigned_staff_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Company Settings
    CREATE TABLE IF NOT EXISTS company_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Tracking Number Sequence Counter
    CREATE TABLE IF NOT EXISTS tracking_sequence (
      year INTEGER NOT NULL,
      last_number INTEGER NOT NULL,
      PRIMARY KEY (year)
    );

    -- Indexes for high performance
    CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
    CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
    CREATE INDEX IF NOT EXISTS idx_events_shipment ON tracking_events(shipment_id);
    CREATE INDEX IF NOT EXISTS idx_packages_shipment ON shipment_packages(shipment_id);
  `);

  // Seed default company settings if not present
  const existingSettings = db.prepare('SELECT count(*) as count FROM company_settings').get() as { count: number };
  if (existingSettings.count === 0) {
    const defaultSettings = [
      ['company_name', 'VED COURIER LOGISTICS'],
      ['tagline', 'FAST • SAFE • GLOBAL'],
      ['headline', 'Your Shipment. Our Responsibility.'],
      ['support_email', 'support@vedcourier.com'],
      ['support_phone', '+1 (808) 301-0314'],
      ['whatsapp_number', '+1 (808) 301-0314'],
      ['headquarters_address', 'W 109th St, New York, NY 10025, USA'],
      ['volumetric_divisor', '5000'],
      ['default_currency', 'USD'],
      ['email_notifications_enabled', 'false'],
    ];
    const insertSetting = db.prepare('INSERT INTO company_settings (key, value) VALUES (?, ?)');
    for (const [key, value] of defaultSettings) {
      insertSetting.run(key, value);
    }
  }

  // Seed default admin accounts
  const existingProfiles = db.prepare('SELECT count(*) as count FROM profiles').get() as { count: number };
  if (existingProfiles.count === 0) {
    const insertProfile = db.prepare(`
      INSERT INTO profiles (id, email, password_hash, full_name, role, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    // Pre-seeded hashed password or simple verified auth for demo administrator
    insertProfile.run('admin-01', 'admin@vedcourier.com', 'admin123', 'Chief Operations Director', 'super_admin', '+1 (808) 301-0314');
    insertProfile.run('ops-01', 'ops@vedcourier.com', 'ops123', 'Global Dispatch Manager', 'operations_manager', '+1 (808) 301-0314');
    insertProfile.run('support-01', 'support@vedcourier.com', 'support123', 'Senior Support Officer', 'customer_support', '+1 (808) 301-0314');
  }

  // Seed realistic international shipments if empty
  const existingShipments = db.prepare('SELECT count(*) as count FROM shipments').get() as { count: number };
  if (existingShipments.count === 0) {
    seedInitialShipments();
  } else {
    try {
      db.prepare(`
        UPDATE shipments
        SET receiver_country = 'United Kingdom',
            destination_country = 'United Kingdom',
            shipping_route = REPLACE(shipping_route, 'Nigeria', 'United Kingdom'),
            receiver_city = CASE WHEN receiver_city = 'Lagos' THEN 'London' WHEN receiver_city = 'Abuja' THEN 'Manchester' WHEN receiver_city = 'Kano' THEN 'Birmingham' ELSE receiver_city END,
            destination_city = CASE WHEN destination_city = 'Lagos' THEN 'London' WHEN destination_city = 'Abuja' THEN 'Manchester' WHEN destination_city = 'Kano' THEN 'Birmingham' ELSE destination_city END,
            destination_facility = CASE WHEN destination_facility LIKE '%Murtala%' THEN 'Heathrow World Cargo Centre (LHR)' WHEN destination_facility LIKE '%Nnamdi%' THEN 'Manchester Airport World Freight Terminal (MAN)' WHEN destination_facility LIKE '%Kano%' THEN 'Birmingham Airport Cargo Terminal (BHX)' ELSE destination_facility END
        WHERE destination_country = 'Nigeria' OR receiver_country = 'Nigeria'
      `).run();

      db.prepare(`
        UPDATE tracking_events
        SET country = 'United Kingdom',
            city = CASE WHEN city = 'Lagos' THEN 'London' WHEN city = 'Abuja' THEN 'Manchester' ELSE city END,
            event_title = REPLACE(event_title, 'Nigeria', 'United Kingdom'),
            event_description = REPLACE(REPLACE(event_description, 'Nigeria', 'United Kingdom'), 'Lagos', 'London')
        WHERE country = 'Nigeria'
      `).run();
    } catch (migErr) {
      console.warn('SQLite country migration notice:', migErr);
    }
  }
}

function seedInitialShipments() {
  const currentYear = new Date().getFullYear();
  db.prepare(`INSERT OR REPLACE INTO tracking_sequence (year, last_number) VALUES (?, ?)`).run(currentYear, 104);

  // 1. United States -> China
  const s1 = {
    id: 'ship-001',
    tracking_number: `VED-${currentYear}-000101`,
    internal_reference: 'REF-USCN-8821',
    booking_date: '2026-10-24 09:30:00',
    estimated_delivery_date: '2026-10-31',
    sender_name: 'Apex Precision Technologies Inc.',
    sender_company: 'Apex Precision Technologies Inc.',
    sender_email: 'logistics@apexprecision.com',
    sender_phone: '+1 (212) 555-0199',
    sender_country: 'United States',
    sender_state: 'New York',
    sender_city: 'New York',
    sender_postal_code: '10001',
    sender_street: '450 West 33rd Street, Floor 14',
    receiver_name: 'Shanghai Semiconductor Systems Ltd.',
    receiver_company: 'Shanghai Semiconductor Systems Ltd.',
    receiver_email: 'receiving@shanghaisemi.cn',
    receiver_phone: '+86 21 6888 2300',
    receiver_country: 'China',
    receiver_state: 'Shanghai',
    receiver_city: 'Shanghai',
    receiver_postal_code: '200120',
    receiver_street: 'Building 8, Zhangjiang Hi-Tech Park, Pudong New Area',
    delivery_instructions: 'Deliver to Cleanroom Receiving Bay C. Notify Mr. Wei upon arrival.',
    origin_country: 'United States',
    origin_city: 'New York',
    origin_facility: 'JFK Air Freight Cargo Terminal 4',
    destination_country: 'China',
    destination_city: 'Shanghai',
    destination_facility: 'Shanghai Pudong Airport Customs Logistics Center',
    transit_hubs: 'Anchorage International Cargo Gateway (ANC)',
    shipping_route: 'United States → China',
    transport_mode: 'Air Freight',
    service_type: 'Priority Air Express',
    carrier_partner: 'VED Global Air Charter',
    flight_vessel_reference: 'VED-Flight 941',
    current_status: 'Customs Cleared',
    current_recorded_location: 'Shanghai Pudong International Hub, China',
    last_updated_at: '2026-10-28 14:15:00',
    total_actual_weight: 42.5,
    weight_unit: 'kg',
    total_volumetric_weight: 48.0,
    chargeable_weight: 48.0,
    declared_value: 18500.00,
    currency: 'USD',
    shipping_fee: 1420.00,
    handling_fee: 150.00,
    insurance_fee: 220.00,
    customs_charges: 180.00,
    discount: 50.00,
    total_charge: 1920.00,
    amount_paid: 1920.00,
    payment_status: 'Paid',
    payment_method: 'Corporate Wire Transfer',
    customs_declaration_ref: 'DEC-CN-2026-9031',
    hs_code: '8471.80.10',
    duty_status: 'Cleared',
    restricted_review_status: 'Compliant & Verified',
    customer_notes: 'High-value precision sensors. Maintain shock absorbers.',
    internal_notes: 'Priority handling approved by Director. Direct customs clearance requested.',
    assigned_staff_name: 'Chief Operations Director',
    assigned_staff_id: 'admin-01',
    created_by: 'admin@vedcourier.com',
  };

  insertShipmentWithDetails(s1, [
    {
      id: 'pkg-001-1',
      description: 'Optoelectronic Sensor Assemblies (Crated)',
      quantity: 2,
      weight: 22.5,
      weight_unit: 'kg',
      length: 60,
      width: 50,
      height: 40,
      dimension_unit: 'cm',
      volumetric_weight: 24.0,
      package_type: 'Heavy-Duty Reinforced Crate',
      declared_value: 10500,
      fragile: 1,
      handling_instructions: 'Fragile: Keep upright. Do not stack higher than 2 units.',
    },
    {
      id: 'pkg-001-2',
      description: 'Micro-controller Testing Modules',
      quantity: 1,
      weight: 20.0,
      weight_unit: 'kg',
      length: 60,
      width: 50,
      height: 40,
      dimension_unit: 'cm',
      volumetric_weight: 24.0,
      package_type: 'Anti-Static Foam Sealed Carton',
      declared_value: 8000,
      fragile: 1,
      handling_instructions: 'Handle with extreme care.',
    }
  ], [
    {
      id: 'evt-101-1',
      status: 'Shipment Created',
      event_title: 'Shipment Order Created & Electronic Documentation Received',
      event_description: 'Shipping label and export documentation generated. Awaiting parcel intake.',
      location_name: 'JFK Air Freight Cargo Terminal 4',
      city: 'New York',
      region: 'NY',
      country: 'United States',
      facility_name: 'VED JFK Logistics Center',
      event_timestamp: '2026-10-24 09:30:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-101-2',
      status: 'Picked Up',
      event_title: 'Parcel Collected from Shipper Facility',
      event_description: 'VED Courier collection team picked up 2 crates from Apex Precision Technologies.',
      location_name: 'Manhattan Dispatch Hub',
      city: 'New York',
      region: 'NY',
      country: 'United States',
      facility_name: 'Manhattan Central Depot',
      event_timestamp: '2026-10-24 14:10:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-101-3',
      status: 'Received at Origin Facility',
      event_title: 'Security Screened and Weighed at Export Terminal',
      event_description: 'Packages inspected, X-ray scanned, and weighed. Export manifest prepared.',
      location_name: 'JFK Cargo Facility',
      city: 'New York',
      region: 'NY',
      country: 'United States',
      facility_name: 'VED Transatlantic Air Hub',
      event_timestamp: '2026-10-25 04:45:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-101-4',
      status: 'Departed Origin',
      event_title: 'Departed Origin Gateway on Scheduled Cargo Flight',
      event_description: 'Flight VED-Flight 941 departed JFK en route to Pacific transshipment gateway.',
      location_name: 'John F. Kennedy International Airport',
      city: 'New York',
      region: 'NY',
      country: 'United States',
      facility_name: 'Runway Cargo Bay 12',
      event_timestamp: '2026-10-25 18:20:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-101-5',
      status: 'Arrived at Transit Hub',
      event_title: 'Transferred at Anchorage Cargo Gateway',
      event_description: 'Aircraft refueled and sorting completed for Asia-Pacific transit line.',
      location_name: 'Ted Stevens Anchorage International Hub',
      city: 'Anchorage',
      region: 'AK',
      country: 'United States',
      facility_name: 'Pacific North Gateway',
      event_timestamp: '2026-10-26 11:30:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-101-6',
      status: 'Arrived at Destination Country',
      event_title: 'Arrived at Shanghai Pudong International Airport',
      event_description: 'Cargo vessel landed. Transferred to Shanghai Customs bonded facility.',
      location_name: 'Shanghai Pudong Airport',
      city: 'Shanghai',
      region: 'Shanghai',
      country: 'China',
      facility_name: 'PVG Bonded Cargo Center',
      event_timestamp: '2026-10-27 20:00:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-101-7',
      status: 'Customs Cleared',
      event_title: 'China Customs Inspection Completed & Released',
      event_description: 'Customs declaration DEC-CN-2026-9031 verified and cleared. Dispatched to local sorting facility.',
      location_name: 'Shanghai Pudong International Hub',
      city: 'Shanghai',
      region: 'Shanghai',
      country: 'China',
      facility_name: 'VED Eastern China Central Depot',
      event_timestamp: '2026-10-28 14:15:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    }
  ]);

  // 2. China -> United Kingdom (Guangzhou -> London)
  const s2 = {
    id: 'ship-002',
    tracking_number: `VED-${currentYear}-000102`,
    internal_reference: 'REF-CNUK-4109',
    booking_date: '2026-10-22 11:00:00',
    estimated_delivery_date: '2026-11-02',
    sender_name: 'Guangdong Electronic Wholesale Co.',
    sender_company: 'Guangdong Electronic Wholesale Co.',
    sender_email: 'export@gdelectronic.com',
    sender_phone: '+86 20 8123 4567',
    sender_country: 'China',
    sender_state: 'Guangdong',
    sender_city: 'Guangzhou',
    sender_postal_code: '510000',
    sender_street: '88 Huanshi East Road, Yuexiu District',
    receiver_name: 'Arthur Pemberton',
    receiver_company: 'Meridian Tech Distribution Ltd',
    receiver_email: 'apemberton@meridiantech.co.uk',
    receiver_phone: '+44 20 7946 0192',
    receiver_country: 'United Kingdom',
    receiver_state: 'Greater London',
    receiver_city: 'London',
    receiver_postal_code: 'EC1A 1BB',
    receiver_street: '14 High Holborn, Camden',
    delivery_instructions: 'Call receiver 2 hours prior to scheduled delivery. Require photo ID.',
    origin_country: 'China',
    origin_city: 'Guangzhou',
    origin_facility: 'Guangzhou Baiyun Freight Terminal',
    destination_country: 'United Kingdom',
    destination_city: 'London',
    destination_facility: 'Heathrow World Cargo Centre (LHR), London',
    transit_hubs: 'Dubai International Air Cargo Hub (DXB)',
    shipping_route: 'China → United Kingdom',
    transport_mode: 'Air Freight',
    service_type: 'Express Courier',
    carrier_partner: 'VED Europe Freight Network',
    flight_vessel_reference: 'VED-Air 332',
    current_status: 'In Transit',
    current_recorded_location: 'Dubai Cargo Logistics Terminal 2, UAE',
    last_updated_at: '2026-10-28 08:40:00',
    total_actual_weight: 85.0,
    weight_unit: 'kg',
    total_volumetric_weight: 92.0,
    chargeable_weight: 92.0,
    declared_value: 9400.00,
    currency: 'USD',
    shipping_fee: 1150.00,
    handling_fee: 120.00,
    insurance_fee: 140.00,
    customs_charges: 95.00,
    discount: 0,
    total_charge: 1505.00,
    amount_paid: 1505.00,
    payment_status: 'Paid',
    payment_method: 'Credit Card',
    customs_declaration_ref: 'DEC-GB-5520',
    hs_code: '8517.62.00',
    duty_status: 'Assessment in Progress',
    restricted_review_status: 'Approved',
    customer_notes: 'Commercial telecom components.',
    internal_notes: 'London Heathrow express clearance agent notified.',
    assigned_staff_name: 'Global Dispatch Manager',
    assigned_staff_id: 'ops-01',
    created_by: 'ops@vedcourier.com',
  };

  insertShipmentWithDetails(s2, [
    {
      id: 'pkg-002-1',
      description: 'Telecommunications Networking Routers & Adapters',
      quantity: 4,
      weight: 85.0,
      weight_unit: 'kg',
      length: 80,
      width: 60,
      height: 50,
      dimension_unit: 'cm',
      volumetric_weight: 48.0,
      package_type: 'Cartons on Pallet',
      declared_value: 9400,
      fragile: 0,
      handling_instructions: 'Keep dry. Do not expose to moisture.',
    }
  ], [
    {
      id: 'evt-102-1',
      status: 'Shipment Created',
      event_title: 'Shipment Booked at Guangzhou Logistics Office',
      event_description: 'Consignment booked for priority air express to London Heathrow, United Kingdom.',
      location_name: 'Guangzhou International Cargo Hub',
      city: 'Guangzhou',
      region: 'Guangdong',
      country: 'China',
      facility_name: 'VED South China Processing Center',
      event_timestamp: '2026-10-22 11:00:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-102-2',
      status: 'Departed Origin',
      event_title: 'Departed Guangzhou Baiyun International Airport',
      event_description: 'Freight loaded onto flight VED-Air 332 departing for Dubai transshipment.',
      location_name: 'Guangzhou Baiyun Airport',
      city: 'Guangzhou',
      region: 'Guangdong',
      country: 'China',
      facility_name: 'CAN Cargo Terminal',
      event_timestamp: '2026-10-24 16:30:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-102-3',
      status: 'In Transit',
      event_title: 'In Transit: Sorting at Dubai Cargo Gateway',
      event_description: 'Transferred to Dubai intercontinental sorting depot. Preparing connecting cargo flight to London Heathrow.',
      location_name: 'Dubai Cargo Logistics Terminal 2',
      city: 'Dubai',
      region: 'Dubai',
      country: 'United Arab Emirates',
      facility_name: 'DXB Global Cargo Center',
      event_timestamp: '2026-10-28 08:40:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    }
  ]);

  // 3. United States -> United Kingdom (Los Angeles -> Manchester)
  const s3 = {
    id: 'ship-003',
    tracking_number: `VED-${currentYear}-000103`,
    internal_reference: 'REF-USUK-7740',
    booking_date: '2026-10-20 10:00:00',
    estimated_delivery_date: '2026-10-29',
    sender_name: 'California Medical Equipment Corp',
    sender_company: 'California Medical Equipment Corp',
    sender_email: 'dispatch@calmedcorp.com',
    sender_phone: '+1 (310) 555-7822',
    sender_country: 'United States',
    sender_state: 'California',
    sender_city: 'Los Angeles',
    sender_postal_code: '90045',
    sender_street: '5757 Century Boulevard, Suite 300',
    receiver_name: 'Manchester Specialist Clinic & Diagnostics',
    receiver_company: 'Manchester Specialist Health Trust',
    receiver_email: 'procurement@manchesterclinic.nhs.uk',
    receiver_phone: '+44 161 496 0321',
    receiver_country: 'United Kingdom',
    receiver_state: 'Greater Manchester',
    receiver_city: 'Manchester',
    receiver_postal_code: 'M13 9PL',
    receiver_street: 'Unit 4, Oxford Road Health Park',
    delivery_instructions: 'Medical supplies: Deliver directly to Central Pharmacy Receiving Department.',
    origin_country: 'United States',
    origin_city: 'Los Angeles',
    origin_facility: 'LAX International Cargo Depot',
    destination_country: 'United Kingdom',
    destination_city: 'Manchester',
    destination_facility: 'Manchester Airport World Freight Terminal (MAN)',
    transit_hubs: 'London Heathrow (LHR) / Manchester (MAN)',
    shipping_route: 'United States → United Kingdom',
    transport_mode: 'Air Freight',
    service_type: 'Priority Air Express',
    carrier_partner: 'VED Global Medical Logistics',
    flight_vessel_reference: 'VED-Med Express 10',
    current_status: 'Out for Delivery',
    current_recorded_location: 'VED Manchester Central Distribution Depot, Manchester, United Kingdom',
    last_updated_at: '2026-10-29 07:15:00',
    total_actual_weight: 15.2,
    weight_unit: 'kg',
    total_volumetric_weight: 18.0,
    chargeable_weight: 18.0,
    declared_value: 12500.00,
    currency: 'USD',
    shipping_fee: 680.00,
    handling_fee: 90.00,
    insurance_fee: 150.00,
    customs_charges: 80.00,
    discount: 0,
    total_charge: 1000.00,
    amount_paid: 1000.00,
    payment_status: 'Paid',
    payment_method: 'Corporate Account',
    customs_declaration_ref: 'MED-EXP-2026-44',
    hs_code: '9018.90.00',
    duty_status: 'Exempt / Cleared',
    restricted_review_status: 'Certified Medical Goods',
    customer_notes: 'Diagnostic ultrasound probes and sterile accessories.',
    internal_notes: 'Urgent medical delivery; courier dispatched with van #MAN-04.',
    assigned_staff_name: 'Chief Operations Director',
    assigned_staff_id: 'admin-01',
    created_by: 'admin@vedcourier.com',
  };

  insertShipmentWithDetails(s3, [
    {
      id: 'pkg-003-1',
      description: 'Ultrasonic Diagnostic Transducers and Accessories',
      quantity: 1,
      weight: 15.2,
      weight_unit: 'kg',
      length: 50,
      width: 45,
      height: 40,
      dimension_unit: 'cm',
      volumetric_weight: 18.0,
      package_type: 'Padded Shock-Proof Travel Case',
      declared_value: 12500,
      fragile: 1,
      handling_instructions: 'Handle with extreme care. Temperature range 10-25C.',
    }
  ], [
    {
      id: 'evt-103-1',
      status: 'Shipment Created',
      event_title: 'Shipment Manifest Created in Los Angeles',
      event_description: 'Priority medical booking confirmed. Barcode labels generated.',
      location_name: 'LAX Air Cargo Facility',
      city: 'Los Angeles',
      region: 'CA',
      country: 'United States',
      facility_name: 'VED Pacific Coast Hub',
      event_timestamp: '2026-10-20 10:00:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-103-2',
      status: 'Departed Origin',
      event_title: 'Departed Los Angeles International Airport',
      event_description: 'Dispatched on priority cargo route.',
      location_name: 'Los Angeles International Airport',
      city: 'Los Angeles',
      region: 'CA',
      country: 'United States',
      facility_name: 'Runway 24L Cargo',
      event_timestamp: '2026-10-21 21:00:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-103-3',
      status: 'Arrived at Destination Country',
      event_title: 'Arrived in United Kingdom at Heathrow Gateway',
      event_description: 'Landed at Heathrow Cargo Terminal. Transferring to domestic linehaul connection to Manchester.',
      location_name: 'London Heathrow International Airport',
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      facility_name: 'Heathrow Inter-City Logistics Depot',
      event_timestamp: '2026-10-25 15:40:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-103-4',
      status: 'Customs Cleared',
      event_title: 'Customs Clearance Completed',
      event_description: 'Special medical expediting approved by UK Border Force. Package handed over to VED Courier Manchester fleet.',
      location_name: 'Manchester Airport World Freight Wing',
      city: 'Manchester',
      region: 'Greater Manchester',
      country: 'United Kingdom',
      facility_name: 'Manchester Regional Cargo Bay',
      event_timestamp: '2026-10-28 16:20:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-103-5',
      status: 'Out for Delivery',
      event_title: 'Out for Delivery with VED Courier Driver',
      event_description: 'Assigned to Courier Vehicle MAN-04 for direct hospital delivery.',
      location_name: 'VED Manchester Central Distribution Depot',
      city: 'Manchester',
      region: 'Greater Manchester',
      country: 'United Kingdom',
      facility_name: 'Manchester Central Fleet Hub',
      event_timestamp: '2026-10-29 07:15:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    }
  ]);

  // 4. South Korea -> United States (Incheon -> Chicago)
  const s4 = {
    id: 'ship-004',
    tracking_number: `VED-${currentYear}-000104`,
    internal_reference: 'REF-KRUS-1092',
    booking_date: '2026-10-18 08:30:00',
    estimated_delivery_date: '2026-10-24',
    actual_delivery_date: '2026-10-24 15:45:00',
    sender_name: 'Seoul Advanced Robotics Ltd.',
    sender_company: 'Seoul Advanced Robotics Ltd.',
    sender_email: 'shipping@seoulrobotics.kr',
    sender_phone: '+82 2 3456 7890',
    sender_country: 'South Korea',
    sender_state: 'Seoul',
    sender_city: 'Seoul',
    sender_postal_code: '06236',
    sender_street: '152 Teheran-ro, Gangnam-gu',
    receiver_name: 'Midwest Automation Labs',
    receiver_company: 'Midwest Automation Labs',
    receiver_email: 'receiving@midwestauto.com',
    receiver_phone: '+1 (312) 555-4421',
    receiver_country: 'United States',
    receiver_state: 'Illinois',
    receiver_city: 'Chicago',
    receiver_postal_code: '60607',
    receiver_street: '850 W Jackson Blvd, Suite 200',
    delivery_instructions: 'Sign on delivery. Loading dock accessible from rear alley.',
    origin_country: 'South Korea',
    origin_city: 'Incheon',
    origin_facility: 'Incheon International Cargo Terminal (ICN)',
    destination_country: 'United States',
    destination_city: 'Chicago',
    destination_facility: 'O\'Hare International Airport Cargo Complex',
    transit_hubs: 'Tokyo Haneda (HND) / Seattle (SEA)',
    shipping_route: 'South Korea → United States',
    transport_mode: 'Air Freight',
    service_type: 'Door-to-Door Special',
    carrier_partner: 'VED Trans-Pacific Express',
    flight_vessel_reference: 'VED-Flight 118',
    current_status: 'Delivered',
    current_recorded_location: 'Delivered to Midwest Automation Labs, Chicago, IL, USA',
    last_updated_at: '2026-10-24 15:45:00',
    total_actual_weight: 35.0,
    weight_unit: 'kg',
    total_volumetric_weight: 38.0,
    chargeable_weight: 38.0,
    declared_value: 24000.00,
    currency: 'USD',
    shipping_fee: 1250.00,
    handling_fee: 100.00,
    insurance_fee: 300.00,
    customs_charges: 120.00,
    discount: 50.00,
    total_charge: 1720.00,
    amount_paid: 1720.00,
    payment_status: 'Paid',
    payment_method: 'Corporate Credit',
    customs_declaration_ref: 'DEC-US-9801',
    hs_code: '8479.50.00',
    duty_status: 'Paid',
    restricted_review_status: 'Cleared',
    customer_notes: 'Industrial robotic servos and controllers.',
    internal_notes: 'Delivery completed. Signed by warehouse manager Dave Peterson.',
    assigned_staff_name: 'Chief Operations Director',
    assigned_staff_id: 'admin-01',
    created_by: 'admin@vedcourier.com',
  };

  insertShipmentWithDetails(s4, [
    {
      id: 'pkg-004-1',
      description: 'Precision Robotic Servo Motors & Controllers',
      quantity: 3,
      weight: 35.0,
      weight_unit: 'kg',
      length: 70,
      width: 50,
      height: 40,
      dimension_unit: 'cm',
      volumetric_weight: 28.0,
      package_type: 'Plywood Wooden Crate',
      declared_value: 24000,
      fragile: 1,
      handling_instructions: 'Keep dry. Do not drop.',
    }
  ], [
    {
      id: 'evt-104-1',
      status: 'Shipment Created',
      event_title: 'Shipment Registered at Seoul Hub',
      event_description: 'Consignment packaged and booked for Chicago, USA.',
      location_name: 'Seoul Gangnam Logistics Center',
      city: 'Seoul',
      region: 'Seoul',
      country: 'South Korea',
      facility_name: 'VED Korea Central Terminal',
      event_timestamp: '2026-10-18 08:30:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-104-2',
      status: 'Departed Origin',
      event_title: 'Departed Incheon International Airport',
      event_description: 'Cleared Korea export control and boarded transpacific cargo aircraft.',
      location_name: 'Incheon International Airport',
      city: 'Incheon',
      region: 'Gyeonggi',
      country: 'South Korea',
      facility_name: 'ICN Terminal 2 Cargo',
      event_timestamp: '2026-10-19 22:15:00',
      is_public: 1,
      created_by: 'ops@vedcourier.com',
    },
    {
      id: 'evt-104-3',
      status: 'Customs Cleared',
      event_title: 'US Customs and Border Protection Release',
      event_description: 'Cleared through US Customs at Chicago O\'Hare entry gateway.',
      location_name: 'Chicago O\'Hare Airport',
      city: 'Chicago',
      region: 'IL',
      country: 'United States',
      facility_name: 'ORD Customs Inspection Depot',
      event_timestamp: '2026-10-23 11:20:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    },
    {
      id: 'evt-104-4',
      status: 'Delivered',
      event_title: 'Successfully Delivered and Signed For',
      event_description: 'Package delivered in good condition to Midwest Automation Labs. Signed by: Dave Peterson.',
      location_name: '850 W Jackson Blvd',
      city: 'Chicago',
      region: 'IL',
      country: 'United States',
      facility_name: 'Recipient Facility Loading Dock',
      event_timestamp: '2026-10-24 15:45:00',
      is_public: 1,
      created_by: 'admin@vedcourier.com',
    }
  ]);

  // Seed initial support tickets
  const insertTicket = db.prepare(`
    INSERT INTO support_tickets (id, ticket_number, name, email, phone, tracking_number, subject, message, status, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertTicket.run(
    'tkt-001',
    'TKT-2026-1001',
    'Michael Roberts',
    'mroberts@apexprecision.com',
    '+1 (212) 555-0199',
    `VED-${currentYear}-000101`,
    'Customs clearance document verification',
    'Hello, could you confirm if Shanghai customs requires an additional commercial invoice copy?',
    'resolved',
    'normal'
  );
  insertTicket.run(
    'tkt-002',
    'TKT-2026-1002',
    'Eleanor Davies',
    'eleanor.davies@manchesterclinic.nhs.uk',
    '+44 161 496 0321',
    `VED-${currentYear}-000103`,
    'Delivery window inquiry for Manchester Clinic',
    'Please advise estimated hour for courier arrival at Central Hospital receiving dock.',
    'in_review',
    'high'
  );
}

function insertShipmentWithDetails(shipment: any, packages: any[], events: any[]) {
  const insertS = db.prepare(`
    INSERT INTO shipments (
      id, tracking_number, internal_reference, booking_date, estimated_delivery_date, actual_delivery_date,
      sender_name, sender_company, sender_email, sender_phone, sender_country, sender_state, sender_city, sender_postal_code, sender_street, sender_pickup_address,
      receiver_name, receiver_company, receiver_email, receiver_phone, receiver_country, receiver_state, receiver_city, receiver_postal_code, receiver_street, delivery_instructions,
      origin_country, origin_city, origin_facility, destination_country, destination_city, destination_facility, transit_hubs, shipping_route, transport_mode, service_type, carrier_partner, flight_vessel_reference,
      current_status, current_recorded_location, last_updated_at,
      total_actual_weight, weight_unit, total_volumetric_weight, chargeable_weight,
      declared_value, currency, shipping_fee, handling_fee, insurance_fee, customs_charges, discount, total_charge, amount_paid, payment_status, payment_method,
      customs_declaration_ref, hs_code, duty_status, restricted_review_status,
      customer_notes, internal_notes,
      assigned_staff_name, assigned_staff_id, created_by
    ) VALUES (
      @id, @tracking_number, @internal_reference, @booking_date, @estimated_delivery_date, @actual_delivery_date,
      @sender_name, @sender_company, @sender_email, @sender_phone, @sender_country, @sender_state, @sender_city, @sender_postal_code, @sender_street, @sender_pickup_address,
      @receiver_name, @receiver_company, @receiver_email, @receiver_phone, @receiver_country, @receiver_state, @receiver_city, @receiver_postal_code, @receiver_street, @delivery_instructions,
      @origin_country, @origin_city, @origin_facility, @destination_country, @destination_city, @destination_facility, @transit_hubs, @shipping_route, @transport_mode, @service_type, @carrier_partner, @flight_vessel_reference,
      @current_status, @current_recorded_location, @last_updated_at,
      @total_actual_weight, @weight_unit, @total_volumetric_weight, @chargeable_weight,
      @declared_value, @currency, @shipping_fee, @handling_fee, @insurance_fee, @customs_charges, @discount, @total_charge, @amount_paid, @payment_status, @payment_method,
      @customs_declaration_ref, @hs_code, @duty_status, @restricted_review_status,
      @customer_notes, @internal_notes,
      @assigned_staff_name, @assigned_staff_id, @created_by
    )
  `);

  insertS.run({
    actual_delivery_date: null,
    internal_reference: null,
    transit_hubs: null,
    carrier_partner: null,
    flight_vessel_reference: null,
    customs_declaration_ref: null,
    hs_code: null,
    customer_notes: null,
    internal_notes: null,
    sender_company: null,
    sender_email: null,
    sender_phone: null,
    sender_state: null,
    sender_postal_code: null,
    sender_pickup_address: null,
    receiver_company: null,
    receiver_email: null,
    receiver_phone: null,
    receiver_state: null,
    receiver_postal_code: null,
    delivery_instructions: null,
    origin_facility: null,
    destination_facility: null,
    assigned_staff_name: null,
    assigned_staff_id: null,
    ...shipment
  });

  const insertP = db.prepare(`
    INSERT INTO shipment_packages (
      id, shipment_id, package_reference, description, quantity, weight, weight_unit, length, width, height, dimension_unit, volumetric_weight, package_type, declared_value, fragile, handling_instructions
    ) VALUES (
      @id, @shipment_id, @package_reference, @description, @quantity, @weight, @weight_unit, @length, @width, @height, @dimension_unit, @volumetric_weight, @package_type, @declared_value, @fragile, @handling_instructions
    )
  `);

  for (const pkg of packages) {
    insertP.run({
      ...pkg,
      shipment_id: shipment.id,
      package_reference: pkg.package_reference || pkg.id,
    });
  }

  const insertE = db.prepare(`
    INSERT INTO tracking_events (
      id, shipment_id, status, event_title, event_description, internal_note, location_name, city, region, country, facility_name, latitude, longitude, event_timestamp, recorded_at, is_public, created_by
    ) VALUES (
      @id, @shipment_id, @status, @event_title, @event_description, @internal_note, @location_name, @city, @region, @country, @facility_name, @latitude, @longitude, @event_timestamp, datetime('now'), @is_public, @created_by
    )
  `);

  for (const evt of events) {
    insertE.run({
      internal_note: null,
      latitude: null,
      longitude: null,
      ...evt,
      shipment_id: shipment.id,
    });
  }
}

// Generate sequential, unguessable, atomic tracking number: VED-2026-000105
export function generateNextTrackingNumber(): string {
  initDb();
  const year = new Date().getFullYear();
  const tx = db.transaction(() => {
    let row = db.prepare('SELECT last_number FROM tracking_sequence WHERE year = ?').get(year) as { last_number: number } | undefined;
    let nextNum = 101;
    if (row) {
      nextNum = row.last_number + 1;
      db.prepare('UPDATE tracking_sequence SET last_number = ? WHERE year = ?').run(nextNum, year);
    } else {
      db.prepare('INSERT INTO tracking_sequence (year, last_number) VALUES (?, ?)').run(year, nextNum);
    }
    const padded = String(nextNum).padStart(6, '0');
    return `VED-${year}-${padded}`;
  });

  return tx();
}

// Helper query functions
export function getShipments(params?: {
  search?: string;
  status?: string;
  service?: string;
  route?: string;
  limit?: number;
  offset?: number;
}) {
  initDb();
  let query = 'SELECT * FROM shipments WHERE 1=1';
  const queryParams: any[] = [];

  if (params?.search) {
    const s = `%${params.search.trim()}%`;
    query += ` AND (
      tracking_number LIKE ? OR
      sender_name LIKE ? OR
      receiver_name LIKE ? OR
      sender_city LIKE ? OR
      receiver_city LIKE ? OR
      internal_reference LIKE ?
    )`;
    queryParams.push(s, s, s, s, s, s);
  }

  if (params?.status && params.status !== 'all') {
    query += ' AND current_status = ?';
    queryParams.push(params.status);
  }

  if (params?.service && params.service !== 'all') {
    query += ' AND service_type = ?';
    queryParams.push(params.service);
  }

  if (params?.route && params.route !== 'all') {
    query += ' AND shipping_route = ?';
    queryParams.push(params.route);
  }

  query += ' ORDER BY datetime(booking_date) DESC, created_at DESC';

  if (params?.limit) {
    query += ' LIMIT ?';
    queryParams.push(params.limit);
    if (params?.offset) {
      query += ' OFFSET ?';
      queryParams.push(params.offset);
    }
  }

  return db.prepare(query).all(...queryParams);
}

export function getShipmentByTrackingNumber(trackingNumber: string) {
  initDb();
  const raw = (trackingNumber || '').trim();
  const normalized = raw.toUpperCase().replace(/\s+/g, '-').replace(/_+/g, '-');
  const alphanumeric = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

  let shipment = db.prepare(`
    SELECT * FROM shipments 
    WHERE tracking_number = ? 
       OR id = ?
       OR tracking_number = ?
       OR replace(replace(upper(tracking_number), '-', ''), ' ', '') = ?
    LIMIT 1
  `).get(normalized, raw, raw, alphanumeric) as any;

  if (!shipment) return null;

  const packages = db.prepare('SELECT * FROM shipment_packages WHERE shipment_id = ?').all(shipment.id);
  const events = db.prepare('SELECT * FROM tracking_events WHERE shipment_id = ? AND is_public = 1 ORDER BY datetime(event_timestamp) ASC').all(shipment.id);

  return {
    ...shipment,
    packages,
    events,
  };
}

export function getShipmentById(id: string) {
  initDb();
  let shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id) as any;
  if (!shipment) {
    shipment = db.prepare('SELECT * FROM shipments WHERE tracking_number = ?').get(id) as any;
  }
  if (!shipment) return null;

  const packages = db.prepare('SELECT * FROM shipment_packages WHERE shipment_id = ?').all(shipment.id);
  const events = db.prepare('SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY datetime(event_timestamp) ASC').all(shipment.id);
  const documents = db.prepare('SELECT * FROM shipment_documents WHERE shipment_id = ?').all(shipment.id);

  return {
    ...shipment,
    packages,
    events,
    documents,
  };
}

export function createShipment(data: any, packages: any[]) {
  initDb();
  const trackingNumber = data.tracking_number || generateNextTrackingNumber();
  const shipmentId = data.id || `ship-${Date.now()}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Calculate totals
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

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO shipments (
        id, tracking_number, internal_reference, booking_date, estimated_delivery_date,
        sender_name, sender_company, sender_email, sender_phone, sender_country, sender_state, sender_city, sender_postal_code, sender_street, sender_pickup_address,
        receiver_name, receiver_company, receiver_email, receiver_phone, receiver_country, receiver_state, receiver_city, receiver_postal_code, receiver_street, delivery_instructions,
        origin_country, origin_city, origin_facility, destination_country, destination_city, destination_facility, transit_hubs, shipping_route, transport_mode, service_type, carrier_partner, flight_vessel_reference,
        current_status, current_recorded_location, last_updated_at,
        total_actual_weight, weight_unit, total_volumetric_weight, chargeable_weight,
        declared_value, currency, shipping_fee, handling_fee, insurance_fee, customs_charges, discount, total_charge, amount_paid, payment_status, payment_method,
        customs_declaration_ref, hs_code, duty_status, restricted_review_status,
        customer_notes, internal_notes,
        assigned_staff_name, assigned_staff_id, created_by
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?
      )
    `).run(
      shipmentId,
      trackingNumber,
      data.internal_reference || null,
      data.booking_date || now,
      data.estimated_delivery_date || null,
      data.sender_name,
      data.sender_company || null,
      data.sender_email || null,
      data.sender_phone || null,
      data.sender_country,
      data.sender_state || null,
      data.sender_city,
      data.sender_postal_code || null,
      data.sender_street,
      data.sender_pickup_address || null,
      data.receiver_name,
      data.receiver_company || null,
      data.receiver_email || null,
      data.receiver_phone || null,
      data.receiver_country,
      data.receiver_state || null,
      data.receiver_city,
      data.receiver_postal_code || null,
      data.receiver_street,
      data.delivery_instructions || null,
      data.origin_country,
      data.origin_city,
      data.origin_facility || `${data.origin_city} Logistics Hub`,
      data.destination_country,
      data.destination_city,
      data.destination_facility || `${data.destination_city} Central Delivery Depot`,
      data.transit_hubs || null,
      data.shipping_route || `${data.origin_country} → ${data.destination_country}`,
      data.transport_mode || 'Air Freight',
      data.service_type || 'Express Courier',
      data.carrier_partner || 'VED Courier Global Line',
      data.flight_vessel_reference || null,
      'Shipment Created',
      `${data.origin_facility || data.origin_city}, ${data.origin_country}`,
      now,
      totalActualWeight,
      data.weight_unit || 'kg',
      Number(totalVolumetricWeight.toFixed(2)),
      Number(chargeableWeight.toFixed(2)),
      Number(data.declared_value || 0),
      data.currency || 'USD',
      Number(data.shipping_fee || 0),
      Number(data.handling_fee || 0),
      Number(data.insurance_fee || 0),
      Number(data.customs_charges || 0),
      Number(data.discount || 0),
      Number(totalCharge.toFixed(2)),
      Number(data.amount_paid || 0),
      data.payment_status || 'Pending',
      data.payment_method || 'Bank Transfer',
      data.customs_declaration_ref || null,
      data.hs_code || null,
      data.duty_status || 'Unpaid',
      data.restricted_review_status || 'Cleared',
      data.customer_notes || null,
      data.internal_notes || null,
      data.assigned_staff_name || 'Staff Dispatch',
      data.assigned_staff_id || 'admin-01',
      data.created_by || 'admin@vedcourier.com'
    );

    // Insert packages
    const insertPkg = db.prepare(`
      INSERT INTO shipment_packages (
        id, shipment_id, package_reference, description, quantity, weight, weight_unit, length, width, height, dimension_unit, volumetric_weight, package_type, declared_value, fragile, handling_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let pkgIndex = 1;
    for (const pkg of packages) {
      const pkgId = `pkg-${Date.now()}-${pkgIndex}`;
      const vol = (pkg.length && pkg.width && pkg.height) ? (Number(pkg.length) * Number(pkg.width) * Number(pkg.height)) / 5000 : 0;
      insertPkg.run(
        pkgId,
        shipmentId,
        pkg.package_reference || `${trackingNumber}-P${pkgIndex}`,
        pkg.description || 'General Cargo',
        Number(pkg.quantity || 1),
        Number(pkg.weight || 1),
        pkg.weight_unit || 'kg',
        pkg.length ? Number(pkg.length) : null,
        pkg.width ? Number(pkg.width) : null,
        pkg.height ? Number(pkg.height) : null,
        pkg.dimension_unit || 'cm',
        Number(vol.toFixed(2)),
        pkg.package_type || 'Box / Carton',
        Number(pkg.declared_value || 0),
        pkg.fragile ? 1 : 0,
        pkg.handling_instructions || null
      );
      pkgIndex++;
    }

    // Insert initial tracking event
    const eventId = `evt-${Date.now()}`;
    db.prepare(`
      INSERT INTO tracking_events (
        id, shipment_id, status, event_title, event_description, location_name, city, country, facility_name, event_timestamp, is_public, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      shipmentId,
      'Shipment Created',
      'Shipment Order Created & Electronic Documentation Processed',
      'Shipping order registered in system. Consignment preparing for facility dispatch.',
      `${data.origin_facility || data.origin_city}`,
      data.origin_city,
      data.origin_country,
      data.origin_facility || `${data.origin_city} Intake Facility`,
      now,
      1,
      data.created_by || 'admin@vedcourier.com'
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_name, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `aud-${Date.now()}`,
      data.created_by || 'admin@vedcourier.com',
      'CREATE_SHIPMENT',
      'shipments',
      shipmentId,
      `Created shipment ${trackingNumber} for route ${data.origin_country} to ${data.destination_country}`
    );

    return { id: shipmentId, tracking_number: trackingNumber };
  });

  return tx();
}

export function addTrackingEvent(data: {
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
  event_timestamp: string;
  is_public?: boolean;
  created_by: string;
  notify_customer?: boolean;
}) {
  initDb();
  const eventId = `evt-${Date.now()}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const tx = db.transaction(() => {
    // 1. Insert tracking event
    db.prepare(`
      INSERT INTO tracking_events (
        id, shipment_id, status, event_title, event_description, internal_note,
        location_name, city, region, country, facility_name, event_timestamp,
        recorded_at, is_public, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      data.shipment_id,
      data.status,
      data.event_title,
      data.event_description || null,
      data.internal_note || null,
      data.location_name,
      data.city || null,
      data.region || null,
      data.country,
      data.facility_name || null,
      data.event_timestamp || now,
      now,
      data.is_public !== false ? 1 : 0,
      data.created_by
    );

    // 2. Update shipment current status & location
    const updateShipment = db.prepare(`
      UPDATE shipments
      SET current_status = ?,
          current_recorded_location = ?,
          last_updated_at = ?,
          actual_delivery_date = CASE WHEN ? = 'Delivered' THEN ? ELSE actual_delivery_date END,
          updated_at = ?
      WHERE id = ?
    `);

    const fullLocation = `${data.location_name}${data.city ? `, ${data.city}` : ''}, ${data.country}`;
    updateShipment.run(
      data.status,
      fullLocation,
      now,
      data.status,
      data.status === 'Delivered' ? (data.event_timestamp || now) : null,
      now,
      data.shipment_id
    );

    // 3. Log notification if requested
    if (data.notify_customer) {
      const shipment = db.prepare('SELECT receiver_email, sender_email, tracking_number FROM shipments WHERE id = ?').get(data.shipment_id) as any;
      if (shipment && (shipment.receiver_email || shipment.sender_email)) {
        const recipient = shipment.receiver_email || shipment.sender_email;
        db.prepare(`
          INSERT INTO notifications (id, shipment_id, recipient, channel, subject, status, provider_response)
          VALUES (?, ?, ?, 'email', ?, 'sent', 'Delivered to SMTP queue (Resend / Mail Provider)')
        `).run(
          `notif-${Date.now()}`,
          data.shipment_id,
          recipient,
          `Tracking Update: ${shipment.tracking_number} is now ${data.status}`
        );
      }
    }

    // 4. Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_name, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `aud-${Date.now()}`,
      data.created_by,
      'ADD_TRACKING_EVENT',
      'tracking_events',
      eventId,
      `Added status ${data.status} at ${data.location_name} for shipment ${data.shipment_id}`
    );

    return eventId;
  });

  return tx();
}

export function updateShipmentStatus(id: string, status: string, location: string, actor: string) {
  initDb();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  db.prepare(`
    UPDATE shipments
    SET current_status = ?, current_recorded_location = ?, last_updated_at = ?, updated_at = ?
    WHERE id = ?
  `).run(status, location, now, now, id);

  db.prepare(`
    INSERT INTO audit_logs (id, actor_name, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`aud-${Date.now()}`, actor, 'UPDATE_STATUS', 'shipments', id, `Updated status to ${status}`);
}

export function getDashboardMetrics() {
  initDb();
  const total = db.prepare('SELECT count(*) as count FROM shipments').get() as { count: number };
  const inTransit = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status IN ('In Transit', 'Departed Origin', 'Arrived at Transit Hub')").get() as { count: number };
  const customs = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status IN ('Customs Clearance', 'Customs Hold', 'Customs Cleared')").get() as { count: number };
  const outForDelivery = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status IN ('Out for Delivery', 'Arrived at Local Facility')").get() as { count: number };
  const delivered = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status = 'Delivered'").get() as { count: number };
  const delayed = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status IN ('Delayed', 'Delivery Exception', 'Customs Hold')").get() as { count: number };
  const awaitingPickup = db.prepare("SELECT count(*) as count FROM shipments WHERE current_status IN ('Shipment Created', 'Awaiting Pickup')").get() as { count: number };
  const openTickets = db.prepare("SELECT count(*) as count FROM support_tickets WHERE status != 'resolved' AND status != 'closed'").get() as { count: number };

  const recentShipments = db.prepare('SELECT * FROM shipments ORDER BY created_at DESC LIMIT 5').all();
  const recentEvents = db.prepare(`
    SELECT e.*, s.tracking_number, s.shipping_route
    FROM tracking_events e
    JOIN shipments s ON e.shipment_id = s.id
    ORDER BY datetime(e.recorded_at) DESC LIMIT 6
  `).all();

  return {
    totalShipments: total.count,
    inTransit: inTransit.count,
    customs: customs.count,
    outForDelivery: outForDelivery.count,
    delivered: delivered.count,
    delayed: delayed.count,
    awaitingPickup: awaitingPickup.count,
    openTickets: openTickets.count,
    recentShipments,
    recentEvents,
  };
}

export function getSupportTickets(filter?: { status?: string }) {
  initDb();
  let query = 'SELECT * FROM support_tickets';
  const params: any[] = [];
  if (filter?.status && filter.status !== 'all') {
    query += ' WHERE status = ?';
    params.push(filter.status);
  }
  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params);
}

export function createSupportTicket(data: {
  name: string;
  email: string;
  phone?: string;
  tracking_number?: string;
  subject: string;
  message: string;
}) {
  initDb();
  const id = `tkt-${Date.now()}`;
  const countRow = db.prepare('SELECT count(*) as count FROM support_tickets').get() as { count: number };
  const ticketNumber = `TKT-${new Date().getFullYear()}-${1000 + countRow.count + 1}`;

  db.prepare(`
    INSERT INTO support_tickets (id, ticket_number, name, email, phone, tracking_number, subject, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    ticketNumber,
    data.name,
    data.email,
    data.phone || null,
    data.tracking_number ? data.tracking_number.trim().toUpperCase() : null,
    data.subject,
    data.message
  );

  return { id, ticket_number: ticketNumber };
}

export function updateSupportTicketStatus(id: string, status: string) {
  initDb();
  db.prepare('UPDATE support_tickets SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
}

export function getCompanySettings(): Record<string, string> {
  initDb();
  const rows = db.prepare('SELECT key, value FROM company_settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function updateCompanySettings(settings: Record<string, string>) {
  initDb();
  const stmt = db.prepare('INSERT OR REPLACE INTO company_settings (key, value) VALUES (?, ?)');
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(settings)) {
      stmt.run(key, value);
    }
  });
  tx();
}

export function getCustomers() {
  initDb();
  // Aggregate customers from sender and receiver entries or explicit customers table
  return db.prepare(`
    SELECT
      sender_name as name,
      sender_company as company,
      sender_email as email,
      sender_phone as phone,
      sender_country as country,
      count(*) as total_shipments,
      'Sender' as relationship
    FROM shipments
    GROUP BY sender_name
    ORDER BY total_shipments DESC
  `).all();
}

export function getReportsData() {
  initDb();
  const routeStats = db.prepare(`
    SELECT shipping_route, count(*) as count, sum(total_actual_weight) as total_weight, sum(total_charge) as total_revenue
    FROM shipments
    GROUP BY shipping_route
    ORDER BY count DESC
  `).all();

  const statusStats = db.prepare(`
    SELECT current_status, count(*) as count
    FROM shipments
    GROUP BY current_status
    ORDER BY count DESC
  `).all();

  const serviceStats = db.prepare(`
    SELECT service_type, count(*) as count
    FROM shipments
    GROUP BY service_type
    ORDER BY count DESC
  `).all();

  const totalRevenue = db.prepare('SELECT sum(total_charge) as revenue, sum(total_actual_weight) as weight FROM shipments').get() as { revenue: number; weight: number };

  return {
    routeStats,
    statusStats,
    serviceStats,
    totalRevenue: totalRevenue.revenue || 0,
    totalWeight: totalRevenue.weight || 0,
  };
}

export default db;
