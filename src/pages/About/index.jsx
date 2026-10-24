import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Cpu,
  Headphones,
  Truck,
  MapPin,
  Building2,
  Calendar,
  User,
  Copy,
  Check,
  FileText,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function About() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const registeredAddress =
    '1st Floor, Flat No. 4, Senthamizh Kidil, No. 1, North Kavari Street, West Mambalam, Chennai, Tamil Nadu - 600033';

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* 1. Large Brand Statement */}
      <div className="max-w-3xl space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          About Fawaz Enterprises
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-900 tracking-tight leading-[1.08]">
          Engineering <br />
          <span className="text-neutral-500">Tomorrow's Performance.</span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
          Fawaz Enterprises is a technology infrastructure and premium computing company founded on the principle that modern hardware should offer uncompromising processing capability, studio acoustic fidelity, and verified reliability.
        </p>
      </div>

      {/* 2. Full-Width Tech Lifestyle Imagery */}
      <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-neutral-100 shadow-xl border border-neutral-200">
        <img
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=85"
          alt="Fawaz Enterprises technology philosophy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
          <p className="text-xs uppercase tracking-widest font-bold text-neutral-300">Authorized Hardware Catalog</p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1">High-Precision Workstations & Sound Systems</h3>
        </div>
      </div>

      {/* 3. Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-neutral-200 pt-16">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">01</span>
          <h3 className="text-xl font-bold text-neutral-900">Enterprise Computing</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            We supply high-efficiency laptops, desktop workstations, and enterprise PC components engineered for sustained compute workloads, software engineering, and 3D rendering.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
            <Headphones className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">02</span>
          <h3 className="text-xl font-bold text-neutral-900">Acoustic Excellence</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            From audiophile closed-back headphones to spatial desktop studio monitors, our sound equipment is curated to deliver reference-grade acoustic accuracy without fatigue.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">03</span>
          <h3 className="text-xl font-bold text-neutral-900">Verified Compliance</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            All equipment is 100% authentic, backed by original manufacturer warranty, and dispatched with compliant GST invoicing for streamlined enterprise input tax credit.
          </p>
        </div>
      </div>

      {/* 4. Official Government Registration Certificate & Business Dossier */}
      <div className="space-y-8 border-t border-neutral-200 pt-16">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BadgeCheck className="w-3.5 h-3.5" />
            Statutory Registration Dossier
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Government Registration & Entity Details
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Fawaz Enterprises is duly registered under the Goods and Services Tax Act, Government of India. Below are the verified statutory credentials from Form GST REG-06 for customer assurance and B2B ITC compliance.
          </p>
        </div>

        {/* Certificate Card Container */}
        <div className="bg-gradient-to-b from-neutral-50 to-white rounded-3xl border border-neutral-300 shadow-sm overflow-hidden">
          {/* Certificate Header Bar */}
          <div className="bg-neutral-900 text-white px-6 sm:px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 tracking-wider uppercase">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Government of India • Form GST REG-06</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Registration Certificate [See Rule 10(1)]
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Regular Registration
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-mono">
                State: Tamil Nadu (33)
              </span>
            </div>
          </div>

          {/* Prominent GSTIN Box */}
          <div className="p-6 sm:p-10 border-b border-neutral-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  GST Registration Number (GSTIN)
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-neutral-900 tracking-wider">
                  33AEYPF9750J1ZV
                </div>
                <p className="text-xs text-neutral-500">
                  Permanent Account Number (PAN): <span className="font-mono font-bold text-neutral-800">AEYPF9750J</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => copyToClipboard('33AEYPF9750J1ZV', 'gstin')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-semibold shadow-xs transition-colors"
                >
                  {copiedKey === 'gstin' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">GSTIN Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-600" />
                      <span>Copy GSTIN</span>
                    </>
                  )}
                </button>

                <a
                  href="https://services.gst.gov.in/services/searchtpb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Verify on GST Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Certificate Field Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Legal Name */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <User className="w-4 h-4 text-neutral-700" />
                <span>1. Legal Name</span>
              </div>
              <div className="text-base font-bold text-neutral-900">
                MOHAMED FAYATH
              </div>
              <p className="text-[11px] text-neutral-500">Proprietor / Legal Person</p>
            </div>

            {/* Trade Name */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-neutral-700" />
                <span>2. Trade Name</span>
              </div>
              <div className="text-base font-bold text-neutral-900">
                FAWAZ ENTERPRISES
              </div>
              <p className="text-[11px] text-neutral-500">Commercial Entity Brand</p>
            </div>

            {/* Constitution */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                <span>3. Constitution of Business</span>
              </div>
              <div className="text-base font-bold text-neutral-900">
                Proprietorship
              </div>
              <p className="text-[11px] text-neutral-500">Sole Proprietorship Entity</p>
            </div>

            {/* Type of Registration */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-neutral-700" />
                <span>4. Type of Registration</span>
              </div>
              <div className="text-base font-bold text-neutral-900">
                Regular
              </div>
              <p className="text-[11px] text-neutral-500">Standard GST Taxpayer</p>
            </div>

            {/* Period of Validity */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <span>5. Period of Validity</span>
              </div>
              <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>From: 08/12/2025</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600 font-medium">To: Regular (Perpetual)</span>
              </div>
              <p className="text-[11px] text-neutral-500">Valid & Active</p>
            </div>

            {/* Date of Issue */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <span>6. Date of Issue</span>
              </div>
              <div className="text-base font-bold text-neutral-900">
                09/12/2025
              </div>
              <p className="text-[11px] text-neutral-500">Official Certificate Date</p>
            </div>

            {/* Address of Principal Place of Business - Span Full Width */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 md:col-span-2 lg:col-span-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2 text-neutral-700 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>7. Address of Principal Place of Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredAddress, 'address')}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
                  >
                    {copiedKey === 'address' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Address Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                  <span className="text-neutral-300">|</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=North+Kavari+Street+West+Mambalam+Chennai+600033"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Formatted Address Presentation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Floor & Unit</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Floor: 1st Floor</span>
                  <span className="text-neutral-600">Flat No: Senthamizh Kidil, Flat No 4</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Premises & Street</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Building No: 1</span>
                  <span className="text-neutral-600">Road: North Kavari Street</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Locality & City</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">West Mambalam</span>
                  <span className="text-neutral-600">Chennai District, Chennai</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">State & Postal PIN</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Tamil Nadu</span>
                  <span className="font-mono font-bold text-neutral-900">PIN: 600033</span>
                </div>
              </div>

              {/* Complete Address Line */}
              <p className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200 font-normal leading-relaxed">
                <strong className="text-neutral-900">Complete Address:</strong> 1st Floor, Flat No. 4, Senthamizh Kidil, 1, North Kavari Street, West Mambalam, Chennai, Tamil Nadu, PIN Code: 600033.
              </p>
            </div>
          </div>

          {/* Certificate Footer Notes & Digital Verification */}
          <div className="p-6 sm:p-8 bg-neutral-100/70 border-t border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-neutral-600">
            <div className="space-y-1">
              <p className="font-semibold text-neutral-800">
                ✓ Digitally Verified Record
              </p>
              <p className="text-[11px] text-neutral-500">
                Digitally approved by DS GOODS AND SERVICES TAX NETWORK 15 on 09/12/2025.
              </p>
              <p className="text-[11px] text-neutral-500 italic">
                Note: The registration certificate is required to be prominently displayed at all places of business in the State (Rule 10(1)).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-[11px] font-semibold text-neutral-800 shadow-2xs">
                GST REG-06 Verified
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold shadow-2xs">
                Eligible for B2B ITC
              </span>
            </div>
          </div>
        </div>

        {/* 5. Direct Contact & Support Quick Actions */}
        <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Logo />
            <h3 className="text-2xl font-bold text-neutral-900 pt-2">
              Official Communication Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-600 pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Support & Sales Lines</span>
                <div className="text-neutral-900 font-semibold mt-1 space-x-2">
                  <a href="tel:9976895663" className="hover:text-blue-600 transition-colors">+91 9976895663</a>
                  <span>/</span>
                  <a href="tel:6369421249" className="hover:text-blue-600 transition-colors">+91 6369421249</a>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Official GST & Orders Inquiries</span>
                <div className="text-neutral-900 font-semibold mt-1">
                  <a href="mailto:Fayasmd.md@gmail.com" className="hover:text-blue-600 transition-colors block">
                    Fayasmd.md@gmail.com
                  </a>
                  <a href="mailto:support@fawazenterprises.com" className="hover:text-blue-600 transition-colors text-xs text-neutral-600 font-normal">
                    support@fawazenterprises.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link
              to="/products"
              className="w-full py-3.5 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors shadow-md"
            >
              Explore Hardware Collection
            </Link>
            <Link
              to="/contact"
              className="w-full py-3.5 px-6 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-xs font-semibold uppercase tracking-wider text-center transition-colors"
            >
              Contact Fawaz Enterprises
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

