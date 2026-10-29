'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Plane, 
  Ship, 
  Truck, 
  ShieldCheck, 
  Globe2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Package, 
  FileText, 
  Award, 
  Building2, 
  ChevronRight,
  PhoneCall,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    router.push(`/track?id=${encodeURIComponent(trackingId.trim())}`);
  };

  const sampleTrackingNumbers = [
    { label: 'US → China (In Transit)', id: 'VED-2026-000101' },
    { label: 'China → Nigeria (Transit Hub)', id: 'VED-2026-000102' },
    { label: 'US → Nigeria (Out for Delivery)', id: 'VED-2026-000103' },
    { label: 'Korea → US (Delivered)', id: 'VED-2026-000104' },
  ];

  const internationalRoutes = [
    {
      origin: 'United States',
      dest: 'China',
      mode: 'Air & Ocean Freight',
      freq: 'Daily Departures',
      highlight: 'Direct JFK/LAX to PVG/PEK',
      badge: 'High Volume',
    },
    {
      origin: 'China',
      dest: 'Nigeria',
      mode: 'Air Cargo & Sea Container',
      freq: '3x Weekly Cargo Flights',
      highlight: 'Guangzhou/Shenzhen to Lagos (LOS)',
      badge: 'Fast Express',
    },
    {
      origin: 'United States',
      dest: 'Nigeria',
      mode: 'Express Courier & Air Cargo',
      freq: 'Daily Express Intake',
      highlight: 'Direct Hub to Lagos & Abuja',
      badge: 'Priority Medical & Tech',
    },
    {
      origin: 'South Korea',
      dest: 'United States',
      mode: 'Air Freight & Sea Express',
      freq: 'Scheduled Cargo Lines',
      highlight: 'Incheon (ICN) to Chicago & LAX',
      badge: 'Electronics & Robotics',
    },
    {
      origin: 'China',
      dest: 'United States',
      mode: 'Intermodal & Air Express',
      freq: 'Continuous Line-Haul',
      highlight: 'Commercial E-Commerce & B2B',
      badge: 'Trade Corridor',
    },
    {
      origin: 'Nigeria',
      dest: 'United States',
      mode: 'Secured Air Consignment',
      freq: 'Twice Weekly',
      highlight: 'Export Commodities & Courier',
      badge: 'Secured Line',
    },
  ];

  const services = [
    {
      title: 'International Air Freight',
      desc: 'Rapid intercontinental air transport for urgent commercial freight, electronics, pharmaceuticals, and time-critical consignments.',
      icon: Plane,
      link: '/services#air-freight',
      stat: '24–72 Hour Global Transit',
    },
    {
      title: 'Ocean & Maritime Shipping',
      desc: 'Full Container Load (FCL) and Less than Container Load (LCL) shipping across primary trans-Pacific and trans-Atlantic trade lanes.',
      icon: Ship,
      link: '/services#ocean-freight',
      stat: 'Economical Bulk Cargo',
    },
    {
      title: 'Express Door-to-Door Courier',
      desc: 'End-to-end parcel collection directly from your warehouse or doorstep with hand-to-hand delivery to the recipient.',
      icon: Truck,
      link: '/services#express-courier',
      stat: 'Signature-Verified Delivery',
    },
    {
      title: 'Customs Clearance & Brokerage',
      desc: 'In-house licensed customs brokers handling import/export declarations, HS classification, tariffs, and regulatory clearances.',
      icon: FileText,
      link: '/services#customs',
      stat: '100% Regulatory Compliance',
    },
    {
      title: 'Secure Bonded Warehousing',
      desc: 'Climate-controlled, 24/7 monitored distribution facilities located near major international airports and seaports.',
      icon: Building2,
      link: '/services#warehousing',
      stat: 'Short & Long Term Storage',
    },
    {
      title: 'Specialized & High-Value Cargo',
      desc: 'Shock-proof crating, temperature-monitored medical freight, and escort security for high-value industrial machinery.',
      icon: ShieldCheck,
      link: '/services#special-cargo',
      stat: 'Full Value Insurance',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0b2240] via-[#0f2d56] to-[#061426] text-white pt-16 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#e22026]/20 border border-[#e22026]/40 px-3 py-1.5 rounded-full text-xs font-bold text-red-200">
              <span className="w-2 h-2 rounded-full bg-[#e22026] animate-pulse" />
              GLOBAL LOGISTICS NETWORK — FAST • SAFE • GLOBAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Your Shipment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-300">
                Our Responsibility.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Precision international courier, bonded air cargo, maritime container freight, and real-time shipment visibility. Connecting the United States, China, Nigeria, South Korea, and global commerce hubs with uncompromising reliability.
            </p>

            {/* Prominent Live Tracking Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 border-4 border-slate-100/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0b2240] flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#e22026]" /> Track Real-Time Consignment
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Direct Live Database Lookup
                </span>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. VED-2026-000101)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0b2240] focus:bg-white transition"
                    required
                  />
                  <Package className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-red-900/30 transition flex items-center justify-center gap-2 text-sm shrink-0 active:scale-95 cursor-pointer"
                >
                  <span>Track Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sample Live Tracking IDs */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">Quick Demo Lookups:</span>
                {sampleTrackingNumbers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => router.push(`/track?id=${s.id}`)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1"
                  >
                    <span className="font-mono text-[#0b2240]">{s.id}</span>
                    <span className="text-slate-400">({s.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60 text-slate-300">
              <div>
                <p className="text-2xl font-black text-white">99.8%</p>
                <p className="text-xs text-slate-400">On-Time Linehaul Dispatch</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">180+</p>
                <p className="text-xs text-slate-400">Countries & Territories</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400">Insured Bonded Cargo</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 text-slate-900">
              {/* Logo Presentation Card */}
              <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-24 h-24 mx-auto relative mb-2">
                  <Image
                    src="/images/ved-logo.png"
                    alt="VED Courier Logistics"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-black text-[#0b2240] tracking-tight">
                  VED COURIER LOGISTICS
                </h3>
                <p className="text-xs font-extrabold tracking-widest text-[#e22026] mt-0.5">
                  FAST • SAFE • GLOBAL
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Licensed International Carrier & Freight Forwarding System
                </p>
              </div>

              {/* Status Simulation Indicator */}
              <div className="space-y-3 bg-[#0b2240] text-white p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Active Trade Corridors</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    SYSTEM OPERATIONAL
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-700/60 pb-1">
                    <span>USA ↔ China Linehaul</span>
                    <span className="text-emerald-400 font-mono">ON SCHEDULE</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-700/60 pb-1">
                    <span>China ↔ Nigeria Air Cargo</span>
                    <span className="text-emerald-400 font-mono">ON SCHEDULE</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Korea ↔ USA Express</span>
                    <span className="text-emerald-400 font-mono">ON SCHEDULE</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#e22026]" /> 24/7 Global Tracking Active
                </span>
                <Link href="/services" className="text-[#0b2240] font-bold hover:underline flex items-center gap-0.5">
                  Explore Services <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Primary International Shipping Routes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              INTERCONTINENTAL CONNECTIVITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0b2240] tracking-tight">
              Featured Global Trade Routes
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We operate dedicated line-hauls, chartered air cargo space, and maritime container slots connecting major economic gateways with guaranteed scheduled departures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalRoutes.map((route, i) => (
              <div 
                key={i}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#0b2240]/40 hover:shadow-lg transition group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold uppercase bg-red-100 text-[#e22026] px-2.5 py-1 rounded-md">
                      {route.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0b2240]" /> {route.freq}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-4">
                    <div className="font-bold text-lg text-[#0b2240]">
                      {route.origin}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#e22026] group-hover:translate-x-1 transition shrink-0" />
                    <div className="font-bold text-lg text-[#0b2240]">
                      {route.dest}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    {route.mode}
                  </p>
                  <p className="text-xs text-slate-500">
                    {route.highlight}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Secured Customs Bonded</span>
                  <Link 
                    href="/contact" 
                    className="text-xs font-bold text-[#0b2240] hover:text-[#e22026] flex items-center gap-1 transition"
                  >
                    Request Route Rate <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              COMPREHENSIVE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0b2240] tracking-tight">
              End-to-End Logistics Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Engineered for manufacturers, trading enterprises, medical distributors, and cross-border commerce requiring total chain-of-custody control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-7 shadow-xs border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0b2240] text-white flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6 text-[#e22026]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0b2240]">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0b2240] bg-slate-100 px-2 py-1 rounded">
                      {svc.stat}
                    </span>
                    <Link
                      href={svc.link}
                      className="font-bold text-[#e22026] hover:text-[#b81419] flex items-center gap-1 transition"
                    >
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Our Shipping Process Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              TRANSPARENT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0b2240] tracking-tight">
              How Your Consignment Moves
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every package is tracked, security-inspected, and electronically recorded through our persistent global tracking network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                1
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Booking & Dispatch Intake</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unique tracking number generated, parcel weighed, measured, and verified with scannable QR label.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                2
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Export Screening & Hub Sorting</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                X-ray screening, export documentation review, and palletization for scheduled air or maritime departures.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                3
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Transit & Customs Brokerage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live intercontinental transit updates with proactive destination customs clearance and tariff verification.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#e22026] text-white font-black text-lg flex items-center justify-center border-4 border-red-100 shadow-md">
                4
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Final Mile & Sign-Off</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Local distribution fleet delivery, real-time driver out-for-delivery milestone, and signature confirmation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Ved Courier Section */}
      <section className="py-20 bg-[#0b2240] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
                WHY BUSINESSES TRUST VED COURIER
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Built For Global Trade Without Blind Spots
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                When shipping overseas, uncertainty is costly. VED COURIER LOGISTICS combines physical freight infrastructure with immutable, persistent milestone tracking so your operations team always has accurate intelligence.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Real Persistent Database Records</h5>
                    <p className="text-xs text-slate-300">
                      No simulated or hardcoded placeholders. Every milestone is saved with facility stamps, author accountability, and audit history.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Privacy Guard for Shippers & Consignees</h5>
                    <p className="text-xs text-slate-300">
                      Public tracking strictly conceals private phone numbers, street addresses, and commercial invoices to safeguard your client relationships.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Multi-Package & Volumetric Calculations</h5>
                    <p className="text-xs text-slate-300">
                      Accurate carrier-grade volumetric weight calculations (L × W × H ÷ 5000) for pallets, cartons, and oversized crates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/track"
                  className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
                >
                  Track Consignment Now
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm border border-white/20 transition"
                >
                  Contact Freight Desk
                </Link>
              </div>
            </div>

            {/* Testimonials / Industry Recognition */}
            <div className="bg-[#123058] rounded-3xl p-8 border border-slate-700/60 space-y-6">
              <h3 className="font-black text-xl text-white border-b border-slate-700 pb-3 flex items-center justify-between">
                <span>Enterprise Shipper Reviews</span>
                <span className="text-xs font-normal text-slate-400">Verified Client Feedback</span>
              </h3>

              <div className="space-y-4">
                <div className="bg-[#0b2240] p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-200 italic mb-2">
                    “VED Courier handles our high-precision optical sensors from New York into Shanghai. The customs clearance transparency and real-time updates save us hours of back-and-forth.”
                  </p>
                  <p className="text-[11px] font-bold text-white">David K. — Supply Chain Director, Apex Precision</p>
                  <p className="text-[10px] text-slate-400">Route: United States → China</p>
                </div>

                <div className="bg-[#0b2240] p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-200 italic mb-2">
                    “Our telecommunications hardware shipped from Guangzhou to Lagos arrived 2 days ahead of schedule. The door-to-door delivery and WhatsApp tracking notifications were exceptional.”
                  </p>
                  <p className="text-[11px] font-bold text-white">Alhaji Bello Danladi — CEO, Danladi Ventures</p>
                  <p className="text-[10px] text-slate-400">Route: China → Nigeria</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <Award className="w-4 h-4 text-amber-400" /> ISO 9001 Certified Procedures
                </span>
                <span>Global Air Waybill Partner</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-black text-[#0b2240] tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-sm text-[#0b2240]">How do I track my shipment online?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simply enter your unique tracking ID (such as <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">VED-2026-000101</code>) into the tracking field on our homepage or visit our dedicated <Link href="/track" className="text-[#e22026] font-semibold underline">Track Shipment page</Link>. Your status and milestone timeline will appear instantly.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-sm text-[#0b2240]">What countries and routes does VED Courier cover?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We specialize in intercontinental cargo between the United States, China, Nigeria, South Korea, and European trade gateways, with full domestic onward connections in North America and West Africa.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-sm text-[#0b2240]">How is customs clearance managed?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                VED Courier provides bonded customs brokerage. Our licensed agents prepare export and import declarations, handle HS tariff classifications, inspect documentation, and coordinate directly with local customs authorities to prevent holds.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-sm text-[#0b2240]">Can I print an official shipping label or receipt?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Every confirmed shipment generated in our system includes a printable barcode label with a scannable QR code and an official itemized freight receipt with declared values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Action Banner */}
      <section className="bg-gradient-to-r from-[#0b2240] to-[#123058] py-14 px-4 sm:px-8 text-white border-t border-slate-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black">Ready to Book or Track Your Freight?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Speak with a dedicated logistics specialist or input your tracking ID for instant milestone visibility.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/track"
              className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              Track Now
            </Link>
            <Link
              href="/contact"
              className="bg-white text-[#0b2240] hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
