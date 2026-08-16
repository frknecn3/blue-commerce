'use client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeAdminSidebar, toggleAdminSidebar } from '@/redux/slices/uiSlice';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { FaBox, FaStore, FaUsers, FaChevronRight, FaChevronLeft, FaHome, FaTimes } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const AdminSidebar = () => {
    const dispatch = useAppDispatch();
    const { adminSidebarOpen } = useAppSelector(state => state.uiReducer);
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: MdDashboard },
        { label: 'Products', href: '/admin/product', icon: FaBox },
        { label: 'Users', href: '/admin/user', icon: FaUsers },
        { label: 'Stores', href: '/admin/store', icon: FaStore },
    ];

    return (
        <aside
            className={`fixed top-[130px] md:top-[140px] left-0 z-[9990] h-[calc(100vh-140px)] w-60 bg-white border-r border-sky-100 shadow-xl transition-transform duration-300 ease-in-out flex flex-col justify-between py-4 ${
                adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* Header & Close on mobile */}
            <div className="flex flex-col gap-1 px-3">
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Admin Navigation
                    </span>
                    <button
                        onClick={() => dispatch(closeAdminSidebar())}
                        aria-label="Close Sidebar"
                        className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors md:hidden"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    dispatch(closeAdminSidebar());
                                }
                            }}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                                isActive
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-xs'
                                    : 'text-slate-700 hover:bg-sky-50 hover:text-blue-600'
                            }`}
                        >
                            <Icon className={`text-sm ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom link back to store */}
            <div className="px-3 pt-3 border-t border-slate-100">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-medium text-slate-600 hover:bg-sky-50 hover:text-blue-600 transition-colors"
                >
                    <FaHome className="text-sm text-slate-400" />
                    <span>Back to Store</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;