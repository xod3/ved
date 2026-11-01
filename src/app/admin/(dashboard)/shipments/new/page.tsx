'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Calculator, 
  ShieldCheck, 
  Plane, 
  FileText,
  DollarSign,
  RefreshCw,
  Copy,
  ExternalLink,
  QrCode,
  Check
} from 'lucide-react';

export default function CreateShipmentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{ id: string; tracking_number: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form State
  const [shipment, setShipment] = useState({
    tracking_number: '',
    current_status: 'In Transit',
    current_recorded_location: 'JFK Air Freight Cargo Terminal 4, New York',
    initial_event_title: 'Shipment Order Created & Electronic Documentation Processed',
    initial_event_description: 'Consignment booked and verified. Dispatch barcode issued.',
    internal_reference: '',
    booking_date: new Date().toISOString().substring(0, 10),
    estimated_delivery_date: '',
    service_type: 'Priority Air Express',
    transport_mode: 'Air Freight',
    carrier_partner: 'VED Global Air Charter',
    flight_vessel_reference: '',
    
    // Sender
    sender_name: '',
    sender_company: '',
    sender_email: '',
    sender_phone: '',
    sender_country: 'United States',
    sender_state: 'New York',
    sender_city: 'New York',
    sender_postal_code: '',
    sender_street: '',
    sender_pickup_address: '',

    // Receiver
    receiver_name: '',
    receiver_company: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_country: 'United Kingdom',
    receiver_state: 'Greater London',
    receiver_city: 'London',
    receiver_postal_code: '',
    receiver_street: '',
    delivery_instructions: '',

    // Origin & Destination
    origin_country: 'United States',
    origin_city: 'New York',
    origin_facility: 'JFK Air Freight Cargo Terminal 4',
    destination_country: 'United Kingdom',
    destination_city: 'London',
    destination_facility: 'Heathrow World Cargo Centre (LHR)',
    transit_hubs: '',
    shipping_route: 'United States → United Kingdom',

    // Customs & Compliance
    hs_code: '8471.80.10',
    declared_value: 5000,
    currency: 'USD',
    customs_declaration_ref: '',
    duty_status: 'Unpaid',
    restricted_review_status: 'Cleared',

    // Financial
    shipping_fee: 450,
    handling_fee: 50,
    insurance_fee: 80,
    customs_charges: 60,
    discount: 0,
    payment_status: 'Pending',
    payment_method: 'Bank Transfer',

    // Notes
    customer_notes: '',
    internal_notes: '',
  });

  // Load next live tracking ID on mount
  const fetchNextTrackingId = async () => {
    try {
      const res = await fetch('/api/admin/shipments?action=next-tracking');
      const data = await res.json();
      if (data.success && data.tracking_number) {
        setShipment((prev) => ({
          ...prev,
          tracking_number: data.tracking_number,
        }));
      }
    } catch (err) {
      console.warn('Could not auto-fetch next tracking ID:', err);
    }
  };

  useEffect(() => {
    fetchNextTrackingId();
  }, []);

  const handleGenerateNewTracking = async () => {
    try {
      const res = await fetch('/api/admin/shipments?action=next-tracking');
      const data = await res.json();
      if (data.success && data.tracking_number) {
        setShipment((prev) => ({
          ...prev,
          tracking_number: data.tracking_number,
        }));
      } else {
        const year = new Date().getFullYear();
        const rand = Math.floor(100100 + Math.random() * 899000);
        setShipment((prev) => ({ ...prev, tracking_number: `VED-${year}-${rand}` }));
      }
    } catch {
      const year = new Date().getFullYear();
      const rand = Math.floor(100100 + Math.random() * 899000);
      setShipment((prev) => ({ ...prev, tracking_number: `VED-${year}-${rand}` }));
    }
  };

  // Multi-package state
  const [packages, setPackages] = useState<any[]>([
    {
      description: 'Industrial Electronic Components',
      package_type: 'Box / Carton',
      quantity: 1,
      weight: 12.5,
      weight_unit: 'kg',
      length: 45,
      width: 35,
      height: 30,
      dimension_unit: 'cm',
      declared_value: 5000,
      fragile: 0,
      handling_instructions: 'Handle with care. Keep upright.',
    }
  ]);

  const addPackageRow = () => {
    setPackages([
      ...packages,
      {
        description: 'Commercial Cargo',
        package_type: 'Box / Carton',
        quantity: 1,
        weight: 5.0,
        weight_unit: 'kg',
        length: 30,
        width: 25,
        height: 20,
        dimension_unit: 'cm',
        declared_value: 500,
        fragile: 0,
        handling_instructions: '',
      }
    ]);
  };

  const removePackageRow = (index: number) => {
    if (packages.length <= 1) return;
    setPackages(packages.filter((_, idx) => idx !== index));
  };

  const updatePackageField = (index: number, field: string, val: any) => {
    const updated = [...packages];
    updated[index][field] = val;
    setPackages(updated);
  };

  // Calculations
  const calculateTotalActualWeight = () => {
    return packages.reduce((acc, p) => acc + (Number(p.weight || 0) * Number(p.quantity || 1)), 0);
  };

  const calculateTotalVolumetricWeight = () => {
    return packages.reduce((acc, p) => {
      if (p.length && p.width && p.height) {
        const vol = (Number(p.length) * Number(p.width) * Number(p.height)) / 5000;
        return acc + (vol * Number(p.quantity || 1));
      }
      return acc;
    }, 0);
  };

  const totalActual = calculateTotalActualWeight();
  const totalVolumetric = calculateTotalVolumetricWeight();
  const chargeableWeight = Math.max(totalActual, totalVolumetric);

  const totalCharges = (
    Number(shipment.shipping_fee || 0) +
    Number(shipment.handling_fee || 0) +
    Number(shipment.insurance_fee || 0) +
    Number(shipment.customs_charges || 0) -
    Number(shipment.discount || 0)
  );

  const handleCountryRouteSync = (origin: string, dest: string) => {
    setShipment((prev) => ({
      ...prev,
      origin_country: origin,
      destination_country: dest,
      shipping_route: `${origin} → ${dest}`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const year = new Date().getFullYear();
    let finalTrack = (shipment.tracking_number || '').trim().toUpperCase().replace(/[\s_]+/g, '-');
    if (finalTrack.includes('MOLESTIAS') || finalTrack.includes('IPSUM')) {
      finalTrack = '';
    }
    if (!finalTrack.startsWith('VED-')) {
      finalTrack = `VED-${year}-${finalTrack.replace(/[^A-Z0-9]/g, '') || Math.floor(100100 + Math.random() * 899000)}`;
    }

    try {
      const res = await fetch('/api/admin/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment: { ...shipment, tracking_number: finalTrack },
          packages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to create shipment.');
        setSubmitting(false);
      } else {
        setCreatedResult({
          id: data.id,
          tracking_number: data.tracking_number,
        });
        setSubmitting(false);
      }
    } catch {
      setErrorMsg('Network error. Check database availability.');
      setSubmitting(false);
    }
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyCustomerUrl = (id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.vedcourier.online';
    const url = `${origin}/track?id=${encodeURIComponent(id)}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const resetFormForNext = () => {
    setCreatedResult(null);
    fetchNextTrackingId();
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/admin/shipments"
            className="text-xs font-bold text-slate-500 hover:text-[#0b2240] flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Create Real-Time Shipment &amp; Customer Tracking ID
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and activate a live tracking ID that is immediately queryable on the public frontend tracking page.
          </p>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {createdResult && (
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl shadow-2xl border-2 border-emerald-400/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-400 text-emerald-950 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/40">
                Live &amp; Activated in Database
              </span>
              <h2 className="text-2xl font-black text-white">
                Customer Tracking ID Created!
              </h2>
              <p className="text-xs text-emerald-100 max-w-xl">
                This tracking number is now live and synchronized with the frontend. Your customer can immediately track this shipment by entering the code below on the homepage or track page.
              </p>
            </div>
          </div>

          <div className="bg-emerald-950/80 p-4 sm:p-6 rounded-2xl border border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                Active Tracking Number
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                {createdResult.tracking_number}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copyTrackingId(createdResult.tracking_number)}
                className="bg-white text-emerald-950 hover:bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedId ? 'Copied ID!' : 'Copy Tracking ID'}
              </button>
              <button
                type="button"
                onClick={() => copyCustomerUrl(createdResult.tracking_number)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-emerald-500 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {copiedUrl ? 'Copied Link!' : 'Copy Direct Customer Link'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-700/60 text-xs">
            <div className="flex items-center gap-2">
              <Link
                href={`/track?id=${encodeURIComponent(createdResult.tracking_number)}`}
                target="_blank"
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <ExternalLink className="w-4 h-4" />
                Test Customer Tracking View
              </Link>
              <Link
                href={`/admin/shipments/${createdResult.id}/label`}
                target="_blank"
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 border border-emerald-600"
              >
                <QrCode className="w-4 h-4" />
                Print Label
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetFormForNext}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold transition cursor-pointer"
              >
                + Create Another Tracking ID
              </button>
              <Link
                href={`/admin/shipments/${createdResult.id}`}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold transition"
              >
                View in Admin
              </Link>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Shipment Creation Failed</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ─── REAL-TIME TRACKING ID ACTIVATION CARD ─── */}
        <div className="bg-gradient-to-r from-purple-900 via-[#2e0854] to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border-2 border-purple-500/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Customer Tracking ID
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Consignment Waybill Identification
              </h2>
              <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
                This Tracking ID is immediately activated upon creation. Customers can paste or type it directly into the website tracking form on the homepage and track page to view real-time transit status, packages, and milestones.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateNewTracking}
              className="bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-purple-300" />
              Generate Next Sequence ID
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <label className="block text-xs font-bold text-purple-200 mb-1.5">
                Active Tracking / Waybill Number (Customizable)
              </label>
              <div className="relative">
                <Package className="w-5 h-5 text-purple-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={shipment.tracking_number}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase().replace(/[\s_]+/g, '-');
                    if (val.includes('MOLESTIAS') || val.includes('IPSUM')) {
                      val = '';
                    }
                    setShipment({ ...shipment, tracking_number: val });
                  }}
                  placeholder="e.g. VED-2026-000108"
                  pattern="^VED-[A-Z0-9-]+$"
                  title="Tracking ID must begin with VED- (e.g. VED-2026-000108)"
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl font-mono font-black text-lg sm:text-xl tracking-wider focus:outline-hidden focus:ring-4 focus:ring-purple-400 shadow-md"
                  required
                />
              </div>
              <p className="text-[11px] text-purple-200 mt-1">
                Standard format: <span className="font-mono font-bold text-white">VED-2026-XXXXXX</span> (begins with VED-)
              </p>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-purple-200 mb-1.5">
                Initial Live Status for Consignee
              </label>
              <select
                value={shipment.current_status}
                onChange={(e) => setShipment({ ...shipment, current_status: e.target.value })}
                className="w-full px-4 py-3.5 bg-purple-950/90 text-white border border-purple-400/40 rounded-xl text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              >
                <option value="Shipment Created">Shipment Created / Intake Booked</option>
                <option value="In Transit">In Transit (Air / Linehaul)</option>
                <option value="Departed Origin">Departed Origin Gateway</option>
                <option value="Arrived at Transit Hub">Arrived at Transit Hub</option>
                <option value="Customs Clearance">Customs Clearance Inspection</option>
                <option value="Customs Cleared">Customs Cleared &amp; Released</option>
                <option value="Out for Delivery">Out for Delivery (Final Mile)</option>
                <option value="Delivered">Delivered (Completed)</option>
              </select>
            </div>
          </div>

          {/* Realtime link preview */}
          {shipment.tracking_number && (
            <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-purple-300">
                Customer Tracking URL Preview: <code className="text-white font-mono font-bold">https://www.vedcourier.online/track?id={shipment.tracking_number.trim().toUpperCase()}</code>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Realtime Query
              </span>
            </div>
          )}
        </div>

        {/* Section 1: Route & Transit Configuration */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xs border border-slate-200 space-y-6">
          <h2 className="text-base font-extrabold text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plane className="w-4 h-4 text-[#e22026]" /> 1. Route, Mode & Linehaul Logistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Transport Mode *
              </label>
              <select
                value={shipment.transport_mode}
                onChange={(e) => setShipment({ ...shipment, transport_mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="Air Freight">Air Freight (Fastest)</option>
                <option value="Ocean Freight">Ocean / Maritime Container</option>
                <option value="Express Courier">Express Courier Line</option>
                <option value="Land Freight">Dedicated Overland Truckload</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Level *
              </label>
              <select
                value={shipment.service_type}
                onChange={(e) => setShipment({ ...shipment, service_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="Priority Air Express">Priority Air Express (24–72h)</option>
                <option value="Standard International Air">Standard International Air (3–5 Days)</option>
                <option value="Door-to-Door Special">Door-to-Door Special Delivery</option>
                <option value="Ocean FCL Container">Ocean FCL Container</option>
                <option value="Ocean LCL Consolidation">Ocean LCL Consolidation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Internal Reference No. (Optional)
              </label>
              <input
                type="text"
                value={shipment.internal_reference}
                onChange={(e) => setShipment({ ...shipment, internal_reference: e.target.value })}
                placeholder="e.g. REF-USCN-9901"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Origin */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-extrabold text-xs text-[#0b2240] block">Origin Dispatch Point</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Origin Country *</label>
                <input
                  type="text"
                  required
                  value={shipment.origin_country}
                  onChange={(e) => {
                    handleCountryRouteSync(e.target.value, shipment.destination_country);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Origin City *</label>
                <input
                  type="text"
                  required
                  value={shipment.origin_city}
                  onChange={(e) => setShipment({ ...shipment, origin_city: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Intake Facility / Airport</label>
                <input
                  type="text"
                  value={shipment.origin_facility}
                  onChange={(e) => setShipment({ ...shipment, origin_facility: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-extrabold text-xs text-[#0b2240] block">Destination Delivery Point</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination Country *</label>
                <input
                  type="text"
                  required
                  value={shipment.destination_country}
                  onChange={(e) => {
                    handleCountryRouteSync(shipment.origin_country, e.target.value);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination City *</label>
                <input
                  type="text"
                  required
                  value={shipment.destination_city}
                  onChange={(e) => setShipment({ ...shipment, destination_city: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Delivery Depot / Port</label>
                <input
                  type="text"
                  value={shipment.destination_facility}
                  onChange={(e) => setShipment({ ...shipment, destination_facility: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transit Hubs (Optional)</label>
              <input
                type="text"
                value={shipment.transit_hubs}
                onChange={(e) => setShipment({ ...shipment, transit_hubs: e.target.value })}
                placeholder="e.g. Anchorage (ANC) / Dubai (DXB)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carrier / Flight Ref</label>
              <input
                type="text"
                value={shipment.flight_vessel_reference}
                onChange={(e) => setShipment({ ...shipment, flight_vessel_reference: e.target.value })}
                placeholder="e.g. VED-Flight 884"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Delivery Date</label>
              <input
                type="date"
                value={shipment.estimated_delivery_date}
                onChange={(e) => setShipment({ ...shipment, estimated_delivery_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Sender & Consignee Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sender Details */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
              2. Sender (Shipper) Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Shipper Full Name or Business *</label>
                <input
                  type="text"
                  required
                  value={shipment.sender_name}
                  onChange={(e) => setShipment({ ...shipment, sender_name: e.target.value })}
                  placeholder="Apex Precision Technologies Inc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={shipment.sender_email}
                    onChange={(e) => setShipment({ ...shipment, sender_email: e.target.value })}
                    placeholder="shipping@apexprecision.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={shipment.sender_phone}
                    onChange={(e) => setShipment({ ...shipment, sender_phone: e.target.value })}
                    placeholder="+1 (212) 555-0199"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shipment.sender_street}
                  onChange={(e) => setShipment({ ...shipment, sender_street: e.target.value })}
                  placeholder="450 West 33rd Street, Floor 14"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shipment.sender_city}
                    onChange={(e) => setShipment({ ...shipment, sender_city: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    value={shipment.sender_state}
                    onChange={(e) => setShipment({ ...shipment, sender_state: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ZIP / Postal</label>
                  <input
                    type="text"
                    value={shipment.sender_postal_code}
                    onChange={(e) => setShipment({ ...shipment, sender_postal_code: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Receiver Details */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
              3. Receiver (Consignee) Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Receiver Name or Entity *</label>
                <input
                  type="text"
                  required
                  value={shipment.receiver_name}
                  onChange={(e) => setShipment({ ...shipment, receiver_name: e.target.value })}
                  placeholder="Shanghai Semiconductor Systems Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={shipment.receiver_email}
                    onChange={(e) => setShipment({ ...shipment, receiver_email: e.target.value })}
                    placeholder="receiving@shanghaisemi.cn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={shipment.receiver_phone}
                    onChange={(e) => setShipment({ ...shipment, receiver_phone: e.target.value })}
                    placeholder="+86 21 6888 2300"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  value={shipment.receiver_street}
                  onChange={(e) => setShipment({ ...shipment, receiver_street: e.target.value })}
                  placeholder="Building 8, Zhangjiang Hi-Tech Park, Pudong"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shipment.receiver_city}
                    onChange={(e) => setShipment({ ...shipment, receiver_city: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Province / State</label>
                  <input
                    type="text"
                    value={shipment.receiver_state}
                    onChange={(e) => setShipment({ ...shipment, receiver_state: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={shipment.receiver_postal_code}
                    onChange={(e) => setShipment({ ...shipment, receiver_postal_code: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Special Delivery Instructions</label>
                <input
                  type="text"
                  value={shipment.delivery_instructions}
                  onChange={(e) => setShipment({ ...shipment, delivery_instructions: e.target.value })}
                  placeholder="e.g. Call recipient 2 hours before arrival; Loading dock bay 4"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Section 3: Package Builder & Measurements */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xs border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#0b2240] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#e22026]" /> 4. Packages, Weights & Dimensions
              </h3>
              <p className="text-xs text-slate-500">
                Supports multi-package consignments with carrier volumetric calculation (L × W × H ÷ 5000).
              </p>
            </div>
            <button
              type="button"
              onClick={addPackageRow}
              className="text-xs font-bold bg-[#0b2240] hover:bg-[#163866] text-white px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Package Row
            </button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0b2240]">
                    Package #{idx + 1}
                  </span>
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePackageRow(idx)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition"
                      title="Remove package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Description of Goods *</label>
                    <input
                      type="text"
                      required
                      value={pkg.description}
                      onChange={(e) => updatePackageField(idx, 'description', e.target.value)}
                      placeholder="e.g. Sensors, Machine parts"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Package Type</label>
                    <select
                      value={pkg.package_type}
                      onChange={(e) => updatePackageField(idx, 'package_type', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Box / Carton">Box / Carton</option>
                      <option value="Wooden Crate">Wooden Crate</option>
                      <option value="Pallet">Pallet</option>
                      <option value="Drum / Barrel">Drum / Barrel</option>
                      <option value="Padded Envelope">Padded Envelope</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={pkg.quantity}
                      onChange={(e) => updatePackageField(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={pkg.weight}
                      onChange={(e) => updatePackageField(idx, 'weight', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">L × W × H (cm)</label>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        placeholder="L"
                        value={pkg.length}
                        onChange={(e) => updatePackageField(idx, 'length', Number(e.target.value))}
                        className="px-1.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="W"
                        value={pkg.width}
                        onChange={(e) => updatePackageField(idx, 'width', Number(e.target.value))}
                        className="px-1.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="H"
                        value={pkg.height}
                        onChange={(e) => updatePackageField(idx, 'height', Number(e.target.value))}
                        className="px-1.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Handling Instructions</label>
                    <input
                      type="text"
                      value={pkg.handling_instructions}
                      onChange={(e) => updatePackageField(idx, 'handling_instructions', e.target.value)}
                      placeholder="e.g. Fragile, Keep Upright, Do Not Stack"
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pkg.fragile === 1}
                        onChange={(e) => updatePackageField(idx, 'fragile', e.target.checked ? 1 : 0)}
                        className="rounded text-[#e22026]"
                      />
                      <span className="font-semibold">Fragile Cargo</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary Banner */}
          <div className="p-4 bg-[#0b2240] text-white rounded-xl grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gross Weight</span>
              <span className="text-lg font-black text-white">{totalActual.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Volumetric Weight</span>
              <span className="text-lg font-black text-white">{totalVolumetric.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-red-300 block">Billable Chargeable Weight</span>
              <span className="text-lg font-black text-[#e22026] bg-white px-2 py-0.5 rounded-md inline-block">
                {chargeableWeight.toFixed(2)} kg
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Customs, Tariffs & Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Customs */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
              5. Customs & Compliance Declarations
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Declared Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={shipment.declared_value}
                    onChange={(e) => setShipment({ ...shipment, declared_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={shipment.currency}
                    onChange={(e) => setShipment({ ...shipment, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="KRW">KRW (₩)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">HS Tariff Classification Code</label>
                <input
                  type="text"
                  value={shipment.hs_code}
                  onChange={(e) => setShipment({ ...shipment, hs_code: e.target.value })}
                  placeholder="e.g. 8471.80.10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Customs Declaration Reference</label>
                <input
                  type="text"
                  value={shipment.customs_declaration_ref}
                  onChange={(e) => setShipment({ ...shipment, customs_declaration_ref: e.target.value })}
                  placeholder="e.g. DEC-CN-2026-9031"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Billing & Charges */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
              6. Shipping Fees & Payment Record
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Freight Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={shipment.shipping_fee}
                    onChange={(e) => setShipment({ ...shipment, shipping_fee: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Handling Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={shipment.handling_fee}
                    onChange={(e) => setShipment({ ...shipment, handling_fee: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Cargo Insurance ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={shipment.insurance_fee}
                    onChange={(e) => setShipment({ ...shipment, insurance_fee: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Customs Clearance ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={shipment.customs_charges}
                    onChange={(e) => setShipment({ ...shipment, customs_charges: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={shipment.payment_status}
                    onChange={(e) => setShipment({ ...shipment, payment_status: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Pending">Payment Pending</option>
                    <option value="Post-Delivery Invoice">Post-Delivery Invoice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={shipment.payment_method}
                    onChange={(e) => setShipment({ ...shipment, payment_method: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Bank Wire">Bank Wire Transfer</option>
                    <option value="Corporate Account">Corporate Account Credit</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0b2240]">Total Billing Charge:</span>
                <span className="text-base font-black font-mono text-[#0b2240]">
                  ${totalCharges.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Section 5: Notes & Submit */}
        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
            7. Shipment Notes & Authorization
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Visible Notes</label>
              <textarea
                rows={2}
                value={shipment.customer_notes}
                onChange={(e) => setShipment({ ...shipment, customer_notes: e.target.value })}
                placeholder="Notes visible on customer waybill..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-700 mb-1">
                Internal Administrative Notes (Private)
              </label>
              <textarea
                rows={2}
                value={shipment.internal_notes}
                onChange={(e) => setShipment({ ...shipment, internal_notes: e.target.value })}
                placeholder="Confidential staff instructions (never exposed publicly)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/admin/shipments"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-700 via-purple-800 to-[#2e0854] hover:from-purple-800 hover:to-purple-950 disabled:opacity-70 text-white rounded-xl text-sm font-black shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Realtime Tracking...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Activate Realtime Tracking ID: {shipment.tracking_number || 'Auto-Generate'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
