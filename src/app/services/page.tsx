import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Plane, Ship, Truck, FileText, Building2, ShieldCheck,
  ArrowRight, CheckCircle2, Zap, Clock, Store
} from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      id: 'express-courier',
      title: 'Domestic & Regional Express Courier',
      icon: Truck,
      badge: 'Urgent & Same-Day',
      image: '/images/courier-delivery.jpg',
      desc: 'Time-definite courier solutions for personal parcels, trade samples, legal documents, and urgent e-commerce packages requiring hand-to-hand delivery.',
      features: [
        'Doorstep collection with digital barcode waybill',
        'Signature upon delivery with real-time consignee photo proof',
        'Automated transit milestone SMS and email notifications',
        'GoFaster next-day inter-state & regional delivery',
      ],
      leadTime: '24 to 48 Hours',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
    {
      id: 'air-freight',
      title: 'International Air Freight & Cargo',
      icon: Plane,
      badge: 'Global Speed',
      image: '/images/air-cargo.jpg',
      desc: 'Priority, standard, and chartered air cargo transportation connecting Nigeria, the United States, China, the UK, and South Korea with dedicated allocations on scheduled freighters.',
      features: [
        'Airport-to-airport and airport-to-door options',
        'Consolidated (LAL) and full charter solutions',
        'Direct tracking linked to Master Air Waybill (MAWB)',
        'Pre-alert and flight touchdown confirmation',
      ],
      leadTime: '1 to 4 Business Days',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
    {
      id: 'ocean-freight',
      title: 'Ocean & Maritime Container Shipping',
      icon: Ship,
      badge: 'Economical Bulk',
      image: '/images/ocean-ship.jpg',
      desc: 'Comprehensive maritime container shipping across trans-Pacific and trans-Atlantic trade corridors. FCL and LCL with full customs integration and port-to-door drayage.',
      features: [
        '20ft, 40ft, and 40ft High Cube container options',
        'LCL consolidation hubs in Guangzhou, Ningbo, and Los Angeles',
        'Vessel stowage planning and maritime cargo insurance',
        'Demurrage avoidance coordination with destination ports',
      ],
      leadTime: '18 to 32 Days Transit',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
    {
      id: 'door-to-door',
      title: 'E-Commerce Merchant Logistics & Drop-off',
      icon: Store,
      badge: 'E-Commerce Sellers',
      image: '/images/fleet-van.jpg',
      desc: "Complete end-to-end fulfillment for e-commerce vendors, social sellers, and corporate stores with inventory management, return handling, and multi-location dispatch.",
      features: [
        'Automated API integration with e-commerce storefronts',
        'Smart warehousing and pick-pack-ship operations',
        'Dedicated corporate merchant support hotline',
        'Cash-on-Delivery (COD) reconciliation support',
      ],
      leadTime: 'Scheduled & Same-Day',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
    {
      id: 'customs',
      title: 'Customs Clearance & Brokerage',
      icon: FileText,
      badge: 'Pre-Cleared Airborne',
      image: '/images/customs-port.jpg',
      desc: 'In-house licensed customs brokerage navigating complex trade regulations, tariff schedules, HS code classifications, and import compliance in Nigeria, the US, and China.',
      features: [
        'Pre-clearance documentation filing while cargo is airborne',
        'Harmonized System (HS) code classification auditing',
        'Duty and tax payment facilitation on behalf of consignees',
        'Resolution of customs inquiries, inspections, and examinations',
      ],
      leadTime: 'Same-Day Pre-Clearance',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
    {
      id: 'special-cargo',
      title: 'Special Cargo & Bonded Warehousing',
      icon: ShieldCheck,
      badge: 'High-Value & Insured',
      image: '/images/cargo-crating.jpg',
      desc: 'Specialized crating, shock dampening, temperature-controlled packaging, and enhanced security for valuable electronics, machinery, and certified medical consignments.',
      features: [
        'Custom ISPM-15 heat-treated export wood crating',
        'Shock, tilt, and temperature monitoring indicators',
        'Restricted goods pre-shipment compliance review',
        'High-value transit insurance up to 100% declared value',
      ],
      leadTime: 'Tailored to Specification',
      accent: 'text-purple-700',
      accentBg: 'bg-purple-50',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── PAGE HEADER (PURPLE & WHITE) ──────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] text-white py-16 sm:py-20 px-4 sm:px-8 border-b-4 border-purple-500 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/warehouse.jpg"
            alt="Logistics Terminal"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#240643]/95 via-[#2e0854]/90 to-[#2e0854]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto space-y-3">
          <span className="text-xs font-black tracking-widest text-purple-300 uppercase bg-purple-900/80 px-3 py-1 rounded-full border border-purple-400/30">
            OUR COMPREHENSIVE CAPABILITIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Logistics &amp; Delivery Services
          </h1>
          <p className="text-purple-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            VED COURIER LOGISTICS combines tech-driven tracking with physical transport assets to deliver packages, pallets, and full container loads across borders seamlessly.
          </p>
        </div>
      </section>

      {/* ─── SERVICE LIST (GIGL PURPLE & WHITE CARDS) ─────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="space-y-10">
          {serviceList.map((svc, index) => {
            const Icon = svc.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={svc.id}
                id={svc.id}
                className={`bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} hover:shadow-xl transition-shadow duration-300`}
              >
                {/* Image Panel */}
                <div className="relative md:w-80 lg:w-96 shrink-0 h-56 md:h-auto overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-none from-black/60 via-transparent to-transparent md:from-transparent" />
                  
                  <div className={`absolute top-4 ${isEven ? 'left-4' : 'right-4'} w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md border border-purple-100`}>
                    <Icon className="w-5 h-5 text-purple-700" />
                  </div>

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 md:hidden">
                    <span className="bg-purple-700 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow">
                      {svc.badge}
                    </span>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="flex-1 p-7 lg:p-9 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div>
                        <span className="hidden md:inline-block bg-purple-100 text-purple-900 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2">
                          {svc.badge}
                        </span>
                        <h2 className="text-xl font-black text-[#2e0854] leading-tight">{svc.title}</h2>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">{svc.desc}</p>
                    
                    <div>
                      <p className="text-xs font-bold text-purple-900 mb-2.5 uppercase tracking-wider">Service Highlights</p>
                      <ul className="space-y-2">
                        {svc.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-purple-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Estimated Lead Time</p>
                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#2e0854]">
                        <Clock className="w-4 h-4 text-purple-700" />
                        {svc.leadTime}
                      </div>
                    </div>

                    <Link
                      href={`/contact?subject=${encodeURIComponent(svc.title)}`}
                      className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition"
                    >
                      Request Rate <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#2e0854] via-purple-900 to-[#2e0854] rounded-3xl overflow-hidden relative shadow-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-lg">
            <h3 className="text-2xl font-black">Need a Custom Merchant or Corporate Account?</h3>
            <p className="text-sm text-purple-200 leading-relaxed">
              We offer volume discounts, automated API integrations, dedicated account managers, and weekly invoicing for regular shippers.
            </p>
          </div>
          <Link
            href="/contact?subject=Corporate%20Account%20Onboarding"
            className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-8 py-4 rounded-full text-sm shadow-md transition shrink-0"
          >
            Open Corporate Account
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
