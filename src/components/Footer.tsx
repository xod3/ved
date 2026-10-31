import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone, Mail, MapPin, Clock, ShieldCheck, Globe2, ArrowRight,
  Plane, Ship, Truck, Smartphone, MessageSquare
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#240643] text-purple-200">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/60">
          
          {/* Brand Column (GIGL Style) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-14 h-14 bg-white rounded-xl p-1 border border-purple-300 shadow-md flex items-center justify-center shrink-0">
                <Image
                  src="/images/ved-logo.png"
                  alt="VED COURIER LOGISTICS"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  VED <span className="text-purple-400">COURIER</span> LOGISTICS
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-purple-300 uppercase">
                  FAST • SAFE • GLOBAL
                </span>
              </div>
            </Link>

            <blockquote className="text-white font-semibold text-sm italic border-l-3 border-purple-500 pl-4 py-0.5 leading-relaxed">
              "Your Shipment. Our Responsibility."
            </blockquote>

            <p className="text-sm text-purple-200/90 leading-relaxed max-w-sm">
              Africa and global technology-driven courier, freight forwarding, and e-commerce logistics platform connecting the United States, Nigeria, China, South Korea, and 230+ international trade gateways.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/60 text-purple-200 text-xs px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Insured Cargo
              </div>
              <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/60 text-purple-200 text-xs px-3 py-1.5 rounded-full">
                <Globe2 className="w-3.5 h-3.5 text-purple-300" /> 230+ Global Destinations
              </div>
            </div>
          </div>

          {/* Logistics Services */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-b border-purple-900/80 pb-2">
              Logistics Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/services#air-freight', icon: Plane, label: 'International Air Cargo' },
                { href: '/services#ocean-freight', icon: Ship, label: 'Ocean Container Shipping' },
                { href: '/services#express-courier', icon: Truck, label: 'Express Doorstep Delivery' },
                { href: '/services#door-to-door', icon: ArrowRight, label: 'E-Commerce Merchant Logistics' },
                { href: '/services#customs', icon: ShieldCheck, label: 'Customs Pre-Clearance' },
                { href: '/services#warehousing', icon: ArrowRight, label: 'Bonded Warehousing Depots' },
              ].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-purple-200 hover:text-white transition group">
                    <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Trade Routes */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-b border-purple-900/80 pb-2">
              Active Trade Corridors
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['USA ↔ China', 'Daily Departures'],
                ['China ↔ Nigeria', 'Priority Air & Ocean'],
                ['USA ↔ Nigeria', 'Express Linehaul'],
                ['South Korea ↔ USA', 'Direct Air Cargo'],
                ['Europe & Global', 'Worldwide Network'],
              ].map(([route, freq]) => (
                <li key={route} className="flex items-center justify-between gap-2 py-1 border-b border-purple-950/80 last:border-0">
                  <span className="text-purple-200 text-xs font-medium">{route}</span>
                  <span className="text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">{freq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-b border-purple-900/80 pb-2">
              Global Support &amp; Hubs
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-xs text-purple-200 leading-relaxed">
                  100 Global Logistics Parkway, Suite 400<br />
                  New York, NY 10001, United States
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="tel:+18005928334" className="text-xs text-white hover:text-purple-300 transition font-semibold">
                  +1 (800) 592-8334 (Toll-Free)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/18005928334" target="_blank" rel="noreferrer" className="text-xs text-purple-200 hover:text-white transition font-medium">
                  WhatsApp Instant Dispatch Desk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:support@vedcourier.com" className="text-xs text-purple-200 hover:text-white transition">
                  support@vedcourier.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-purple-300">Operations: 24/7/365 Non-Stop</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300">
          <p>© {currentYear} VED COURIER LOGISTICS Technologies Limited. All rights reserved.</p>
          <div className="flex items-center gap-6 flex-wrap justify-center font-medium">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Carriage</Link>
            <Link href="/contact" className="hover:text-white transition">Support &amp; FAQs</Link>
            <Link href="/admin/login" className="hover:text-white text-purple-400 transition font-bold">Staff Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
