'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plane, 
  Ship, 
  Truck, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  Printer,
  ChevronRight,
  HelpCircle,
  FileCheck
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
    setLoading(true);
    setError(null);
    setShipment(null);

    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to locate tracking record.');
      } else {
        setShipment(data.shipment);
      }
    } catch {
      setError('Network communication failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setInputVal(initialId);
      performLookup(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    router.push(`/track?id=${encodeURIComponent(inputVal.trim())}`);
    performLookup(inputVal.trim());
  };

  const copyTracking = () => {
    if (shipment?.tracking_number) {
      navigator.clipboard.writeText(shipment.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Status mapping for progress stages
  const stages = [
    { key: 'created', label: 'Order Created' },
    { key: 'origin', label: 'Collected / Origin Hub' },
    { key: 'transit', label: 'In Transit' },
    { key: 'customs', label: 'Customs Clearance' },
    { key: 'delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
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

  const getStatusBadgeClass = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s.includes('out for delivery')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (s.includes('customs')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (s.includes('delayed') || s.includes('exception') || s.includes('hold')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const demoNumbers = [
    { id: 'VED-2026-000101', label: 'US → China (Customs Cleared)' },
    { id: 'VED-2026-000102', label: 'China → Nigeria (In Transit)' },
    { id: 'VED-2026-000103', label: 'US → Nigeria (Out for Delivery)' },
    { id: 'VED-2026-000104', label: 'Korea → US (Delivered)' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner with Logistics Backdrop */}
      <section className="relative bg-[#0b2240] text-white py-14 px-4 sm:px-8 border-b-4 border-[#e22026] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-cargo.jpg"
            alt="International Air Cargo Terminal"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#0b2240]/95 to-[#0b2240]/85" />
        </div>
        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-wider">
            <Search className="w-4 h-4 text-[#e22026]" /> Official Consignment Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Track & Trace Your Consignment
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Live, verified tracking data directly from VED Courier global air cargo terminals, maritime gateways, and customs hubs.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Tracking ID (e.g., VED-2026-000101)"
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 rounded-xl font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-[#e22026] shadow-md"
                required
              />
              <Package className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#e22026] hover:bg-[#b81419] disabled:opacity-70 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Consignment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Links */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-slate-300">
            <span className="text-slate-400">Sample Active Tracking IDs:</span>
            {demoNumbers.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setInputVal(d.id);
                  router.push(`/track?id=${d.id}`);
                  performLookup(d.id);
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-[11px] font-mono border border-white/10 transition"
              >
                {d.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-10">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-slate-200 space-y-4">
            <div className="w-12 h-12 mx-auto border-4 border-[#0b2240] border-t-[#e22026] rounded-full animate-spin" />
            <h3 className="text-base font-bold text-slate-800">Querying Global Dispatch Database...</h3>
            <p className="text-xs text-slate-500">Retrieving authentic milestone timeline and current facility coordinates.</p>
          </div>
        )}

        {/* Error / Not Found View */}
        {error && !loading && (
          <div className="bg-white rounded-2xl p-8 shadow-xs border border-red-200 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-[#e22026] flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tracking Record Not Found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {error}
            </p>
            <div className="pt-3 flex items-center justify-center gap-4 text-xs">
              <button
                onClick={() => {
                  setInputVal('VED-2026-000101');
                  router.push('/track?id=VED-2026-000101');
                  performLookup('VED-2026-000101');
                }}
                className="bg-[#0b2240] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#163866] transition"
              >
                Try Demo ID VED-2026-000101
              </button>
              <a
                href="/contact"
                className="text-slate-700 hover:text-black font-semibold underline"
              >
                Contact Dispatch Helpdesk
              </a>
            </div>
          </div>
        )}

        {/* Empty State before any search */}
        {!shipment && !loading && !error && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-slate-200 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-[#0b2240] flex items-center justify-center">
              <Package className="w-8 h-8 text-[#0b2240]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enter a Tracking Number Above</h3>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Please provide the tracking ID issued on your VED Courier booking confirmation, bill of lading, or dispatch label.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setInputVal('VED-2026-000101');
                  router.push('/track?id=VED-2026-000101');
                  performLookup('VED-2026-000101');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-lg transition"
              >
                Inspect Sample US → China Record
              </button>
            </div>
          </div>
        )}

        {/* Active Shipment Display */}
        {shipment && !loading && (
          <div className="space-y-8">
            
            {/* Top Shipment Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tracking Identification
                    </span>
                    <button
                      onClick={copyTracking}
                      className="text-slate-400 hover:text-slate-600 transition p-1"
                      title="Copy Tracking Number"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono text-[#0b2240] tracking-tight">
                    {shipment.tracking_number}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide border shadow-2xs ${getStatusBadgeClass(shipment.current_status)}`}>
                    {shipment.current_status}
                  </span>
                </div>
              </div>

              {/* Progress Milestones Bar */}
              <div className="py-2">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                  <div 
                    className="hidden sm:block absolute top-1/2 left-0 h-1 bg-[#e22026] -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                  />

                  {/* Stage Points */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                    {stages.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage.key} className="flex flex-col sm:items-center text-left sm:text-center space-y-1.5">
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              isCompleted
                                ? 'bg-[#e22026] text-white shadow-md'
                                : 'bg-slate-200 text-slate-500'
                            } ${isCurrent ? 'ring-4 ring-red-200' : ''}`}
                          >
                            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-bold ${isCurrent ? 'text-[#0b2240]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Origin to Destination Route Banner */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Origin */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0b2240] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#0b2240]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Origin</span>
                    <p className="font-extrabold text-base text-[#0b2240]">{shipment.origin_city}, {shipment.origin_country}</p>
                    <p className="text-xs text-slate-500">{shipment.origin_facility}</p>
                  </div>
                </div>

                {/* Transit Indicator */}
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>{shipment.transport_mode}</span>
                  </div>
                  <div className="flex items-center gap-2 my-1">
                    <div className="w-12 h-0.5 bg-slate-300" />
                    <Plane className="w-4 h-4 text-[#e22026]" />
                    <div className="w-12 h-0.5 bg-slate-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {shipment.transit_hubs ? `Via: ${shipment.transit_hubs}` : 'Direct Cargo Flight'}
                  </span>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Destination</span>
                    <p className="font-extrabold text-base text-[#0b2240]">{shipment.destination_city}, {shipment.destination_country}</p>
                    <p className="text-xs text-slate-500">{shipment.destination_facility}</p>
                  </div>
                </div>

              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Current Recorded Location</span>
                  <span className="font-bold text-[#0b2240] text-sm mt-0.5 block">
                    {shipment.current_recorded_location}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Estimated Delivery Date</span>
                  <span className="font-bold text-[#0b2240] text-sm mt-0.5 block">
                    {shipment.estimated_delivery_date || 'In Transit Scheduling'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Total Chargeable Weight</span>
                  <span className="font-bold text-[#0b2240] text-sm mt-0.5 block">
                    {shipment.total_actual_weight} {shipment.weight_unit} ({shipment.package_count} package{shipment.package_count > 1 ? 's' : ''})
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Carrier & Service Type</span>
                  <span className="font-bold text-[#0b2240] text-sm mt-0.5 block">
                    {shipment.service_type}
                  </span>
                </div>
              </div>

            </div>

            {/* Tracking History Timeline */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-[#0b2240] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#e22026]" /> Chronological Milestone Timeline
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {shipment.events?.length || 0} Verified Milestones
                </span>
              </div>

              {(!shipment.events || shipment.events.length === 0) ? (
                <p className="text-xs text-slate-500 py-4">Location not yet updated. Consignment intake in progress.</p>
              ) : (
                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {shipment.events.slice().reverse().map((evt: any, i: number) => {
                    const isLatest = i === 0;
                    return (
                      <div key={evt.id || i} className="relative group">
                        {/* Dot */}
                        <div 
                          className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                            isLatest 
                              ? 'bg-[#e22026] ring-4 ring-red-100' 
                              : 'bg-[#0b2240]'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>

                        {/* Content */}
                        <div className={`p-4 rounded-xl border transition ${
                          isLatest ? 'bg-red-50/40 border-red-200 shadow-xs' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <h4 className="font-extrabold text-sm text-[#0b2240]">
                              {evt.event_title}
                            </h4>
                            <span className="text-xs font-mono font-medium text-slate-500">
                              {evt.event_timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-[#e22026]" />
                            <span>{evt.location_name}{evt.city ? `, ${evt.city}` : ''}, {evt.country}</span>
                            {evt.facility_name && (
                              <span className="text-slate-400 font-normal">({evt.facility_name})</span>
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

            {/* Parcel Contents Approval Card */}
            {shipment.packages && shipment.packages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2240] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" /> Package Declarations
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {shipment.packages.map((pkg: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{pkg.description}</span>
                        <span className="text-slate-400 block text-[11px]">{pkg.package_type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-700">{pkg.weight} {pkg.weight_unit}</span>
                        <span className="text-slate-400 block text-[11px]">Qty: {pkg.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Protection Disclaimer */}
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Customer Confidentiality & Privacy Notice</p>
                <p className="mt-0.5">
                  To protect commercial confidentiality and recipient privacy, full street addresses, recipient telephone numbers, and financial tariff statements are excluded from public tracking. Authorized account holders can access full records via the Customer & Staff Portal.
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#0b2240] border-t-[#e22026] rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
