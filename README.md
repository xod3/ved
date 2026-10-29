# VED COURIER LOGISTICS — International Courier, Freight & Global Tracking Platform

> **"Your Shipment. Our Responsibility."**  
> *FAST • SAFE • GLOBAL*

A professional, production-grade logistics, air cargo, ocean freight, and international shipment tracking web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and a **hybrid persistent SQL database architecture (Persistent SQLite locally + Supabase PostgreSQL in the cloud)**.

---

## 🚀 Key Features

### 1. Public-Facing Logistics Portal
- **Brand Identity**: Official **VED COURIER LOGISTICS** branding, featuring the corporate deep navy blue (`#0B2240`) and red accent (`#E22026`) theme, with the official carrier logo.
- **Hero Section**: Features the core company headline: *“Your Shipment. Our Responsibility.”* with instant live consignment lookup.
- **Real-Time Consignment Tracking (`/track`)**:
  - Live milestone timeline with status badges (Order Created, Collected, In Transit, Customs Clearance, Out for Delivery, Delivered).
  - Origin-to-Destination visual route indicators.
  - Package specifications and approved cargo descriptions.
  - **Strict Customer Privacy Guard**: Conceals private phone numbers, street addresses, billing notes, and internal staff notes from public visibility.
- **International Trade Corridors Spotlight**:
  - United States ↔ China (Daily flights via JFK, LAX, PVG)
  - China ↔ Nigeria (Priority air cargo via CAN, LOS)
  - United States ↔ Nigeria (Direct cargo & express courier)
  - South Korea ↔ United States (Direct robotics & electronics hub via ICN, ORD)
  - Intermodal transatlantic and transpacific container lines.
- **Comprehensive Logistics Services (`/services`)**:
  - International Air Freight
  - Ocean & Maritime Shipping (FCL / LCL)
  - Express Door-to-Door Courier
  - Customs Clearance & Brokerage
  - Bonded Warehousing
  - Specialized & Temperature-Controlled Cargo
- **Corporate About Page (`/about`)**: Company history, international gateway hubs, four operational pillars, and certifications.
- **Interactive Support Desk (`/contact`)**: Logs inquiries directly to the real database support ticket registry.
- **Legal Compliance Policies**: Full Terms & Conditions of Carriage (`/terms`) and Privacy Policy (`/privacy`).

---

### 2. Secure Operations Control Center (`/admin`)
- **Authentication & RBAC (`/admin/login`)**:
  - Pre-seeded administrative accounts with secure password hashing.
  - Role-Based Access Control: Super Administrator, Operations Manager, Logistics Staff, and Customer Support.
- **Live KPI Dashboard (`/admin`)**:
  - Real database metrics: Total Shipments, In Transit, Customs Clearance, Out for Delivery, Delivered, Delayed/Held, Awaiting Pickup, and Open Support Tickets.
  - Live feed of recent milestones and newly registered consignments.
- **Shipments Registry (`/admin/shipments`)**:
  - Multi-parameter search by Tracking ID, Shipper, Receiver, or City.
  - Filter by operational status and trade corridor.
  - Quick action controls to view details, add milestones, print labels, and print receipts.
- **Comprehensive Shipment Creation Form (`/admin/shipments/new`)**:
  - **Backend Tracking ID Generation**: Generates atomic, sequential tracking numbers (e.g. `VED-2026-000105`).
  - Full Shipper and Consignee address blocks.
  - Multi-package builder with automatic **Volumetric Weight Calculation** `(L × W × H ÷ 5000)`.
  - Customs compliance declarations (HS codes, declared value, declaration reference).
  - Shipping fees, handling, insurance, and billing records.
  - Separation of customer-facing notes and confidential internal staff notes.
- **Milestone & Location Manager (`/admin/shipments/[id]/tracking`)**:
  - Append-only event history stamped with author accountability, facility coordinates, and timestamps.
  - Advances shipment status in real time across the public tracking timeline.
- **Printable 4x6" Barcode Shipping Label (`/admin/shipments/[id]/label`)**:
  - Features company branding, 1D barcode, and **real scannable 2D QR Code** linking directly to the live tracking page.
- **Official Freight Waybill & Payment Receipt (`/admin/shipments/[id]/receipt`)**:
  - Official itemized freight receipt with declared values, payment status, and authorized stamp area.
- **Customer Directory (`/admin/customers`)**: Aggregates customer accounts, contact details, and shipment history.
- **Support Inquiries Manager (`/admin/support`)**: Real-time review and resolution of public tickets.
- **Reports & Analytics (`/admin/reports`)**: Route volume breakdown, total cargo mass moved, revenue stats, and **one-click CSV export**.
- **Company Settings (`/admin/settings`)**: Configurable company contact info, default billing currency, volumetric divisors, and email service parameters.

---

## 🔑 Pre-Seeded Administrative Credentials

For demonstration and administrative evaluation, the following accounts are pre-seeded in the database:

| Role | Email | Password |
|---|---|---|
| **Super Administrator** | `admin@vedcourier.com` | `admin123` |
| **Operations Manager** | `ops@vedcourier.com` | `ops123` |
| **Customer Support** | `support@vedcourier.com` | `support123` |

---

## 📦 Sample Active Tracking IDs (Demo Lookups)

| Tracking Number | Route | Status | Notes |
|---|---|---|---|
| `VED-2026-000101` | United States → China | Customs Cleared | High-value precision sensors |
| `VED-2026-000102` | China → Nigeria | In Transit | Telecom networking equipment |
| `VED-2026-000103` | United States → Nigeria | Out for Delivery | Certified medical transducers |
| `VED-2026-000104` | South Korea → United States | Delivered | Precision industrial robotics |

---

## 🛠️ Technology Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **Database Engine**:
  - **Local Persistence (Zero-Config)**: ACID-compliant SQLite via `better-sqlite3` stored in `data/ved_courier.db`.
  - **Cloud Database (Supabase PostgreSQL)**: Full production PostgreSQL migration schema located at `supabase/schema.sql` with Row Level Security (RLS) policies and indexes.
- **Barcodes & QR Codes**: `qrcode` library generating scannable vector data URLs for shipping labels.
- **Security**: Cookie sessions, server-side data sanitization, privacy filters on public endpoints.

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Run for Production
```bash
npm run build
npm run start
```

---

## 🌐 Supabase PostgreSQL Deployment

To deploy to Supabase:
1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Configure your `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
