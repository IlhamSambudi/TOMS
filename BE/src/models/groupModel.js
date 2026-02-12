import pool from '../config/db.js';

const GroupModel = {
    findAll: async () => {
        const result = await pool.query(`
            SELECT g.*, h.name as handling_company_name 
            FROM groups g 
            LEFT JOIN handling_companies h ON g.handling_company_id = h.id 
            ORDER BY g.created_at DESC
        `);
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(`
            SELECT g.*, h.name as handling_company_name 
            FROM groups g 
            LEFT JOIN handling_companies h ON g.handling_company_id = h.id 
            WHERE g.id = $1
        `, [id]);
        return result.rows[0];
    },

    // Full itinerary: group + flight segments ordered by segment_order
    findFullItinerary: async (id) => {
        const group = await pool.query(`
            SELECT g.*, h.name as handling_company_name 
            FROM groups g 
            LEFT JOIN handling_companies h ON g.handling_company_id = h.id 
            WHERE g.id = $1
        `, [id]);

        if (!group.rows[0]) return null;

        const segments = await pool.query(`
            SELECT gfs.*, 
                   fm.airline, fm.flight_number, fm.origin, fm.destination,
                   fm.scheduled_etd, fm.scheduled_eta
            FROM group_flight_segments gfs
            JOIN flight_master fm ON gfs.flight_master_id = fm.id
            WHERE gfs.group_id = $1
            ORDER BY gfs.segment_order ASC
        `, [id]);

        const transports = await pool.query(
            'SELECT * FROM transports WHERE group_id = $1 ORDER BY journey_date ASC',
            [id]
        );

        return {
            ...group.rows[0],
            flight_segments: segments.rows,
            transports: transports.rows
        };
    },

    create: async (data) => {
        const { group_code, program_type, departure_date, total_pax, handling_company_id, notes } = data;
        const result = await pool.query(
            `INSERT INTO groups (group_code, program_type, departure_date, total_pax, handling_company_id, notes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [group_code, program_type, departure_date, total_pax, handling_company_id, notes]
        );
        return result.rows[0];
    },

    update: async (id, data) => {
        const { group_code, program_type, departure_date, total_pax, handling_company_id, notes } = data;
        const result = await pool.query(
            `UPDATE groups SET group_code = $1, program_type = $2, departure_date = $3, 
                              total_pax = $4, handling_company_id = $5, notes = $6
             WHERE id = $7 RETURNING *`,
            [group_code, program_type, departure_date, total_pax, handling_company_id, notes, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM groups WHERE id = $1', [id]);
        return { message: 'Group deleted successfully' };
    }
};

export default GroupModel;
