'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    icon?: ReactNode;
}

export function AccordionItem({ title, children, defaultOpen = false, icon }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-700/50 rounded-xl overflow-hidden mb-3 last:mb-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-4 flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-purple-400">{icon}</span>}
                    <span className="font-semibold text-white">{title}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4 bg-slate-900/40">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface AccordionProps {
    children: ReactNode;
    className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
