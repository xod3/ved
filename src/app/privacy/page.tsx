import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-[#0b2240] text-white py-14 px-4 sm:px-8 border-b-4 border-[#e22026]">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase">
            <ShieldCheck className="w-4 h-4 text-[#e22026]" /> Data Protection & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Privacy & Data Protection Policy</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Last Updated: October 2026 | VED COURIER LOGISTICS Legal Compliance Office
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-14 text-slate-800 space-y-8 text-sm leading-relaxed">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">1. Introduction & Overview</h2>
            <p>
              VED COURIER LOGISTICS (“VED Courier”, “we”, “our”, or “us”) respects the confidentiality of shippers, consignees, and commercial trade partners. This Privacy Policy outlines how we collect, process, disclose, and safeguard personal and commercial data across our international courier, customs brokerage, and tracking systems.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">2. Information We Collect</h2>
            <p>To execute international freight forwarding and customs clearance, we collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>Shipper Information:</strong> Name, business name, physical street address, phone number, and email.</li>
              <li><strong>Consignee Details:</strong> Recipient name, company name, destination address, delivery instructions, and phone number.</li>
              <li><strong>Consignment Metadata:</strong> Package dimensions, weights, declared customs values, HS commodity codes, and commercial invoice descriptions.</li>
              <li><strong>Tracking & Audit Logs:</strong> Timestamped transit events, facility scan records, and administrative updates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">3. Public Tracking Privacy Protections</h2>
            <p>
              Under our strict customer privacy protocol, our public tracking engine (accessible at <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/track</code>) does <strong>never</strong> publicly disclose sensitive sender or receiver telephone numbers, specific apartment/unit street addresses, or commercial billing amounts. Only city-level and country-level milestones and approved status descriptions are visible publicly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">4. Customs & Law Enforcement Disclosures</h2>
            <p>
              International customs laws require the presentation of authentic manifests to border authorities (such as US Customs and Border Protection, General Administration of Customs of China, and Nigeria Customs Service). We disclose required documentation solely to comply with applicable import/export regulations and security mandates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">5. Data Retention & Security</h2>
            <p>
              We implement industry-standard database encryption, strict session authorization, and access-controlled storage for shipment waybills and customs documentation. Records are retained strictly in accordance with international aviation and maritime carrier record-keeping standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#0b2240]">6. Contact Privacy Officer</h2>
            <p>
              If you have inquiries regarding your personal information, address modifications, or privacy rights, please contact our data compliance desk at <a href="mailto:privacy@vedcourier.com" className="text-[#e22026] font-bold underline">privacy@vedcourier.com</a> or call +1 (800) 592-8334.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
