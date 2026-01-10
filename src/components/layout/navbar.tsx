'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Gamepad2, Upload, Home, RefreshCw } from 'lucide-react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/upload', label: 'Upload', icon: Upload },
        { href: '/converter', label: 'Converter', icon: RefreshCw },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">SensiFinder</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 border-t border-slate-700/50' : 'max-h-0'
                    }`}
            >
                <div className="px-4 py-2 space-y-1 bg-slate-900/95">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
