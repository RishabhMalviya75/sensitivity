'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crosshair, Target, Move3D, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Accordion, AccordionItem } from './ui/accordion';
import { Card } from './ui/card';
import {
    GameName,
    GAMES,
    ScopeSensitivity,
    SCOPE_LABELS,
    DEFAULT_SENSITIVITY,
    CreateSensitivityProfile
} from '@/lib/types';
import { createProfile } from '@/lib/supabase';

interface FormErrors {
    game?: string;
    device?: string;
    shareCode?: string;
    sensitivity?: string;
}

export function UploadForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState(false);

    // Form state
    const [gameName, setGameName] = useState<GameName | ''>('');
    const [deviceName, setDeviceName] = useState('');
    const [shareCode, setShareCode] = useState('');
    const [isGyroEnabled, setIsGyroEnabled] = useState(false);

    const [cameraSens, setCameraSens] = useState<ScopeSensitivity>({ ...DEFAULT_SENSITIVITY });
    const [adsSens, setAdsSens] = useState<ScopeSensitivity>({ ...DEFAULT_SENSITIVITY });
    const [gyroSens, setGyroSens] = useState<ScopeSensitivity>({ ...DEFAULT_SENSITIVITY });

    const gameOptions = GAMES.map(g => ({ value: g, label: g }));

    const validateSensitivity = (value: number): boolean => {
        return value >= 1 && value <= 300;
    };

    const validateAllSensitivities = (): boolean => {
        const allValues = [
            ...Object.values(cameraSens),
            ...Object.values(adsSens),
            ...(isGyroEnabled ? Object.values(gyroSens) : []),
        ];
        return allValues.every(validateSensitivity);
    };

    const handleSensChange = (
        setter: React.Dispatch<React.SetStateAction<ScopeSensitivity>>,
        key: keyof ScopeSensitivity,
        value: string
    ) => {
        const numValue = parseInt(value) || 0;
        setter(prev => ({ ...prev, [key]: numValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: FormErrors = {};

        if (!gameName) {
            newErrors.game = 'Please select a game';
        }

        if (!deviceName.trim()) {
            newErrors.device = 'Please enter your device name';
        }

        if (!shareCode.trim()) {
            newErrors.shareCode = 'Please enter the share code';
        }

        if (!validateAllSensitivities()) {
            newErrors.sensitivity = 'All sensitivity values must be between 1 and 300';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const profile: CreateSensitivityProfile = {
                game_name: gameName as GameName,
                device_name: deviceName.trim(),
                share_code: shareCode.trim(),
                camera_sensitivity: cameraSens,
                ads_sensitivity: adsSens,
                gyro_sensitivity: isGyroEnabled ? gyroSens : null,
                is_gyro_enabled: isGyroEnabled,
            };

            const created = await createProfile(profile);
            setSuccess(true);

            // Redirect to the new profile after a short delay
            setTimeout(() => {
                router.push(`/profile/${created.id}`);
            }, 1500);

        } catch (error) {
            console.error('Error creating profile:', error);
            setErrors({ sensitivity: 'Failed to create profile. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderSensitivityInputs = (
        values: ScopeSensitivity,
        setter: React.Dispatch<React.SetStateAction<ScopeSensitivity>>
    ) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SCOPE_LABELS.map(({ key, label }) => (
                <Input
                    key={key}
                    label={label}
                    type="number"
                    min={1}
                    max={300}
                    value={values[key]}
                    onChange={(e) => handleSensChange(setter, key, e.target.value)}
                    error={
                        !validateSensitivity(values[key])
                            ? 'Must be 1-300'
                            : undefined
                    }
                />
            ))}
        </div>
    );

    if (success) {
        return (
            <Card className="max-w-2xl mx-auto text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Profile Created!</h2>
                <p className="text-slate-400">Redirecting to your sensitivity profile...</p>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Basic Info */}
            <Card>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    Basic Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Select
                        label="Game"
                        options={gameOptions}
                        placeholder="Select a game"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value as GameName)}
                        error={errors.game}
                    />

                    <Input
                        label="Device Name"
                        placeholder="e.g., iPhone 13 Pro, Redmi Note 10"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        error={errors.device}
                    />
                </div>

                <div className="mt-6">
                    <Input
                        label="Share Code"
                        placeholder="Enter the in-game share/cloud code"
                        value={shareCode}
                        onChange={(e) => setShareCode(e.target.value)}
                        error={errors.shareCode}
                        helper="This is the code players can use to import your sensitivity settings"
                    />
                </div>
            </Card>

            {/* Gyro Toggle */}
            <Card>
                <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isGyroEnabled}
                            onChange={(e) => setIsGyroEnabled(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${isGyroEnabled ? 'bg-purple-500' : 'bg-slate-700'
                            }`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${isGyroEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                } mt-0.5`} />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-white">Enable Gyroscope Settings</p>
                        <p className="text-sm text-slate-400">Add gyro sensitivity values to your profile</p>
                    </div>
                </label>
            </Card>

            {/* Sensitivity Sections */}
            <Card>
                <h2 className="text-xl font-bold text-white mb-6">Sensitivity Settings</h2>

                {errors.sensitivity && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                        {errors.sensitivity}
                    </div>
                )}

                <Accordion>
                    <AccordionItem
                        title="Camera Sensitivity"
                        defaultOpen={true}
                        icon={<Crosshair className="w-5 h-5" />}
                    >
                        {renderSensitivityInputs(cameraSens, setCameraSens)}
                    </AccordionItem>

                    <AccordionItem
                        title="ADS Sensitivity"
                        icon={<Target className="w-5 h-5" />}
                    >
                        {renderSensitivityInputs(adsSens, setAdsSens)}
                    </AccordionItem>

                    {isGyroEnabled && (
                        <AccordionItem
                            title="Gyro Sensitivity"
                            icon={<Move3D className="w-5 h-5" />}
                        >
                            {renderSensitivityInputs(gyroSens, setGyroSens)}
                        </AccordionItem>
                    )}
                </Accordion>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="min-w-[200px]"
                >
                    {isSubmitting ? 'Uploading...' : 'Upload Sensitivity'}
                </Button>
            </div>
        </form>
    );
}
