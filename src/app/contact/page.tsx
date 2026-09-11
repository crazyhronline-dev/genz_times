'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Building2, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'review_pitch',
    deviceOrCompany: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <Mail className="w-3.5 h-3.5" />
          <span>Connect with the Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Get in Touch with GenZ Time
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Whether you represent a consumer hardware brand looking to submit review units for benchmarking, have a breaking tech news tip, or want to partner with us, we are eager to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form: 7 Cols */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-tech-900/80 border border-slate-800 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-tech-emerald/15 border border-tech-emerald/40 text-tech-emerald flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for contacting GenZ Time. Our editorial or hardware testing team will review your message and reply within 24–48 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', inquiryType: 'review_pitch', deviceOrCompany: '', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Miller"
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Nature of Inquiry
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  >
                    <option value="review_pitch">Submit Hardware for Review / Benchmarks</option>
                    <option value="press_release">Send Press Release or Embargo Briefing</option>
                    <option value="editorial_correction">Editorial Feedback or Correction</option>
                    <option value="advertising">Sponsorship & Brand Partnership</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Company / Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.deviceOrCompany}
                    onChange={(e) => setFormData({ ...formData, deviceOrCompany: e.target.value })}
                    placeholder="e.g. Acme Audio XR Headphones"
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Message & Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details on the hardware, embargo dates, specifications, or inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry to GenZ Time</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Info: 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-tech-900/60 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Editorial Desk:</span>
                  <a href="mailto:editor@genztime.com" className="text-white hover:text-tech-cyan transition font-bold text-sm">
                    editor@genztime.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/30 flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Review Unit Submissions:</span>
                  <a href="mailto:hardware-lab@genztime.com" className="text-white hover:text-tech-emerald transition font-bold text-sm">
                    hardware-lab@genztime.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-tech-violet/10 text-purple-400 border border-tech-violet/30 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Lab Testing Hours:</span>
                  <span className="text-slate-200">Monday – Friday: 9:00 AM – 6:00 PM EST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-tech-cyan uppercase font-mono flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Review Units Policy</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We welcome loaner review units from brands of all sizes. Please note that sending a unit does not guarantee a positive score. All devices are evaluated according to our strict laboratory benchmarking standards.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
