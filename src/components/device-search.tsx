'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface DeviceSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    size?: 'default' | 'hero';
}

export function DeviceSearch({
    onSearch,
    placeholder = 'Search your device (e.g., iPhone 13, Redmi Note 10)...',
    size = 'default'
}: DeviceSearchProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onSearch(query.trim());
        }
    };

    const isHero = size === 'hero';

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative">
                <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${isHero ? 'w-6 h-6' : 'w-5 h-5'
                        }`}
                />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`
            w-full bg-slate-800/60 border-2 border-slate-600/50 rounded-2xl text-white
            placeholder-slate-500 transition-all duration-300
            focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)]
            ${isHero
                            ? 'pl-14 pr-6 py-5 text-lg'
                            : 'pl-12 pr-4 py-3 text-base'
                        }
          `}
                />
            </div>
        </form>
    );
}
