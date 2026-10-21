import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Phone, Mail, Award, Cpu, Headphones, Truck } from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function About() {
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

      {/* 4. Company & Registered Statutory Information */}
      <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-4">
          <Logo />
          <h3 className="text-2xl font-bold text-neutral-900 pt-2">
            Statutory & Business Entity Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-600 pt-2">
            <div className="p-3 bg-white rounded-xl border border-neutral-200/80">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Business Name</span>
              <strong className="text-neutral-900 text-sm">Fawaz Enterprises</strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-neutral-200/80">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">GSTIN Identification</span>
              <span className="font-mono text-neutral-900 font-bold">33AEYPF9750J1ZV</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-neutral-200/80">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Permanent Account Number (PAN)</span>
              <span className="font-mono text-neutral-900 font-bold">AEYPF9750J</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-neutral-200/80">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Support Phones</span>
              <span className="text-neutral-900 font-medium">+91 9976895663 / 6369421249</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-neutral-200/80 sm:col-span-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Official Inquiries & Support</span>
              <span className="text-neutral-900">Fayasmd.md@gmail.com / support@fawazenterprises.com</span>
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
  );
}
