import pool from '../config/db.js';

const HandlingCompanyModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM handling_companies ORDER BY name ASC');
        return result.rows;
    },
    create: async (data) => {
        const { name, contact_person, phone, email, address } = data;
        const result = await pool.query(
            `INSERT INTO handling_companies (name, contact_person, phone, email, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, contact_person, phone, email, address]
        );
        return result.rows[0];
    }
};

export default HandlingCompanyModel;
