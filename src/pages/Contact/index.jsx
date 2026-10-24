import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { feedbackService } from '../../services/feedbackService';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'Hardware & Systems Inquiry';
  const skuParam = searchParams.get('sku') || '';

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: skuParam ? `Inquiry regarding hardware model (${skuParam}). Please share availability and enterprise pricing.` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams.get('subject')) {
      setFormData((prev) => ({
        ...prev,
        subject: searchParams.get('subject'),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await feedbackService.submitFeedback({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        category: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      addToast('Thank you! Your inquiry has been logged with Fawaz Enterprises support team.', 'success', 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Hardware & Systems Inquiry',
        message: '',
      });
    } catch (err) {
      addToast(err.message || 'Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          Direct Hardware Support & Procurement
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight">
          Contact Fawaz Enterprises
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
          Whether you need bulk procurement quotes, workstation customization, GST invoice assistance, or technical advice, our specialist team is ready to assist.
        </p>
      </div>

      {/* Main Grid: Details + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200/90 space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Official Business Information
              </span>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">
                Fawaz Enterprises
              </h3>
            </div>

            <div className="space-y-6 text-xs text-neutral-600">
              {/* Phone Contacts */}
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block uppercase tracking-wider text-[11px]">
                    Direct Support Numbers
                  </span>
                  <div className="flex flex-col gap-1 mt-1 text-sm font-semibold">
                    <a href="tel:9976895663" className="text-neutral-900 hover:text-blue-600 transition-colors">
                      +91 9976895663
                    </a>
                    <a href="tel:6369421249" className="text-neutral-900 hover:text-blue-600 transition-colors">
                      +91 6369421249
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Contacts */}
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block uppercase tracking-wider text-[11px]">
                    Email Inquiries & Technical Support
                  </span>
                  <div className="flex flex-col gap-1 mt-1 text-xs">
                    <a
                      href="mailto:Fayasmd.md@gmail.com"
                      className="text-neutral-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      Fayasmd.md@gmail.com
                    </a>
                    <a
                      href="mailto:support@fawazenterprises.com"
                      className="text-neutral-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      support@fawazenterprises.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Registered Office Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block uppercase tracking-wider text-[11px]">
                    Registered Office & Principal Place
                  </span>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed">
                    1st Floor, Flat No. 4, Senthamizh Kidil, No. 1, North Kavari Street, West Mambalam, Chennai, Tamil Nadu - 600033
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=North+Kavari+Street+West+Mambalam+Chennai+600033"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold mt-1"
                  >
                    <span>View on Google Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Statutory Tax Compliance */}
              <div className="flex items-start gap-3.5 pt-2 border-t border-neutral-200">
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1 w-full">
                  <span className="font-bold text-neutral-900 block uppercase tracking-wider text-[11px]">
                    Tax & Statutory Compliance
                  </span>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-neutral-500">GSTIN:</span>
                    <span className="font-mono font-bold text-neutral-900">33AEYPF9750J1ZV</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">PAN:</span>
                    <span className="font-mono font-bold text-neutral-900">AEYPF9750J</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-medium pt-1">
                    ✓ Input Tax Credit (ITC) applicable for all registered GST businesses.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex gap-3">
              <a
                href="mailto:support@fawazenterprises.com"
                className="flex-1 py-3 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors shadow-sm"
              >
                Email Support
              </a>
              <a
                href="tel:9976895663"
                className="flex-1 py-3 px-4 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-xs font-semibold uppercase tracking-wider text-center transition-colors"
              >
                Call Specialist
              </a>
            </div>
          </div>
        </div>

        {/* Right: Consultation Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm space-y-6">
            <h3 className="text-2xl font-black text-neutral-900">
              Send an Inquiry
            </h3>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-800">
                  <p className="font-bold text-emerald-900">Inquiry Received Successfully</p>
                  <p className="text-emerald-800 mt-0.5">
                    Thank you. A representative from Fawaz Enterprises will respond to your registered email and phone promptly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Mohammed Fayas"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block">
                    Contact Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 99768 95663"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block">
                    Interest / Category
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all cursor-pointer"
                  >
                    <option value="Hardware & Systems Inquiry">Hardware & Systems Inquiry</option>
                    <option value="Laptops & Notebooks">Laptops & Notebooks</option>
                    <option value="Enterprise Workstations">Enterprise Workstations</option>
                    <option value="Studio Audio & Acoustics">Studio Audio & Acoustics</option>
                    <option value="PC Components & Storage">PC Components & Storage</option>
                    <option value="Bulk Procurement & Corporate Quotes">Bulk Procurement & Corporate Quotes</option>
                    <option value="GST Invoicing & Input Credit">GST Invoicing & Input Credit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block">
                  Message / Specifications *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Specify machine configuration, quantity, delivery location or required hardware specifications..."
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
