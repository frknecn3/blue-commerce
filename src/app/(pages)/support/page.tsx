import React from 'react';
import Link from 'next/link';
import { FiHelpCircle, FiPackage, FiRefreshCw, FiCreditCard, FiTruck, FiLock, FiSearch } from 'react-icons/fi';

const supportTopics = [
    { title: 'Order Tracking', desc: 'Check the live shipping and cargo status of your orders.', icon: FiPackage, href: '/orders' },
    { title: 'Returns & Refunds', desc: 'Learn how to initiate easy 14-day product returns.', icon: FiRefreshCw, href: '#' },
    { title: 'Payment & Billing', desc: 'Accepted payment cards, installments, and invoices.', icon: FiCreditCard, href: '#' },
    { title: 'Shipping & Delivery', desc: 'Delivery options, same-day delivery, and shipping fees.', icon: FiTruck, href: '#' },
    { title: 'Account Security', desc: 'Password reset, 2FA, and account privacy options.', icon: FiLock, href: '/profile' },
    { title: 'Seller Marketplace', desc: 'How to list products and manage seller payouts.', icon: FiHelpCircle, href: '/become-seller' },
];

const SupportPage = () => {
    return (
        <main className="min-h-screen bg-sky-50/40 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-blue-900 font-bold">Customer Support</span>
            </nav>

            {/* Support Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white rounded-lg p-6 sm:p-8 mb-6 shadow-sm border border-blue-500 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold">How can we help you?</h1>
                <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl mx-auto font-normal">
                    Search our help topics or browse common questions below.
                </p>

                <div className="mt-6 max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for orders, returns, shipping..."
                        className="w-full bg-white border border-blue-200 text-slate-800 placeholder-slate-400 py-3 pl-10 pr-4 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-sm shadow-sm"
                    />
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                </div>
            </div>

            {/* Support Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {supportTopics.map((topic, idx) => {
                    const Icon = topic.icon;
                    return (
                        <Link
                            key={idx}
                            href={topic.href}
                            className="bg-white border border-sky-100 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all group flex items-start gap-4 shadow-xs"
                        >
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Icon className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                                    {topic.desc}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Contact Card */}
            <div className="bg-white border border-sky-100 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">Still need assistance?</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Our customer care team is available 24/7 to resolve your inquiries.</p>
                </div>
                <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-md shadow-xs transition-colors">
                    Contact Support Team
                </Link>
            </div>
        </main>
    );
};

export default SupportPage;
