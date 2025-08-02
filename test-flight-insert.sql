-- Test Flight Insert Script
-- This script can be run directly in your Supabase SQL editor or any PostgreSQL client

-- 1. First, let's check if the flights table exists and see its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'flights' 
ORDER BY ordinal_position;

-- 2. Insert a test flight
INSERT INTO flights (
    flight_number,
    airline,
    origin,
    destination,
    departure_time,
    arrival_time,
    duration,
    price,
    seats_available,
    total_seats,
    cabin_class,
    created_at,
    updated_at
) VALUES (
    'AI101',
    'Air India',
    'Mumbai (BOM)',
    'Delhi (DEL)',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
    120, -- 2 hours in minutes
    8500,
    222,
    222,
    'Economy',
    NOW(),
    NOW()
) RETURNING *;

-- 3. Insert another test flight
INSERT INTO flights (
    flight_number,
    airline,
    origin,
    destination,
    departure_time,
    arrival_time,
    duration,
    price,
    seats_available,
    total_seats,
    cabin_class,
    created_at,
    updated_at
) VALUES (
    '6E123',
    'IndiGo',
    'Delhi (DEL)',
    'Bangalore (BLR)',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '2.5 hours',
    150, -- 2.5 hours in minutes
    6500,
    180,
    180,
    'Economy',
    NOW(),
    NOW()
) RETURNING *;

-- 4. Insert a business class flight
INSERT INTO flights (
    flight_number,
    airline,
    origin,
    destination,
    departure_time,
    arrival_time,
    duration,
    price,
    seats_available,
    total_seats,
    cabin_class,
    created_at,
    updated_at
) VALUES (
    'UK123',
    'Vistara',
    'Mumbai (BOM)',
    'Bangalore (BLR)',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '1.5 hours',
    90, -- 1.5 hours in minutes
    12000,
    20,
    20,
    'Business',
    NOW(),
    NOW()
) RETURNING *;

-- 5. Query all flights to verify the inserts
SELECT 
    id,
    flight_number,
    airline,
    origin,
    destination,
    departure_time,
    arrival_time,
    duration,
    price,
    seats_available,
    total_seats,
    cabin_class,
    created_at
FROM flights 
ORDER BY created_at DESC;

-- 6. Search flights by origin and destination
SELECT * FROM flights 
WHERE origin = 'Mumbai (BOM)' 
AND destination = 'Delhi (DEL)';

-- 7. Search flights by date (tomorrow)
SELECT * FROM flights 
WHERE DATE(departure_time) = DATE(NOW() + INTERVAL '1 day');

-- 8. Get flight statistics
SELECT 
    COUNT(*) as total_flights,
    COUNT(DISTINCT airline) as unique_airlines,
    COUNT(DISTINCT origin) as unique_origins,
    COUNT(DISTINCT destination) as unique_destinations,
    AVG(price) as average_price,
    SUM(seats_available) as total_available_seats
FROM flights; 