import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, Mail, User, Building2 } from 'lucide-react';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

/**
 * Full-screen, hard-wall lead capture modal.
 * Fires when user clicks "Calculate" on desktop for the first time.
 *
 * Props:
 *   calculatorType: 'household' | 'business' | 'industry'
 *   totalTonnes:    number  (pre-calculated, shown as a teaser)
 *   onSuccess:      () => void  — called after successful submission
 */
export default function LeadCaptureModal({ calculatorType, totalTonnes, onSuccess }) {
  const [email, setEmail]       = useState('');
  const [name, setName]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  const nameLabel =
    calculatorType === 'household' ? 'Your name' :
    calculatorType === 'business'  ? 'Company name' :
    'Organisation name';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email to continue.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email address.'); return; }

    setError('');
    setSubmitting(true);

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method:  'POST',
          mode:    'no-cors',           // Google Apps Script requires no-cors
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:          email.trim(),
            name:           name.trim(),
            calculatorType,
            totalTonnes,
            timestamp:      new Date().toISOString(),
            source:         window.location.origin,
          }),
        });
      }
      // Persist so repeat visits skip the gate
      localStorage.setItem('aiganesha_subscribed', '1');
      onSuccess();
    } catch (_err) {
      // Even on network error, let the user through — don't block them
      localStorage.setItem('aiganesha_subscribed', '1');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
         style={{ background: 'rgba(8,12,16,0.96)', backdropFilter: 'blur(24px)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(244,162,97,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-[480px]">

        {/* Card */}
        <div className="relative bg-[#0a0f15] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl">

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
               style={{ background: 'linear-gradient(90deg, transparent, rgba(244,162,97,0.7), transparent)' }} />

          <div className="px-8 pt-10 pb-8">

            {/* Logo */}
            <div className="mb-8">
              <span className="font-semibold text-[20px] text-white/90 tracking-[-0.03em] font-sans">
                ai<span style={{ color: '#F4A261' }}>G</span>anesha
              </span>
            </div>

            {/* Headline */}
            <div className="mb-2">
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em] mb-3">
                Your Results Are Ready
              </p>
              <h2 className="text-[28px] font-semibold text-white tracking-[-0.04em] leading-[1.1] mb-3 font-sans">
                Unlock your full<br />
                <span className="font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>climate breakdown.</span>
              </h2>
              <p className="text-[15px] text-white/30 leading-[1.75] font-sans">
                Subscribe free to see your emissions by category, scope analysis,
                real-world equivalents, and personalised reduction tips.
              </p>
            </div>

            {/* Teaser stat */}
            {totalTonnes != null && (
              <div className="my-6 flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
                <div className="flex-1">
                  <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">
                    Your Annual Footprint
                  </div>
                  <div className="text-[32px] font-mono font-semibold text-white/75 leading-none tracking-[-0.03em]">
                    {typeof totalTonnes === 'number' ? totalTonnes.toFixed(1) : totalTonnes}
                    <span className="text-[12px] font-mono text-white/25 ml-2 uppercase tracking-[0.1em]">tCO₂e</span>
                  </div>
                </div>
                {/* Blurred teaser of chart */}
                <div className="flex gap-1 items-end opacity-30" style={{ filter: 'blur(3px)' }}>
                  {[40, 65, 30, 80, 50].map((h, i) => (
                    <div key={i} className="w-3 rounded-t-sm bg-[#F4A261]" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  id="lead-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                  className="w-full bg-[#0d1218] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-[14px] font-sans text-white/85 placeholder-white/25 outline-none focus:border-[#F4A261]/50 focus:bg-white/[0.03] transition-all"
                />
              </div>

              {/* Name / Company */}
              <div className="relative">
                {calculatorType === 'household'
                  ? <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  : <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                }
                <input
                  id="lead-name"
                  type="text"
                  placeholder={`${nameLabel} (optional)`}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0d1218] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-[14px] font-sans text-white/85 placeholder-white/25 outline-none focus:border-[#F4A261]/50 focus:bg-white/[0.03] transition-all"
                />
              </div>

              {error && (
                <p className="text-[12px] text-[#f85149] font-mono pl-1">{error}</p>
              )}

              {/* Submit */}
              <button
                id="lead-submit-btn"
                type="submit"
                disabled={submitting}
                className="group w-full relative inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl border text-[13px] font-mono uppercase tracking-[0.12em] transition-all duration-300 overflow-hidden mt-2 cursor-pointer"
                style={{
                  borderColor: 'rgba(244,162,97,0.5)',
                  color: '#fff',
                  background: submitting ? 'rgba(244,162,97,0.08)' : 'rgba(244,162,97,0.14)',
                }}
                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = 'rgba(244,162,97,0.24)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(244,162,97,0.2)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = submitting ? 'rgba(244,162,97,0.08)' : 'rgba(244,162,97,0.14)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F4A261]/0 via-[#F4A261]/15 to-[#F4A261]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative z-10 flex items-center gap-2.5">
                  {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                    : <>See My Full Results <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>
                  }
                </span>
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-[11px] text-white/20 font-mono text-center mt-5 leading-relaxed">
              No spam. Used only for{' '}
              <span style={{ textTransform: 'none' }}>
                ai<span style={{ color: '#F4A261' }}>G</span>anesha
              </span>
              {' '}product updates.
            </p>
          </div>
        </div>

        {/* Feature pills below card */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {['Category Breakdown', 'Scope 1–3 Analysis', 'Equivalents', 'Reduction Tips'].map(f => (
            <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.025]">
              <CheckCircle2 size={11} className="text-[#3fb950]" />
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-[0.1em]">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
