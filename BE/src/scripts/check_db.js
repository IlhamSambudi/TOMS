import pool from '../config/db.js';

const check = async () => {
    try {
        console.log('Checking database...');
        // await pool.query('SET search_path TO umroh_ops'); // schema might be public or umroh_ops

        const res = await pool.query(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_schema IN ('public', 'umroh_ops')
        `);

        console.log('Tables found:', res.rows.map(r => `${r.table_schema}.${r.table_name}`));

        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'group_flight_segments'
        `);

        console.log('Columns in group_flight_segments:', columns.rows);

        const groupFlightsColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'group_flights'
        `);

        console.log('Columns in group_flights:', groupFlightsColumns.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error checking DB:', error);
        process.exit(1);
    }
};

check();
