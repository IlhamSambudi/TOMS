import pool from './db.js';
import createTables from './setupDb.js';

const seedData = async () => {
    try {
        // 1. Reset Database (Re-create tables)
        // efficient way to clear data is to drop schema and recreate, but let's just truncate for now or rely on createTables if not exists
        // actually, let's keep it simple: just insert if empty or maybe clear specific tables.
        // simpler for "Load all data" request: truncate everything first.
        const client = await pool.connect();
        try {
            await client.query('SET search_path TO umroh_ops');

            console.log('Resetting database schema...');
            await client.query('DROP SCHEMA IF EXISTS umroh_ops CASCADE');
            await client.query('CREATE SCHEMA umroh_ops');
            await client.query('SET search_path TO umroh_ops');

            // We need to run createTables to ensure tables exist
            // But createTables uses its own connection, so we might want to just run the queries here or rely on the fact that we just dropped the schema.
            // Actually, createTables is an async function that uses pool.connect().
            // Let's release this client, run createTables, then get a new client?
            // Or better: just copy table creation logic or trust createTables.
            // Issue: createTables uses a separate client.
        } finally {
            client.release();
        }

        console.log('Re-creating tables...');
        await createTables();

        const client2 = await pool.connect();
        try {
            await client2.query('BEGIN');
            await client2.query('SET search_path TO umroh_ops');

            console.log('Seeding Handling Companies...');
            const companies = await client2.query(`
        INSERT INTO handling_companies (name, contact_person, phone, email, address) VALUES
        ('Ezy Handling', 'Ahmad Rizki', '+628123456789', 'ahmad@ezy.com', 'Jeddah, KSA'),
        ('Amro Services', 'Khalid Bin Walid', '+966501234567', 'khalid@amro.com', 'Makkah, KSA')
        RETURNING id
      `);
            const companyIds = companies.rows.map(r => r.id);

            console.log('Seeding Flights...');
            const flights = await client.query(`
        INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time) VALUES
        ('Saudia', 'SV819', 'JKT', 'JED', '2023-12-01 10:00:00', '2023-12-01 16:00:00'),
        ('Garuda', 'GA980', 'JKT', 'JED', '2023-12-05 11:30:00', '2023-12-05 17:30:00'),
        ('Emirates', 'EK356', 'JKT', 'DXB', '2023-12-10 00:40:00', '2023-12-10 05:30:00')
        RETURNING id
      `);
            const flightIds = flights.rows.map(r => r.id);

            console.log('Seeding Staff...');
            const tourLeaders = await client.query(`
        INSERT INTO tour_leaders (name, phone) VALUES
        ('Ustadz Fulan', '+62811111111'),
        ('H. Abdullah', '+62822222222')
        RETURNING id
      `);

            const muthawifs = await client.query(`
        INSERT INTO muthawifs (name, phone) VALUES
        ('Syeikh Ali', '+96655555555'),
        ('Ustadz Hamzah', '+96654444444')
        RETURNING id
      `);

            console.log('Seeding Groups...');
            const groups = await client.query(`
        INSERT INTO groups (group_code, program_type, departure_date, total_pax, handling_company_id, notes) VALUES
        ('GRP-DEC-001', 'Umroh 9 Days', '2023-12-01', 45, $1, 'VVIP Group'),
        ('GRP-DEC-002', 'Umroh 12 Days', '2023-12-05', 30, $2, 'Family Group'),
        ('GRP-JAN-003', 'Umroh Plus Turkey', '2024-01-15', 25, $1, 'Corporate Group')
        RETURNING id
      `, [companyIds[0], companyIds[1]]);
            const groupIds = groups.rows.map(r => r.id);

            console.log('Linking Data...');
            // Flight for Group 1
            await client.query('INSERT INTO group_flights (group_id, flight_id) VALUES ($1, $2)', [groupIds[0], flightIds[0]]);

            // Transport for Group 1
            await client.query(`
        INSERT INTO transports (group_id, provider_name, vehicle_type, route, journey_date) VALUES
        ($1, 'Saptco', 'Bus VIP 50s', 'JED APT - HTL MAK', '2023-12-01 17:00:00'),
        ($1, 'Saptco', 'Bus VIP 50s', 'HTL MAK - HTL MED', '2023-12-05 08:00:00')
      `, [groupIds[0]]);

            // Assignments for Group 1
            await client.query('INSERT INTO group_assignments (group_id, tour_leader_id, role) VALUES ($1, $2, $3)', [groupIds[0], tourLeaders.rows[0].id, 'TOUR_LEADER']);
            await client.query('INSERT INTO group_assignments (group_id, muthawif_id, role) VALUES ($1, $2, $3)', [groupIds[0], muthawifs.rows[0].id, 'MUTHAWIF']);

            await client.query('COMMIT');
            console.log('Database seeded successfully!');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        pool.end();
    }
};

seedData();
