import Link from 'next/link';
import { Gamepad2, Github, Heart } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-slate-950/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Gamepad2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">SensiFinder</span>
                        </Link>
                        <p className="text-slate-400 max-w-md">
                            The ultimate crowdsourced database for gaming sensitivities.
                            Find the perfect settings for your device and dominate the game.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/upload" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Upload Sensitivity
                                </Link>
                            </li>
                            <li>
                                <Link href="/converter" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Sensitivity Converter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Games */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Supported Games</h4>
                        <ul className="space-y-2">
                            <li className="text-slate-400">BGMI</li>
                            <li className="text-slate-400">PUBG Mobile</li>
                            <li className="text-slate-400">Free Fire</li>
                            <li className="text-slate-400">COD Mobile</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} SensiFinder. All rights reserved.
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 text-sm">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for gamers
                    </p>
                </div>
            </div>
        </footer>
    );
}
