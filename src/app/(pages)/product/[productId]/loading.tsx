import React from 'react';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 mt-20 md:mt-16 lg:mt-0 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-slate-200 rounded"></div>
          <div className="h-4 w-3 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 rounded"></div>
          <div className="h-4 w-3 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product Image Skeleton */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="aspect-square w-[75%] bg-slate-200 rounded-xl mb-4"></div>
            <div className="grid grid-cols-4 gap-2 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <div className="h-4 w-24 bg-blue-100 rounded mb-2"></div>
              <div className="h-8 w-3/4 bg-slate-200 rounded mb-2"></div>
              <div className="h-6 w-1/2 bg-slate-200 rounded"></div>
            </div>

            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="h-5 w-28 bg-slate-200 rounded"></div>
              <div className="h-5 w-16 bg-slate-200 rounded"></div>
            </div>

            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-slate-200 rounded"></div>
                <div className="h-3.5 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-3.5 w-4/6 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Checkout Card Skeleton */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="h-3 w-16 bg-slate-200 rounded"></div>
            <div className="h-8 w-28 bg-slate-300 rounded"></div>
            <div className="h-16 w-full bg-slate-100 rounded-lg"></div>
            <div className="h-11 w-full bg-blue-200 rounded-lg mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
