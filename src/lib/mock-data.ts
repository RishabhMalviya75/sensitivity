// Mock data for demo purposes when Supabase is not configured
import { SensitivityProfile } from './types';

export const MOCK_PROFILES: SensitivityProfile[] = [
    {
        id: '1',
        game_name: 'BGMI',
        device_name: 'iPhone 13 Pro',
        share_code: '7245913680',
        camera_sensitivity: { no_scope: 95, red_dot: 85, '2x': 75, '3x': 65, '4x': 55, '6x': 45, '8x': 35 },
        ads_sensitivity: { no_scope: 90, red_dot: 80, '2x': 70, '3x': 60, '4x': 50, '6x': 40, '8x': 30 },
        gyro_sensitivity: { no_scope: 300, red_dot: 300, '2x': 280, '3x': 260, '4x': 240, '6x': 220, '8x': 200 },
        is_gyro_enabled: true,
        upvotes: 156,
        created_at: '2024-01-15T10:30:00Z',
    },
    {
        id: '2',
        game_name: 'BGMI',
        device_name: 'Redmi Note 10 Pro',
        share_code: '8834521907',
        camera_sensitivity: { no_scope: 100, red_dot: 90, '2x': 80, '3x': 70, '4x': 60, '6x': 50, '8x': 40 },
        ads_sensitivity: { no_scope: 95, red_dot: 85, '2x': 75, '3x': 65, '4x': 55, '6x': 45, '8x': 35 },
        gyro_sensitivity: null,
        is_gyro_enabled: false,
        upvotes: 89,
        created_at: '2024-01-10T14:20:00Z',
    },
    {
        id: '3',
        game_name: 'Free Fire',
        device_name: 'Samsung Galaxy S24',
        share_code: 'FF9283746501',
        camera_sensitivity: { no_scope: 85, red_dot: 75, '2x': 65, '3x': 55, '4x': 45, '6x': 35, '8x': 25 },
        ads_sensitivity: { no_scope: 80, red_dot: 70, '2x': 60, '3x': 50, '4x': 40, '6x': 30, '8x': 20 },
        gyro_sensitivity: { no_scope: 250, red_dot: 250, '2x': 230, '3x': 210, '4x': 190, '6x': 170, '8x': 150 },
        is_gyro_enabled: true,
        upvotes: 72,
        created_at: '2024-01-12T09:15:00Z',
    },
    {
        id: '4',
        game_name: 'COD',
        device_name: 'OnePlus 12',
        share_code: 'COD2024PRO',
        camera_sensitivity: { no_scope: 110, red_dot: 100, '2x': 90, '3x': 80, '4x': 70, '6x': 60, '8x': 50 },
        ads_sensitivity: { no_scope: 105, red_dot: 95, '2x': 85, '3x': 75, '4x': 65, '6x': 55, '8x': 45 },
        gyro_sensitivity: null,
        is_gyro_enabled: false,
        upvotes: 54,
        created_at: '2024-01-08T16:45:00Z',
    },
    {
        id: '5',
        game_name: 'PUBG',
        device_name: 'iPad Pro 12.9',
        share_code: '5567891234',
        camera_sensitivity: { no_scope: 88, red_dot: 78, '2x': 68, '3x': 58, '4x': 48, '6x': 38, '8x': 28 },
        ads_sensitivity: { no_scope: 85, red_dot: 75, '2x': 65, '3x': 55, '4x': 45, '6x': 35, '8x': 25 },
        gyro_sensitivity: { no_scope: 280, red_dot: 280, '2x': 260, '3x': 240, '4x': 220, '6x': 200, '8x': 180 },
        is_gyro_enabled: true,
        upvotes: 45,
        created_at: '2024-01-05T11:30:00Z',
    },
    {
        id: '6',
        game_name: 'BGMI',
        device_name: 'Poco F5',
        share_code: '3321654987',
        camera_sensitivity: { no_scope: 92, red_dot: 82, '2x': 72, '3x': 62, '4x': 52, '6x': 42, '8x': 32 },
        ads_sensitivity: { no_scope: 88, red_dot: 78, '2x': 68, '3x': 58, '4x': 48, '6x': 38, '8x': 28 },
        gyro_sensitivity: null,
        is_gyro_enabled: false,
        upvotes: 38,
        created_at: '2024-01-03T08:00:00Z',
    },
];

// Filter mock profiles
export function filterMockProfiles(
    profiles: SensitivityProfile[],
    game?: string,
    search?: string
): SensitivityProfile[] {
    let filtered = [...profiles];

    if (game) {
        filtered = filtered.filter(p => p.game_name === game);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.device_name.toLowerCase().includes(searchLower)
        );
    }

    return filtered.sort((a, b) => b.upvotes - a.upvotes);
}

export function getMockProfileById(id: string): SensitivityProfile | null {
    return MOCK_PROFILES.find(p => p.id === id) || null;
}
