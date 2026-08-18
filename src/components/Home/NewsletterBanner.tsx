'use client';

import React, { useState } from 'react';
import { FiMail, FiGift, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('🎉 Welcome to the VIP Club! Use code WELCOME15 for 15% off.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME15');
    setCopied(true);
    toast.info('Discount code "WELCOME15" copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="w-full my-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left column: Text & Perk */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-sky-100 mb-3 border border-white/20">
            <FiGift className="text-amber-300" />
            <span>VIP Member Privilege</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Unlock 15% Off Your First Order
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 font-normal mt-1 leading-relaxed max-w-xl">
            Join 20,000+ members receiving weekly flash deal alerts, early tech drops, and exclusive seasonal coupons.
          </p>

          {/* Coupon Code Pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-xs text-sky-200 font-medium">Use Promo Code:</span>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
              WELCOME15
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy promo code"
              className="text-white hover:text-amber-300 transition-colors p-1"
            >
              {copied ? <FiCheck className="text-emerald-400 text-xs" /> : <FiCopy className="text-xs" />}
            </button>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-5">
          {subscribed ? (
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-center">
              <span className="text-sm font-bold text-white block mb-1">
                ✅ You're on the list!
              </span>
              <p className="text-xs text-sky-100">
                Check your inbox for exclusive weekly savings and new drops.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                Join VIP Club
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
