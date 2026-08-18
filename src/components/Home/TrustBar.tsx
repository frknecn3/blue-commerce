import React from 'react';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const trustFeatures = [
  {
    icon: FiTruck,
    title: 'Free Express Shipping',
    description: 'On all orders over $50 with fast tracking',
    accent: 'from-blue-50 to-sky-50 text-blue-600 border-sky-100',
  },
  {
    icon: FiShield,
    title: 'Secure Stripe Checkout',
    description: '256-bit encrypted bank-grade security',
    accent: 'from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: FiRefreshCw,
    title: '30-Day Easy Returns',
    description: '100% money-back guarantee policy',
    accent: 'from-amber-50 to-orange-50 text-amber-600 border-amber-100',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Priority Support',
    description: 'Instant live chat and dedicated support',
    accent: 'from-purple-50 to-indigo-50 text-purple-600 border-purple-100',
  },
];

export default function TrustBar() {
  return (
    <section className="w-full my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {trustFeatures.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3.5 p-3.5 bg-white border border-sky-100/80 rounded-xl shadow-2xs hover:shadow-xs hover:border-blue-200 transition-all duration-200"
            >
              <div className={`w-11 h-11 shrink-0 rounded-lg bg-gradient-to-br ${item.accent} border flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
