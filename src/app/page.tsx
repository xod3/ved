'use client';

import React, { useState, useEffect } from 'react';
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
  Building2,
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  MessageCircle,
  MapPin,
  Star,
  Award,
  Zap,
  Box,
  Check,
  Calculator,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Navigation,
  Eye,
  Radio,
  Layers,
  Smartphone,
  Send,
  Sparkles,
  QrCode,
  Store,
  RefreshCw
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  // State: Tracking input
  const [trackingId, setTrackingId] = useState('');

  // State: Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // State: Hero Tab (VED signature: track | estimate | book)
  const [activeHeroTab, setActiveHeroTab] = useState<'track' | 'estimate' | 'book'>('track');

  // State: Rate Calculator
  const [calcOrigin, setCalcOrigin] = useState('United States (JFK)');
  const [calcDest, setCalcDest] = useState('United Kingdom (London LHR)');
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcMode, setCalcMode] = useState<'express' | 'air' | 'ocean'>('express');

  // State: Volumetric Calculator
  const [boxLength, setBoxLength] = useState(45);
  const [boxWidth, setBoxWidth] = useState(35);
  const [boxHeight, setBoxHeight] = useState(30);
  const [boxActualWeight, setBoxActualWeight] = useState(7);

  // State: Milestone Journey Step
  const [activeJourneyStep, setActiveJourneyStep] = useState(2);

  // State: FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hero Slider Images & Highlights
  const heroSlides = [
    {
      id: 0,
      badge: 'CROSS-BORDER & DOMESTIC EXPRESS',
      title: 'Seamless Global Delivery, Fast & Reliable',
      highlight: 'From Your Doorstep to Anywhere in the World',
      image: '/images/air-cargo.jpg',
      statBadge: 'Direct Cargo Flights: USA • China • UK • Korea',
    },
    {
      id: 1,
      badge: 'E-COMMERCE & SOCIAL COMMERCE',
      title: 'Empowering Merchants Across Continents',
      highlight: 'End-to-End Fulfillment & Same-Day Dispatch',
      image: '/images/courier-delivery.jpg',
      statBadge: '100% Verified Delivery with Digital Signature',
    },
    {
      id: 2,
      badge: 'OCEAN & BULK FREIGHT',
      title: 'Cost-Effective Sea Cargo & Haulage',
      highlight: 'Full Container Load (FCL) & LCL Consolidation',
      image: '/images/ocean-ship.jpg',
      statBadge: 'Regular Maritime Sailings with Port Drayage',
    },
    {
      id: 3,
      badge: 'BONDED HUBS & WAREHOUSING',
      title: 'Smart Warehousing & Customs Pre-Clearance',
      highlight: '24/7 Monitored Storage Beside Major Gateways',
      image: '/images/warehouse.jpg',
      statBadge: 'Licensed Customs Brokerage in USA, China & UK',
    },
  ];

  // Auto-advance slider
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    const clean = trackingId.trim().toUpperCase().replace(/\s+/g, '-');
    router.push(`/track?id=${encodeURIComponent(clean)}`);
  };

  // Rate calculation formula
  const getRateEstimate = () => {
    const rate = calcMode === 'express' ? 16.5 : calcMode === 'air' ? 10.8 : 4.5;
    const base = calcMode === 'ocean' ? 110 : 35;
    const total = Math.round(calcWeight * rate + base);
    const eta = calcMode === 'express' ? '1–3 Business Days' : calcMode === 'air' ? '3–5 Business Days' : '18–24 Days Ocean';
    return { total, eta };
  };

  // Volumetric formula
  const volWeight = Number(((boxLength * boxWidth * boxHeight) / 5000).toFixed(1));
  const chargeableWeight = Math.max(volWeight, boxActualWeight);

  // Core Services
  const coreServices = [
    {
      title: 'Domestic Express Delivery',
      desc: 'Nationwide door-to-door courier delivery with same-day and next-day options for packages, documents, and retail goods.',
      badge: 'Fast & Secure',
      icon: Truck,
      image: '/images/courier-delivery.jpg',
      link: '/services#express-courier',
      tag: '24–48h Dispatch',
      features: ['Doorstep Pickup', 'Real-time SMS Updates', 'Proof of Delivery'],
    },
    {
      title: 'Overseas Shipping (Import & Export)',
      desc: 'Cross-border express and freight forwarding connecting the United Kingdom, the United States, China, Europe, and South Korea.',
      badge: '230+ Destinations',
      icon: Plane,
      image: '/images/air-cargo.jpg',
      link: '/services#air-freight',
      tag: 'Air & Sea Freight',
      features: ['Direct MAWB Integration', 'Duty & Tax Assessment', 'Global Tracking'],
    },
    {
      title: 'E-Commerce Merchant Logistics',
      desc: 'Built for online stores and social sellers with inventory management, smart fulfillment, and cash-on-delivery options.',
      badge: 'Merchant Solutions',
      icon: Store,
      image: '/images/fleet-van.jpg',
      link: '/services#door-to-door',
      tag: 'Tailored for Sellers',
      features: ['Automated Waybill Print', 'Dedicated Account Desk', 'Return Logistics'],
    },
    {
      title: 'Maritime Ocean & Bulk Haulage',
      desc: 'Reliable Full Container Load (FCL) and Less-than-Container Load (LCL) shipping across trans-Pacific and Atlantic trade lanes.',
      badge: 'Cost-Effective Bulk',
      icon: Ship,
      image: '/images/ocean-ship.jpg',
      link: '/services#ocean-freight',
      tag: 'FCL & LCL Cargo',
      features: ['Consolidation Ports', 'Vessel Space Guarantee', 'Port-to-Door Drayage'],
    },
    {
      title: 'Customs Clearance & Brokerage',
      desc: 'In-house licensed customs brokers handling export declarations, HS code classification, and import tax compliance.',
      badge: 'Zero Port Delay',
      icon: ShieldCheck,
      image: '/images/customs-port.jpg',
      link: '/services#customs',
      tag: 'Licensed Brokerage',
      features: ['Pre-Clearance Airborne', 'Tariff Verification', 'Regulatory Inspections'],
    },
    {
      title: 'Bonded Depots & Warehousing',
      desc: 'Secure climate-monitored facilities with barcode pallet tracking and distribution hubs near major international ports.',
      badge: 'Strategic Depots',
      icon: Building2,
      image: '/images/warehouse.jpg',
      link: '/services#warehousing',
      tag: '24/7 Monitored',
      features: ['Short & Long Term', 'ISPM-15 Crating', 'Inventory Control'],
    },
  ];

  // Journey milestones
  const journeySteps = [
    {
      step: '01',
      title: 'Booking & Waybill Creation',
      status: 'Order Placed',
      desc: 'Consignment details logged in database, unique waybill number generated with scannable barcode label.',
      image: '/images/hero-cargo.jpg',
      icon: Package,
    },
    {
      step: '02',
      title: 'Pickup & Gateway Sort',
      status: 'Hub Intake',
      desc: 'Driver collects parcel, X-ray security inspection passed, cargo consolidated into Unit Load Device.',
      image: '/images/cargo-crating.jpg',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Air / Sea Linehaul Transit',
      status: 'In Transit',
      desc: 'Direct scheduled flight departure with continuous real-time satellite telemetry and status updates.',
      image: '/images/air-cargo.jpg',
      icon: Plane,
    },
    {
      step: '04',
      title: 'Customs Pre-Clearance',
      status: 'Customs Cleared',
      desc: 'Destination customs documents filed electronically and cleared while shipment is airborne.',
      image: '/images/customs-port.jpg',
      icon: FileText,
    },
    {
      step: '05',
      title: 'Final Mile Delivery',
      status: 'Delivered',
      desc: 'Express dispatch van delivers to recipient doorstep with digital signature confirmation.',
      image: '/images/courier-delivery.jpg',
      icon: Truck,
    },
  ];

  // Cross-border corridors
  const tradeCorridors = [
    {
      origin: 'United States',
      dest: 'United Kingdom',
      mode: 'Air Cargo Express',
      freq: 'Daily Flights',
      route: 'JFK/ORD → London (LHR) & Manchester',
      badge: 'Popular Route',
      image: '/images/courier-delivery.jpg',
      time: '2–4 Days Express',
    },
    {
      origin: 'China',
      dest: 'United Kingdom',
      mode: 'Air Cargo & Ocean',
      freq: '3x Weekly Flights',
      route: 'Guangzhou/Shenzhen → London (LHR)',
      badge: 'Direct Express',
      image: '/images/customs-port.jpg',
      time: '3–5 Days Air • 20 Days Ocean',
    },
    {
      origin: 'United States',
      dest: 'China',
      mode: 'Commercial Air Freight',
      freq: 'Daily Departures',
      route: 'JFK/LAX → Shanghai (PVG)',
      badge: 'High-Volume Trade',
      image: '/images/air-cargo.jpg',
      time: '1–3 Days Transit',
    },
    {
      origin: 'South Korea',
      dest: 'United States',
      mode: 'Air Linehaul Charter',
      freq: 'Scheduled Cargo',
      route: 'Incheon (ICN) → LAX & Chicago',
      badge: 'Tech & Electronics',
      image: '/images/hero-cargo.jpg',
      time: '24–48h Air Linehaul',
    },
  ];

  // FAQ list
  const faqs = [
    {
      q: 'How do I track my shipment or waybill on VED Courier?',
      a: 'Enter your tracking waybill number (e.g. VED-2026-000101) in the tracking bar. Our platform pulls the real-time record from our live database, displaying current location, customs status, and milestone progression.',
    },
    {
      q: 'Can I book a package pickup directly from my home or office?',
      a: 'Yes. You can request a pickup online or message our 24/7 WhatsApp dispatch desk (+1 808 301-0314). A dedicated courier driver will arrive at your premises, weigh and measure the package, and issue an official waybill on the spot.',
    },
    {
      q: 'What international shipping corridors does VED Courier cover?',
      a: 'We operate scheduled air and ocean freight connecting the United Kingdom, the United States, China, South Korea, Europe, and 230+ destinations globally with bonded customs clearance at all major ports.',
    },
    {
      q: 'How does VED Courier protect customer privacy on public tracking?',
      a: 'Under our strict Privacy Guard standard, public tracking displays only city/state milestones and delivery confirmations. Personal telephone numbers, full residential street numbers, and commercial tariff invoices are never displayed publicly.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── 1. HERO SECTION: SPLIT LAYOUT IN PURPLE & WHITE ─────────── */}
      <section className="relative bg-gradient-to-b from-[#faf5ff] via-white to-white pt-10 pb-20 px-4 sm:px-8 border-b border-purple-100 overflow-hidden">
        {/* Subtle decorative purple background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading + Interactive Action Card */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-purple-100/80 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-900 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-purple-700 animate-pulse" />
                GLOBAL LOGISTICS &amp; FREIGHT FORWARDING
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2e0854] tracking-tight leading-[1.1]">
                  Seamless Delivery Solutions, <br />
                  <span className="text-purple-700">Locally &amp; Globally.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Empowering commerce and connecting businesses and individuals with fast, reliable cross-border shipping across the USA, the UK, China, South Korea, and 230+ global destinations.
                </p>
              </div>

              {/* ── Interactive Tabbed Action Card ── */}
              <div className="bg-white rounded-3xl shadow-xl border border-purple-200/80 overflow-hidden">
                {/* Tabs Header */}
                <div className="grid grid-cols-3 bg-purple-50/70 border-b border-purple-100 text-xs sm:text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('track')}
                    className={`py-3.5 px-4 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeHeroTab === 'track'
                        ? 'bg-white text-purple-800 border-b-2 border-purple-700 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-purple-700'
                    }`}
                  >
                    <Search className="w-4 h-4 text-purple-700" />
                    <span>Track Waybill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('estimate')}
                    className={`py-3.5 px-4 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeHeroTab === 'estimate'
                        ? 'bg-white text-purple-800 border-b-2 border-purple-700 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-purple-700'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-purple-700" />
                    <span>Cost Estimator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('book')}
                    className={`py-3.5 px-4 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeHeroTab === 'book'
                        ? 'bg-white text-purple-800 border-b-2 border-purple-700 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-purple-700'
                    }`}
                  >
                    <Send className="w-4 h-4 text-purple-700" />
                    <span>Book Pickup</span>
                  </button>
                </div>

                {/* Tab 1: Track Waybill */}
                {activeHeroTab === 'track' && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Package className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          placeholder="Enter Waybill / Tracking ID (e.g. VED-2026-000101)"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-purple-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 transition"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                      >
                        <span>Track Waybill</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Official Format Helper */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1 text-slate-500">
                      <span className="font-semibold text-[11px]">Official Format:</span>
                      <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">VED-2026-XXXXXX</span>
                      <span className="text-[11px] text-slate-400">• Real-time multi-carrier tracking</span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Cost Estimator */}
                {activeHeroTab === 'estimate' && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Origin</label>
                        <select
                          value={calcOrigin}
                          onChange={(e) => setCalcOrigin(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-purple-200 rounded-lg text-xs font-semibold text-slate-900"
                        >
                          <option value="United States (JFK)">New York (USA)</option>
                          <option value="China (Guangzhou CAN)">Guangzhou (China)</option>
                          <option value="United Kingdom (London LHR)">London (United Kingdom)</option>
                          <option value="South Korea (Seoul ICN)">Seoul (Korea)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination</label>
                        <select
                          value={calcDest}
                          onChange={(e) => setCalcDest(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-purple-200 rounded-lg text-xs font-semibold text-slate-900"
                        >
                          <option value="United Kingdom (London LHR)">London (United Kingdom)</option>
                          <option value="United States (JFK)">New York (USA)</option>
                          <option value="China (Shanghai PVG)">Shanghai (China)</option>
                          <option value="South Korea (Seoul ICN)">Seoul (Korea)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(Number(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-slate-50 border border-purple-200 rounded-lg text-xs font-semibold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-purple-700 block">Indicative Cost</span>
                        <span className="text-lg font-black text-purple-950">${getRateEstimate().total} USD</span>
                        <span className="text-xs text-slate-500 ml-2">({getRateEstimate().eta})</span>
                      </div>
                      <Link
                        href={`/contact?subject=Estimate%20Quote%20${calcWeight}kg`}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
                      >
                        Book at this rate
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tab 3: Book Pickup */}
                {activeHeroTab === 'book' && (
                  <div className="p-5 sm:p-6 space-y-3">
                    <p className="text-xs text-slate-600">
                      Request a door-to-door courier dispatch. A VED Logistics driver will collect your parcels from your home, factory, or office.
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/contact?subject=Request%20Pickup"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-center text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Schedule Pickup Now</span>
                      </Link>
                      <a
                        href="https://wa.me/18083010314"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 border border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0"
                        title="Chat with Dispatch on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>WhatsApp Dispatch</span>
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column: Hero Logistics Slider in Purple Frame */}
            <div 
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-200/80 bg-[#2e0854] aspect-4/3 sm:aspect-16/11">
                {heroSlides.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                      />
                      {/* Purple Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#240643] via-[#2e0854]/40 to-transparent" />

                      {/* Floating Card Overlay */}
                      <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-900/80 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-purple-400/30">
                          {slide.badge}
                        </span>
                        <h3 className="text-xl font-black leading-tight text-white drop-shadow-sm">
                          {slide.title}
                        </h3>
                        <p className="text-xs text-purple-200 line-clamp-1">
                          {slide.highlight}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Slider Nav Buttons */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-purple-700 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-purple-700 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === currentSlide ? 'w-6 bg-purple-400' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Live Telemetry Badge */}
              <div className="absolute -bottom-4 left-6 right-6 bg-white rounded-2xl p-3 shadow-lg border border-purple-100 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-[#2e0854]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>VED Network Live:</span>
                </div>
                <span className="text-[11px] font-mono text-purple-700 font-semibold truncate">
                  {heroSlides[currentSlide].statBadge}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. STATS COUNTER STRIP (PURPLE & WHITE) ───────── */}
      <section className="bg-white py-12 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-3xl sm:text-4xl font-black text-purple-800">230+</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">Global Destinations</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-3xl sm:text-4xl font-black text-purple-800">36</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">States &amp; Global Hubs</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-3xl sm:text-4xl font-black text-purple-800">99.8%</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">On-Time Dispatch Rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-3xl sm:text-4xl font-black text-purple-800">24/7</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">Live Tracking &amp; Support</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. CORE SERVICES SECTION WITH PICTURES ─────────────── */}
      <section className="py-20 bg-slate-50/70 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              CORE LOGISTICS SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2e0854] tracking-tight">
              Tailored Shipping for Individuals &amp; Enterprises
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              From personal doorstep packages to enterprise sea container freight and licensed customs clearance, VED Courier delivers with speed and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {coreServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
                >
                  {/* Photo Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#240643]/90 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-purple-800 p-2 rounded-xl shadow-md">
                      <Icon className="w-5 h-5 text-purple-700" />
                    </div>

                    <div className="absolute top-3 right-3 bg-purple-700 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      {svc.badge}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold text-purple-300 uppercase block">{svc.tag}</span>
                      <h3 className="text-lg font-black text-white">{svc.title}</h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {svc.desc}
                      </p>

                      <ul className="space-y-2 text-xs text-slate-700">
                        {svc.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-purple-50 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400">VED Certified</span>
                      <Link
                        href={svc.link}
                        className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
                      >
                        Explore Service <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 4. VED MOBILE APP / DIGITAL EXPERIENCE ─────────── */}
      <section className="py-20 bg-gradient-to-r from-[#2e0854] via-[#3b0764] to-[#240643] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-black tracking-widest text-purple-300 uppercase bg-purple-900/80 px-3.5 py-1 rounded-full border border-purple-500/30">
                VEDGo MOBILE ECOSYSTEM
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Ship, Track &amp; Manage Deliveries On The Go
              </h2>
              <p className="text-purple-200 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience logistics without friction. Book doorstep pickups in seconds, track packages in real-time with satellite GPS, receive instant delivery notifications, and print scannable barcode waybills.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-purple-950/60 p-4 rounded-2xl border border-purple-800/60">
                  <QrCode className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-white">Scannable QR Waybills</h5>
                    <p className="text-xs text-purple-300 mt-0.5">Instant barcode generation on your device.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-purple-950/60 p-4 rounded-2xl border border-purple-800/60">
                  <Smartphone className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-white">Real-Time Push Alerts</h5>
                    <p className="text-xs text-purple-300 mt-0.5">Checkpoints sent straight to your phone.</p>
                  </div>
                </div>
              </div>

              {/* App Badges */}
              <div className="flex items-center gap-4 pt-4 flex-wrap">
                <div className="bg-black/60 hover:bg-black text-white px-5 py-3 rounded-2xl border border-purple-700/60 flex items-center gap-3 cursor-pointer transition">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block leading-none">Download On</span>
                    <span className="font-bold text-sm">Apple App Store</span>
                  </div>
                </div>

                <div className="bg-black/60 hover:bg-black text-white px-5 py-3 rounded-2xl border border-purple-700/60 flex items-center gap-3 cursor-pointer transition">
                  <QrCode className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block leading-none">Get It On</span>
                    <span className="font-bold text-sm">Google Play Store</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Visual Simulation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm bg-white rounded-3xl p-4 shadow-2xl text-slate-900 border-4 border-purple-400/40">
                <div className="bg-[#2e0854] text-white p-4 rounded-2xl space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-purple-300" /> VED Express Mobile
                    </span>
                    <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full">LIVE</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase font-bold block">Current Active Waybill</span>
                    <span className="font-mono font-black text-sm">VED-2026-000101</span>
                    <span className="block text-xs text-emerald-300 mt-0.5 font-bold">Customs Cleared • Out for Delivery</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <span className="font-bold text-purple-900">Estimated Delivery</span>
                    <span className="font-semibold text-slate-700">Today by 16:00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-700">Destination</span>
                    <span className="font-semibold text-slate-700">Shanghai Gateway (PVG)</span>
                  </div>
                </div>

                <Link
                  href="/track"
                  className="mt-4 w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>Track Your Package Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. INTERACTIVE HOW IT WORKS STEPPER ──────── */}
      <section className="py-20 bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              HOW SHIPPING WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2e0854] tracking-tight">
              5 Steps from Booking to Delivery
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every parcel moves with verified timestamps, scannable barcode manifests, and electronic proof of delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {journeySteps.map((s, idx) => (
              <div
                key={idx}
                className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100 hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-purple-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                      {s.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#2e0854] mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="pt-2 border-t border-purple-100 flex items-center gap-1 text-[11px] text-purple-800 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>Verified Checkpoint</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. CROSS-BORDER TRADE CORRIDORS ───────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              GLOBAL TRADE LANES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2e0854] tracking-tight">
              Direct Cross-Border Corridors
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We operate dedicated linehauls connecting the Americas, West Africa, and East Asia with guaranteed cargo space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeCorridors.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.origin + ' to ' + c.dest}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#240643]/90 via-[#2e0854]/40 to-transparent" />
                  <div className="absolute top-3 left-3 bg-purple-700 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {c.badge}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-xs font-black">
                    <span>{c.origin}</span>
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                    <span>{c.dest}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-purple-900">{c.mode}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-600">{c.freq}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{c.route}</p>
                  <p className="text-xs text-purple-800 font-bold">{c.time}</p>

                  <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Customs Included</span>
                    <Link
                      href={`/contact?subject=${encodeURIComponent(`Route Quote: ${c.origin} to ${c.dest}`)}`}
                      className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
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

      {/* ─── 7. INTERACTIVE VOLUMETRIC WEIGHT CALCULATOR TOOL ─────────── */}
      <section className="py-20 bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-purple-50/70 rounded-3xl p-8 sm:p-10 border border-purple-200 shadow-md space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-white px-3 py-1 rounded-full border border-purple-200">
                SHIPPING TOOL
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2e0854]">
                Volumetric Weight Calculator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Aviation carriers assess freight costs using standard international formula: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-purple-900">(Length × Width × Height in cm) ÷ 5,000</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Length: <span className="text-purple-700">{boxLength} cm</span></label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={boxLength}
                  onChange={(e) => setBoxLength(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Width: <span className="text-purple-700">{boxWidth} cm</span></label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={boxWidth}
                  onChange={(e) => setBoxWidth(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Height: <span className="text-purple-700">{boxHeight} cm</span></label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={boxHeight}
                  onChange={(e) => setBoxHeight(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Actual Scale: <span className="text-purple-900">{boxActualWeight} kg</span></label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={boxActualWeight}
                  onChange={(e) => setBoxActualWeight(Number(e.target.value))}
                  className="w-full accent-purple-900"
                />
              </div>
            </div>

            {/* Computation Display */}
            <div className="p-6 bg-white rounded-2xl border border-purple-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volumetric Weight</span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">{volWeight} kg</span>
                <span className="text-[11px] text-slate-500">({boxLength} × {boxWidth} × {boxHeight} ÷ 5000)</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scale Reading</span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">{boxActualWeight} kg</span>
                <span className="text-[11px] text-slate-500">Actual package weight</span>
              </div>

              <div className="bg-purple-700 text-white p-4 rounded-xl shadow-md">
                <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">Chargeable Freight Weight</span>
                <span className="text-3xl font-black text-white font-mono mt-0.5 block">{chargeableWeight} kg</span>
                <span className="text-[10px] text-purple-200">
                  {chargeableWeight === volWeight ? 'Volumetric weight applies' : 'Actual scale weight applies'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. CLIENT REVIEWS & TESTIMONIALS ──────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              CUSTOMER SATISFACTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2e0854] tracking-tight">
              Trusted by 10,000+ Shippers Worldwide
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Read how e-commerce brands, industrial manufacturers, and international traders rely on VED Courier Logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-7 border border-purple-100 shadow-sm space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                “Our telecommunications hardware shipped from Guangzhou to London Heathrow arrived 2 days ahead of schedule. The door-to-door delivery and automated tracking notifications were exceptional.”
              </p>
              <div className="pt-3 border-t border-purple-50">
                <p className="font-extrabold text-sm text-[#2e0854]">Arthur Pemberton</p>
                <p className="text-[11px] text-purple-700 font-semibold">Managing Director, Meridian Tech Ltd (London)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Route: China → United Kingdom Express</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-purple-100 shadow-sm space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                “VED Courier handles our high-precision optical sensors from New York into Shanghai. The customs clearance transparency and real-time updates save us hours of back-and-forth.”
              </p>
              <div className="pt-3 border-t border-purple-50">
                <p className="font-extrabold text-sm text-[#2e0854]">David K.</p>
                <p className="text-[11px] text-purple-700 font-semibold">Supply Chain Director, Apex Precision</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Route: United States → China</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-purple-100 shadow-sm space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                “As an e-commerce business owner shipping from the USA to customers across the United Kingdom and Europe, VED Courier has eliminated all customs hassles. Their digital tracking gives my buyers peace of mind.”
              </p>
              <div className="pt-3 border-t border-purple-50">
                <p className="font-extrabold text-sm text-[#2e0854]">Eleanor Davies</p>
                <p className="text-[11px] text-purple-700 font-semibold">Founder, Davies &amp; Co. Retail</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Route: USA → United Kingdom Doorstep</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 9. FREQUENTLY ASKED QUESTIONS (ACCORDION) ────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-3xl font-black text-[#2e0854] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-purple-50/50 rounded-2xl border border-purple-100 overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-[#2e0854] flex items-center justify-between gap-4 cursor-pointer hover:bg-purple-100/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-700 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-purple-100 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 10. CTA BANNER IN ROYAL PURPLE ─────────────────── */}
      <section className="bg-gradient-to-r from-[#2e0854] via-purple-800 to-[#2e0854] py-16 px-4 sm:px-8 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to Ship with VED Courier Logistics?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 mt-1.5">
              Book your pickup online, request a custom corporate rate, or track an existing consignment now.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/track"
              className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm shadow-lg transition"
            >
              Track Waybill
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm transition"
            >
              Contact Freight Desk
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
