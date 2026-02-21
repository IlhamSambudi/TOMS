import pool from '../config/db.js';

const RawdahModel = {
    // Get all rawdah allocations across all groups with group details
    getAll: async () => {
        const result = await pool.query(
            `SELECT r.*, g.group_code, g.program_type as group_name 
             FROM group_rawdah r 
             JOIN groups g ON r.group_id = g.id 
             ORDER BY g.departure_date DESC, r.created_at DESC`
        );
        return result.rows;
    },

    // There's usually exactly 1 rawdah record per group
    getByGroup: async (groupId) => {
        const result = await pool.query(
            'SELECT * FROM group_rawdah WHERE group_id = $1',
            [groupId]
        );
        return result.rows[0] || null;
    },

    upsert: async (groupId, data) => {
        // Check if exists
        const exists = await RawdahModel.getByGroup(groupId);
        if (exists) {
            const result = await pool.query(
                `UPDATE group_rawdah
                 SET men_date = $1, men_time = $2, men_pax = $3,
                     women_date = $4, women_time = $5, women_pax = $6,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE group_id = $7
                 RETURNING *`,
                [
                    data.men_date || null, data.men_time || null, data.men_pax || null,
                    data.women_date || null, data.women_time || null, data.women_pax || null,
                    groupId
                ]
            );
            return result.rows[0];
        } else {
            const result = await pool.query(
                `INSERT INTO group_rawdah (
                    group_id, men_date, men_time, men_pax, women_date, women_time, women_pax
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    groupId,
                    data.men_date || null, data.men_time || null, data.men_pax || null,
                    data.women_date || null, data.women_time || null, data.women_pax || null
                ]
            );
            return result.rows[0];
        }
    }
};

export default RawdahModel;
