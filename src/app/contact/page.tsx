'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Building,
  Globe2
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          tracking_number: '',
          subject: '',
          message: '',
        });
      }
    } catch {
      setErrorMsg('Network error. Please try again or reach out via telephone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0b2240] text-white py-14 px-4 sm:px-8 border-b-4 border-[#e22026]">
        <div className="max-w-6xl mx-auto space-y-3">
          <span className="text-xs font-black tracking-widest text-[#e22026] uppercase">
            GLOBAL CUSTOMER SUPPORT & FREIGHT DESK
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Contact VED Courier Logistics
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Have questions about a shipment, customs clearance, rate quoting, or charter bookings? Our international dispatch specialists are available 24/7/365.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Global Offices */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
              <h3 className="font-extrabold text-lg text-[#0b2240] border-b border-slate-100 pb-3">
                Corporate Headquarters & Support
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#e22026] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Global HQ Address</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      100 Global Logistics Parkway, Suite 400<br />
                      New York, NY 10001, United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0b2240] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Customer Support Hotline</span>
                    <a href="tel:+18005928334" className="text-xs text-[#0b2240] font-semibold hover:underline block mt-0.5">
                      +1 (800) 592-8334 (Toll-Free USA / Canada)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">WhatsApp Business Line</span>
                    <a href="https://wa.me/18005928334" target="_blank" rel="noreferrer" className="text-xs text-emerald-700 font-semibold hover:underline block mt-0.5">
                      +1 (800) 592-8334 (Instant Dispatch Updates)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Official Dispatch Email</span>
                    <a href="mailto:support@vedcourier.com" className="text-xs text-slate-700 font-medium hover:underline block mt-0.5">
                      support@vedcourier.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Operational Hours</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Terminal Operations: 24/7/365 Non-stop<br />
                      Customs Support: Mon – Sat (06:00 – 22:00 Local)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Hubs Card */}
            <div className="bg-[#0b2240] text-white rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm tracking-wide uppercase text-slate-300 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#e22026]" /> Regional Operations Hubs
              </h4>
              <div className="divide-y divide-slate-700/60 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">North America (JFK / LAX)</span>
                  <span className="text-slate-400">New York & Los Angeles</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">East Asia (PVG / CAN / ICN)</span>
                  <span className="text-slate-400">Shanghai, Guangzhou, Seoul</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">West Africa (LOS / ABV)</span>
                  <span className="text-slate-400">Lagos & Abuja, Nigeria</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">Middle East Transshipment</span>
                  <span className="text-slate-400">Dubai Airport Cargo Bay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
              <div>
                <h3 className="font-extrabold text-xl text-[#0b2240]">
                  Submit an Inquiry or Request a Quote
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inquiries are logged in our real database support ticket registry and routed to the appropriate station controller.
                </p>
              </div>

              {successTicket && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Ticket Successfully Logged!</p>
                    <p className="mt-0.5">
                      Your reference ticket is <span className="font-mono font-bold">{successTicket}</span>. Our logistics officer will contact you within 2 business hours.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Error Submitting Form</p>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jdoe@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tracking ID (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.tracking_number}
                      onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                      placeholder="e.g. VED-2026-000101"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Service Required *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                  >
                    <option value="">Select subject category...</option>
                    <option value="Tracking & Milestone Inquiry">Tracking & Milestone Inquiry</option>
                    <option value="Air Freight Booking & Quote">Air Freight Booking & Quote</option>
                    <option value="Ocean Freight Container Slot">Ocean Freight Container Slot</option>
                    <option value="Customs Clearance & Documentation">Customs Clearance & Documentation</option>
                    <option value="Corporate Account Onboarding">Corporate Account Onboarding</option>
                    <option value="Claims or Delivery Exception">Claims or Delivery Exception</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details of your consignment, cargo weight, dimensions, origin, destination, or specific inquiries..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0b2240]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0b2240] hover:bg-[#163866] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#e22026]" />
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
