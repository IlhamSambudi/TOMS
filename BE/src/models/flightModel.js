import pool from '../config/db.js';

const FlightModel = {
    findAll: async () => {
        const result = await pool.query(
            'SELECT * FROM flight_master ORDER BY created_at DESC'
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(
            'SELECT * FROM flight_master WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    create: async (data) => {
        const { airline, flight_number, origin, destination, scheduled_etd, scheduled_eta } = data;
        const result = await pool.query(
            `INSERT INTO flight_master (airline, flight_number, origin, destination, scheduled_etd, scheduled_eta)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [airline, flight_number, origin, destination, scheduled_etd, scheduled_eta]
        );
        return result.rows[0];
    },

    update: async (id, data) => {
        const { airline, flight_number, origin, destination, scheduled_etd, scheduled_eta } = data;
        const result = await pool.query(
            `UPDATE flight_master 
             SET airline = $1, flight_number = $2, origin = $3, destination = $4, 
                 scheduled_etd = $5, scheduled_eta = $6
             WHERE id = $7 RETURNING *`,
            [airline, flight_number, origin, destination, scheduled_etd, scheduled_eta, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM flight_master WHERE id = $1', [id]);
        return { message: 'Flight deleted successfully' };
    }
};

export default FlightModel;
