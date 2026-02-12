import pool from '../config/db.js';

export const TourLeaderModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM tour_leaders ORDER BY name ASC');
        return result.rows;
    },
    create: async (name, phone) => {
        const result = await pool.query(
            'INSERT INTO tour_leaders (name, phone) VALUES ($1, $2) RETURNING *',
            [name, phone]
        );
        return result.rows[0];
    }
};

export const MuthawifModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM muthawifs ORDER BY name ASC');
        return result.rows;
    },
    create: async (name, phone) => {
        const result = await pool.query(
            'INSERT INTO muthawifs (name, phone) VALUES ($1, $2) RETURNING *',
            [name, phone]
        );
        return result.rows[0];
    }
};
