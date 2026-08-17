import React from 'react';

export default function AdminLoading() {
  return (
    <div className="w-full p-6 animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-72 bg-slate-100 rounded"></div>
        </div>
        <div className="h-10 w-36 bg-blue-100 rounded-lg"></div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-8 w-8 bg-sky-100 rounded-lg"></div>
            </div>
            <div className="h-8 w-20 bg-slate-300 rounded mb-2"></div>
            <div className="h-3 w-32 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="h-5 w-36 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
