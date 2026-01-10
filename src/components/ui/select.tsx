'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`
              w-full px-4 py-3 pr-10
              bg-slate-800/60 
              border border-slate-600/50 
              rounded-xl 
              text-white 
              appearance-none
              cursor-pointer
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
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-slate-800 text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
