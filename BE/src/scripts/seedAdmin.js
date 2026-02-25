import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const seedAdmin = async () => {
    try {
        const client = await pool.connect();
        try {
            await client.query('SET search_path TO umroh_ops');

            // Create users table if not exists
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(100) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    role VARCHAR(50) DEFAULT 'operator',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Check if admin already exists
            const existing = await client.query(
                'SELECT id FROM users WHERE username = $1',
                ['admin']
            );

            if (existing.rows.length > 0) {
                console.log('✓ Admin user already exists, skipping seed.');
                return;
            }

            const password_hash = await bcrypt.hash('admin123', 10);
            await client.query(
                `INSERT INTO users (username, password_hash, full_name, role)
                 VALUES ($1, $2, $3, $4)`,
                ['admin', password_hash, 'Administrator', 'admin']
            );

            console.log('✓ Admin user seeded successfully!');
            console.log('  Username: admin');
            console.log('  Password: admin123');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        process.exit();
    }
};

seedAdmin();
