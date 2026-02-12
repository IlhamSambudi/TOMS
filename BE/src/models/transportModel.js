import pool from '../config/db.js';

const TransportModel = {
    findByGroupId: async (groupId) => {
        const result = await pool.query(
            'SELECT * FROM transports WHERE group_id = $1 ORDER BY journey_date ASC',
            [groupId]
        );
        return result.rows;
    },

    create: async (groupId, data) => {
        const { provider_name, vehicle_type, route, journey_date, pickup_location, drop_location, pax_count, notes } = data;
        const result = await pool.query(
            `INSERT INTO transports (group_id, provider_name, vehicle_type, route, journey_date, pickup_location, drop_location, pax_count, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [groupId, provider_name, vehicle_type, route, journey_date, pickup_location || null, drop_location || null, pax_count || null, notes || null]
        );
        return result.rows[0];
    },

    update: async (transportId, data) => {
        const { provider_name, vehicle_type, route, journey_date, pickup_location, drop_location, pax_count, notes } = data;
        const result = await pool.query(
            `UPDATE transports 
             SET provider_name = $1, vehicle_type = $2, route = $3, journey_date = $4,
                 pickup_location = $5, drop_location = $6, pax_count = $7, notes = $8
             WHERE id = $9 RETURNING *`,
            [provider_name, vehicle_type, route, journey_date, pickup_location || null, drop_location || null, pax_count || null, notes || null, transportId]
        );
        return result.rows[0];
    },

    delete: async (transportId) => {
        await pool.query('DELETE FROM transports WHERE id = $1', [transportId]);
        return { message: 'Transport deleted successfully' };
    }
};

export default TransportModel;
