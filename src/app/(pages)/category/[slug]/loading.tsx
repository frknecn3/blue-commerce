import React from 'react';

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-sky-50/40 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-10 bg-slate-200 rounded"></div>
        <div className="h-3 w-2 bg-slate-200 rounded"></div>
        <div className="h-3 w-16 bg-slate-200 rounded"></div>
      </div>

      {/* Banner Skeleton */}
      <div className="h-32 w-full bg-gradient-to-r from-blue-400/50 to-sky-300/50 rounded-lg mb-6"></div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
            <div className="aspect-square bg-slate-200 rounded-md"></div>
            <div className="h-3.5 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
            <div className="h-4 w-1/3 bg-slate-300 rounded"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
