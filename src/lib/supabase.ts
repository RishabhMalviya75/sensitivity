import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SensitivityProfile, CreateSensitivityProfile, GameName } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if credentials are available
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
    return supabase !== null;
}

// Fetch trending profiles (sorted by upvotes)
export async function getTrendingProfiles(limit: number = 10, game?: GameName): Promise<SensitivityProfile[]> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return [];
    }

    let query = supabase
        .from('sensitivity_profiles')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(limit);

    if (game) {
        query = query.eq('game_name', game);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching trending profiles:', error);
        return [];
    }

    return data as SensitivityProfile[];
}

// Search profiles by device name
export async function searchProfiles(deviceName: string, game?: GameName): Promise<SensitivityProfile[]> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return [];
    }

    let query = supabase
        .from('sensitivity_profiles')
        .select('*')
        .ilike('device_name', `%${deviceName}%`)
        .order('upvotes', { ascending: false });

    if (game) {
        query = query.eq('game_name', game);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error searching profiles:', error);
        return [];
    }

    return data as SensitivityProfile[];
}

// Get single profile by ID
export async function getProfileById(id: string): Promise<SensitivityProfile | null> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return null;
    }

    const { data, error } = await supabase
        .from('sensitivity_profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data as SensitivityProfile;
}

// Create new sensitivity profile
export async function createProfile(profile: CreateSensitivityProfile): Promise<SensitivityProfile> {
    if (!supabase) {
        throw new Error('Supabase not configured. Please add your Supabase credentials to .env.local');
    }

    const { data, error } = await supabase
        .from('sensitivity_profiles')
        .insert([profile])
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error);
        throw error;
    }

    return data as SensitivityProfile;
}

// Upvote a profile
export async function upvoteProfile(id: string): Promise<number | null> {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.rpc('increment_upvotes', { profile_id: id });

    if (error) {
        console.error('Error upvoting profile:', error);
        throw error;
    }

    return data;
}

// Get unique device names for autocomplete
export async function getDeviceNames(): Promise<string[]> {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from('sensitivity_profiles')
        .select('device_name')
        .order('device_name');

    if (error) {
        console.error('Error fetching device names:', error);
        return [];
    }

    // Return unique device names
    const uniqueDevices = [...new Set(data.map(d => d.device_name))];
    return uniqueDevices;
}
