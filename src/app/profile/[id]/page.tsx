'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ThumbsUp,
    Shield,
    Smartphone,
    Crosshair,
    Target,
    Move3D,
    Calendar,
    Share2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';
import { SensitivityProfile, ScopeSensitivity, SCOPE_LABELS, GAME_COLORS } from '@/lib/types';
import { getProfileById, upvoteProfile, isSupabaseConfigured } from '@/lib/supabase';
import { getMockProfileById } from '@/lib/mock-data';

export default function ProfilePage() {
    const params = useParams();
    const [profile, setProfile] = useState<SensitivityProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [params.id]);

    const loadProfile = async () => {
        if (!params.id) return;

        setIsLoading(true);

        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            setIsDemo(true);
            const mockProfile = getMockProfileById(params.id as string);
            setProfile(mockProfile);
            setIsLoading(false);
            return;
        }

        try {
            const data = await getProfileById(params.id as string);
            setProfile(data);
        } catch (error) {
            console.error('Error loading profile:', error);
            // Try mock data as fallback
            setIsDemo(true);
            const mockProfile = getMockProfileById(params.id as string);
            setProfile(mockProfile);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpvote = async () => {
        if (!profile || hasUpvoted) return;

        if (isDemo) {
            // Simulate upvote in demo mode
            setProfile(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
            setHasUpvoted(true);
            return;
        }

        setIsUpvoting(true);
        try {
            await upvoteProfile(profile.id);
            setProfile(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
            setHasUpvoted(true);
        } catch (error) {
            console.error('Error upvoting:', error);
        } finally {
            setIsUpvoting(false);
        }
    };

    const renderSensitivityTable = (
        title: string,
        sensitivity: ScopeSensitivity,
        icon: React.ReactNode
    ) => (
        <Card className="overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="sens-table">
                    <thead>
                        <tr>
                            {SCOPE_LABELS.map(({ label }) => (
                                <th key={label}>{label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {SCOPE_LABELS.map(({ key }) => (
                                <td key={key} className="text-purple-400 font-semibold">
                                    {sensitivity[key]}%
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-slate-700/50 rounded w-32" />
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-slate-700/50 rounded-xl" />
                                <div className="flex-1">
                                    <div className="h-6 bg-slate-700/50 rounded w-48 mb-2" />
                                    <div className="h-4 bg-slate-700/50 rounded w-32" />
                                </div>
                            </div>
                            <div className="h-24 bg-slate-800/50 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen py-12 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
                    <p className="text-slate-400 mb-8">The sensitivity profile you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/" className="btn-primary inline-flex">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const isVerified = profile.upvotes >= 50;
    const createdDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Demo Banner */}
                {isDemo && (
                    <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                        <p className="text-sm text-purple-300">
                            <span className="font-semibold">Demo Mode:</span> This is sample data. Connect Supabase for real profiles.
                        </p>
                    </div>
                )}

                {/* Profile Header */}
                <Card className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                        {/* Device Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                            <Smartphone className="w-10 h-10 text-purple-400" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    {profile.device_name}
                                </h1>
                                <Badge variant="game" game={profile.game_name}>
                                    {profile.game_name}
                                </Badge>
                                {isVerified && (
                                    <Badge variant="verified">
                                        <Shield className="w-3 h-3" />
                                        Community Verified
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <ThumbsUp className="w-4 h-4" />
                                    {profile.upvotes} upvotes
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {createdDate}
                                </span>
                                <span>
                                    {profile.is_gyro_enabled ? '🎯 Gyro Enabled' : '📱 Non-Gyro'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Share Code Section */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-purple-500/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">In-Game Share Code</p>
                                <p className="font-mono text-xl sm:text-2xl text-purple-400 font-bold">
                                    {profile.share_code}
                                </p>
                            </div>
                            <CopyButton
                                text={profile.share_code}
                                label="Copy Code"
                                size="lg"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                            onClick={handleUpvote}
                            disabled={hasUpvoted}
                            variant={hasUpvoted ? 'secondary' : 'primary'}
                            isLoading={isUpvoting}
                        >
                            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                            {hasUpvoted ? 'Upvoted!' : 'Upvote'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                if (typeof navigator !== 'undefined' && navigator.share) {
                                    navigator.share({
                                        title: `${profile.device_name} Sensitivity - SensiFinder`,
                                        text: `Check out this ${profile.game_name} sensitivity for ${profile.device_name}`,
                                        url: window.location.href,
                                    });
                                }
                            }}
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                    </div>
                </Card>

                {/* Sensitivity Tables */}
                <div className="space-y-6">
                    {renderSensitivityTable(
                        'Camera Sensitivity',
                        profile.camera_sensitivity,
                        <Crosshair className="w-5 h-5 text-purple-400" />
                    )}

                    {renderSensitivityTable(
                        'ADS Sensitivity',
                        profile.ads_sensitivity,
                        <Target className="w-5 h-5 text-purple-400" />
                    )}

                    {profile.is_gyro_enabled && profile.gyro_sensitivity && renderSensitivityTable(
                        'Gyro Sensitivity',
                        profile.gyro_sensitivity,
                        <Move3D className="w-5 h-5 text-purple-400" />
                    )}
                </div>
            </div>
        </div>
    );
}
