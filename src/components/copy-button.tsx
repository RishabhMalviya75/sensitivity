'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';

interface CopyButtonProps {
    text: string;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function CopyButton({ text, label = 'Copy Code', size = 'md', className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
            size={size}
            className={`min-w-[140px] ${className}`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    {label}
                </>
            )}
        </Button>
    );
}
