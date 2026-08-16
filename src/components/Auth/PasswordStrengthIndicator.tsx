'use client';
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

type Props = {
    password: string;
};

const PasswordStrengthIndicator = ({ password }: Props) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const score = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasNumber ? 1 : 0);

    const getStrengthLabel = () => {
        if (!password) return { label: 'Empty', color: 'text-stone-400', barBg: 'bg-stone-200' };
        if (score === 3) return { label: 'Strong', color: 'text-emerald-600', barBg: 'bg-emerald-500' };
        if (score === 2) return { label: 'Medium', color: 'text-amber-500', barBg: 'bg-amber-400' };
        return { label: 'Weak', color: 'text-rose-500', barBg: 'bg-rose-500' };
    };

    const { label, color, barBg } = getStrengthLabel();

    const requirements = [
        { met: hasMinLength, text: 'At least 8 characters' },
        { met: hasUppercase, text: 'At least one uppercase letter (A-Z)' },
        { met: hasNumber, text: 'At least one number (0-9)' },
    ];

    return (
        <div className="flex flex-col gap-2 mt-1 px-1">
            {/* Progress Bar & Label */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1 bg-stone-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full transition-all duration-300 ${score >= 1 ? barBg : 'bg-stone-200'} flex-1 rounded-full`} />
                    <div className={`h-full transition-all duration-300 ${score >= 2 ? barBg : 'bg-stone-200'} flex-1 rounded-full`} />
                    <div className={`h-full transition-all duration-300 ${score === 3 ? barBg : 'bg-stone-200'} flex-1 rounded-full`} />
                </div>
                {password && (
                    <span className={`text-xs font-semibold ${color} transition-colors duration-200`}>
                        {label}
                    </span>
                )}
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1">
                {requirements.map((req, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-1.5 text-[0.72rem] font-medium transition-colors duration-200 ${
                            req.met ? 'text-emerald-600' : 'text-stone-400'
                        }`}
                    >
                        {req.met ? (
                            <FaCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                        ) : (
                            <FaTimes className="w-3 h-3 text-stone-300 shrink-0" />
                        )}
                        <span>{req.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
