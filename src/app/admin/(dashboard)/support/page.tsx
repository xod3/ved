'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeadphonesIcon, CheckCircle2, Clock, Mail, Phone, ExternalLink } from 'lucide-react';

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/support?status=${statusFilter}`);
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Help Desk Registry</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Customer Support & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real customer tickets logged through the public contact form and tracking inquiry desk.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Ticket Statuses</option>
            <option value="new">New Inquiries</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 mx-auto border-3 border-[#0b2240] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs">Loading support tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <HeadphonesIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No support inquiries found.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {t.ticket_number}
                  </span>
                  <h3 className="font-extrabold text-sm text-[#0b2240]">
                    {t.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{t.created_at}</span>
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                      t.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : t.status === 'in_review'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-blue-50 text-blue-800 border-blue-300'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {t.message}
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-800">From: {t.name}</span>
                  <span>Email: {t.email}</span>
                  {t.phone && <span>Phone: {t.phone}</span>}
                </div>

                {t.tracking_number && (
                  <Link
                    href={`/track?id=${t.tracking_number}`}
                    target="_blank"
                    className="text-xs font-mono font-bold text-[#e22026] hover:underline flex items-center gap-1"
                  >
                    Related AWB: {t.tracking_number} <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
