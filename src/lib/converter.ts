// Sensitivity conversion logic between games

import { ScopeSensitivity } from './types';

// Conversion ratios based on community research
// These are approximate multipliers to convert sensitivity between games
// Base reference is BGMI/PUBG (they share the same engine)
const CONVERSION_RATIOS: Record<string, Record<string, number>> = {
    'BGMI': {
        'BGMI': 1.0,
        'PUBG': 1.0, // Same engine
        'Free Fire': 0.75, // Free Fire uses different scaling
        'COD': 1.25, // COD has higher base sensitivity
    },
    'PUBG': {
        'BGMI': 1.0,
        'PUBG': 1.0,
        'Free Fire': 0.75,
        'COD': 1.25,
    },
    'Free Fire': {
        'BGMI': 1.33, // Inverse of 0.75
        'PUBG': 1.33,
        'Free Fire': 1.0,
        'COD': 1.67,
    },
    'COD': {
        'BGMI': 0.8, // Inverse of 1.25
        'PUBG': 0.8,
        'Free Fire': 0.6,
        'COD': 1.0,
    },
};

export function convertSensitivity(
    value: number,
    fromGame: string,
    toGame: string
): number {
    const ratio = CONVERSION_RATIOS[fromGame]?.[toGame] ?? 1.0;
    const converted = Math.round(value * ratio);
    // Clamp between 1 and 300
    return Math.max(1, Math.min(300, converted));
}

export function convertAllSensitivities(
    sensitivity: ScopeSensitivity,
    fromGame: string,
    toGame: string
): ScopeSensitivity {
    return {
        no_scope: convertSensitivity(sensitivity.no_scope, fromGame, toGame),
        red_dot: convertSensitivity(sensitivity.red_dot, fromGame, toGame),
        '2x': convertSensitivity(sensitivity['2x'], fromGame, toGame),
        '3x': convertSensitivity(sensitivity['3x'], fromGame, toGame),
        '4x': convertSensitivity(sensitivity['4x'], fromGame, toGame),
        '6x': convertSensitivity(sensitivity['6x'], fromGame, toGame),
        '8x': convertSensitivity(sensitivity['8x'], fromGame, toGame),
    };
}

// DPI conversion for different devices (optional feature)
export function convertDPI(
    sensitivity: number,
    fromDPI: number,
    toDPI: number
): number {
    if (fromDPI === 0 || toDPI === 0) return sensitivity;
    const converted = Math.round((sensitivity * fromDPI) / toDPI);
    return Math.max(1, Math.min(300, converted));
}
