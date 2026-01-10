'use client';

import { useState } from 'react';
import { RefreshCw, ArrowRight, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GAMES, SCOPE_LABELS, ScopeSensitivity, DEFAULT_SENSITIVITY } from '@/lib/types';
import { convertAllSensitivities } from '@/lib/converter';

export default function ConverterPage() {
    const [fromGame, setFromGame] = useState('');
    const [toGame, setToGame] = useState('');
    const [inputSens, setInputSens] = useState<ScopeSensitivity>({ ...DEFAULT_SENSITIVITY });
    const [outputSens, setOutputSens] = useState<ScopeSensitivity | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const gameOptions = GAMES.map(g => ({ value: g, label: g }));

    const handleInputChange = (key: keyof ScopeSensitivity, value: string) => {
        const numValue = parseInt(value) || 0;
        setInputSens(prev => ({ ...prev, [key]: Math.max(1, Math.min(300, numValue)) }));
    };

    const handleConvert = () => {
        if (!fromGame || !toGame) return;

        setIsConverting(true);

        // Simulate async conversion
        setTimeout(() => {
            const converted = convertAllSensitivities(inputSens, fromGame, toGame);
            setOutputSens(converted);
            setIsConverting(false);
        }, 500);
    };

    const handleSwapGames = () => {
        setFromGame(toGame);
        setToGame(fromGame);
        if (outputSens) {
            setInputSens(outputSens);
            setOutputSens(null);
        }
    };

    return (
        <div className="min-h-screen py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-6 shadow-lg shadow-purple-500/30">
                        <RefreshCw className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Sensitivity Converter
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Convert your sensitivity settings between different games.
                        Our algorithm uses community-researched conversion ratios.
                    </p>
                </div>

                {/* Info Card */}
                <Card className="mb-8 bg-blue-500/10 border-blue-500/30">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-blue-200 text-sm">
                                <strong>Note:</strong> Conversion ratios are approximate and based on community research.
                                BGMI and PUBG use the same engine, so their sensitivities are identical (1:1 ratio).
                                Actual in-game feel may vary slightly—fine-tune as needed.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Game Selection */}
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-6">Select Games</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <Select
                                label="From Game"
                                options={gameOptions}
                                placeholder="Select source game"
                                value={fromGame}
                                onChange={(e) => setFromGame(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSwapGames}
                            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 transition-colors shrink-0 mt-6 sm:mt-4"
                            title="Swap games"
                        >
                            <RefreshCw className="w-5 h-5 text-purple-400" />
                        </button>

                        <div className="flex-1 w-full">
                            <Select
                                label="To Game"
                                options={gameOptions}
                                placeholder="Select target game"
                                value={toGame}
                                onChange={(e) => setToGame(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Input Sensitivity */}
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-6">Input Sensitivity</h2>
                    <p className="text-slate-400 text-sm mb-4">
                        Enter your current {fromGame || 'source game'} sensitivity values (1-300)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {SCOPE_LABELS.map(({ key, label }) => (
                            <Input
                                key={key}
                                label={label}
                                type="number"
                                min={1}
                                max={300}
                                value={inputSens[key]}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                            />
                        ))}
                    </div>
                </Card>

                {/* Convert Button */}
                <div className="flex justify-center mb-6">
                    <Button
                        onClick={handleConvert}
                        size="lg"
                        disabled={!fromGame || !toGame || fromGame === toGame}
                        isLoading={isConverting}
                        className="min-w-[200px]"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Convert Sensitivity
                    </Button>
                </div>

                {/* Output Sensitivity */}
                {outputSens && (
                    <Card className="animate-fade-in border-purple-500/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Converted Sensitivity</h2>
                                <p className="text-sm text-slate-400">
                                    {fromGame} → {toGame}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="sens-table">
                                <thead>
                                    <tr>
                                        <th>Scope</th>
                                        <th>Original ({fromGame})</th>
                                        <th>Converted ({toGame})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SCOPE_LABELS.map(({ key, label }) => (
                                        <tr key={key}>
                                            <td className="font-medium text-slate-300">{label}</td>
                                            <td className="text-slate-400">{inputSens[key]}%</td>
                                            <td className="text-purple-400 font-bold">{outputSens[key]}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
