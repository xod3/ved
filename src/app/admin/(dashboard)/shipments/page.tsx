'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  Printer, 
  ExternalLink, 
  Clock, 
  FileText,
  ChevronRight,
  RefreshCw,
  QrCode
} from 'lucide-react';

export default function ShipmentsManagementPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (routeFilter !== 'all') params.append('route', routeFilter);

      const res = await fetch(`/api/admin/shipments?${params.toString()}`);
      const data = await res.json();
      if (data.shipments) {
        setShipments(data.shipments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [statusFilter, routeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShipments();
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s.includes('out for delivery')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (s.includes('customs')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (s.includes('delayed') || s.includes('hold') || s.includes('exception')) return 'bg-red-100 text-red-800 border-red-300';
    if (s.includes('in transit')) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Operational Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Shipments & Consignments Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage active manifests, append transit milestones, generate barcodes & QR labels, and review delivery confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchShipments}
            className="p-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl transition shadow-2xs"
            title="Refresh Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/shipments/new"
            className="bg-[#e22026] hover:bg-[#b81419] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Shipment</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Tracking ID, Shipper, Receiver, or City..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter shipments by operational status"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
            >
              <option value="all">All Operational Statuses</option>
              <option value="Shipment Created">Shipment Created</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Customs Cleared">Customs Cleared</option>
              <option value="Customs Hold">Customs Hold</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              aria-label="Filter shipments by trade route"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
            >
              <option value="all">All Trade Corridors</option>
              <option value="United States → China">United States → China</option>
              <option value="China → Nigeria">China → Nigeria</option>
              <option value="United States → Nigeria">United States → Nigeria</option>
              <option value="South Korea → United States">South Korea → United States</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-full bg-[#0b2240] text-white font-bold rounded-xl text-xs hover:bg-[#163866] transition flex items-center justify-center py-2"
            >
              Filter
            </button>
          </div>

        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Sender & Receiver</th>
                <th className="py-3 px-4">Route & Mode</th>
                <th className="py-3 px-4">Status & Location</th>
                <th className="py-3 px-4">Weight / Charge</th>
                <th className="py-3 px-4">Booking Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="w-8 h-8 mx-auto border-3 border-[#0b2240] border-t-transparent rounded-full animate-spin mb-2" />
                    <span>Loading database records...</span>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No shipments found matching criteria.</p>
                  </td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <Link 
                        href={`/admin/shipments/${s.id}`}
                        className="font-mono font-bold text-[#0b2240] hover:text-[#e22026] hover:underline block text-xs"
                      >
                        {s.tracking_number}
                      </Link>
                      {s.internal_reference && (
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Ref: {s.internal_reference}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block truncate max-w-[150px]">
                          From: {s.sender_name}
                        </span>
                        <span className="text-slate-600 block truncate max-w-[150px]">
                          To: {s.receiver_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {s.origin_city} → {s.destination_city}
                      </span>
                      <span className="text-slate-400 text-[10px] block">
                        {s.transport_mode} • {s.service_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getStatusBadge(s.current_status)}`}>
                        {s.current_status}
                      </span>
                      <span className="text-slate-500 text-[10px] block mt-1 truncate max-w-[170px]" title={s.current_recorded_location}>
                        📍 {s.current_recorded_location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {s.total_actual_weight} {s.weight_unit}
                      </span>
                      <span className="text-slate-500 text-[10px] block font-mono">
                        {s.currency} {Number(s.total_charge).toFixed(2)} ({s.payment_status})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px] font-mono">
                      {s.booking_date?.substring(0, 10)}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/admin/shipments/${s.id}/tracking`}
                        className="inline-block p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                        title="Add Tracking Milestone"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/shipments/${s.id}/label`}
                        target="_blank"
                        className="inline-block p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition"
                        title="Print Barcode Shipping Label"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/shipments/${s.id}/receipt`}
                        target="_blank"
                        className="inline-block p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition"
                        title="Print Waybill Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/shipments/${s.id}`}
                        className="inline-block text-[11px] font-bold text-[#0b2240] hover:text-white hover:bg-[#0b2240] px-2.5 py-1 rounded-lg border border-slate-300 transition"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
