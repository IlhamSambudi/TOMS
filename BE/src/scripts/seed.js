import pool from '../config/db.js';

const seed = async () => {
    try {
        console.log('Seeding data...');
        await pool.query('SET search_path TO umroh_ops');

        // 1. Handling Companies
        console.log('Seeding handling companies...');
        const handlingCompanies = [
            { name: 'Ebaa Al-Saudia', phone: '+966 55 123 4567', email: 'contact@ebaa.com' },
            { name: 'Rawaf Mina', phone: '+966 50 987 6543', email: 'info@rawaf.com' }
        ];

        for (const company of handlingCompanies) {
            await pool.query(
                'INSERT INTO handling_companies (name, phone, email) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [company.name, company.phone, company.email]
            );
        }

        // Get Handling IDs
        const handlingRes = await pool.query('SELECT * FROM handling_companies');
        const ebaa = handlingRes.rows.find(c => c.name === 'Ebaa Al-Saudia');
        const rawaf = handlingRes.rows.find(c => c.name === 'Rawaf Mina');

        // 2. Groups
        console.log('Seeding groups...');
        const groups = [
            { group_code: 'GRP-FEB-001', program_type: 'Umroh 9 Days', departure_date: '2025-02-15', total_pax: 45, handling_company_id: ebaa ? ebaa.id : null, notes: 'VIP Group' },
            { group_code: 'GRP-FEB-002', program_type: 'Umroh 12 Days', departure_date: '2025-02-20', total_pax: 30, handling_company_id: rawaf ? rawaf.id : null, notes: 'Standard Group' },
            { group_code: 'GRP-MAR-001', program_type: 'Umroh Plus Turkey', departure_date: '2025-03-05', total_pax: 25, handling_company_id: ebaa ? ebaa.id : null, notes: 'Includes Istanbul tour' }
        ];

        for (const group of groups) {
            await pool.query(
                `INSERT INTO groups (group_code, program_type, departure_date, total_pax, handling_company_id, notes) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 ON CONFLICT DO NOTHING`,
                [group.group_code, group.program_type, group.departure_date, group.total_pax, group.handling_company_id, group.notes]
            );
        }

        // Get Group IDs for associations
        const groupsRes = await pool.query('SELECT * FROM groups');
        const group1 = groupsRes.rows[0];

        // 3. Flights
        console.log('Seeding flights...');
        const flights = [
            { airline: 'Saudia', flight_number: 'SV819', origin: 'CGK', destination: 'JED', departure_time: '2025-02-15 11:00:00', arrival_time: '2025-02-15 17:00:00' },
            { airline: 'Garuda', flight_number: 'GA980', origin: 'CGK', destination: 'JED', departure_time: '2025-02-20 12:00:00', arrival_time: '2025-02-20 18:30:00' }
        ];

        for (const flight of flights) {
            const flightRes = await pool.query(
                `INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [flight.airline, flight.flight_number, flight.origin, flight.destination, flight.departure_time, flight.arrival_time]
            );

            // Link first flight to first group
            if (group1 && flight.flight_number === 'SV819') {
                await pool.query(
                    'INSERT INTO group_flights (group_id, flight_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [group1.id, flightRes.rows[0].id]
                );
            }
        }

        // 4. Transport
        console.log('Seeding transport...');
        if (group1) {
            await pool.query(
                `INSERT INTO transports (group_id, provider_name, vehicle_type, route, journey_date) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [group1.id, 'Saptco', 'Bus 50 Seater', 'Jeddah to Makkah', '2025-02-15 18:00:00']
            );
        }

        // 5. Staff
        console.log('Seeding staff...');
        const staff = [
            { type: 'tour_leaders', name: 'Ustadz Ahmad', phone: '08123456789' },
            { type: 'muthawifs', name: 'Muthawif Ali', phone: '+966 54 321 0987' }
        ];

        for (const s of staff) {
            const res = await pool.query(
                `INSERT INTO ${s.type} (name, phone) VALUES ($1, $2) RETURNING id`,
                [s.name, s.phone]
            );

            // Assign to first group
            if (group1) {
                if (s.type === 'tour_leaders') {
                    await pool.query(
                        'INSERT INTO group_assignments (group_id, tour_leader_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                        [group1.id, res.rows[0].id, 'TOUR_LEADER']
                    );
                } else {
                    await pool.query(
                        'INSERT INTO group_assignments (group_id, muthawif_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                        [group1.id, res.rows[0].id, 'MUTHAWIF']
                    );
                }
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
