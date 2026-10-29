-- ========================================================================
-- VED COURIER LOGISTICS — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Staff / Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'logistics_staff' CHECK (role IN ('super_admin', 'operations_manager', 'logistics_staff', 'customer_support', 'customer')),
    phone TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    customer_type TEXT DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business', 'corporate')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number TEXT UNIQUE NOT NULL,
    internal_reference TEXT,
    booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estimated_delivery_date DATE,
    actual_delivery_date TIMESTAMPTZ,

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

    -- Route & Transport Mode
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

    -- Current Operational Status & Location
    current_status TEXT NOT NULL DEFAULT 'Shipment Created',
    current_recorded_location TEXT NOT NULL,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Weights & Measures
    total_actual_weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
    weight_unit TEXT NOT NULL DEFAULT 'kg',
    total_volumetric_weight NUMERIC(10, 2) DEFAULT 0,
    chargeable_weight NUMERIC(10, 2) DEFAULT 0,

    -- Value & Charges
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

    -- Customs & Compliance
    customs_declaration_ref TEXT,
    hs_code TEXT,
    duty_status TEXT DEFAULT 'Unpaid',
    restricted_review_status TEXT DEFAULT 'Cleared',

    -- Notes
    customer_notes TEXT,
    internal_notes TEXT,

    -- Administrative
    assigned_staff_name TEXT,
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Shipment Packages Table
CREATE TABLE IF NOT EXISTS public.shipment_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
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
    fragile BOOLEAN DEFAULT FALSE,
    temperature_sensitive BOOLEAN DEFAULT FALSE,
    handling_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tracking Events Table (Append-only Timeline)
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_description TEXT,
    internal_note TEXT,
    location_name TEXT NOT NULL,
    city TEXT,
    region TEXT,
    country TEXT NOT NULL,
    facility_name TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    event_timestamp TIMESTAMPTZ NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_zone TEXT DEFAULT 'UTC',
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_by TEXT NOT NULL,
    correction_of_event_id UUID REFERENCES public.tracking_events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    tracking_number TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'normal',
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_supabase_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_supabase_shipments_status ON public.shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_supabase_events_shipment ON public.tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_supabase_packages_shipment ON public.shipment_packages(shipment_id);

-- Row Level Security (RLS) Setup
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Public can view public fields of shipments by tracking number (handled via safe API layer)
CREATE POLICY "Public read tracking events" ON public.tracking_events
    FOR SELECT USING (is_public = true);
