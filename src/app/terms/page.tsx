import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-r from-[#240643] via-[#2e0854] to-[#3b0764] text-white py-14 px-4 sm:px-8 border-b-4 border-purple-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase">
            <FileText className="w-4 h-4 text-purple-400" /> Standard Carrier Contract
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Terms &amp; Conditions of Carriage</h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Governing all air cargo, ocean shipping, courier, and customs brokerage services provided by VED COURIER LOGISTICS.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-14 text-slate-800 space-y-8 text-sm leading-relaxed">
        <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">1. Scope of Agreement</h2>
            <p>
              By tendering cargo, documents, or parcels to VED COURIER LOGISTICS, the Shipper agrees on behalf of itself and the Consignee to all terms set forth herein. These terms govern from the moment of dispatch booking until confirmed physical delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">2. Proper Packaging &amp; Shipper Warranties</h2>
            <p>
              The Shipper warrants that all items are securely packed, clearly labeled with the generated VED Courier tracking identifier, and suitable to withstand normal transportation hazards associated with air turbulence, maritime motion, and handling. Any special handling instructions (e.g. Fragile, Keep Upright, Temperature Sensitive) must be declared at time of booking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">3. Prohibited &amp; Regulated Goods</h2>
            <p>
              VED Courier strictly prohibits the shipment of unlicensed explosives, hazardous flammables, unauthorized biological specimens, contraband, or goods violating international trade sanctions. Consignments are subject to physical examination, X-ray scanning, and customs inspection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">4. Customs Clearance &amp; Tariffs</h2>
            <p>
              The Shipper and Consignee are jointly responsible for the accuracy of declared values and HS codes. Customs duties, taxes, and inspection assessments levied by destination authorities must be paid promptly. Delays resulting from customs holds or regulatory document requests do not constitute carrier breach of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">5. Volumetric Calculation Rules</h2>
            <p>
              Charges are assessed on the greater of actual gross weight or volumetric weight calculated using standard international airline formula: <code>(Length × Width × Height in cm) ÷ 5,000</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#2e0854]">6. Claims &amp; Limitation of Liability</h2>
            <p>
              Unless an additional declared value and comprehensive cargo insurance premium has been purchased, VED Courier's liability for physical loss or damage is limited in accordance with the Warsaw Convention, Montreal Convention, or applicable domestic transport statutes. All damage or missing parcel claims must be reported within 14 calendar days of delivery.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
