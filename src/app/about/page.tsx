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
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0b2240] text-white py-16 px-4 sm:px-8 border-b-4 border-[#e22026]">
        <div className="max-w-6xl mx-auto space-y-4">
          <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
            ABOUT VED COURIER LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Connecting Continents With Uncompromising Care
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Founded on the principle that international freight requires absolute transparency and accountability, VED COURIER LOGISTICS provides seamless courier, air cargo, and freight forwarding worldwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        
        {/* Mission and Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              OUR MISSION & PURPOSE
            </span>
            <h2 className="text-3xl font-black text-[#0b2240] tracking-tight">
              “Your Shipment. Our Responsibility.”
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At VED COURIER LOGISTICS, our motto is not a marketing slogan—it is the operational doctrine governing every parcel, pallet, and container we receive. In an industry often clouded by opaque tracking, unexpected delays, and unaccountable intermediaries, we stand out by offering direct, persistent visibility from intake to final sign-off.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We specialize in complex, high-demand international trade corridors including the United States, China, Nigeria, South Korea, and European gateways. Whether shipping precision medical sensors from California to Abuja, industrial robotics from Seoul to Chicago, or electronic cargo from Guangzhou to Lagos, our team handles each consignment with rigorous care.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-2xl font-black text-[#0b2240]">100%</span>
                <p className="text-xs text-slate-500 font-medium">Chain-of-Custody Tracking</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-2xl font-black text-[#e22026]">24/7/365</span>
                <p className="text-xs text-slate-500 font-medium">Global Terminal Operations</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-4 max-w-sm">
              <div className="w-28 h-28 mx-auto relative">
                <Image
                  src="/images/ved-logo.png"
                  alt="VED Courier Logistics"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-[#0b2240]">VED COURIER LOGISTICS</h3>
              <p className="text-xs font-bold tracking-widest text-[#e22026]">
                FAST • SAFE • GLOBAL
              </p>
              <div className="pt-3 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Licensed International Freight Forwarder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customs Bonded Warehouse Facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-Time Milestone Database Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Network Hubs */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              STRATEGIC INFRASTRUCTURE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0b2240]">
              Our International Gateway Hubs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct physical operations positioned at the crossroads of global logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-[#e22026]">North America Hub</span>
              <h4 className="font-extrabold text-base text-[#0b2240]">New York (JFK) & Los Angeles (LAX)</h4>
              <p className="text-xs text-slate-500">
                100 Global Logistics Parkway, New York. Direct trans-Pacific and trans-Atlantic air freight dispatch facilities.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-[#e22026]">East Asia Hub</span>
              <h4 className="font-extrabold text-base text-[#0b2240]">Shanghai (PVG) & Guangzhou (CAN)</h4>
              <p className="text-xs text-slate-500">
                Pudong Cargo Gateway & Baiyun Freight Center. Daily line-hauls connecting Chinese manufacturing with global destinations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-[#e22026]">West Africa Hub</span>
              <h4 className="font-extrabold text-base text-[#0b2240]">Lagos (LOS) & Abuja (ABV)</h4>
              <p className="text-xs text-slate-500">
                Murtala Muhammed Cargo Complex & Abuja Central Depot. Comprehensive in-country customs clearance and last-mile delivery fleet.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-[#e22026]">Northeast Asia Hub</span>
              <h4 className="font-extrabold text-base text-[#0b2240]">Seoul Incheon (ICN)</h4>
              <p className="text-xs text-slate-500">
                Incheon International Air Cargo Terminal. Precision robotics and semiconductor export dispatch center.
              </p>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
              STANDARDS & GUARANTEES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0b2240]">
              The Four Pillars of VED Logistics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-[#e22026] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0b2240]">Cargo Security</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tamper-evident seals, continuous CCTV monitoring, and strict chain-of-custody handovers prevent loss or damage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0b2240] flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0b2240]">Regulatory Mastery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Expert customs brokerage ensuring full HS compliance, export permits, and minimized border holds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0b2240]">On-Time Linehaul</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled departures and pre-booked airline capacity guarantee dependable delivery timelines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0b2240]">Human Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct phone and WhatsApp access to licensed logistics officers who can answer specific consignment questions.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
