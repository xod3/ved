import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getShipmentById } from '@/lib/db';
import { isPostgresConfigured, getPostgresShipmentById } from '@/lib/postgres';
import { ArrowLeft } from 'lucide-react';
import PrintButton from '@/components/PrintButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrintReceiptPage({ params }: Props) {
  const { id } = await params;
  let shipment: any = null;

  if (isPostgresConfigured()) {
    try {
      shipment = await getPostgresShipmentById(id);
    } catch (pgErr) {
      console.warn('Postgres lookup error on receipt page:', pgErr);
    }
  }

  if (!shipment) {
    shipment = getShipmentById(id);
  }

  if (!shipment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex flex-col items-center">
      
      {/* Top action bar (hidden during print) */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between no-print">
        <Link
          href={`/admin/shipments/${shipment.id}`}
          className="text-xs font-bold text-slate-600 hover:text-[#0b2240] flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Shipment
        </Link>
        <PrintButton label="Print Official Waybill Receipt" />
      </div>

      {/* Official Waybill Receipt Document */}
      <div className="w-full max-w-4xl bg-white border border-slate-300 p-8 sm:p-12 shadow-2xl text-slate-900 font-sans space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 relative flex items-center justify-center">
                <Image
                  src="/images/ved-logo.png"
                  alt="VED COURIER LOGISTICS"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#0b2240]">
                  VED <span className="text-[#e22026]">COURIER</span> LOGISTICS
                </h1>
                <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                  FAST • SAFE • GLOBAL
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              W 109th St, New York, NY 10025, USA<br />
              WhatsApp: +1 (808) 301-0314 | Email: support@vedcourier.com<br />
              Web: www.vedcourier.online
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs font-black uppercase text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-md inline-block">
              OFFICIAL FREIGHT WAYBILL &amp; RECEIPT
            </span>
            <p className="text-sm font-mono font-bold mt-2">
              Receipt No: RCT-{shipment.tracking_number.replace('VED-', '').replace('RKS-', '')}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Date: {shipment.booking_date}
            </p>
            <div className="pt-1">
              <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                shipment.payment_status === 'Paid' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                PAYMENT {shipment.payment_status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Consignment Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Tracking / AWB No</span>
            <span className="font-mono font-bold text-sm text-[#0b2240]">{shipment.tracking_number}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Route</span>
            <span className="font-bold text-slate-800">{shipment.shipping_route}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Service Mode</span>
            <span className="font-bold text-slate-800">{shipment.transport_mode} ({shipment.service_type})</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Payment Method</span>
            <span className="font-bold text-slate-800">{shipment.payment_method || 'Bank Wire'}</span>
          </div>
        </div>

        {/* Shipper & Consignee Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs border-b border-slate-200 pb-6">
          <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">SHIPPER (SENDER)</span>
            <p className="font-extrabold text-sm text-[#0b2240]">{shipment.sender_name}</p>
            {shipment.sender_company && <p className="font-semibold text-slate-700">{shipment.sender_company}</p>}
            <p className="text-slate-600">{shipment.sender_street}</p>
            <p className="text-slate-600">{shipment.sender_city}, {shipment.sender_state || ''} {shipment.sender_postal_code || ''}, {shipment.sender_country}</p>
            <p className="text-slate-500 font-mono">Phone: {shipment.sender_phone || 'N/A'}</p>
            <p className="text-slate-500">Email: {shipment.sender_email || 'N/A'}</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">CONSIGNEE (RECEIVER)</span>
            <p className="font-extrabold text-sm text-[#0b2240]">{shipment.receiver_name}</p>
            {shipment.receiver_company && <p className="font-semibold text-slate-700">{shipment.receiver_company}</p>}
            <p className="text-slate-600">{shipment.receiver_street}</p>
            <p className="text-slate-600">{shipment.receiver_city}, {shipment.receiver_state || ''} {shipment.receiver_postal_code || ''}, {shipment.receiver_country}</p>
            <p className="text-slate-500 font-mono">Phone: {shipment.receiver_phone || 'N/A'}</p>
            <p className="text-slate-500">Email: {shipment.receiver_email || 'N/A'}</p>
          </div>
        </div>

        {/* Package Manifest Items */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0b2240]">
            Cargo Specifications & Package Breakdown
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Item #</th>
                <th className="py-2.5 px-3">Description of Goods</th>
                <th className="py-2.5 px-3">Package Type</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Gross Weight</th>
                <th className="py-2.5 px-3">Dimensions</th>
                <th className="py-2.5 px-3 text-right">Declared Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(shipment.packages || []).map((pkg: any, idx: number) => (
                <tr key={pkg.id || idx}>
                  <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{pkg.description}</td>
                  <td className="py-2.5 px-3 text-slate-600">{pkg.package_type}</td>
                  <td className="py-2.5 px-3 font-mono">{pkg.quantity}</td>
                  <td className="py-2.5 px-3 font-bold">{pkg.weight} {pkg.weight_unit}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {pkg.length && pkg.width && pkg.height ? `${pkg.length}×${pkg.width}×${pkg.height} cm` : 'Standard'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">${pkg.declared_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Itemized Charges & Accounting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          
          <div className="space-y-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700 uppercase block text-[11px]">Notice & Terms</span>
            <p className="leading-relaxed">
              This document serves as an authentic transport waybill and payment receipt issued by VED COURIER LOGISTICS. All transport services are rendered subject to VED Courier Terms &amp; Conditions of Carriage and international air/maritime treaties.
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              Electronic Signature ID: VED-AUTH-{shipment.id}
            </p>
          </div>

          {/* Charges Breakdown */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Base Freight Transport Fee:</span>
              <span className="font-mono font-bold">${Number(shipment.shipping_fee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Handling & Terminal Screening:</span>
              <span className="font-mono font-bold">${Number(shipment.handling_fee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Transit Cargo Insurance:</span>
              <span className="font-mono font-bold">${Number(shipment.insurance_fee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Customs Coordination & Clearance:</span>
              <span className="font-mono font-bold">${Number(shipment.customs_charges || 0).toFixed(2)}</span>
            </div>
            {Number(shipment.discount || 0) > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                <span>Special Account Discount:</span>
                <span className="font-mono font-bold">-${Number(shipment.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-black text-[#0b2240] border-t-2 border-slate-300">
              <span>Total Chargeable Amount:</span>
              <span className="font-mono">${Number(shipment.total_charge || 0).toFixed(2)} {shipment.currency}</span>
            </div>
          </div>

        </div>

        {/* Signatures & Seal Block */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-12 text-xs">
          <div className="space-y-6">
            <div className="border-b border-slate-400 pb-1" />
            <p className="font-bold text-slate-700 text-center uppercase text-[10px]">
              Shipper / Agent Signature
            </p>
          </div>
          <div className="space-y-6">
            <div className="border-b border-slate-400 pb-1 flex items-center justify-center">
              <span className="text-red-700 font-serif italic text-xs font-bold">
                [ VED COURIER LOGISTICS AUTHORIZED STAMP ]
              </span>
            </div>
            <p className="font-bold text-slate-700 text-center uppercase text-[10px]">
              Authorized Dispatch Officer ({shipment.assigned_staff_name || 'Operations Controller'})
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
