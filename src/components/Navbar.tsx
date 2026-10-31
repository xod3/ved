'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Globe, 
  Lock, 
  ShieldCheck, 
  Clock, 
  MapPin,
  Send,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Track Shipment', href: '/track' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar in Deep Purple & White */}
      <div className="bg-[#2e0854] text-purple-100 text-xs py-2 px-4 sm:px-8 border-b border-purple-900/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-purple-200">
              <Globe className="w-3.5 h-3.5 text-purple-300" />
              VED COURIER LOGISTICS — Next-Gen Cross-Border Delivery &amp; E-Commerce
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-purple-300">
              <Clock className="w-3.5 h-3.5 text-purple-300" />
              24/7 Operations Across Nigeria, USA, China &amp; Korea
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bonded Customs Clearance
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:+18005928334" className="hover:text-white flex items-center gap-1.5 font-semibold text-white transition">
              <PhoneCall className="w-3 h-3 text-purple-300" />
              +1 (800) 592-8334
            </a>
            <span className="text-purple-400">•</span>
            <Link href="/admin/login" className="hover:text-white flex items-center gap-1.5 text-purple-200 hover:text-white transition">
              <Lock className="w-3 h-3 text-purple-400" /> Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar (Pure White with Purple Accents) */}
      <div className={`bg-white transition-all duration-200 ${scrolled ? 'shadow-md border-b border-purple-100' : 'border-b border-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-14 h-14 bg-white rounded-xl p-0.5 border border-purple-100 shadow-sm flex items-center justify-center overflow-hidden">
              <Image
                src="/images/ved-logo.png"
                alt="VED COURIER LOGISTICS"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#2e0854] group-hover:text-purple-700 transition">
                VED <span className="text-purple-700">COURIER</span> LOGISTICS
              </span>
              <span className="text-[10px] tracking-widest font-extrabold text-purple-600 uppercase mt-0.5">
                FAST • SAFE • GLOBAL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-extrabold'
                      : 'text-slate-700 hover:bg-purple-50/60 hover:text-purple-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact?subject=Book%20Pickup"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 px-3.5 py-2.5 rounded-lg border border-purple-200 hover:border-purple-300 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Book Pickup</span>
            </Link>

            <Link
              href="/track"
              className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-purple-700/20 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Waybill</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-purple-100 bg-white px-4 pb-6 pt-3 space-y-1 shadow-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-slate-800 hover:bg-purple-50/40 hover:text-purple-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-purple-100 space-y-2">
              <Link
                href="/track"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-full shadow-sm text-sm"
              >
                <Search className="w-4 h-4" />
                Track Your Waybill
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 border border-purple-200 text-purple-700 font-bold py-2.5 rounded-xl text-sm hover:bg-purple-50"
              >
                <Send className="w-4 h-4" />
                Request A Pickup / Quote
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-100"
              >
                <Lock className="w-4 h-4" />
                Staff Management Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
