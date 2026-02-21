import pool from '../config/db.js';

const HotelModel = {
    findByGroupId: async (groupId) => {
        const result = await pool.query(
            'SELECT * FROM group_hotels WHERE group_id = $1 ORDER BY check_in ASC',
            [groupId]
        );
        return result.rows;
    },

    create: async (groupId, data) => {
        const { city, hotel_name, check_in, check_out, room_dbl, room_trpl, room_quad, room_quint, reservation_no } = data;
        const result = await pool.query(
            `INSERT INTO group_hotels (group_id, city, hotel_name, check_in, check_out, room_dbl, room_trpl, room_quad, room_quint, reservation_no)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [groupId, city, hotel_name, check_in || null, check_out || null,
                room_dbl || 0, room_trpl || 0, room_quad || 0, room_quint || 0, reservation_no || null]
        );
        return result.rows[0];
    },

    update: async (hotelId, data) => {
        const { city, hotel_name, check_in, check_out, room_dbl, room_trpl, room_quad, room_quint, reservation_no } = data;
        const result = await pool.query(
            `UPDATE group_hotels
             SET city = $1, hotel_name = $2, check_in = $3, check_out = $4,
                 room_dbl = $5, room_trpl = $6, room_quad = $7, room_quint = $8, reservation_no = $9
             WHERE id = $10 RETURNING *`,
            [city, hotel_name, check_in || null, check_out || null,
                room_dbl || 0, room_trpl || 0, room_quad || 0, room_quint || 0, reservation_no || null, hotelId]
        );
        return result.rows[0];
    },

    delete: async (hotelId) => {
        await pool.query('DELETE FROM group_hotels WHERE id = $1', [hotelId]);
        return { message: 'Hotel deleted successfully' };
    }
};

export default HotelModel;
