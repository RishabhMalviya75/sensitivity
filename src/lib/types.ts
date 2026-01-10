// TypeScript interfaces for SensiFinder

export type GameName = 'BGMI' | 'PUBG' | 'Free Fire' | 'COD';

export interface ScopeSensitivity {
  no_scope: number;
  red_dot: number;
  '2x': number;
  '3x': number;
  '4x': number;
  '6x': number;
  '8x': number;
}

export interface SensitivityProfile {
  id: string;
  game_name: GameName;
  device_name: string;
  share_code: string;
  camera_sensitivity: ScopeSensitivity;
  ads_sensitivity: ScopeSensitivity;
  gyro_sensitivity: ScopeSensitivity | null;
  is_gyro_enabled: boolean;
  upvotes: number;
  created_at: string;
}

export interface CreateSensitivityProfile {
  game_name: GameName;
  device_name: string;
  share_code: string;
  camera_sensitivity: ScopeSensitivity;
  ads_sensitivity: ScopeSensitivity;
  gyro_sensitivity?: ScopeSensitivity | null;
  is_gyro_enabled: boolean;
}

export const GAMES: GameName[] = ['BGMI', 'PUBG', 'Free Fire', 'COD'];

export const SCOPE_LABELS: { key: keyof ScopeSensitivity; label: string }[] = [
  { key: 'no_scope', label: 'No Scope' },
  { key: 'red_dot', label: 'Red Dot' },
  { key: '2x', label: '2x' },
  { key: '3x', label: '3x' },
  { key: '4x', label: '4x' },
  { key: '6x', label: '6x' },
  { key: '8x', label: '8x' },
];

export const DEFAULT_SENSITIVITY: ScopeSensitivity = {
  no_scope: 100,
  red_dot: 100,
  '2x': 100,
  '3x': 100,
  '4x': 100,
  '6x': 100,
  '8x': 100,
};

// Game colors for UI
export const GAME_COLORS: Record<GameName, { bg: string; text: string; border: string }> = {
  'BGMI': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  'PUBG': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
  'Free Fire': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
  'COD': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
};
