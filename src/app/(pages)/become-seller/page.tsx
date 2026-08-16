import React from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiUsers, FiTrendingUp, FiDollarSign, FiShield, FiCheckCircle } from 'react-icons/fi';

const benefits = [
    { title: 'Millions of Active Customers', desc: 'Reach thousands of shoppers visiting Blue-Commerce daily.', icon: FiUsers },
    { title: 'Competitive Commissions', desc: 'Industry-leading low commission rates with no hidden fees.', icon: FiDollarSign },
    { title: 'Fast Payout Schedules', desc: 'Reliable weekly automated direct deposits to your bank.', icon: FiTrendingUp },
    { title: 'Seller Protection Program', desc: 'Comprehensive protection against unauthorized chargebacks.', icon: FiShield },
];

const BecomeSellerPage = () => {
    return (
        <main className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-slate-900 font-bold">Become a Seller</span>
            </nav>

            {/* Seller Hero Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-lg p-8 sm:p-12 mb-8 shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider mb-3">
                        <FiShoppingBag />
                        <span>Blue-Commerce Marketplace</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">Grow Your E-Commerce Business With Us</h1>
                    <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                        Open your official store on Blue-Commerce today and showcase your products to millions of shoppers across the country.
                    </p>
                </div>

                <div className="bg-white text-slate-900 p-6 rounded-lg shadow-md border border-slate-200 w-full md:w-80 shrink-0">
                    <h3 className="font-extrabold text-base mb-1">Start Selling Today</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium">Free registration with instant store setup.</p>
                    <Link
                        href="/admin"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase py-3 px-4 rounded-md text-center block shadow-xs transition-colors"
                    >
                        Create Your Store Now
                    </Link>
                </div>
            </div>

            {/* Seller Benefits Grid */}
            <div className="border-b-2 border-slate-900 pb-2 mb-6">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    Why Sell On Blue-Commerce?
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {benefits.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-600 transition-all">
                            <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 border border-blue-100 text-blue-600 mb-3">
                                <Icon className="text-xl" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Steps to Become a Seller */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6">Simple 3-Step Onboarding</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-4">
                        <span className="font-black text-2xl text-blue-600">01</span>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Register Account</h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Create your business account and provide seller verification documents.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="font-black text-2xl text-blue-600">02</span>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">List Your Products</h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Upload inventory details, images, prices, and stock numbers using our admin dashboard.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="font-black text-2xl text-blue-600">03</span>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Receive & Fulfill Orders</h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Ship products to customers and receive automatic payouts directly to your bank account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BecomeSellerPage;
