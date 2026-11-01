'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <aside aria-label="WhatsApp Support Desk" className="fixed bottom-6 right-6 z-50 flex items-center group">
      <div className="hidden sm:flex items-center mr-3 px-3.5 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-full shadow-lg border border-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span>Chat on WhatsApp: +1 (808) 301-0314</span>
      </div>
      <a
        href="https://wa.me/18083010314"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with VED Courier Logistics on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-emerald-300"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
}
