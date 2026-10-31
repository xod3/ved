import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getShipmentById } from '@/lib/db';
import { isPostgresConfigured, getPostgresShipmentById } from '@/lib/postgres';
import { 
  Package, 
  MapPin, 
  Printer, 
  Clock, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Plane, 
  Truck, 
  CheckCircle2, 
  Copy, 
  QrCode,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; tracking?: string }>;
}

export default async function ShipmentDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { created, tracking } = await searchParams;

  let shipment = getShipmentById(id);

  if (!shipment && isPostgresConfigured()) {
    try {
      shipment = await getPostgresShipmentById(id);
    } catch {
      // fallback
    }
  }

  if (!shipment) {
    if (created === 'true' || tracking) {
      return (
        <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-purple-100 p-8 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                Shipment Successfully Registered
              </span>
              <h1 className="text-2xl font-black text-slate-900">
                Waybill: {tracking || id}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your consignment order has been registered into the dispatch queue with reference <strong className="text-purple-700">{id}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/admin/shipments"
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Shipments Registry
              </Link>
              <Link
                href={`/track?id=${tracking || id}`}
                target="_blank"
                className="inline-flex items-center gap-2 border border-purple-200 text-purple-700 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open Public Tracking
              </Link>
            </div>
          </div>
        </div>
      );
    }
    notFound();
  }

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s.includes('out for delivery')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (s.includes('customs')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (s.includes('delayed') || s.includes('hold')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Back and Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/shipments"
          className="text-xs font-bold text-slate-500 hover:text-[#0b2240] flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipments Registry
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Internal ID: {shipment.id}
        </span>
      </div>

      {/* Fresh Creation Success Banner */}
      {created && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-sm text-emerald-900">
                Shipment Successfully Registered!
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Assigned Tracking ID: <span className="font-mono font-bold text-emerald-950">{shipment.tracking_number}</span>. Initial intake event has been stamped into the audit timeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/shipments/${shipment.id}/label`}
              target="_blank"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <QrCode className="w-3.5 h-3.5" /> Print Label
            </Link>
            <Link
              href={`/track?id=${shipment.tracking_number}`}
              target="_blank"
              className="bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Tracking
            </Link>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Number</span>
              <span className="text-[11px] font-mono text-slate-500">
                {shipment.internal_reference ? `(Ref: ${shipment.internal_reference})` : ''}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono text-[#0b2240] tracking-tight">
              {shipment.tracking_number}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered on {shipment.booking_date} by {shipment.created_by}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${getStatusBadge(shipment.current_status)}`}>
              {shipment.current_status}
            </span>
            <Link
              href={`/admin/shipments/${shipment.id}/tracking`}
              className="bg-[#0b2240] hover:bg-[#163866] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-[#e22026]" /> Add Milestone Update
            </Link>
            <Link
              href={`/admin/shipments/${shipment.id}/label`}
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 border border-slate-300"
            >
              <QrCode className="w-3.5 h-3.5" /> Shipping Label
            </Link>
            <Link
              href={`/admin/shipments/${shipment.id}/receipt`}
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 border border-slate-300"
            >
              <Printer className="w-3.5 h-3.5" /> Waybill Receipt
            </Link>
            <Link
              href={`/track?id=${shipment.tracking_number}`}
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-2 rounded-xl text-xs transition border border-slate-300"
              title="View Public Tracking Page"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>

        {/* Route Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Origin Location</span>
            <p className="font-black text-sm text-[#0b2240]">{shipment.origin_city}, {shipment.origin_country}</p>
            <p className="text-xs text-slate-500">{shipment.origin_facility}</p>
          </div>

          <div className="text-center border-x border-slate-200 px-4">
            <span className="text-[10px] uppercase font-bold text-[#e22026] block">Trade Route & Mode</span>
            <p className="font-black text-sm text-[#0b2240]">{shipment.shipping_route}</p>
            <p className="text-xs text-slate-500 font-medium">{shipment.transport_mode} • {shipment.service_type}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination Delivery</span>
            <p className="font-black text-sm text-[#0b2240]">{shipment.destination_city}, {shipment.destination_country}</p>
            <p className="text-xs text-slate-500">{shipment.destination_facility}</p>
          </div>
        </div>

        {/* Status Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Current Recorded Location</span>
            <span className="font-bold text-[#0b2240] block mt-0.5">{shipment.current_recorded_location}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Estimated Delivery</span>
            <span className="font-bold text-[#0b2240] block mt-0.5">
              {shipment.estimated_delivery_date || 'In Scheduled Transit'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Weight & Volume</span>
            <span className="font-bold text-[#0b2240] block mt-0.5">
              {shipment.total_actual_weight} kg (Vol: {shipment.total_volumetric_weight} kg)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Billing Status</span>
            <span className="font-bold text-[#0b2240] block mt-0.5">
              ${shipment.total_charge} {shipment.currency} ({shipment.payment_status})
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Shipper vs Consignee */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Shipper */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
            Shipper (Sender) Details
          </h3>
          <div className="text-xs space-y-1.5 text-slate-700">
            <p className="font-bold text-sm text-slate-900">{shipment.sender_name}</p>
            {shipment.sender_company && <p className="text-slate-600 font-semibold">{shipment.sender_company}</p>}
            <p><strong>Address:</strong> {shipment.sender_street}</p>
            <p><strong>Location:</strong> {shipment.sender_city}, {shipment.sender_state || ''} {shipment.sender_postal_code || ''}, {shipment.sender_country}</p>
            {shipment.sender_phone && <p><strong>Phone:</strong> {shipment.sender_phone}</p>}
            {shipment.sender_email && <p><strong>Email:</strong> {shipment.sender_email}</p>}
          </div>
        </div>

        {/* Consignee */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
            Consignee (Receiver) Details
          </h3>
          <div className="text-xs space-y-1.5 text-slate-700">
            <p className="font-bold text-sm text-slate-900">{shipment.receiver_name}</p>
            {shipment.receiver_company && <p className="text-slate-600 font-semibold">{shipment.receiver_company}</p>}
            <p><strong>Delivery Address:</strong> {shipment.receiver_street}</p>
            <p><strong>Location:</strong> {shipment.receiver_city}, {shipment.receiver_state || ''} {shipment.receiver_postal_code || ''}, {shipment.receiver_country}</p>
            {shipment.receiver_phone && <p><strong>Phone:</strong> {shipment.receiver_phone}</p>}
            {shipment.receiver_email && <p><strong>Email:</strong> {shipment.receiver_email}</p>}
            {shipment.delivery_instructions && (
              <p className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                <strong>Delivery Instructions:</strong> {shipment.delivery_instructions}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Package Contents Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>Consignment Package Manifest</span>
          <span className="text-xs font-normal text-slate-500">
            {shipment.packages?.length || 0} Package Item(s)
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Package Ref</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Dimensions (L×W×H)</th>
                <th className="py-2.5 px-3">Declared Value</th>
                <th className="py-2.5 px-3">Handling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(shipment.packages || []).map((pkg: any) => (
                <tr key={pkg.id}>
                  <td className="py-3 px-3 font-mono text-slate-600">{pkg.package_reference}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{pkg.description}</td>
                  <td className="py-3 px-3 text-slate-600">{pkg.package_type}</td>
                  <td className="py-3 px-3 font-mono">{pkg.quantity}</td>
                  <td className="py-3 px-3 font-bold">{pkg.weight} {pkg.weight_unit}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {pkg.length && pkg.width && pkg.height ? `${pkg.length}×${pkg.width}×${pkg.height} cm` : 'Standard'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">${pkg.declared_value}</td>
                  <td className="py-3 px-3 text-slate-500">{pkg.handling_instructions || (pkg.fragile ? 'Fragile' : 'Standard')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Append-only Milestone Timeline */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-[#0b2240] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e22026]" /> Verified Event History & Audit Log
            </h3>
            <p className="text-xs text-slate-500">
              Append-only timeline recorded in SQLite and Supabase PostgreSQL.
            </p>
          </div>
          <Link
            href={`/admin/shipments/${shipment.id}/tracking`}
            className="text-xs font-bold bg-[#e22026] hover:bg-[#b81419] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" /> Record New Event
          </Link>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {(shipment.events || []).slice().reverse().map((evt: any, i: number) => (
            <div key={evt.id || i} className="relative">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0b2240] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-extrabold text-sm text-[#0b2240]">{evt.event_title}</span>
                  <span className="text-[11px] font-mono text-slate-500">{evt.event_timestamp}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#e22026]" />
                  <span>{evt.location_name}{evt.city ? `, ${evt.city}` : ''}, {evt.country}</span>
                  {evt.facility_name && <span className="text-slate-400">({evt.facility_name})</span>}
                </div>

                {evt.event_description && (
                  <p className="text-slate-600 leading-relaxed pt-1">
                    {evt.event_description}
                  </p>
                )}

                {evt.internal_note && (
                  <p className="text-red-700 bg-red-50 p-2 rounded border border-red-200 mt-2 font-mono text-[11px]">
                    <strong>Staff Internal Note:</strong> {evt.internal_note}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200">
                  <span>Recorded by: {evt.created_by}</span>
                  <span className={evt.is_public === 1 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {evt.is_public === 1 ? 'Public on Tracking' : 'Internal Staff Only'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
