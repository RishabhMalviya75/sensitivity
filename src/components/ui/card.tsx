'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered';
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', hover = true, children, ...props }, ref) => {
        const baseStyles = 'rounded-2xl p-6 transition-all duration-300';

        const variants = {
            default: 'glass-card',
            elevated: 'glass-card shadow-lg shadow-purple-500/10',
            bordered: 'bg-slate-800/30 border-2 border-purple-500/30',
        };

        const hoverStyles = hover
            ? 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1'
            : '';

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className = '', children, ...props }, ref) => (
        <h3 ref={ref} className={`text-xl font-bold text-white ${className}`} {...props}>
            {children}
        </h3>
    )
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`${className}`} {...props}>
            {children}
        </div>
    )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`mt-4 pt-4 border-t border-slate-700/50 ${className}`} {...props}>
            {children}
        </div>
    )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
