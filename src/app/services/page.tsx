import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Plane, 
  Ship, 
  Truck, 
  FileText, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      id: 'air-freight',
      title: 'International Air Freight',
      icon: Plane,
      badge: 'Speed & Urgency',
      image: '/images/air-cargo.jpg',
      desc: 'Priority, standard, and chartered air cargo transportation connecting primary manufacturing and distribution hubs in the United States, China, Nigeria, South Korea, and Europe. Dedicated allocations on major commercial freighters.',
      features: [
        'Airport-to-airport and airport-to-door options',
        'Consolidated (LAL) and full charter solutions',
        'Direct tracking linked to Master Air Waybill (MAWB)',
        'Pre-alert and flight touchdown confirmation',
      ],
      leadTime: '1 to 3 Business Days',
    },
    {
      id: 'ocean-freight',
      title: 'Ocean & Maritime Freight',
      icon: Ship,
      badge: 'Cost Efficiency for Bulk Cargo',
      image: '/images/ocean-ship.jpg',
      desc: 'Comprehensive maritime container shipping across trans-Pacific and trans-Atlantic trade corridors. We handle Full Container Loads (FCL) and Less than Container Loads (LCL) with full customs integration and port-to-door drayage.',
      features: [
        '20ft, 40ft, and 40ft High Cube container options',
        'LCL consolidation hubs in Guangzhou, Ningbo, and Los Angeles',
        'Vessel stowage planning and maritime cargo insurance',
        'Demurrage avoidance coordination with destination ports',
      ],
      leadTime: '18 to 32 Days Transit',
    },
    {
      id: 'express-courier',
      title: 'International Express Courier',
      icon: Zap,
      badge: 'Urgent Parcels & Documents',
      image: '/images/courier-delivery.jpg',
      desc: 'Time-definite courier solutions for urgent business parcels, trade samples, legal paperwork, and confidential documents requiring hand-to-hand accountability and rapid border crossing.',
      features: [
        'Express intake with immediate tracking generation',
        'Signature upon delivery with biometric / photo verification',
        'Automated transit milestone alerts',
        'Next-day delivery available on key domestic & regional corridors',
      ],
      leadTime: '24 to 48 Hours',
    },
    {
      id: 'door-to-door',
      title: 'Door-to-Door Delivery Service',
      icon: Truck,
      badge: 'Seamless End-to-End',
      image: '/images/fleet-van.jpg',
      desc: 'Complete chain-of-custody service where VED Courier collects your parcels directly from your factory, warehouse, or residence and delivers directly to the consignee’s doorstep in the destination country.',
      features: [
        'All inclusive: pickup, export clearance, transit, and local delivery',
        'No third-party broker confusion or hidden local terminal fees',
        'Local delivery fleet operating in New York, Shanghai, Lagos, Abuja, and Chicago',
        'Special recipient calling 2 hours prior to arrival',
      ],
      leadTime: 'End-to-End Scheduled',
    },
    {
      id: 'customs',
      title: 'Customs Clearance & Regulatory Brokerage',
      icon: FileText,
      badge: 'Compliance & Duty Optimization',
      image: '/images/customs-port.jpg',
      desc: 'In-house licensed customs brokerage navigating complex trade regulations, tariff schedules, HS code classifications, and import compliance in the US, China, and Nigeria.',
      features: [
        'Pre-clearance documentation filing while cargo is airborne',
        'Harmonized System (HS) code classification auditing',
        'Duty and tax payment facilitation on behalf of consignees',
        'Resolution of customs inquiries, inspections, and physical examinations',
      ],
      leadTime: 'Same-Day Pre-Clearance',
    },
    {
      id: 'special-cargo',
      title: 'Package Handling & Special Cargo',
      icon: ShieldCheck,
      badge: 'High Value & Regulated',
      image: '/images/cargo-crating.jpg',
      desc: 'Specialized crating, shock dampening, temperature-controlled passive packaging, and enhanced security protocols for valuable electronics, machinery, and certified medical consignments.',
      features: [
        'Custom ISPM-15 heat-treated export wood crating',
        'Shock, tilt, and temperature monitoring indicators',
        'Restricted goods pre-shipment compliance review',
        'High-value transit insurance coverage up to 100% declared value',
      ],
      leadTime: 'Tailored to Specification',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner with Background Image */}
      <section className="relative bg-[#0b2240] text-white py-20 px-4 sm:px-8 border-b-4 border-[#e22026] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/warehouse.jpg"
            alt="International Logistics Terminal"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#0b2240]/90 to-[#0b2240]/80" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
            LOGISTICS CAPABILITIES & SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Our Core Logistics Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            VED COURIER LOGISTICS provides enterprise-grade transport solutions, intermodal freight forwarding, and transparent border clearance engineered to remove friction from international trade.
          </p>
        </div>
      </section>

      {/* Services List with Photography Cards */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id} 
                id={svc.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-xl transition flex flex-col justify-between group"
              >
                {/* Image Header */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#0b2240]/90 backdrop-blur-xs text-white p-2 rounded-xl shadow-md">
                    <Icon className="w-5 h-5 text-[#e22026]" />
                  </div>
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    {svc.badge}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-black">{svc.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {svc.desc}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-800 block mb-2">Service Highlights:</span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {svc.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Transit</span>
                      <span className="font-extrabold text-[#0b2240]">{svc.leadTime}</span>
                    </div>
                    <Link
                      href={`/contact?subject=${encodeURIComponent(svc.title)}`}
                      className="font-bold bg-[#0b2240] hover:bg-[#163866] text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                    >
                      <span>Request Rate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card with Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ocean-ship.jpg"
              alt="Cargo Ship"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0b2240]/90" />
          </div>
          <div className="relative z-10 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-black">Looking for Custom Contract Logistics?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We configure scheduled charter flights, bulk sea cargo space, and corporate warehousing credit accounts for regular high-volume shippers.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md transition shrink-0"
            >
              Speak With Logistics Manager
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
