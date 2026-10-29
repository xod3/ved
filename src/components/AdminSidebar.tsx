'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  HeadphonesIcon, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  ExternalLink,
  Truck,
  MapPin
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    full_name: string;
    email: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Shipments Registry', href: '/admin/shipments', icon: Package },
    { name: 'Create Shipment', href: '/admin/shipments/new', icon: PlusCircle },
    { name: 'Customer Directory', href: '/admin/customers', icon: Users },
    { name: 'Support Inquiries', href: '/admin/support', icon: HeadphonesIcon },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { name: 'Staff & Roles', href: '/admin/staff', icon: ShieldAlert },
    { name: 'Company Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="w-64 bg-[#0b2240] text-slate-200 min-h-screen flex flex-col border-r border-[#163866] shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#163866] flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-md p-1 flex items-center justify-center shrink-0">
          <Image
            src="/images/ved-logo.png"
            alt="VED Courier"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div className="overflow-hidden">
          <h2 className="font-black text-white text-base leading-tight tracking-tight truncate">
            VED <span className="text-[#e22026]">COURIER</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Operational Console
          </p>
        </div>
      </div>

      {/* User Information Badge */}
      <div className="px-4 py-3 bg-[#07172d] border-b border-[#163866]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#163866] text-white flex items-center justify-center font-bold text-xs uppercase border border-slate-600">
            {user.full_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#e22026] bg-red-950/60 px-1.5 py-0.2 rounded border border-red-900/60">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#e22026] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-[#163866] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[#163866]/60">
          <Link
            href="/track"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#163866]/40 rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" /> Public Tracking
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#163866]/40 rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" /> Public Website
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-[#163866]">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-900/60 rounded-lg transition border border-slate-700 hover:border-red-700 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
