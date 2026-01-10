'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, helper, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3 
            bg-slate-800/60 
            border border-slate-600/50 
            rounded-xl 
            text-white 
            placeholder-slate-500
            transition-all duration-300
            focus:outline-none 
            focus:border-purple-500 
            focus:ring-2 
            focus:ring-purple-500/20
            disabled:opacity-50 
            disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
                {helper && !error && (
                    <p className="mt-2 text-sm text-slate-500">{helper}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
