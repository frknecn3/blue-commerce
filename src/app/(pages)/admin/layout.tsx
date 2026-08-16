'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { closeAdminSidebar, toggleAdminSidebar } from '@/redux/slices/uiSlice'
import React from 'react'
import { FaBars, FaHome, FaShieldAlt } from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { adminSidebarOpen } = useAppSelector(state => state.uiReducer);
  const pathname = usePathname();

  const getSectionTitle = () => {
    if (pathname.startsWith('/admin/product')) return 'Products Management';
    if (pathname.startsWith('/admin/user')) return 'Users Administration';
    if (pathname.startsWith('/admin/store')) return 'Stores Management';
    return 'Admin Dashboard';
  };

  return (
    <div className="relative min-h-[calc(100vh-104px)] bg-sky-50/40">
      {/* Admin Utility Bar */}
      <div className="sticky top-[88px] md:top-[98px] z-30 bg-white border-b border-sky-100 shadow-xs px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleAdminSidebar())}
              aria-label="Toggle Admin Sidebar"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <FaBars className="text-xs" />
              <span>Admin Menu</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-bold">{getSectionTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FaHome className="text-xs text-slate-400" />
              <span>Main Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Backdrop overlay for mobile */}
      {adminSidebarOpen && (
        <div
          onClick={() => dispatch(closeAdminSidebar())}
          className="fixed inset-0 z-[9985] bg-slate-900/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;