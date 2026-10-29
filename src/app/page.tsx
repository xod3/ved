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
  MapPin,
  Sparkles,
  Zap
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
    { label: 'US → China', id: 'VED-2026-000101' },
    { label: 'China → Nigeria', id: 'VED-2026-000102' },
    { label: 'US → Nigeria', id: 'VED-2026-000103' },
    { label: 'Korea → US', id: 'VED-2026-000104' },
  ];

  const internationalRoutes = [
    {
      origin: 'United States',
      dest: 'China',
      mode: 'Air & Ocean Freight',
      freq: 'Daily Departures',
      highlight: 'Direct JFK/LAX to PVG/PEK',
      badge: 'High Volume',
      img: '/images/air-cargo.jpg',
    },
    {
      origin: 'China',
      dest: 'Nigeria',
      mode: 'Air Cargo & Sea Container',
      freq: '3x Weekly Cargo Flights',
      highlight: 'Guangzhou/Shenzhen to Lagos (LOS)',
      badge: 'Fast Express',
      img: '/images/customs-port.jpg',
    },
    {
      origin: 'United States',
      dest: 'Nigeria',
      mode: 'Express Courier & Air Cargo',
      freq: 'Daily Express Intake',
      highlight: 'Direct Hub to Lagos & Abuja',
      badge: 'Priority Medical & Tech',
      img: '/images/courier-delivery.jpg',
    },
    {
      origin: 'South Korea',
      dest: 'United States',
      mode: 'Air Freight & Sea Express',
      freq: 'Scheduled Cargo Lines',
      highlight: 'Incheon (ICN) to Chicago & LAX',
      badge: 'Electronics & Robotics',
      img: '/images/hero-cargo.jpg',
    },
    {
      origin: 'China',
      dest: 'United States',
      mode: 'Intermodal & Air Express',
      freq: 'Continuous Line-Haul',
      highlight: 'Commercial E-Commerce & B2B',
      badge: 'Trade Corridor',
      img: '/images/ocean-ship.jpg',
    },
    {
      origin: 'Nigeria',
      dest: 'United States',
      mode: 'Secured Air Consignment',
      freq: 'Twice Weekly',
      highlight: 'Export Commodities & Courier',
      badge: 'Secured Line',
      img: '/images/warehouse.jpg',
    },
  ];

  const services = [
    {
      title: 'International Air Freight',
      desc: 'Rapid intercontinental air transport for urgent commercial freight, precision tech, pharmaceuticals, and time-critical consignments.',
      icon: Plane,
      link: '/services#air-freight',
      stat: '24–72h Global Transit',
      image: '/images/air-cargo.jpg',
    },
    {
      title: 'Ocean & Maritime Shipping',
      desc: 'Full Container Load (FCL) and Less than Container Load (LCL) shipping across primary trans-Pacific and trans-Atlantic trade lanes.',
      icon: Ship,
      link: '/services#ocean-freight',
      stat: 'Economical Bulk Cargo',
      image: '/images/ocean-ship.jpg',
    },
    {
      title: 'Express Door-to-Door Courier',
      desc: 'End-to-end parcel collection directly from your warehouse or doorstep with hand-to-hand delivery to the recipient.',
      icon: Truck,
      link: '/services#express-courier',
      stat: 'Signature-Verified Delivery',
      image: '/images/courier-delivery.jpg',
    },
    {
      title: 'Customs Clearance & Brokerage',
      desc: 'In-house licensed customs brokers handling import/export declarations, HS classification, tariffs, and regulatory clearances.',
      icon: FileText,
      link: '/services#customs',
      stat: '100% Regulatory Compliance',
      image: '/images/customs-port.jpg',
    },
    {
      title: 'Secure Bonded Warehousing',
      desc: 'Climate-controlled, 24/7 monitored distribution facilities located near major international airports and seaports.',
      icon: Building2,
      link: '/services#warehousing',
      stat: 'Short & Long Term Storage',
      image: '/images/warehouse.jpg',
    },
    {
      title: 'Specialized & High-Value Cargo',
      desc: 'Shock-proof crating, temperature-monitored medical freight, and escort security for high-value industrial machinery.',
      icon: ShieldCheck,
      link: '/services#special-cargo',
      stat: 'Full Value Insurance',
      image: '/images/cargo-crating.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section with Rich Logistics Background Imagery */}
      <section className="relative min-h-[640px] bg-[#0b2240] text-white pt-16 pb-24 px-4 sm:px-8 overflow-hidden flex items-center">
        {/* Background Logistics Image with Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-cargo.jpg"
            alt="International Air Cargo Terminal"
            fill
            className="object-cover object-center opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#0b2240]/90 to-[#0b2240]/80" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#e22026]/20 border border-[#e22026]/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-200 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#e22026] animate-pulse" />
              GLOBAL LOGISTICS NETWORK — FAST • SAFE • GLOBAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Your Shipment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-400">
                Our Responsibility.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-xs">
              Precision international courier, bonded air cargo, maritime container freight, and real-time shipment visibility. Connecting the United States, China, Nigeria, South Korea, and global commerce hubs with uncompromising reliability.
            </p>

            {/* Prominent Live Tracking Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 border-4 border-white/20 backdrop-blur-md">
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
                <span className="text-slate-500 font-semibold">Demo Tracking IDs:</span>
                {sampleTrackingNumbers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => router.push(`/track?id=${s.id}`)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span className="font-mono text-[#0b2240] font-bold">{s.id}</span>
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

          {/* Hero Right Visual with Real Air Cargo Image Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-3 shadow-2xl border-4 border-white/20 overflow-hidden text-slate-900 space-y-3">
              
              {/* Aircraft Photo Card */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden shadow-inner">
                <Image
                  src="/images/air-cargo.jpg"
                  alt="Air Cargo Freight Aircraft"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Logo Badge in top left of image */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl shadow-lg flex items-center gap-2">
                  <Image
                    src="/images/ved-logo.png"
                    alt="VED Courier"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <span className="text-[11px] font-black tracking-tight text-[#0b2240] pr-1">
                    VED COURIER
                  </span>
                </div>

                {/* Floating Flight Radar Indicator */}
                <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  FLIGHT VED-941 LIVE
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-red-300 block">Active Linehaul</span>
                  <p className="font-black text-base leading-tight">Trans-Pacific Priority Air Charter</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">JFK New York → PVG Shanghai Gateway</p>
                </div>
              </div>

              {/* Status Details Bar */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0b2240] flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#e22026]" /> Scheduled Cargo Feeder
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ON SCHEDULE
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Gross Capacity: <strong>110 Tons</strong></span>
                  <span>Customs: <strong>Pre-Cleared</strong></span>
                </div>
              </div>

              {/* Courier Delivery Fleet Mini Feature */}
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                  <Image
                    src="/images/courier-delivery.jpg"
                    alt="Courier Doorstep Delivery"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#0b2240] block">Door-to-Door Courier Delivery</span>
                  <span className="text-slate-500 text-[11px]">Direct handoff to consignee with signature verification</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Fleet & Logistics Imagery Showcase Strip */}
      <section className="bg-slate-900 py-10 border-y-4 border-[#e22026]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="relative h-44 rounded-2xl overflow-hidden group shadow-lg">
              <Image
                src="/images/ocean-ship.jpg"
                alt="Ocean Container Vessel"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">Maritime Fleet</span>
                <p className="font-black text-sm">Container Shipping (FCL/LCL)</p>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden group shadow-lg">
              <Image
                src="/images/warehouse.jpg"
                alt="Automated Logistics Warehouse"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">Storage & Hubs</span>
                <p className="font-black text-sm">Bonded Fulfillment Depots</p>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden group shadow-lg">
              <Image
                src="/images/courier-delivery.jpg"
                alt="Express Courier Delivery Driver"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">Final Mile</span>
                <p className="font-black text-sm">Express Door-to-Door</p>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden group shadow-lg">
              <Image
                src="/images/customs-port.jpg"
                alt="Customs Inspection Port Terminal"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">Clearance</span>
                <p className="font-black text-sm">Port & Customs Brokerage</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Grid with Visual Photography */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
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
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
                >
                  {/* Service Photo Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#0b2240] p-2 rounded-xl shadow-md">
                      <Icon className="w-5 h-5 text-[#e22026]" />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">{svc.stat}</span>
                      <h3 className="text-lg font-black leading-tight">{svc.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {svc.desc}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0b2240] bg-slate-100 px-2.5 py-1 rounded-md">
                        Global Coverage
                      </span>
                      <Link
                        href={svc.link}
                        className="font-bold text-[#e22026] hover:text-[#b81419] flex items-center gap-1 transition"
                      >
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Primary International Shipping Routes with Corridor Visuals */}
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
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0b2240]/40 hover:shadow-lg transition group flex flex-col justify-between"
              >
                {/* Mini Image Banner for Route */}
                <div className="relative h-28 w-full overflow-hidden">
                  <Image
                    src={route.img}
                    alt={route.origin + ' to ' + route.dest}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  <div className="absolute top-2.5 left-3">
                    <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded shadow-xs">
                      {route.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between text-xs font-bold">
                    <span>{route.origin}</span>
                    <ArrowRight className="w-4 h-4 text-[#e22026]" />
                    <span>{route.dest}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-slate-700">{route.mode}</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-[#0b2240]" /> {route.freq}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {route.highlight}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Bonded Customs</span>
                    <Link 
                      href="/contact" 
                      className="font-bold text-[#0b2240] hover:text-[#e22026] flex items-center gap-1 transition"
                    >
                      Rate Quote <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Our Shipping Process Works */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
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
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                1
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Booking & Dispatch Intake</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unique tracking number generated, parcel weighed, measured, and verified with scannable QR label.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                2
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Export Screening & Hub Sorting</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                X-ray screening, export documentation review, and palletization for scheduled air or maritime departures.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0b2240] text-white font-black text-lg flex items-center justify-center border-4 border-slate-100 shadow-md">
                3
              </div>
              <h4 className="font-black text-base text-[#0b2240]">Transit & Customs Brokerage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live intercontinental transit updates with proactive destination customs clearance and tariff verification.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative text-center space-y-3">
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
      <section className="relative bg-gradient-to-r from-[#0b2240] to-[#123058] py-16 px-4 sm:px-8 text-white border-t border-slate-700 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Book or Track Your Freight?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
              Speak with a dedicated logistics specialist or input your tracking ID for instant milestone visibility.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/track"
              className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              Track Consignment
            </Link>
            <Link
              href="/contact"
              className="bg-white text-[#0b2240] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition"
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
