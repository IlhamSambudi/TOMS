import pool from '../config/db.js';

const GroupFlightSegmentModel = {
    // Get all segments for a group, joined with flight master data, ordered by segment_order
    findByGroupId: async (groupId) => {
        const result = await pool.query(
            `SELECT gfs.*, 
                    fm.airline, fm.flight_number, fm.origin, fm.destination, 
                    TO_CHAR(fm.departure_time, 'HH24:MI') as scheduled_etd, 
                    TO_CHAR(fm.arrival_time, 'HH24:MI') as scheduled_eta
             FROM group_flight_segments gfs
             JOIN flights fm ON gfs.flight_master_id = fm.id
             WHERE gfs.group_id = $1
             ORDER BY gfs.segment_order ASC`,
            [groupId]
        );
        return result.rows;
    },

    // Create a new flight segment for a group
    create: async (groupId, data) => {
        const { flight_master_id, flight_date, segment_order, override_etd, override_eta, remarks } = data;

        // Validate flight_master_id exists
        const flightCheck = await pool.query('SELECT id FROM flights WHERE id = $1', [flight_master_id]);
        if (flightCheck.rows.length === 0) {
            throw new Error('Flight master not found');
        }

        const result = await pool.query(
            `INSERT INTO group_flight_segments 
             (group_id, flight_master_id, flight_date, segment_order, override_etd, override_eta, remarks)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [groupId, flight_master_id, flight_date, segment_order, override_etd || null, override_eta || null, remarks || null]
        );
        return result.rows[0];
    },

    // Update a segment
    update: async (segmentId, data) => {
        const { flight_master_id, flight_date, segment_order, override_etd, override_eta, remarks } = data;
        const result = await pool.query(
            `UPDATE group_flight_segments 
             SET flight_master_id = $1, flight_date = $2, segment_order = $3,
                 override_etd = $4, override_eta = $5, remarks = $6
             WHERE id = $7 RETURNING *`,
            [flight_master_id, flight_date, segment_order, override_etd || null, override_eta || null, remarks || null, segmentId]
        );
        return result.rows[0];
    },

    // Delete a segment
    delete: async (segmentId) => {
        await pool.query('DELETE FROM group_flight_segments WHERE id = $1', [segmentId]);
        return { message: 'Flight segment deleted successfully' };
    }
};

export default GroupFlightSegmentModel;
