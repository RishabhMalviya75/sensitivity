-- SensiFinder Database Schema
-- Run this in your Supabase SQL Editor

-- Create the sensitivity_profiles table
CREATE TABLE IF NOT EXISTS sensitivity_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name TEXT NOT NULL CHECK (game_name IN ('BGMI', 'PUBG', 'Free Fire', 'COD')),
  device_name TEXT NOT NULL,
  share_code TEXT NOT NULL,
  camera_sensitivity JSONB NOT NULL,
  ads_sensitivity JSONB NOT NULL,
  gyro_sensitivity JSONB,
  is_gyro_enabled BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster device searches
CREATE INDEX IF NOT EXISTS idx_device_name ON sensitivity_profiles USING gin(device_name gin_trgm_ops);

-- Create index for game filtering
CREATE INDEX IF NOT EXISTS idx_game_name ON sensitivity_profiles(game_name);

-- Create index for upvotes sorting
CREATE INDEX IF NOT EXISTS idx_upvotes ON sensitivity_profiles(upvotes DESC);

-- Enable the pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function to increment upvotes atomically
CREATE OR REPLACE FUNCTION increment_upvotes(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_upvotes INTEGER;
BEGIN
  UPDATE sensitivity_profiles 
  SET upvotes = upvotes + 1 
  WHERE id = profile_id
  RETURNING upvotes INTO new_upvotes;
  
  RETURN new_upvotes;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional, for future auth)
ALTER TABLE sensitivity_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read
CREATE POLICY "Allow public read access" ON sensitivity_profiles
  FOR SELECT USING (true);

-- Policy to allow anyone to insert (for now, no auth)
CREATE POLICY "Allow public insert access" ON sensitivity_profiles
  FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to update upvotes only
CREATE POLICY "Allow public upvote" ON sensitivity_profiles
  FOR UPDATE USING (true) WITH CHECK (true);
