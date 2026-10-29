import React from 'react';
import Link from 'next/link';
import { getDashboardMetrics } from '@/lib/db';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ArrowRight, 
  HeadphonesIcon,
  MapPin,
  ExternalLink,
  Search,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const metrics = getDashboardMetrics();

  const kpis = [
    {
      label: 'Total Shipments',
      value: metrics.totalShipments,
      icon: Package,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      label: 'In Transit',
      value: metrics.inTransit,
      icon: Truck,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    },
    {
      label: 'Customs Clearance',
      value: metrics.customs,
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
    {
      label: 'Out for Delivery',
      value: metrics.outForDelivery,
      icon: MapPin,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
    {
      label: 'Delivered',
      value: metrics.delivered,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Delayed / Held',
      value: metrics.delayed,
      icon: AlertTriangle,
      color: 'bg-red-500/10 text-[#e22026] border-red-200',
    },
    {
      label: 'Awaiting Pickup',
      value: metrics.awaitingPickup,
      icon: Clock,
      color: 'bg-slate-500/10 text-slate-700 border-slate-200',
    },
    {
      label: 'Open Inquiries',
      value: metrics.openTickets,
      icon: HeadphonesIcon,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Operational Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Logistics & Shipment Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, active line-hauls, and customs status computed from persistent database records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/shipments/new"
            className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Shipment</span>
          </Link>
          <Link
            href="/admin/shipments"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 shadow-2xs transition"
          >
            View Registry
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Shipments & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Shipments Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-[#0b2240] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#e22026]" /> Recent Registered Shipments
            </h3>
            <Link
              href="/admin/shipments"
              className="text-xs font-bold text-[#0b2240] hover:text-[#e22026] flex items-center gap-1 transition"
            >
              Full Registry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Tracking ID</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentShipments.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#0b2240]">
                      <Link href={`/admin/shipments/${s.id}`} className="hover:underline">
                        {s.tracking_number}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{s.shipping_route}</span>
                      <span className="text-slate-400 block text-[10px]">{s.transport_mode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{s.receiver_name}</span>
                      <span className="text-slate-400 block text-[10px]">{s.receiver_city}, {s.receiver_country}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-[#0b2240] border border-slate-200">
                        {s.current_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <Link
                        href={`/admin/shipments/${s.id}`}
                        className="text-[11px] font-bold text-[#0b2240] hover:text-[#e22026] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Tracking Activity Feed */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-[#0b2240] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e22026]" /> Latest Milestone Updates
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Live Log</span>
          </div>

          <div className="space-y-4">
            {metrics.recentEvents.map((evt: any) => (
              <div key={evt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b2240]">{evt.tracking_number}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{evt.event_timestamp}</span>
                </div>
                <p className="font-bold text-slate-800">{evt.event_title}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-[#e22026]" />
                  <span>{evt.location_name}, {evt.country}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/admin/shipments"
              className="text-xs font-bold text-[#0b2240] hover:underline"
            >
              Add Milestones via Shipments Registry →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
