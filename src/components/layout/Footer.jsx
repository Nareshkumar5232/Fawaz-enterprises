import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import Logo from '../common/Logo';

/* =========================================================
   FAWAZ ENTERPRISES TEXT HOVER EFFECT
   ========================================================= */

export const TextHoverEffect = ({ text = "FAWAZ", duration = 0.15, className }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 500 90"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none uppercase cursor-pointer w-full max-w-5xl mx-auto ${className || ''}`}
    >
      <defs>
        <linearGradient
          id="fawazTextGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="fawazRevealMask"
          gradientUnits="userSpaceOnUse"
          r="28%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0.15, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="fawazTextMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#fawazRevealMask)" />
        </mask>
      </defs>

      {/* Subtle outline base */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.6"
        letterSpacing="0.14em"
        className="fill-transparent stroke-neutral-700 font-sans text-5xl font-extrabold"
        style={{ opacity: hovered ? 0.35 : 0.15 }}
      >
        {text}
      </text>

      {/* Animated stroke outline */}
      <motion.text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.6"
        letterSpacing="0.14em"
        className="fill-transparent stroke-neutral-500 font-sans text-5xl font-extrabold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Cursor-following reveal */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#fawazTextGradient)"
        strokeWidth="0.8"
        letterSpacing="0.14em"
        mask="url(#fawazTextMask)"
        className="fill-transparent font-sans text-5xl font-extrabold"
      >
        {text}
      </text>
    </svg>
  );
};

export default function Footer() {
  const categoryLinks = [
    { label: "Laptops & Notebooks", href: "/products?category=laptops" },
    { label: "Desktop Workstations", href: "/products?category=desktops" },
    { label: "Displays & Monitors", href: "/products?category=monitors" },
    { label: "PC Components & Upgrades", href: "/products?category=pc-components" },
    { label: "Studio Audio & Headsets", href: "/products?category=audio" },
    { label: "Keyboards & Peripherals", href: "/products?category=keyboards-mouse" },
    { label: "Storage & NVMe SSDs", href: "/products?category=storage" },
    { label: "Enterprise Networking", href: "/products?category=networking" },
  ];

  const quickLinks = [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "About Fawaz Enterprises", href: "/about" },
    { label: "Contact & Procurement", href: "/contact" },
    { label: "Order History", href: "/my-orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Admin Suite", href: "/admin/login" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/contact?subject=Terms" },
    { label: "Privacy Policy", href: "/contact?subject=Privacy" },
    { label: "Shipping Policy", href: "/contact?subject=Shipping" },
    { label: "Warranty & RMA", href: "/contact?subject=Warranty" },
    { label: "GST Compliance & Invoicing", href: "/contact?subject=GST" },
  ];

  return (
    <footer className="bg-[#0A0A0C] text-neutral-300 pt-16 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* TOP SECTION: BRAND + COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Client Details (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Logo light={true} />
            <p className="text-xs text-neutral-400 leading-relaxed font-normal max-w-sm">
              Fawaz Enterprises delivers certified enterprise computing solutions, professional workstations, studio audio equipment, and genuine computer accessories tailored for creators and tech enterprises.
            </p>

            {/* Statutory Details Box */}
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Business Entity</span>
                <span className="text-white font-medium">Fawaz Enterprises</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">GSTIN:</span>
                <span className="text-neutral-200 font-mono text-[11px] font-semibold">33AEYPF9750J1ZV</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">PAN:</span>
                <span className="text-neutral-200 font-mono text-[11px] font-semibold">AEYPF9750J</span>
              </div>
              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Verified GST Registered Business</span>
              </div>
            </div>
          </div>

          {/* Categories (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Hardware Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {categoryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neutral-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick & Legal (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Explore & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Contact Fawaz Enterprises
            </h4>

            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-neutral-500 uppercase tracking-wider">Direct Phones</span>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a href="tel:9976895663" className="text-neutral-200 hover:text-white font-medium transition-colors">
                      +91 9976895663
                    </a>
                    <a href="tel:6369421249" className="text-neutral-200 hover:text-white font-medium transition-colors">
                      +91 6369421249
                    </a>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-neutral-500 uppercase tracking-wider">Email Inquiries</span>
                  <a
                    href="mailto:Fayasmd.md@gmail.com"
                    className="text-neutral-200 hover:text-white transition-colors block mt-0.5 truncate"
                  >
                    Fayasmd.md@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-neutral-500 uppercase tracking-wider">Customer Support</span>
                  <a
                    href="mailto:support@fawazenterprises.com"
                    className="text-neutral-200 hover:text-white transition-colors block mt-0.5 truncate"
                  >
                    support@fawazenterprises.com
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
              >
                Send Direct Message
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS & COMPLIANCE BAR */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Fawaz Enterprises. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-neutral-400">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.href} className="hover:text-neutral-200 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* LARGE HOVER OUTLINE LOGO */}
        <div className="pt-2 flex items-center justify-center w-full overflow-hidden">
          <TextHoverEffect text="FAWAZ ENTERPRISES" duration={0.15} />
        </div>
      </div>
    </footer>
  );
}
