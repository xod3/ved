import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  ArrowRight,
  Plane,
  Ship,
  Truck
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b2240] text-slate-300 pt-16 pb-8 border-t-4 border-[#e22026]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                <Image
                  src="/images/ved-logo.png"
                  alt="VED Courier Logistics"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  VED <span className="text-[#e22026]">COURIER</span>
                </span>
                <p className="text-xs font-bold tracking-widest text-slate-400">
                  FAST • SAFE • GLOBAL
                </p>
              </div>
            </div>

            <p className="text-white font-semibold text-lg italic border-l-2 border-[#e22026] pl-3 py-0.5">
              “Your Shipment. Our Responsibility.”
            </p>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Specialized intercontinental freight forwarding, door-to-door express parcel delivery, air cargo, ocean shipping, and integrated customs brokerage connecting the Americas, Asia, Africa, and global commercial trade hubs.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-[#163866] px-2.5 py-1 rounded text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Insured Cargo
              </span>
              <span className="flex items-center gap-1 bg-[#163866] px-2.5 py-1 rounded text-slate-200">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" /> IATA Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-sm border-b border-slate-700 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#air-freight" className="hover:text-white flex items-center gap-1.5 transition">
                  <Plane className="w-3.5 h-3.5 text-[#e22026]" /> Air Freight Cargo
                </Link>
              </li>
              <li>
                <Link href="/services#ocean-freight" className="hover:text-white flex items-center gap-1.5 transition">
                  <Ship className="w-3.5 h-3.5 text-[#e22026]" /> Ocean / Sea Shipping
                </Link>
              </li>
              <li>
                <Link href="/services#express-courier" className="hover:text-white flex items-center gap-1.5 transition">
                  <Truck className="w-3.5 h-3.5 text-[#e22026]" /> International Express
                </Link>
              </li>
              <li>
                <Link href="/services#door-to-door" className="hover:text-white flex items-center gap-1.5 transition">
                  <ArrowRight className="w-3 h-3 text-[#e22026]" /> Door-to-Door Delivery
                </Link>
              </li>
              <li>
                <Link href="/services#customs" className="hover:text-white flex items-center gap-1.5 transition">
                  <ArrowRight className="w-3 h-3 text-[#e22026]" /> Customs Clearance
                </Link>
              </li>
              <li>
                <Link href="/services#warehousing" className="hover:text-white flex items-center gap-1.5 transition">
                  <ArrowRight className="w-3 h-3 text-[#e22026]" /> Bonded Warehousing
                </Link>
              </li>
            </ul>
          </div>

          {/* International Trade Routes */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-sm border-b border-slate-700 pb-2">
              Key Routes
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center justify-between py-0.5 border-b border-slate-800">
                <span>United States ↔ China</span>
                <span className="text-[11px] text-[#e22026] font-semibold">Daily Flight</span>
              </li>
              <li className="flex items-center justify-between py-0.5 border-b border-slate-800">
                <span>China ↔ Nigeria</span>
                <span className="text-[11px] text-[#e22026] font-semibold">Priority Air</span>
              </li>
              <li className="flex items-center justify-between py-0.5 border-b border-slate-800">
                <span>United States ↔ Nigeria</span>
                <span className="text-[11px] text-[#e22026] font-semibold">Express</span>
              </li>
              <li className="flex items-center justify-between py-0.5 border-b border-slate-800">
                <span>South Korea ↔ USA</span>
                <span className="text-[11px] text-[#e22026] font-semibold">Direct Hub</span>
              </li>
              <li className="flex items-center justify-between py-0.5">
                <span>Europe & Global</span>
                <span className="text-[11px] text-slate-400">Worldwide</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-sm border-b border-slate-700 pb-2">
              Global Support
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e22026] shrink-0 mt-1" />
                <span className="text-xs leading-relaxed text-slate-300">
                  100 Global Logistics Parkway, Suite 400, New York, NY 10001, USA
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e22026] shrink-0" />
                <a href="tel:+18005928334" className="text-xs hover:text-white text-slate-200 font-medium">
                  +1 (800) 592-8334
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e22026] shrink-0" />
                <a href="mailto:support@vedcourier.com" className="text-xs hover:text-white text-slate-200">
                  support@vedcourier.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#e22026] shrink-0" />
                <span className="text-xs text-slate-300">
                  Dispatch: 24/7/365 Non-Stop
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VED COURIER LOGISTICS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Conditions of Carriage</Link>
            <Link href="/contact" className="hover:text-white transition">Support Inquiries</Link>
            <Link href="/admin/login" className="hover:text-white transition text-slate-400 hover:text-slate-200">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
