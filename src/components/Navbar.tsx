'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  Globe, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Track Shipment', href: '/track' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar for trust & urgent contact */}
      <div className="bg-[#0b2240] text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-[#163866]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1 font-medium text-slate-100">
              <Globe className="w-3.5 h-3.5 text-[#e22026]" /> Global Cargo, Air & Maritime Logistics Network
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Insured & Licensed Freight Forwarding
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:+18005928334" className="hover:text-white flex items-center gap-1 font-semibold text-slate-200">
              <PhoneCall className="w-3 h-3 text-[#e22026]" /> +1 (800) 592-8334
            </a>
            <span className="text-slate-500">•</span>
            <Link href="/admin/login" className="hover:text-white flex items-center gap-1 text-slate-300 hover:text-white transition">
              <Lock className="w-3 h-3 text-slate-400" /> Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-md bg-white border border-slate-100 shadow-xs flex items-center justify-center">
            <Image
              src="/images/ved-logo.png"
              alt="VED Courier Logistics Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2240] leading-none group-hover:text-[#163866] transition">
              VED <span className="text-[#e22026]">COURIER</span>
            </span>
            <span className="text-[10px] tracking-widest font-bold text-slate-500 uppercase mt-0.5">
              FAST • SAFE • GLOBAL
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-150 py-1 ${
                  isActive
                    ? 'text-[#e22026] border-b-2 border-[#e22026]'
                    : 'text-slate-700 hover:text-[#0b2240]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 bg-[#0b2240] hover:bg-[#163866] text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
          >
            <Search className="w-4 h-4 text-[#e22026]" />
            <span>Track Parcel</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2 text-slate-700 hover:text-[#0b2240] focus:outline-hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-semibold ${
                    isActive
                      ? 'bg-red-50 text-[#e22026]'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/track"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#0b2240] text-white font-bold py-2.5 rounded-lg shadow-sm"
            >
              <Search className="w-4 h-4 text-[#e22026]" />
              <span>Track Your Consignment</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Staff Management Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
