'use client';

import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Review as ReviewType, User } from '../../generated/prisma';
import Link from 'next/link';
import SafeImage from '@/components/Common/SafeImage';

interface ReviewProps {
  i: number;
  user: User;
  review: ReviewType;
}

const Review = ({ i, user, review }: ReviewProps) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 w-full border border-sky-100 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-start justify-between gap-4">
        {/* User Info with Avatar */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/profile/${user?.id}`}
            className="relative w-10 h-10 rounded-full overflow-hidden bg-sky-50 border border-sky-100 shrink-0 block"
          >
            <SafeImage
              fill
              sizes="40px"
              src={user?.avatar}
              fallbackSrc="https://i.pravatar.cc/150?u=user"
              alt={user?.name || 'Customer'}
              className="object-cover"
            />
          </Link>

          <div className="min-w-0">
            <Link
              href={`/profile/${user?.id}`}
              className="text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors truncate block"
            >
              {user?.name || 'Verified Customer'}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                Verified Purchase
              </span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center text-amber-400 shrink-0 text-xs sm:text-sm">
          {[...Array(5)].map((_, index) => (
            index < (review.rating || 5) ? (
              <FaStar key={index} />
            ) : (
              <FaRegStar key={index} className="text-slate-300" />
            )
          ))}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3.5 whitespace-pre-line">
        {review?.text}
      </p>
    </div>
  );
};

export default Review;
