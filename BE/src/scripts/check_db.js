import pool from '../config/db.js';

const check = async () => {
    try {
        console.log('Checking database...');
        await pool.query('SET search_path TO umroh_ops');

        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'umroh_ops'
        `);

        console.log('Tables in umroh_ops:', res.rows.map(r => r.table_name));

        const groups = await pool.query('SELECT count(*) FROM groups');
        console.log('Groups count:', groups.rows[0].count);

        process.exit(0);
    } catch (error) {
        console.error('Error checking DB:', error);
        process.exit(1);
    }
};

check();
