'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Package, 
  DollarSign, 
  MapPin, 
  ArrowRight,
  Plane,
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = async () => {
    const res = await fetch('/api/admin/shipments');
    const json = await res.json();
    if (!json.shipments) return;

    const headers = [
      'Tracking Number',
      'Internal Ref',
      'Sender Name',
      'Sender Country',
      'Receiver Name',
      'Receiver Country',
      'Route',
      'Transport Mode',
      'Service Type',
      'Status',
      'Current Location',
      'Actual Weight (kg)',
      'Total Charge (USD)',
      'Payment Status',
      'Booking Date',
    ];

    const rows = json.shipments.map((s: any) => [
      `"${s.tracking_number}"`,
      `"${s.internal_reference || ''}"`,
      `"${s.sender_name}"`,
      `"${s.sender_country}"`,
      `"${s.receiver_name}"`,
      `"${s.receiver_country}"`,
      `"${s.shipping_route}"`,
      `"${s.transport_mode}"`,
      `"${s.service_type}"`,
      `"${s.current_status}"`,
      `"${s.current_recorded_location}"`,
      s.total_actual_weight,
      s.total_charge,
      `"${s.payment_status}"`,
      `"${s.booking_date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ved_courier_operational_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Logistics & Freight Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data aggregated from real active and historical database shipments. Operational figures are for internal tracking.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#0b2240] hover:bg-[#163866] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#e22026]" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 mx-auto border-3 border-[#0b2240] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">Computing database reports...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Aggregate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Billed Freight Revenue</span>
              <p className="text-3xl sm:text-4xl font-black text-[#0b2240] font-mono">
                ${Number(data?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </p>
              <p className="text-xs text-slate-400">
                Operational records across paid & pending consignments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Recorded Cargo Mass</span>
              <p className="text-3xl sm:text-4xl font-black text-[#e22026] font-mono">
                {Number(data?.totalWeight || 0).toFixed(1)} kg
              </p>
              <p className="text-xs text-slate-400">
                Gross verified scaled freight moved across all gateways.
              </p>
            </div>
          </div>

          {/* Trade Corridor Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-[#e22026]" /> Trade Corridors & Linehaul Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Trade Corridor</th>
                    <th className="py-3 px-4">Shipments Handled</th>
                    <th className="py-3 px-4">Total Weight (kg)</th>
                    <th className="py-3 px-4 text-right">Revenue (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.routeStats || []).map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {r.shipping_route}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0b2240]">
                        {r.count}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {r.total_weight ? Number(r.total_weight).toFixed(1) : 0} kg
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        ${Number(r.total_revenue || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Breakdown & Service Level Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
                Consignments by Status
              </h4>
              <div className="space-y-2.5">
                {(data?.statusStats || []).map((s: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-800">{s.current_status}</span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Level */}
            <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
                Consignments by Service Level
              </h4>
              <div className="space-y-2.5">
                {(data?.serviceStats || []).map((svc: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-800">{svc.service_type}</span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {svc.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
