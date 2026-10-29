import React from 'react';
import { getCustomers } from '@/lib/db';
import { Users, Mail, Phone, MapPin, Package, Building2 } from 'lucide-react';

export default function CustomersPage() {
  const customers = getCustomers();

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Management</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2240] tracking-tight">
            Customer & Account Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered commercial accounts and direct shippers aggregated from database shipments.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Company Entity</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Primary Country</th>
                <th className="py-3 px-4 text-center">Total Shipments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {c.company || 'Private Shipper'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {c.phone || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {c.email || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {c.country}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#0b2240]">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                      {c.total_shipments}
                    </span>
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
