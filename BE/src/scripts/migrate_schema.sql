-- TOMS Schema Migration: Flight Schema Alignment
-- Run this script against the umroh_ops schema

SET search_path TO umroh_ops;

-- 1. Rename flight columns to match new schema
ALTER TABLE flights RENAME COLUMN departure_time TO scheduled_etd;
ALTER TABLE flights RENAME COLUMN arrival_time TO scheduled_eta;

-- 2. Drop old group_flights table
DROP TABLE IF EXISTS group_flights CASCADE;

-- 3. Create group_flight_segments table
CREATE TABLE IF NOT EXISTS group_flight_segments (
  id SERIAL PRIMARY KEY,
  group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  flight_master_id INT NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  flight_date DATE NOT NULL,
  segment_order INT NOT NULL,
  override_etd TIME,
  override_eta TIME,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (group_id, segment_order)
);

-- 4. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_gfs_group_id ON group_flight_segments(group_id);
CREATE INDEX IF NOT EXISTS idx_gfs_flight_master_id ON group_flight_segments(flight_master_id);
