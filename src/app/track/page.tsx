'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Search, Package, MapPin, Calendar, Clock, CheckCircle,
  AlertCircle, Plane, Check, ArrowRight, Copy, ShieldCheck, FileCheck,
  Send, RefreshCw, Printer, ChevronRight
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const performLookup = async (id: string) => {
    if (!id.trim()) return;
    const cleanId = id.trim().toUpperCase().replace(/\s+/g, '-').replace(/_+/g, '-');
    if (cleanId.includes('MOLESTIAS') || cleanId.includes('IPSUM') || cleanId === 'QUO') {
      setError('Invalid tracking number. Official VED tracking numbers start with VED- (e.g. VED-2026-000102).');
      return;
    }
    setLoading(true);
    setError(null);
    setShipment(null);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Unable to locate tracking record.');
      else setShipment(data.shipment);
    } catch {
      setError('Network communication failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) { setInputVal(initialId); performLookup(initialId); }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const clean = inputVal.trim().toUpperCase().replace(/\s+/g, '-');
    router.push(`/track?id=${encodeURIComponent(clean)}`);
    performLookup(clean);
  };

  const copyTracking = () => {
    if (shipment?.tracking_number) {
      navigator.clipboard.writeText(shipment.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stages = [
    { key: 'created', label: 'Order Created', icon: Package },
    { key: 'origin', label: 'Origin Hub', icon: MapPin },
    { key: 'transit', label: 'In Transit', icon: Plane },
    { key: 'customs', label: 'Customs', icon: FileCheck },
    { key: 'delivery', label: 'Out for Delivery', icon: ArrowRight },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getStageIndex = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 5;
    if (s.includes('out for delivery') || s.includes('local facility')) return 4;
    if (s.includes('customs')) return 3;
    if (s.includes('in transit') || s.includes('transit hub') || s.includes('departed')) return 2;
    if (s.includes('picked up') || s.includes('received at origin')) return 1;
    return 0;
  };

  const currentStageIndex = shipment ? getStageIndex(shipment.current_status) : 0;

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s.includes('out for delivery')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (s.includes('customs')) return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
    if (s.includes('delayed') || s.includes('exception') || s.includes('hold')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ─── TRACK HERO IN PURPLE & WHITE ─────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] text-white py-16 px-4 sm:px-8 border-b-4 border-purple-500 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-cargo.jpg"
            alt="Cargo Terminal"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#240643]/95 via-[#2e0854]/90 to-[#2e0854]/80" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-900/80 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold text-purple-200">
            <Search className="w-3.5 h-3.5 text-purple-300" />
            <span>GLOBAL CARGO &amp; WAYBILL TRACKING</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Track &amp; Trace Your Waybill
          </h1>
          <p className="text-purple-200 text-sm max-w-2xl leading-relaxed">
            Live, verified tracking data directly from VED Courier global air cargo terminals, maritime gateways, and customs hubs across the United Kingdom, the USA, China, and Korea.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-2xl">
            <div className="relative flex-1">
              <Package className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Waybill / Tracking ID (e.g. VED-2026-000101)"
                className="w-full pl-12 pr-4 py-4 bg-white text-slate-900 rounded-xl font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 shadow-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-bold px-8 py-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Waybill</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Official Format Helper */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-purple-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Official Tracking Format: <strong className="font-mono text-white">VED-YYYY-XXXXXX</strong> (as printed on your dispatch waybill or booking receipt)</span>
          </div>
        </div>
      </section>

      {/* ─── RESULTS AREA ────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-purple-100 space-y-4">
            <div className="w-12 h-12 mx-auto border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
            <h3 className="text-base font-bold text-slate-800">Querying Global Dispatch Database...</h3>
            <p className="text-xs text-slate-500">Retrieving authentic milestone timeline and current facility coordinates.</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-red-200 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Waybill Record Not Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">{error}</p>
            <div className="flex items-center justify-center gap-4 text-sm pt-2">
              <button
                onClick={() => {
                  setInputVal('VED-2026-000101');
                  router.push('/track?id=VED-2026-000101');
                  performLookup('VED-2026-000101');
                }}
                className="bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-800 transition text-sm"
              >
                Try Demo ID VED-2026-000101
              </button>
              <Link href="/contact" className="text-purple-700 hover:text-purple-900 font-semibold underline text-sm">
                Contact Support Desk
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!shipment && !loading && !error && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-purple-100 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#2e0854]">Enter a Waybill Number Above</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Please enter the tracking waybill issued on your VED Courier booking confirmation, air waybill, or dispatch receipt.
            </p>
            <button
              onClick={() => {
                setInputVal('VED-2026-000101');
                router.push('/track?id=VED-2026-000101');
                performLookup('VED-2026-000101');
              }}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-5 py-2.5 rounded-xl transition"
            >
              View Sample Record (US → China)
            </button>
          </div>
        )}

        {/* ─── ACTIVE SHIPMENT DISPLAY (PURPLE & WHITE) ───────────────── */}
        {shipment && !loading && (
          <div className="space-y-6">
            
            {/* Top Status Card */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
              
              {/* Header in Deep Purple */}
              <div className="bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
                <div>
                  <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">Waybill Identification</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black font-mono text-white tracking-tight">
                      {shipment.tracking_number}
                    </h2>
                    <button
                      onClick={copyTracking}
                      className="text-purple-300 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10"
                      title="Copy Waybill"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <span className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border ${getStatusBadge(shipment.current_status)}`}>
                  {shipment.current_status}
                </span>
              </div>

              {/* Progress Milestones Bar (Purple Stepper) */}
              <div className="px-6 py-6 border-b border-purple-50">
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-1 bg-purple-100 hidden sm:block" />
                  <div
                    className="absolute top-4 left-4 h-1 bg-purple-700 transition-all duration-700 hidden sm:block"
                    style={{ width: `calc(${(currentStageIndex / (stages.length - 1)) * 100}% - 2rem)` }}
                  />

                  <div className="flex justify-between relative z-10">
                    {stages.map(({ key, label, icon: SIcon }, idx) => {
                      const done = idx <= currentStageIndex;
                      const current = idx === currentStageIndex;
                      return (
                        <div key={key} className="flex flex-col items-center gap-2 text-center w-14">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                            done
                              ? current
                                ? 'bg-purple-700 border-purple-700 shadow-md ring-4 ring-purple-200'
                                : 'bg-[#2e0854] border-[#2e0854]'
                              : 'bg-white border-slate-300'
                          }`}>
                            {done ? (
                              current
                                ? <SIcon className="w-4 h-4 text-white" />
                                : <Check className="w-4 h-4 text-white stroke-[3]" />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold leading-tight ${current ? 'text-purple-800' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Origin to Destination Corridor Strip */}
              <div className="px-6 py-5 bg-purple-50/50 border-b border-purple-100">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  
                  {/* Origin */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-purple-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Origin Hub</span>
                      <p className="font-black text-[#2e0854] text-sm">{shipment.origin_city}, {shipment.origin_country}</p>
                      {shipment.origin_facility && <p className="text-[11px] text-slate-500">{shipment.origin_facility}</p>}
                    </div>
                  </div>

                  {/* Transport Indicator */}
                  <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <div className="w-10 h-0.5 bg-purple-300" />
                    <div className="bg-purple-700 rounded-full p-1.5 shadow-sm">
                      <Plane className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="w-10 h-0.5 bg-purple-300" />
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Destination</span>
                      <p className="font-black text-[#2e0854] text-sm">{shipment.destination_city}, {shipment.destination_country}</p>
                      {shipment.destination_facility && <p className="text-[11px] text-slate-500">{shipment.destination_facility}</p>}
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="md:ml-auto text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Transport Mode</span>
                    <p className="font-bold text-[#2e0854] text-sm">{shipment.transport_mode}</p>
                    {shipment.transit_hubs && <p className="text-[11px] text-slate-500">Via: {shipment.transit_hubs}</p>}
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-purple-100 text-xs">
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Facility</span>
                  <span className="font-extrabold text-[#2e0854] text-sm block leading-tight">{shipment.current_recorded_location}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Est. Delivery</span>
                  <span className="font-extrabold text-[#2e0854] text-sm block leading-tight">{shipment.estimated_delivery_date || 'In Transit Scheduling'}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Chargeable Weight</span>
                  <span className="font-extrabold text-[#2e0854] text-sm block leading-tight">{shipment.total_actual_weight} {shipment.weight_unit} ({shipment.package_count} pkg)</span>
                </div>
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Service Type</span>
                  <span className="font-extrabold text-[#2e0854] text-sm block leading-tight">{shipment.service_type}</span>
                </div>
              </div>

            </div>

            {/* Timeline Milestones Card */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-50">
                <h3 className="text-lg font-black text-[#2e0854] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-700" />
                  Chronological Milestone Timeline
                </h3>
                <span className="text-xs text-purple-800 bg-purple-50 px-3 py-1 rounded-full font-bold border border-purple-200">
                  {shipment.events?.length || 0} Verified Checkpoints
                </span>
              </div>

              {(!shipment.events || shipment.events.length === 0) ? (
                <p className="text-sm text-slate-400 py-4">No location updates yet. Consignment intake in progress.</p>
              ) : (
                <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
                  {shipment.events.slice().reverse().map((evt: any, i: number) => {
                    const isLatest = i === 0;
                    return (
                      <div key={evt.id || i} className="relative">
                        <div className={`absolute -left-7 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                          isLatest ? 'bg-purple-700 ring-4 ring-purple-100' : 'bg-[#2e0854]'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>

                        <div className={`rounded-2xl border p-4 transition ${
                          isLatest ? 'bg-purple-50/60 border-purple-200 shadow-xs' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <h4 className="font-extrabold text-sm text-[#2e0854]">
                              {evt.event_title}
                            </h4>
                            <span className="text-[11px] font-mono font-medium text-slate-500">
                              {evt.event_timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold mb-1.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                            <span>{evt.location_name}{evt.city ? `, ${evt.city}` : ''}, {evt.country}</span>
                            {evt.facility_name && (
                              <span className="text-slate-500 font-normal">({evt.facility_name})</span>
                            )}
                          </div>

                          {evt.event_description && (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {evt.event_description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Package Contents Breakdown */}
            {shipment.packages && shipment.packages.length > 0 && (
              <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-[#2e0854] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Package Declarations &amp; Manifest
                </h4>
                <div className="divide-y divide-purple-50 text-xs">
                  {shipment.packages.map((pkg: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{pkg.description}</span>
                        <span className="text-slate-400 block text-[11px] mt-0.5">{pkg.package_type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-purple-900">{pkg.weight} {pkg.weight_unit}</span>
                        <span className="text-slate-400 block text-[11px]">Qty: {pkg.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Protection Disclaimer */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-start gap-3 text-xs text-purple-950">
              <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#2e0854] mb-0.5">Privacy Guard Policy</p>
                <p>
                  To protect commercial confidentiality and recipient safety, specific street apartment numbers and billing invoices are excluded from public tracking.
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
