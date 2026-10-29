'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({ 
  label = 'Print Document', 
  className = 'bg-[#0b2240] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#163866] transition flex items-center gap-2 cursor-pointer shadow-md' 
}: PrintButtonProps) {
  return (
    <button
      onClick={() => window.print()}
      className={className}
      type="button"
    >
      <Printer className="w-4 h-4 text-[#e22026]" />
      <span>{label}</span>
    </button>
  );
}
