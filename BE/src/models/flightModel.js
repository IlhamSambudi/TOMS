import pool from '../config/db.js';

const FlightModel = {
    findAll: async () => {
        const result = await pool.query(
            `SELECT id, airline, flight_number, origin, destination, 
                    TO_CHAR(departure_time, 'HH24:MI') as scheduled_etd, 
                    TO_CHAR(arrival_time, 'HH24:MI') as scheduled_eta, 
                    created_at 
             FROM flights 
             ORDER BY created_at DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(
            `SELECT id, airline, flight_number, origin, destination, 
                    TO_CHAR(departure_time, 'HH24:MI') as scheduled_etd, 
                    TO_CHAR(arrival_time, 'HH24:MI') as scheduled_eta, 
                    created_at 
             FROM flights 
             WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    create: async (data) => {
        const { airline, flight_number, origin, destination, scheduled_etd, scheduled_eta } = data;

        // Ensure time strings are formatted as Timestamps for the DB (using dummy date)
        const formatTime = (t) => t && t.length === 5 ? `1970-01-01 ${t}:00` : t;

        const result = await pool.query(
            `INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time)
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, airline, flight_number, origin, destination, 
                       TO_CHAR(departure_time, 'HH24:MI') as scheduled_etd, 
                       TO_CHAR(arrival_time, 'HH24:MI') as scheduled_eta, created_at`,
            [airline, flight_number, origin, destination, formatTime(scheduled_etd), formatTime(scheduled_eta)]
        );
        return result.rows[0];
    },

    update: async (id, data) => {
        const { airline, flight_number, origin, destination, scheduled_etd, scheduled_eta } = data;

        const formatTime = (t) => t && t.length === 5 ? `1970-01-01 ${t}:00` : t;

        const result = await pool.query(
            `UPDATE flights 
             SET airline = $1, flight_number = $2, origin = $3, destination = $4, 
                 departure_time = $5, arrival_time = $6
             WHERE id = $7 
             RETURNING id, airline, flight_number, origin, destination, 
                       TO_CHAR(departure_time, 'HH24:MI') as scheduled_etd, 
                       TO_CHAR(arrival_time, 'HH24:MI') as scheduled_eta, created_at`,
            [airline, flight_number, origin, destination, formatTime(scheduled_etd), formatTime(scheduled_eta), id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM flights WHERE id = $1', [id]);
        return { message: 'Flight deleted successfully' };
    }
};

export default FlightModel;
