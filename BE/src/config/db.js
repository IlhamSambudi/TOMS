import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO umroh_ops');
});

// Auto-create schema on connection
const initDb = async () => {
    try {
        const client = await pool.connect();
        try {
            await client.query('CREATE SCHEMA IF NOT EXISTS umroh_ops');
            await client.query('SET search_path TO umroh_ops');
            console.log('Database connected and schema umroh_ops ensured.');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database initialization error:', err);
    }
};

initDb();

export const query = (text, params) => pool.query(text, params);
export default pool;
