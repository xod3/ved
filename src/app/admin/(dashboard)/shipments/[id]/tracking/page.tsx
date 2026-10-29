'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  Package
} from 'lucide-react';

export default function TrackingEventPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params.id as string;

  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form
  const [status, setStatus] = useState('In Transit');
  const [eventTitle, setEventTitle] = useState('In Transit: Flight en route to destination gateway');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [eventTimestamp, setEventTimestamp] = useState(
    new Date().toISOString().substring(0, 16)
  );
  const [eventDescription, setEventDescription] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  const fetchShipment = async () => {
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(shipmentId)}`);
      // Or query by internal id
      const res2 = await fetch(`/api/admin/shipments`);
      const data2 = await res2.json();
      const current = data2.shipments?.find((s: any) => s.id === shipmentId || s.tracking_number === shipmentId);
      if (current) {
        setShipment(current);
        setLocationName(current.origin_facility || current.origin_city);
        setCity(current.origin_city);
        setCountry(current.origin_country);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [shipmentId]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // Auto-fill sensible default title & description
    if (newStatus === 'Picked Up') {
      setEventTitle('Parcel Collected from Shipper Premises');
      setEventDescription('Consignment collected by VED Courier courier. Preparing for origin hub intake.');
    } else if (newStatus === 'Received at Origin Facility') {
      setEventTitle('Consignment Received & Screened at Origin Cargo Terminal');
      setEventDescription('Package weighed, X-ray inspected, and palletized for export flight.');
    } else if (newStatus === 'Departed Origin') {
      setEventTitle('Departed Origin Gateway on Scheduled Cargo Flight');
      setEventDescription('Freight departed origin airport. En route to destination transshipment hub.');
    } else if (newStatus === 'Arrived at Transit Hub') {
      setEventTitle('Transferred at Intercontinental Sorting Hub');
      setEventDescription('Aircraft arrived. Cargo transferred for connecting linehaul.');
    } else if (newStatus === 'Customs Clearance') {
      setEventTitle('Customs Clearance in Progress');
      setEventDescription('Consignment submitted to destination customs authority for inspection and tariff verification.');
    } else if (newStatus === 'Customs Cleared') {
      setEventTitle('Customs Clearance Completed & Released');
      setEventDescription('Customs duties verified. Goods officially released to local distribution facility.');
    } else if (newStatus === 'Customs Hold') {
      setEventTitle('Customs Documentation Hold');
      setEventDescription('Customs authority requested supplementary commercial documentation. Clearance officer assigned.');
    } else if (newStatus === 'Out for Delivery') {
      setEventTitle('Out for Delivery with Local Courier Fleet');
      setEventDescription('Assigned to VED Courier driver. Scheduled for doorstep delivery today.');
    } else if (newStatus === 'Delivered') {
      setEventTitle('Successfully Delivered & Signed For');
      setEventDescription('Consignment delivered in good condition and signed for by consignee.');
    } else if (newStatus === 'Delayed') {
      setEventTitle('Weather / Flight Schedule Delay');
      setEventDescription('Temporary connection delay due to adverse linehaul flight operations.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/tracking-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment_id: shipment?.id || shipmentId,
          status,
          event_title: eventTitle,
          event_description: eventDescription,
          internal_note: internalNote,
          location_name: locationName,
          city,
          region,
          country,
          facility_name: facilityName,
          event_timestamp: eventTimestamp.replace('T', ' ') + ':00',
          is_public: isPublic,
          notify_customer: notifyCustomer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to add milestone.');
      } else {
        setSuccessMsg('Milestone update successfully posted and published!');
        setTimeout(() => {
          router.push(`/admin/shipments/${shipment?.id || shipmentId}`);
        }, 1500);
      }
    } catch {
      setErrorMsg('Network error. Check server status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <Link
            href={`/admin/shipments/${shipmentId}`}
            className="text-xs font-bold text-slate-500 hover:text-[#0b2240] flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipment Details
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Record Transit Milestone & Update Location
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updating status appends an immutable event to the shipment timeline and advances the customer-facing tracking page.
          </p>
        </div>
      </div>

      {/* Shipment Reference Card */}
      {shipment && (
        <div className="bg-[#0b2240] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Shipment</span>
            <p className="text-xl font-black font-mono">{shipment.tracking_number}</p>
            <p className="text-xs text-slate-300 mt-0.5">
              Route: <span className="font-bold text-white">{shipment.shipping_route}</span> ({shipment.transport_mode})
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
            <span className="inline-block bg-white/10 text-white font-extrabold px-3 py-1 rounded-lg text-xs mt-1 border border-white/20">
              {shipment.current_status}
            </span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2.5 text-xs text-red-900 font-bold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        
        {/* Status Selection */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700">
            Select Operational Status Milestone *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              'Picked Up',
              'Received at Origin Facility',
              'Departed Origin',
              'In Transit',
              'Arrived at Transit Hub',
              'Customs Clearance',
              'Customs Cleared',
              'Customs Hold',
              'Arrived at Local Facility',
              'Out for Delivery',
              'Delivered',
              'Delayed',
            ].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-2 rounded-xl text-left font-bold transition border ${
                  status === st
                    ? 'bg-[#e22026] text-white border-[#e22026] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Event Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Milestone Event Title (Customer Facing) *
          </label>
          <input
            type="text"
            required
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
          />
        </div>

        {/* Location & Facility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Facility / Hub Name *
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Shanghai Pudong Airport Customs Logistics Center"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. China"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Shanghai"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Event Timestamp *
            </label>
            <input
              type="datetime-local"
              required
              value={eventTimestamp}
              onChange={(e) => setEventTimestamp(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Description & Internal Note */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Public Description (Visible to Customer on Tracking Page)
            </label>
            <textarea
              rows={3}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Detailed description of transit event..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-red-700 mb-1">
              Internal Administrative Note (Staff & Auditors Only)
            </label>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Confidential notes, driver license info, customs inspection details..."
              className="w-full px-3.5 py-2 bg-red-50/40 border border-red-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded text-[#e22026]"
              />
              <span>Publish to Public Tracking Page</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="rounded text-[#0b2240]"
              />
              <span className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-blue-600" /> Send Email / SMS Alert
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/shipments/${shipmentId}`}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#e22026] hover:bg-[#b81419] disabled:opacity-70 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Record & Publish Milestone</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
