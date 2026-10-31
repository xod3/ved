import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Globe2, 
  Award, 
  Building2, 
  Plane, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Package
} from 'lucide-react';

export default function AboutPage() {
  const hubs = [
    {
      title: 'North America Gateway',
      location: 'New York (JFK) & Los Angeles (LAX)',
      desc: 'Direct trans-Pacific and trans-Atlantic air freight dispatch facilities with 24/7 cold-chain and bonded handling.',
      image: '/images/air-cargo.jpg',
    },
    {
      title: 'United Kingdom & Europe Gateway',
      location: 'London (LHR) & Manchester (MAN), United Kingdom',
      desc: 'Heathrow World Cargo Centre operations with dedicated customs pre-clearance and nationwide last-mile delivery fleet.',
      image: '/images/courier-delivery.jpg',
    },
    {
      title: 'East Asia Gateway',
      location: 'Shanghai (PVG) & Guangzhou (CAN), China',
      desc: 'Pudong and Baiyun Freight Centers connecting major manufacturing corridors directly to the United Kingdom and the Americas.',
      image: '/images/customs-port.jpg',
    },
    {
      title: 'Northeast Asia Hub',
      location: 'Seoul Incheon (ICN), South Korea',
      desc: 'Incheon International Air Cargo Terminal serving Korean electronics, automotive, and high-tech exporters.',
      image: '/images/warehouse.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner with Logistics Backdrop */}
      <section className="relative bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] text-white py-16 sm:py-20 px-4 sm:px-8 border-b-4 border-purple-500 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/customs-port.jpg"
            alt="International Port Logistics"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#240643]/95 via-[#2e0854]/90 to-[#2e0854]/80" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <span className="text-xs font-black tracking-widest text-purple-300 uppercase bg-purple-900/80 px-3 py-1 rounded-full border border-purple-400/30">
            ABOUT VED COURIER LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Connecting Continents With Uncompromising Care
          </h1>
          <p className="text-purple-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            Founded on the principle that international freight requires absolute transparency and accountability, VED COURIER LOGISTICS provides technology-driven courier, air cargo, ocean shipping, and customs brokerage worldwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        
        {/* Mission and Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full">
              OUR MISSION &amp; OPERATIONAL DOCTRINE
            </span>
            <h2 className="text-3xl font-black text-[#2e0854] tracking-tight">
              “Your Shipment. Our Responsibility.”
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At VED COURIER LOGISTICS, our motto is not a marketing slogan—it is the operational doctrine governing every parcel, pallet, and container we receive. In an industry often clouded by opaque tracking, unexpected delays, and unaccountable intermediaries, we stand out by offering direct, persistent visibility from intake to final sign-off.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We specialize in complex, high-demand international trade corridors including the United States, the United Kingdom, China, South Korea, and European gateways. Whether shipping precision medical sensors from California to London, industrial robotics from Seoul to Chicago, or commercial e-commerce goods from Guangzhou to Manchester, our team handles each consignment with rigorous care.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 shadow-2xs">
                <span className="text-2xl font-black text-purple-900">100%</span>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Chain-of-Custody Tracking</p>
              </div>
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 shadow-2xs">
                <span className="text-2xl font-black text-purple-700">24/7/365</span>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Global Station Operations</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100 text-center space-y-4 max-w-sm w-full">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-2">
                <Image
                  src="/images/fleet-van.jpg"
                  alt="VED COURIER Delivery Fleet"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-20 h-20 mx-auto relative -mt-10 bg-white p-2 rounded-2xl shadow-md border border-purple-100 flex items-center justify-center">
                <Image
                  src="/images/ved-logo.png"
                  alt="VED COURIER LOGISTICS"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-[#2e0854]">VED COURIER LOGISTICS</h3>
              <p className="text-xs font-bold tracking-widest text-purple-700">
                FAST • SAFE • GLOBAL
              </p>
              <div className="pt-3 border-t border-purple-50 text-left space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Licensed International Freight Forwarder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Customs Bonded Warehouse Facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Real-Time Milestone Database Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Network Hubs */}
        <div className="bg-purple-50/50 rounded-3xl p-8 sm:p-12 shadow-xs border border-purple-100 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-white px-3 py-1 rounded-full border border-purple-200">
              STRATEGIC INFRASTRUCTURE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2e0854]">
              Our International Gateway Stations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct physical operations positioned at key aviation and maritime trade crossroads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hubs.map((hub, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-purple-100 bg-white flex flex-col group hover:shadow-lg transition">
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    src={hub.image}
                    alt={hub.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#240643]/70 to-transparent" />
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">{hub.title}</span>
                    <h4 className="font-extrabold text-sm text-[#2e0854]">{hub.location}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {hub.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-[#240643] via-[#2e0854] to-purple-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black">Ready to Ship with VED Courier?</h3>
            <p className="text-xs sm:text-sm text-purple-200">
              Speak with a logistics coordinator today or track an existing active consignment.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/track"
              className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition shadow-md"
            >
              Track Waybill
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
