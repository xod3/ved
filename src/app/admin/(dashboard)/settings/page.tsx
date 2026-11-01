'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, Building, Mail, Phone, Calculator, Bell } from 'lucide-react';

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'VED COURIER LOGISTICS',
    tagline: 'FAST • SAFE • GLOBAL',
    headline: 'Your Shipment. Our Responsibility.',
    support_email: 'support@vedcourier.com',
    support_phone: '+1 (808) 301-0314',
    whatsapp_number: '+1 (808) 301-0314',
    headquarters_address: 'W 109th St, New York, NY 10025, USA',
    volumetric_divisor: '5000',
    default_currency: 'USD',
    email_notifications_enabled: 'false',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setSettings((prev) => ({ ...prev, ...d.settings }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setMessage('Company configurations successfully saved to persistent database.');
      }
    } catch {
      setMessage('Failed to persist settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Configuration</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Company & Logistics Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure official brand titles, dispatch phone numbers, volumetric calculators, and notification integrations.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Identity */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-[#e22026]" /> Official Identity & Headings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name || ''}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#e22026]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Headline</label>
              <input
                type="text"
                value={settings.headline || ''}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Global Contacts */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-[#e22026]" /> Contact Details & Dispatch Desk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Support (Chat Only)</label>
              <input
                type="text"
                value={settings.support_phone || ''}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headquarters Physical Address</label>
              <input
                type="text"
                value={settings.headquarters_address || ''}
                onChange={(e) => setSettings({ ...settings, headquarters_address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Carrier Calculation Formulas */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calculator className="w-4 h-4 text-[#e22026]" /> Volumetric Calculation Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Air Freight Volumetric Divisor (L × W × H ÷ Divisor)
              </label>
              <input
                type="number"
                value={settings.volumetric_divisor || '5000'}
                onChange={(e) => setSettings({ ...settings, volumetric_divisor: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Standard IATA international air freight divisor is 5000 cm³/kg (or 6000 for domestic express).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Default Billing Currency</label>
              <select
                value={settings.default_currency || 'USD'}
                onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="CNY">CNY (¥ - Chinese Yuan)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="KRW">KRW (₩ - South Korean Won)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email & Notification Provider Status */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-[#0b2240] flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-[#e22026]" /> Transactional Notification Services
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Email Gateway Integration</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Awaiting API Credentials (Resend / SMTP)
              </span>
            </div>
            <p className="text-slate-500">
              Per requirements, when email API credentials are not set in the environment, the platform accurately logs simulated notifications to the audit database without pretending emails reached external inboxes. To enable real email dispatch, configure <code>RESEND_API_KEY</code> in <code>.env.local</code>.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#e22026] hover:bg-[#b81419] disabled:opacity-70 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
