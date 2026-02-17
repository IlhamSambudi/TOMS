-- Set schema
SET search_path TO umroh_ops;

-- Truncate all tables
TRUNCATE TABLE 
    handling_companies,
    groups,
    transports,
    group_assignments,
    tour_leaders,
    muthawifs,
    flight_master,
    group_flight_segments,
    group_flights,
    flights
RESTART IDENTITY CASCADE;
