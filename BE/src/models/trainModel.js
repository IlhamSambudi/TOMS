import pool from '../config/db.js';

const TrainModel = {
    findByGroupId: async (groupId) => {
        const result = await pool.query(
            'SELECT * FROM group_trains WHERE group_id = $1 ORDER BY train_date ASC, departure_time ASC',
            [groupId]
        );
        return result.rows;
    },

    create: async (groupId, data) => {
        const { train_date, from_station, to_station, departure_time, total_hajj, remarks } = data;
        const result = await pool.query(
            `INSERT INTO group_trains (group_id, train_date, from_station, to_station, departure_time, total_hajj, remarks)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [groupId, train_date || null, from_station || null, to_station || null,
                departure_time || null, total_hajj || null, remarks || null]
        );
        return result.rows[0];
    },

    update: async (trainId, data) => {
        const { train_date, from_station, to_station, departure_time, total_hajj, remarks } = data;
        const result = await pool.query(
            `UPDATE group_trains
             SET train_date = $1, from_station = $2, to_station = $3,
                 departure_time = $4, total_hajj = $5, remarks = $6
             WHERE id = $7 RETURNING *`,
            [train_date || null, from_station || null, to_station || null,
            departure_time || null, total_hajj || null, remarks || null, trainId]
        );
        return result.rows[0];
    },

    delete: async (trainId) => {
        await pool.query('DELETE FROM group_trains WHERE id = $1', [trainId]);
        return { message: 'Train reservation deleted successfully' };
    }
};

export default TrainModel;
