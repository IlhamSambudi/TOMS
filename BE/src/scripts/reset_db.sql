-- ⚠️  WARNING: THIS SCRIPT DELETES ALL DATA FROM ALL TABLES ⚠️
-- Only run this manually when you intentionally want to reset the database.
-- DO NOT run this in production. DO NOT automate this script.
-- 
-- To run: psql -d your_database -f reset_db.sql

-- Set schema
SET search_path TO umroh_ops;

-- Truncate all tables (preserves table structure, deletes all rows)
TRUNCATE TABLE 
    group_assignments,
    group_flight_segments,
    transports,
    groups,
    tour_leaders,
    muthawifs,
    handling_companies,
    flights
RESTART IDENTITY CASCADE;
