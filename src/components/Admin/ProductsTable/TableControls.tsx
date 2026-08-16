'use client'
import { changePage } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type Props = {
  totalAmount: number;
}

const TableControls = ({ totalAmount }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const totalPages = Math.max(1, Math.ceil(totalAmount / limit));

  return (
    <Suspense>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
        {/* Total Summary */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{totalAmount > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(page * limit, totalAmount)}</span> of{' '}
          <span className="font-bold text-slate-800">{totalAmount}</span> results
        </div>

        <div className="flex items-center gap-4">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>Per page:</span>
            <select
              value={limit.toString()}
              aria-label="Items per page"
              className="border border-sky-200 rounded-md bg-white text-xs font-semibold text-slate-700 py-1 px-2.5 outline-none focus:border-blue-500 shadow-xs cursor-pointer"
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('limit', e.currentTarget.value);
                params.set('page', "1");
                router.replace(`${pathname}?${params.toString()}`);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          {/* Stepper Pagination */}
          <div className="flex items-center gap-1.5 bg-white border border-sky-200 rounded-md p-1 shadow-xs">
            <button
              onClick={() => changePage(searchParams, -1, router, pathname)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="p-1.5 rounded hover:bg-sky-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <span className="px-2 text-xs font-bold text-slate-800">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => changePage(searchParams, 1, router, pathname)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="p-1.5 rounded hover:bg-sky-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default TableControls;