import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'
import { FaBox, FaStore, FaUsers, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa'
import { FiShield } from 'react-icons/fi'

export const dynamic = 'force-dynamic';

const AdminPage = async () => {
    const [productCount, userCount, storeCount] = await Promise.all([
        prisma.product.count(),
        prisma.user.count(),
        prisma.store.count()
    ]);

    const cards = [
        {
            title: "Products",
            description: "Control and analyze products across the catalog.",
            count: productCount,
            href: "/admin/product",
            icon: FaBox,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Users",
            description: "Administrate registered customer and seller accounts.",
            count: userCount,
            href: "/admin/user",
            icon: FaUsers,
            color: "text-sky-600",
            bgColor: "bg-sky-50"
        },
        {
            title: "Stores",
            description: "Manage merchant storefronts and seller profiles.",
            count: storeCount,
            href: "/admin/store",
            icon: FaStore,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        }
    ];

    return (
        <div className="mx-auto max-w-[1200px] px-4 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <FiShield className="text-lg" />
                        <span className="text-xs font-bold uppercase">Administration</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Blue-Commerce Admin Hub
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Select a category below to manage catalog records and platform users.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-md border border-slate-200 shadow-xs transition-colors"
                >
                    <span>Visit Storefront</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                </Link>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const IconComponent = card.icon;
                    return (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="group flex flex-col justify-between bg-white border border-sky-100 rounded-xl p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-150"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center text-xl`}>
                                        <IconComponent />
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">
                                        {card.count}
                                    </span>
                                </div>

                                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                                <span>Manage {card.title}</span>
                                <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminPage;