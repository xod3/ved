import React from 'react';
import { ShieldCheck, UserCheck, Check, X, ShieldAlert } from 'lucide-react';
import db from '@/lib/db';

export default function StaffPage() {
  const staffMembers = db.prepare('SELECT id, email, full_name, role, phone, active FROM profiles').all() as any[];

  const rolesMatrix = [
    { permission: 'Create & Register Shipments', super_admin: true, ops: true, staff: true, support: false },
    { permission: 'Append Tracking Milestones & Locations', super_admin: true, ops: true, staff: true, support: false },
    { permission: 'Print Barcode Labels & Commercial Waybills', super_admin: true, ops: true, staff: true, support: true },
    { permission: 'View Internal Administrative Staff Notes', super_admin: true, ops: true, staff: true, support: false },
    { permission: 'Modify Tariffs & Payment Records', super_admin: true, ops: true, staff: false, support: false },
    { permission: 'Resolve Customer Support Tickets', super_admin: true, ops: true, staff: false, support: true },
    { permission: 'Export Operational Reports & CSVs', super_admin: true, ops: true, staff: false, support: false },
    { permission: 'Edit Company Settings & Volumetric Divisors', super_admin: true, ops: false, staff: false, support: false },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Access Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Staff & Role-Based Permissions (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enforced on the backend database layer to safeguard customer privacy and operational security.
          </p>
        </div>
      </div>

      {/* Staff Members List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-extrabold text-xs text-[#0b2240] uppercase">
          Authorized System Profiles
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {s.full_name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {s.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-[#0b2240] border border-slate-200">
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {s.phone || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-100">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-[#0b2240] border-b border-slate-100 pb-2">
          Role-Based Access Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">System Capability</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
                <th className="py-3 px-3 text-center">Operations Manager</th>
                <th className="py-3 px-3 text-center">Logistics Staff</th>
                <th className="py-3 px-3 text-center">Customer Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-800">{row.permission}</td>
                  <td className="py-3 px-3 text-center">
                    {row.super_admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.ops ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.staff ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.support ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
