import pool from '../config/db.js';

const AuthModel = {
    findByUsername: async (username) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    },

    createUser: async ({ username, password_hash, full_name, role = 'operator' }) => {
        const result = await pool.query(
            `INSERT INTO users (username, password_hash, full_name, role)
             VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, role, created_at`,
            [username, password_hash, full_name, role]
        );
        return result.rows[0];
    },
};

export default AuthModel;
