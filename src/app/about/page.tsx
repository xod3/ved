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

      {/* Header Banner with Real Background Image */}
      <section className="relative bg-[#0b2240] text-white py-20 px-4 sm:px-8 border-b-4 border-[#e22026] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/customs-port.jpg"
            alt="International Port Logistics"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#0b2240]/90 to-[#0b2240]/80" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
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
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-2xl font-black text-[#0b2240]">100%</span>
                <p className="text-xs text-slate-500 font-medium">Chain-of-Custody Tracking</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-2xl font-black text-[#e22026]">24/7/365</span>
                <p className="text-xs text-slate-500 font-medium">Global Terminal Operations</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center space-y-4 max-w-sm">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-2">
                <Image
                  src="/images/fleet-van.jpg"
                  alt="VED Courier Delivery Fleet"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-20 h-20 mx-auto relative -mt-10 bg-white p-2 rounded-2xl shadow-md border border-slate-100">
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
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
              <div className="relative h-28 w-full">
                <Image
                  src="/images/air-cargo.jpg"
                  alt="New York JFK Hub"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1 flex-1">
                <span className="text-[11px] font-bold text-[#e22026] uppercase">North America Hub</span>
                <h4 className="font-extrabold text-sm text-[#0b2240]">New York (JFK) & LAX</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct trans-Pacific and trans-Atlantic air freight dispatch facilities.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
              <div className="relative h-28 w-full">
                <Image
                  src="/images/customs-port.jpg"
                  alt="Shanghai PVG Hub"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1 flex-1">
                <span className="text-[11px] font-bold text-[#e22026] uppercase">East Asia Hub</span>
                <h4 className="font-extrabold text-sm text-[#0b2240]">Shanghai (PVG) & CAN</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pudong & Baiyun Freight Center connecting Chinese manufacturing.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
              <div className="relative h-28 w-full">
                <Image
                  src="/images/courier-delivery.jpg"
                  alt="Lagos LOS Hub"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1 flex-1">
                <span className="text-[11px] font-bold text-[#e22026] uppercase">West Africa Hub</span>
                <h4 className="font-extrabold text-sm text-[#0b2240]">Lagos (LOS) & Abuja</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Murtala Muhammed Cargo Complex & in-country customs clearance fleet.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
              <div className="relative h-28 w-full">
                <Image
                  src="/images/warehouse.jpg"
                  alt="Seoul ICN Hub"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1 flex-1">
                <span className="text-[11px] font-bold text-[#e22026] uppercase">Northeast Asia Hub</span>
                <h4 className="font-extrabold text-sm text-[#0b2240]">Seoul Incheon (ICN)</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Incheon International Air Cargo Terminal. Robotics & semiconductor export center.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
