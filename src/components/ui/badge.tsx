'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Check, Shield } from 'lucide-react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'verified' | 'game';
    game?: 'BGMI' | 'PUBG' | 'Free Fire' | 'COD';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = '', variant = 'default', game, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';

        const variants = {
            default: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
            verified: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
            game: getGameStyles(game),
        };

        function getGameStyles(gameName?: string) {
            switch (gameName) {
                case 'BGMI':
                    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
                case 'PUBG':
                    return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
                case 'Free Fire':
                    return 'bg-red-500/20 text-red-400 border border-red-500/30';
                case 'COD':
                    return 'bg-green-500/20 text-green-400 border border-green-500/30';
                default:
                    return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            }
        }

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}
            >
                {variant === 'verified' && <Shield className="w-3 h-3" />}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
