import pool from './db.js';
import createTables from './setupDb.js';

const seedData = async () => {
    try {
        // Ensure tables exist first (safe, non-destructive)
        console.log('Ensuring tables exist...');
        await createTables();

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('SET search_path TO umroh_ops');

            // Check if data already exists to avoid duplicate seeding
            const existing = await client.query('SELECT COUNT(*) FROM groups');
            if (parseInt(existing.rows[0].count) > 0) {
                console.log('Database already has data. Skipping seed to prevent data loss.');
                console.log('To force re-seed, manually clear the tables first.');
                await client.query('ROLLBACK');
                return;
            }

            console.log('Seeding Handling Companies...');
            const companies = await client.query(`
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
            // Transport for Group 1
            await client.query(`
                INSERT INTO transports (group_id, provider_name, vehicle_type, route, journey_date) VALUES
                ($1, 'Saptco', 'Bus VIP 50s', 'JED APT - HTL MAK', '2023-12-01 17:00:00'),
                ($1, 'Saptco', 'Bus VIP 50s', 'HTL MAK - HTL MED', '2023-12-05 08:00:00')
            `, [groupIds[0]]);

            // Assignments for Group 1
            await client.query(
                'INSERT INTO group_assignments (group_id, tour_leader_id, role) VALUES ($1, $2, $3)',
                [groupIds[0], tourLeaders.rows[0].id, 'TOUR_LEADER']
            );
            await client.query(
                'INSERT INTO group_assignments (group_id, muthawif_id, role) VALUES ($1, $2, $3)',
                [groupIds[0], muthawifs.rows[0].id, 'MUTHAWIF']
            );

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
