import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import QRCode from 'qrcode';
import { getShipmentById } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrintLabelPage({ params }: Props) {
  const { id } = await params;
  const shipment = getShipmentById(id);

  if (!shipment) {
    notFound();
  }

  // Generate scannable QR Code linking to live tracking
  const trackingUrl = `https://redkoreaservices.com/track?id=${shipment.tracking_number}`;
  const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
    width: 140,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex flex-col items-center">
      
      {/* Top action bar (hidden during print) */}
      <div className="w-full max-w-[650px] mb-6 flex items-center justify-between no-print">
        <Link
          href={`/admin/shipments/${shipment.id}`}
          className="text-xs font-bold text-slate-600 hover:text-[#0b2240] flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Shipment
        </Link>
        <PrintButton label="Print Shipping Label" />
      </div>

      {/* Official 4x6" Carrier Shipping Label Container */}
      <div className="w-full max-w-[650px] bg-white border-2 border-black p-6 shadow-xl text-black font-sans space-y-4">
        
        {/* Label Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Image
                src="/images/ved-logo.png"
                alt="VED COURIER LOGISTICS"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none">
                VED COURIER LOGISTICS
              </h2>
              <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase mt-0.5">
                FAST • SAFE • GLOBAL
              </p>
              <p className="text-[9px] text-gray-600">
                INTERNATIONAL AIR &amp; MARITIME CARGO
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black uppercase px-2 py-1 bg-black text-white inline-block">
              {shipment.service_type || 'EXPRESS AIR'}
            </span>
            <p className="text-[10px] font-mono mt-1 font-bold">
              AWB: {shipment.tracking_number}
            </p>
          </div>
        </div>

        {/* Route Code Banner */}
        <div className="grid grid-cols-3 border-b-2 border-black py-2 text-center bg-gray-50">
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">ORIGIN</span>
            <span className="text-2xl font-black uppercase tracking-wider">
              {shipment.origin_city.substring(0, 3).toUpperCase()}
            </span>
            <span className="text-[10px] block font-semibold">{shipment.origin_country}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-x-2 border-black">
            <span className="text-[9px] uppercase font-bold text-gray-500">MODE</span>
            <span className="text-xs font-black uppercase">{shipment.transport_mode}</span>
            <span className="text-[9px] text-gray-600">SCHED: {shipment.booking_date.substring(0, 10)}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">DESTINATION</span>
            <span className="text-2xl font-black uppercase tracking-wider text-red-600">
              {shipment.destination_city.substring(0, 3).toUpperCase()}
            </span>
            <span className="text-[10px] block font-semibold">{shipment.destination_country}</span>
          </div>
        </div>

        {/* Shipper & Consignee Blocks */}
        <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4 text-xs">
          
          {/* FROM */}
          <div className="space-y-1 pr-2 border-r border-gray-300">
            <span className="text-[10px] font-black uppercase text-gray-500 block">FROM (SHIPPER):</span>
            <p className="font-bold text-sm">{shipment.sender_name}</p>
            {shipment.sender_company && <p className="font-medium text-gray-700">{shipment.sender_company}</p>}
            <p className="text-gray-800">{shipment.sender_street}</p>
            <p className="font-semibold">{shipment.sender_city}, {shipment.sender_state || ''} {shipment.sender_postal_code || ''}</p>
            <p className="font-bold">{shipment.sender_country}</p>
            {shipment.sender_phone && <p className="text-gray-600 text-[11px]">TEL: {shipment.sender_phone}</p>}
          </div>

          {/* TO */}
          <div className="space-y-1 pl-2">
            <span className="text-[10px] font-black uppercase text-red-600 block">DELIVER TO (CONSIGNEE):</span>
            <p className="font-bold text-sm text-black">{shipment.receiver_name}</p>
            {shipment.receiver_company && <p className="font-medium text-gray-700">{shipment.receiver_company}</p>}
            <p className="text-gray-900 font-medium">{shipment.receiver_street}</p>
            <p className="font-extrabold text-black">{shipment.receiver_city}, {shipment.receiver_state || ''} {shipment.receiver_postal_code || ''}</p>
            <p className="font-black text-sm uppercase">{shipment.receiver_country}</p>
            {shipment.receiver_phone && <p className="text-black font-semibold text-[11px]">TEL: {shipment.receiver_phone}</p>}
          </div>
        </div>

        {/* Delivery Instructions */}
        {shipment.delivery_instructions && (
          <div className="p-2 border border-black bg-gray-50 text-[10px] font-semibold">
            <span className="font-bold text-red-600 uppercase">DELIVERY INSTRUCTIONS: </span>
            {shipment.delivery_instructions}
          </div>
        )}

        {/* Weights, Package Count & Customs */}
        <div className="grid grid-cols-4 border-b-2 border-black py-2 text-center text-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">WEIGHT</span>
            <span className="font-black text-sm">{shipment.total_actual_weight} {shipment.weight_unit}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">VOL WEIGHT</span>
            <span className="font-black text-sm">{shipment.total_volumetric_weight} kg</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">PIECES</span>
            <span className="font-black text-sm">{shipment.packages?.length || 1} PKG</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">CUSTOMS REF</span>
            <span className="font-mono text-[11px] font-bold truncate block">
              {shipment.customs_declaration_ref || 'STANDARD'}
            </span>
          </div>
        </div>

        {/* Barcode & Scannable QR Code Section */}
        <div className="pt-2 flex items-center justify-between gap-4">
          
          {/* Simulated 1D Barcode with Tracking Number */}
          <div className="flex-1 space-y-1">
            <div className="h-16 w-full flex items-center justify-between px-2 bg-white border border-gray-200">
              <div className="w-full h-12 flex justify-between items-stretch">
                {[4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3, 4, 2, 1, 3, 2, 4, 1].map((w, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${w * 1.5}px` }}
                    className={idx % 2 === 0 ? 'bg-black' : 'bg-transparent'}
                  />
                ))}
              </div>
            </div>
            <p className="font-mono text-center font-extrabold text-sm tracking-widest">
              *{shipment.tracking_number}*
            </p>
          </div>

          {/* Real Scannable 2D QR Code */}
          <div className="text-center shrink-0 border border-black p-1 bg-white">
            <img
              src={qrCodeDataUrl}
              alt="Tracking QR Code"
              className="w-24 h-24 object-contain"
            />
            <span className="text-[8px] font-bold block uppercase tracking-tighter">
              SCAN TO TRACK
            </span>
          </div>

        </div>

        {/* Footer Warning & Handling */}
        <div className="pt-2 border-t border-black flex items-center justify-between text-[9px] text-gray-600 uppercase font-semibold">
          <span>VED COURIER LOGISTICS CARRIER LABEL</span>
          <span>SECURITY SCREENED & BONDED</span>
          <span>DISPATCH REF: {shipment.id}</span>
        </div>

      </div>

    </div>
  );
}
