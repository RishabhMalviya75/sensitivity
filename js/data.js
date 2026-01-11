// SensiFinder - Mock Data and Constants

// Game constants
const GAMES = ['BGMI', 'PUBG', 'Free Fire', 'COD'];

const GAME_CLASSES = {
    'BGMI': 'bgmi',
    'PUBG': 'pubg',
    'Free Fire': 'freefire',
    'COD': 'cod'
};

const GAME_CHARACTERS = {
    'BGMI': 'images/bgmi-character.png',
    'PUBG': 'images/bgmi-character.png', // Using same as BGMI
    'Free Fire': 'images/freefire-character.png',
    'COD': 'images/cod-character.png'
};

const SCOPE_LABELS = [
    { key: 'no_scope', label: 'No Scope' },
    { key: 'red_dot', label: 'Red Dot' },
    { key: '2x', label: '2x' },
    { key: '3x', label: '3x' },
    { key: '4x', label: '4x' },
    { key: '6x', label: '6x' },
    { key: '8x', label: '8x' }
];

const DEFAULT_SENSITIVITY = {
    no_scope: 100,
    red_dot: 100,
    '2x': 100,
    '3x': 100,
    '4x': 100,
    '6x': 100,
    '8x': 100
};

// Mock profiles data
const MOCK_PROFILES = [
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
        created_at: '2024-01-15T10:30:00Z'
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
        created_at: '2024-01-10T14:20:00Z'
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
        created_at: '2024-01-12T09:15:00Z'
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
        created_at: '2024-01-08T16:45:00Z'
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
        created_at: '2024-01-05T11:30:00Z'
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
        created_at: '2024-01-03T08:00:00Z'
    }
];

// LocalStorage key for user-uploaded profiles
const STORAGE_KEY = 'sensifinder_profiles';

// Get all profiles (mock + user uploaded)
function getAllProfiles() {
    const userProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return [...MOCK_PROFILES, ...userProfiles];
}

// Save a new profile
function saveProfile(profile) {
    const userProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    profile.id = 'user_' + Date.now();
    profile.upvotes = 0;
    profile.created_at = new Date().toISOString();
    userProfiles.push(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfiles));
    return profile;
}

// Get profile by ID
function getProfileById(id) {
    const allProfiles = getAllProfiles();
    return allProfiles.find(p => p.id === id) || null;
}

// Filter profiles
function filterProfiles(game = null, searchQuery = '') {
    let profiles = getAllProfiles();

    if (game) {
        profiles = profiles.filter(p => p.game_name === game);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        profiles = profiles.filter(p =>
            p.device_name.toLowerCase().includes(query) ||
            p.share_code.toLowerCase().includes(query)
        );
    }

    // Sort by upvotes (trending)
    return profiles.sort((a, b) => b.upvotes - a.upvotes);
}

// Upvote a profile
function upvoteProfile(id) {
    // For mock profiles, we can't actually save the upvote
    // For user profiles, we update localStorage
    const userProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const profileIndex = userProfiles.findIndex(p => p.id === id);

    if (profileIndex !== -1) {
        userProfiles[profileIndex].upvotes++;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfiles));
        return userProfiles[profileIndex].upvotes;
    }

    return null;
}

// Sensitivity conversion multipliers between games
const CONVERSION_MULTIPLIERS = {
    'BGMI': { 'PUBG': 1.0, 'Free Fire': 0.85, 'COD': 1.15 },
    'PUBG': { 'BGMI': 1.0, 'Free Fire': 0.85, 'COD': 1.15 },
    'Free Fire': { 'BGMI': 1.18, 'PUBG': 1.18, 'COD': 1.35 },
    'COD': { 'BGMI': 0.87, 'PUBG': 0.87, 'Free Fire': 0.74 }
};

// Convert sensitivity between games
function convertSensitivity(value, fromGame, toGame) {
    if (fromGame === toGame) return value;
    const multiplier = CONVERSION_MULTIPLIERS[fromGame]?.[toGame] || 1;
    return Math.round(value * multiplier);
}
