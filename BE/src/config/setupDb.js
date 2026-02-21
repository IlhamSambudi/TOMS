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
            status VARCHAR(20) DEFAULT 'PREPARATION',
            handling_company_id INTEGER, 
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (handling_company_id) REFERENCES handling_companies(id) ON DELETE SET NULL
        )`,
        `ALTER TABLE groups ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PREPARATION'`,
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
        `CREATE TABLE IF NOT EXISTS transports (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            provider_name VARCHAR(255),
            vehicle_type VARCHAR(100),
            route VARCHAR(255),
            journey_date TIMESTAMP,
            departure_time TIME,
            pickup_location VARCHAR(255),
            drop_location VARCHAR(255),
            pax_count INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='umroh_ops' AND table_name='transports' AND column_name='pickup_location') THEN
                ALTER TABLE transports ADD COLUMN pickup_location VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='umroh_ops' AND table_name='transports' AND column_name='drop_location') THEN
                ALTER TABLE transports ADD COLUMN drop_location VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='umroh_ops' AND table_name='transports' AND column_name='pax_count') THEN
                ALTER TABLE transports ADD COLUMN pax_count INTEGER;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='umroh_ops' AND table_name='transports' AND column_name='departure_time') THEN
                ALTER TABLE transports ADD COLUMN departure_time TIME;
            END IF;
        END $$`,
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
            role VARCHAR(50),
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS group_hotels (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            city VARCHAR(100) NOT NULL,
            hotel_name VARCHAR(255) NOT NULL,
            check_in DATE,
            check_out DATE,
            room_dbl INTEGER DEFAULT 0,
            room_trpl INTEGER DEFAULT 0,
            room_quad INTEGER DEFAULT 0,
            room_quint INTEGER DEFAULT 0,
            reservation_no VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS group_trains (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            train_date DATE,
            from_station VARCHAR(255),
            to_station VARCHAR(255),
            departure_time TIME,
            total_hajj INTEGER,
            remarks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS group_rawdah (
            id SERIAL PRIMARY KEY,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            men_date DATE,
            men_time VARCHAR(20),
            men_pax INTEGER,
            women_date DATE,
            women_time VARCHAR(20),
            women_pax INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
