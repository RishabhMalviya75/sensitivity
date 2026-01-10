'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Users } from 'lucide-react';
import { DeviceSearch } from '@/components/device-search';
import { GameFilter } from '@/components/game-filter';
import { SensitivityCard } from '@/components/sensitivity-card';
import { GameName, SensitivityProfile } from '@/lib/types';
import { getTrendingProfiles, searchProfiles, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PROFILES, filterMockProfiles } from '@/lib/mock-data';

export default function HomePage() {
  const [profiles, setProfiles] = useState<SensitivityProfile[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameName | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Load trending profiles on mount and when game filter changes
  useEffect(() => {
    loadTrending();
  }, [selectedGame]);

  const loadTrending = async () => {
    setIsLoading(true);
    setSearchQuery('');

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Use mock data for demo
      setIsDemo(true);
      const filtered = filterMockProfiles(MOCK_PROFILES, selectedGame || undefined);
      setProfiles(filtered);
      setIsLoading(false);
      return;
    }

    try {
      const data = await getTrendingProfiles(12, selectedGame || undefined);
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
      // Fallback to mock data
      setIsDemo(true);
      const filtered = filterMockProfiles(MOCK_PROFILES, selectedGame || undefined);
      setProfiles(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (!isSupabaseConfigured()) {
      // Use mock data for demo
      const filtered = filterMockProfiles(MOCK_PROFILES, selectedGame || undefined, query);
      setProfiles(filtered);
      setIsSearching(false);
      return;
    }

    try {
      const data = await searchProfiles(query, selectedGame || undefined);
      setProfiles(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGameSelect = (game: GameName | null) => {
    setSelectedGame(game);
    if (searchQuery) {
      // Re-run search with new filter
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-center text-sm text-purple-300">
              <span className="font-semibold">Demo Mode:</span> Connect your Supabase database to enable full functionality.
              Check <code className="bg-slate-800 px-2 py-0.5 rounded">env.example.txt</code> for setup instructions.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Crowdsourced Gaming Sensitivities
          </div>

          {/* Heading */}
          <h1 className="text-hero gradient-text mb-6 animate-fade-in">
            Find Your Perfect<br />Sensitivity
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in">
            Search thousands of community-uploaded sensitivity profiles for your exact device model.
            Optimized for BGMI, PUBG, Free Fire, and COD Mobile.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in">
            <DeviceSearch onSearch={handleSearch} size="hero" />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">1000+</p>
                <p className="text-sm text-slate-400">Profiles Uploaded</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-sm text-slate-400">Games Supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-section text-white mb-2">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'Trending Sensitivities'
                }
              </h2>
              <p className="text-slate-400">
                {searchQuery
                  ? `${profiles.length} profiles found`
                  : 'Most upvoted sensitivity profiles from the community'
                }
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={loadTrending}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
              >
                ← Back to trending
              </button>
            )}
          </div>

          {/* Game Filter */}
          <div className="mb-8">
            <GameFilter selectedGame={selectedGame} onGameSelect={handleGameSelect} />
          </div>

          {/* Profiles Grid */}
          {isLoading || isSearching ? (
            <div className="card-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50" />
                    <div className="flex-1">
                      <div className="h-5 bg-slate-700/50 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-700/50 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-16 bg-slate-900/60 rounded-xl mb-4" />
                  <div className="h-10 bg-slate-700/50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="card-grid">
              {profiles.map((profile) => (
                <SensitivityCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No profiles found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery
                  ? `No sensitivity profiles match "${searchQuery}"`
                  : 'Be the first to upload a sensitivity profile!'
                }
              </p>
              <a
                href="/upload"
                className="btn-primary inline-flex"
              >
                Upload Your Sensitivity
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
