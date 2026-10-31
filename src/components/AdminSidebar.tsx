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
    <aside className="w-64 bg-[#240643] text-purple-100 min-h-screen flex flex-col border-r border-purple-900/60 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-purple-900/60 flex items-center gap-3">
        <div className="w-11 h-11 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 border border-purple-300">
          <Image
            src="/images/ved-logo.png"
            alt="VED COURIER LOGISTICS"
            width={38}
            height={38}
            className="object-contain"
          />
        </div>
        <div className="overflow-hidden">
          <h2 className="font-black text-white text-sm leading-tight tracking-tight truncate">
            VED <span className="text-purple-400">COURIER</span> LOGISTICS
          </h2>
          <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
            Operational Console
          </p>
        </div>
      </div>

      {/* User Information Badge */}
      <div className="px-4 py-3 bg-[#1d0436] border-b border-purple-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs uppercase border border-purple-500">
            {user.full_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-200 bg-purple-900/80 px-2 py-0.2 rounded border border-purple-700">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-purple-700 text-white shadow-md font-bold'
                  : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-purple-900/60">
          <Link
            href="/track"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" /> Public Tracking
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" /> Public Website
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-purple-900/60">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-purple-200 hover:text-white bg-purple-950 hover:bg-purple-900 rounded-xl transition border border-purple-800 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
