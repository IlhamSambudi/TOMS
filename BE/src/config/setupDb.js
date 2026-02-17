import pool from './db.js';

const createTables = async () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS handling_companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            contact_person VARCHAR(255),
            phone VARCHAR(50),
            email VARCHAR(255),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS groups (
            id SERIAL PRIMARY KEY,
            group_code VARCHAR(50) NOT NULL UNIQUE,
            program_type VARCHAR(50),
            departure_date DATE,
            total_pax INTEGER,
            handling_company_id INTEGER, 
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (handling_company_id) REFERENCES handling_companies(id) ON DELETE SET NULL
        )`,
        `CREATE TABLE IF NOT EXISTS flights (
            id SERIAL PRIMARY KEY,
            airline VARCHAR(100),
            flight_number VARCHAR(20),
            origin VARCHAR(50),
            destination VARCHAR(50),
            departure_time TIMESTAMP,
            arrival_time TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        /* 
        `CREATE TABLE IF NOT EXISTS group_flights (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            flight_id INTEGER REFERENCES flights(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        */
        `DROP TABLE IF EXISTS group_flight_segments CASCADE`,
        `CREATE TABLE IF NOT EXISTS group_flight_segments (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            flight_master_id INTEGER REFERENCES flights(id) ON DELETE RESTRICT,
            flight_date DATE NOT NULL,
            segment_order INTEGER NOT NULL,
            override_etd TIME,
            override_eta TIME,
            remarks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (group_id, segment_order)
        )`,
        `DROP TABLE IF EXISTS transports CASCADE`,
        `CREATE TABLE IF NOT EXISTS transports (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            provider_name VARCHAR(255),
            vehicle_type VARCHAR(100),
            route VARCHAR(255),
            journey_date TIMESTAMP,
            pickup_location VARCHAR(255),
            drop_location VARCHAR(255),
            pax_count INTEGER,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS tour_leaders (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS muthawifs (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS group_assignments (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            tour_leader_id INTEGER REFERENCES tour_leaders(id),
            muthawif_id INTEGER REFERENCES muthawifs(id),
            role VARCHAR(50), -- 'TOUR_LEADER' or 'MUTHAWIF'
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Ensure schema exists again just in case
            await client.query('CREATE SCHEMA IF NOT EXISTS umroh_ops');
            await client.query('SET search_path TO umroh_ops');

            for (const query of queries) {
                await client.query(query);
            }
            await client.query('COMMIT');
            console.log('Tables created successfully');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

export default createTables;
