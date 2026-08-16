'use client'
import React, { useState } from 'react'
import Links from '../constants/constants'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { IoIosClose, IoIosMenu } from 'react-icons/io'
import { FiLogOut, FiLogIn, FiShield, FiUser, FiChevronRight, FiTag, FiHelpCircle, FiShoppingBag, FiTruck } from 'react-icons/fi'
import { FaShoppingBag } from 'react-icons/fa'

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const session = useSession();
    const user = session.data?.user;

    return (
        <>
            {/* Trigger Menu Button */}
            <button
                onClick={() => setSidebar(true)}
                aria-label="Open Menu"
                className="group flex items-center justify-center p-2 rounded-md bg-blue-700/80 border border-blue-500 text-white hover:bg-blue-700 hover:border-blue-400 transition-all duration-150 active:scale-95 shadow-xs"
            >
                <IoIosMenu className="text-xl" />
            </button>

            {/* Backdrop Overlay */}
            {sidebar && (
                <div
                    onClick={() => setSidebar(false)}
                    className="fixed inset-0 z-[100000] bg-slate-900/40 backdrop-blur-xs transition-opacity"
                />
            )}

            {/* Sliding Sidebar Drawer */}
            <aside
                className={`fixed top-0 right-0 z-[100001] h-screen w-80 max-w-[85vw] bg-white text-slate-800 border-l border-sky-100 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    sidebar ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 bg-blue-600 text-white">
                    <Link
                        href="/"
                        onClick={() => setSidebar(false)}
                        className="flex items-center gap-2"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded bg-white text-blue-600 shadow-sm">
                            <FaShoppingBag className="text-sm" />
                        </span>
                        <span className="text-lg font-bold text-white">
                            <span className="text-sky-200">Blu</span>E-Commerce
                        </span>
                    </Link>

                    <button
                        onClick={() => setSidebar(false)}
                        className="grid h-8 w-8 place-items-center rounded-md bg-blue-700/80 border border-blue-500 text-white hover:bg-blue-700 transition-colors"
                        aria-label="Close menu"
                    >
                        <IoIosClose className="text-2xl" />
                    </button>
                </div>

                {/* User Profile / Auth Status Box */}
                <div className="p-5 border-b border-sky-100 bg-sky-50/70">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-white font-bold text-base shadow-sm">
                                {user.name ? user.name[0].toUpperCase() : <FiUser />}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-bold text-sm text-slate-900 truncate">
                                    {user.name || 'User'}
                                </span>
                                <span className="text-xs text-slate-500 truncate">
                                    {user.email}
                                </span>
                                {user.role === 'ADMIN' && (
                                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded w-fit">
                                        <FiShield className="text-[10px]" /> Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium">Welcome! Sign in for a personalized experience.</span>
                            <Link
                                href="/login"
                                onClick={() => setSidebar(false)}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-md transition-colors shadow-sm mt-1"
                            >
                                <FiLogIn className="text-sm" />
                                <span>Sign In / Register</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                    <div className="text-xs font-semibold text-slate-400 mb-2.5">
                        Navigation
                    </div>

                    <ul className="flex flex-col gap-2">
                        {Links.map((link, i) => (
                            <li key={i}>
                                <Link
                                    href={link.href}
                                    onClick={() => setSidebar(false)}
                                    className="flex items-center justify-between p-3 rounded-md bg-sky-50/50 border border-sky-100 text-slate-800 font-medium text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-blue-600 text-sm group-hover:scale-110 transition-transform">
                                            {link.logo}
                                        </span>
                                        <span>{link.name}</span>
                                    </div>
                                    <FiChevronRight className="text-slate-400 text-xs group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </li>
                        ))}

                        {/* Extra Navigation Shortcuts with clean vector icons */}
                        <li>
                            <Link
                                href="/offers"
                                onClick={() => setSidebar(false)}
                                className="flex items-center justify-between p-3 rounded-md bg-sky-50/50 border border-sky-100 text-slate-800 font-medium text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FiTag className="text-blue-600 text-sm" />
                                    <span>Special Offers</span>
                                </div>
                                <FiChevronRight className="text-slate-400 text-xs group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/support"
                                onClick={() => setSidebar(false)}
                                className="flex items-center justify-between p-3 rounded-md bg-sky-50/50 border border-sky-100 text-slate-800 font-medium text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FiHelpCircle className="text-blue-600 text-sm" />
                                    <span>Customer Support</span>
                                </div>
                                <FiChevronRight className="text-slate-400 text-xs group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/become-seller"
                                onClick={() => setSidebar(false)}
                                className="flex items-center justify-between p-3 rounded-md bg-sky-50/50 border border-sky-100 text-slate-800 font-medium text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FiShoppingBag className="text-blue-600 text-sm" />
                                    <span>Become a Seller</span>
                                </div>
                                <FiChevronRight className="text-slate-400 text-xs group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </li>

                        {/* Admin Link */}
                        {user?.role === 'ADMIN' && (
                            <li className="pt-2">
                                <Link
                                    href="/admin"
                                    onClick={() => setSidebar(false)}
                                    className="flex items-center justify-between p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiShield className="text-blue-600 text-sm" />
                                        <span>Admin Panel</span>
                                    </div>
                                    <FiChevronRight className="text-blue-600 text-xs group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Footer Sign Out */}
                {user && (
                    <div className="p-5 border-t border-sky-100 bg-sky-50/50">
                        <button
                            onClick={async () => {
                                await signOut();
                                setSidebar(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-md border border-rose-200 hover:border-rose-600 transition-all duration-150"
                        >
                            <FiLogOut className="text-sm" />
                            <span>Log Out</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    )
}

export default Sidebar