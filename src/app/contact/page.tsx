'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle,
  MessageSquare, Globe2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tracking_number: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessTicket(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit inquiry.');
      } else {
        setSuccessTicket(data.ticket_number);
        setFormData({ name: '', email: '', phone: '', tracking_number: '', subject: '', message: '' });
      }
    } catch {
      setErrorMsg('Network error. Please try again or reach out via telephone.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: 'Global HQ & Logistics Hub',
      value: '100 Global Logistics Parkway, Suite 400\nNew York, NY 10001, United States',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
      isAddress: true,
    },
    {
      icon: Phone,
      label: 'Customer Support Hotline',
      value: '+1 (800) 592-8334 (Toll-Free USA)',
      href: 'tel:+18005928334',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp Business Dispatch',
      value: '+1 (800) 592-8334 (Instant Tracking Updates)',
      href: 'https://wa.me/18005928334',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Mail,
      label: 'Official Dispatch Email',
      value: 'support@vedcourier.com',
      href: 'mailto:support@vedcourier.com',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      icon: Clock,
      label: 'Station Operational Hours',
      value: 'Terminal Intake: 24/7/365 Non-Stop\nCustoms & Freight Desk: Mon–Sat, 06:00–22:00 Local',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      isAddress: true,
    },
  ];

  const hubs = [
    { name: 'North America (JFK / LAX)', cities: 'New York & Los Angeles' },
    { name: 'Europe & United Kingdom (LHR / MAN)', cities: 'London & Manchester, UK' },
    { name: 'East Asia (PVG / CAN)', cities: 'Shanghai & Guangzhou, China' },
    { name: 'Northeast Asia (ICN)', cities: 'Seoul Incheon, South Korea' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ─── PAGE HEADER (PURPLE & WHITE) ──────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] text-white py-14 px-4 sm:px-8 border-b-4 border-purple-500">
        <div className="max-w-6xl mx-auto space-y-3">
          <span className="text-xs font-black tracking-widest text-purple-300 uppercase bg-purple-900/80 px-3 py-1 rounded-full border border-purple-400/30">
            24/7 CUSTOMER SUPPORT &amp; DISPATCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Contact VED Courier Logistics
          </h1>
          <p className="text-purple-200 text-sm max-w-2xl leading-relaxed">
            Have questions about a shipment, customs pre-clearance, freight rate quotation, or merchant fulfillment? Our international logistics coordinators are ready to help.
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── LEFT: Contact Info ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-7 space-y-5">
              <h3 className="font-extrabold text-base text-[#2e0854] border-b border-purple-50 pb-3">
                Corporate Headquarters &amp; Stations
              </h3>
              <div className="space-y-5">
                {contactItems.map(({ icon: Icon, label, value, href, iconBg, iconColor, isAddress }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                          className="text-sm text-purple-900 font-bold hover:text-purple-700 transition">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Hubs */}
            <div className="bg-[#2e0854] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <h4 className="font-bold text-xs tracking-widest uppercase text-purple-300 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-purple-400" />
                Active Gateway Stations
              </h4>
              <div className="space-y-1">
                {hubs.map((hub) => (
                  <div key={hub.name} className="py-2.5 flex justify-between border-b border-purple-900/60 last:border-0 text-sm">
                    <span className="font-semibold text-purple-100">{hub.name}</span>
                    <span className="text-purple-300 text-xs self-center">{hub.cities}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Inquiry / Quote Form ── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-7 sm:p-9">
              <div className="mb-6">
                <h3 className="font-extrabold text-xl text-[#2e0854]">Send An Inquiry or Request a Rate Quote</h3>
                <p className="text-xs text-slate-500 mt-1.5">
                  Your inquiry is recorded in our real-time database support ticket registry and routed immediately to an operations manager.
                </p>
              </div>

              {successTicket && (
                <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-800">
                    <p className="font-bold text-sm mb-0.5">Ticket Successfully Logged!</p>
                    <p>Your reference: <span className="font-mono font-bold text-emerald-950">{successTicket}</span>. Our logistics officer will contact you within 2 business hours.</p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-800">
                    <p className="font-bold mb-0.5">Submission Error</p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. John Doe', required: true },
                    { label: 'Email Address', field: 'email', type: 'email', placeholder: 'e.g. jdoe@company.com', required: true },
                    { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: false },
                    { label: 'Waybill ID (If applicable)', field: 'tracking_number', type: 'text', placeholder: 'e.g. VED-2026-000101', required: false },
                  ].map(({ label, field, type, placeholder, required }) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {label} {required && <span className="text-purple-700">*</span>}
                      </label>
                      <input
                        type={type}
                        required={required}
                        value={formData[field as keyof typeof formData]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 focus:border-purple-700 transition"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Service Required <span className="text-purple-700">*</span>
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 focus:border-purple-700 transition"
                  >
                    <option value="">Select a category...</option>
                    <option value="Tracking & Milestone Inquiry">Tracking &amp; Milestone Inquiry</option>
                    <option value="Book A Doorstep Pickup">Book A Doorstep Pickup</option>
                    <option value="Air Freight Booking & Quote">Air Freight Booking &amp; Quote</option>
                    <option value="Ocean Freight Container Slot">Ocean Freight Container Slot</option>
                    <option value="Customs Clearance & Documentation">Customs Clearance &amp; Documentation</option>
                    <option value="E-Commerce Merchant Onboarding">E-Commerce Merchant Onboarding</option>
                    <option value="Claims or Delivery Exception">Claims or Delivery Exception</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Detailed Message <span className="text-purple-700">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Provide details of your consignment, cargo weight, dimensions, origin, destination, or pickup address..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 focus:border-purple-700 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Dispatch Desk</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
