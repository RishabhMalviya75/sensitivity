'use client';

import Link from 'next/link';
import { ArrowUpRight, ThumbsUp, Smartphone, Shield } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { CopyButton } from './copy-button';
import { SensitivityProfile, GAME_COLORS } from '@/lib/types';

interface SensitivityCardProps {
    profile: SensitivityProfile;
    onUpvote?: (id: string) => void;
}

export function SensitivityCard({ profile, onUpvote }: SensitivityCardProps) {
    const isVerified = profile.upvotes >= 50;
    const gameColors = GAME_COLORS[profile.game_name];

    return (
        <Card className="group relative overflow-hidden">
            {/* Game Badge */}
            <div className="absolute top-4 right-4">
                <Badge variant="game" game={profile.game_name}>
                    {profile.game_name}
                </Badge>
            </div>

            <CardContent>
                {/* Device Name */}
                <div className="flex items-start gap-3 mb-4 pr-20">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{profile.device_name}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {profile.is_gyro_enabled ? 'Gyro Enabled' : 'Non-Gyro'}
                        </p>
                    </div>
                </div>

                {/* Share Code Preview */}
                <div className="bg-slate-900/60 rounded-xl p-3 mb-4">
                    <p className="text-xs text-slate-500 mb-1">Share Code</p>
                    <p className="font-mono text-purple-400 text-sm truncate">{profile.share_code}</p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{profile.upvotes}</span>
                    </div>

                    {isVerified && (
                        <Badge variant="verified">
                            <Shield className="w-3 h-3" />
                            Verified
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <CopyButton text={profile.share_code} size="sm" className="flex-1" />
                <Link
                    href={`/profile/${profile.id}`}
                    className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all text-sm font-medium"
                >
                    View
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}
