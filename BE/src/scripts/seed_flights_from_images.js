import pool from '../config/db.js';

const flightsData = [
    // SAUDIA AIRLINES (SV)
    { airline: 'Saudia Airlines', flight_number: 'SV819', origin: 'CGK', destination: 'JED', etd: '19:05', eta: '01:00 (+1)' },
    { airline: 'Saudia Airlines', flight_number: 'SV265', origin: 'JED', destination: 'IST', etd: '06:35', eta: '10:40' },
    { airline: 'Saudia Airlines', flight_number: 'SV266', origin: 'IST', destination: 'JED', etd: '11:35', eta: '15:25' },
    { airline: 'Saudia Airlines', flight_number: 'SV820', origin: 'MED', destination: 'CGK', etd: '16:40', eta: '06:20 (+1)' },
    { airline: 'Saudia Airlines', flight_number: 'SV817', origin: 'CGK', destination: 'JED', etd: '10:00', eta: '15:55' },
    { airline: 'Saudia Airlines', flight_number: 'SV261', origin: 'JED', destination: 'IST', etd: '17:05', eta: '21:10' },
    { airline: 'Saudia Airlines', flight_number: 'SV260', origin: 'IST', destination: 'JED', etd: '22:25', eta: '02:15 (+1)' },
    { airline: 'Saudia Airlines', flight_number: 'SV826', origin: 'JED', destination: 'CGK', etd: '09:00', eta: '22:45' },
    { airline: 'Saudia Airlines', flight_number: 'SV821', origin: 'CGK', destination: 'MED', etd: '07:50', eta: '14:00' },
    { airline: 'Saudia Airlines', flight_number: 'SV818', origin: 'JED', destination: 'CGK', etd: '03:35', eta: '17:20' },
    { airline: 'Saudia Airlines', flight_number: 'SV215', origin: 'JED', destination: 'AMS', etd: '08:40', eta: '13:05' },
    { airline: 'Saudia Airlines', flight_number: 'SV214', origin: 'AMS', destination: 'JED', etd: '15:20', eta: '23:05' },

    // GARUDA INDONESIA (GA)
    { airline: 'Garuda Indonesia', flight_number: 'GA305', origin: 'SUB', destination: 'CGK', etd: '07:05', eta: '08:40' },
    { airline: 'Garuda Indonesia', flight_number: 'GA980', origin: 'CGK', destination: 'JED', etd: '11:25', eta: '17:30' },
    { airline: 'Garuda Indonesia', flight_number: 'GA981', origin: 'JED', destination: 'CGK', etd: '19:40', eta: '09:25 (+1)' },
    { airline: 'Garuda Indonesia', flight_number: 'GA312', origin: 'CGK', destination: 'SUB', etd: '12:05', eta: '13:45' },
    { airline: 'Garuda Indonesia', flight_number: 'GA313', origin: 'SUB', destination: 'CGK', etd: '18:00', eta: '19:35' },
    { airline: 'Garuda Indonesia', flight_number: 'GA990', origin: 'CGK', destination: 'JED', etd: '08:30', eta: '14:35' },
    { airline: 'Garuda Indonesia', flight_number: 'GA991', origin: 'JED', destination: 'CGK', etd: '16:35', eta: '06:20 (+1)' },
    { airline: 'Garuda Indonesia', flight_number: 'GA322', origin: 'CGK', destination: 'SUB', etd: '08:45', eta: '10:45' },
    { airline: 'Garuda Indonesia', flight_number: 'GA301', origin: 'SUB', destination: 'CGK', etd: '05:10', eta: '06:45' },
    { airline: 'Garuda Indonesia', flight_number: 'GA968', origin: 'CGK', destination: 'MED', etd: '09:15', eta: '15:05' },

    // EMIRATES (EK)
    { airline: 'Emirates', flight_number: 'EK359', origin: 'CGK', destination: 'DXB', etd: '00:15', eta: '05:30' },
    { airline: 'Emirates', flight_number: 'EK803', origin: 'DXB', destination: 'JED', etd: '15:45', eta: '18:00' },
    { airline: 'Emirates', flight_number: 'EK802', origin: 'JED', destination: 'DXB', etd: '04:15', eta: '08:10' },
    { airline: 'Emirates', flight_number: 'EK358', origin: 'DXB', destination: 'CGK', etd: '10:55', eta: '22:10' },
    { airline: 'Emirates', flight_number: 'EK357', origin: 'CGK', destination: 'DXB', etd: '17:45', eta: '23:00' },
    { airline: 'Emirates', flight_number: 'EK801', origin: 'DXB', destination: 'JED', etd: '00:15', eta: '02:25' },
    { airline: 'Emirates', flight_number: 'EK806', origin: 'JED', destination: 'DXB', etd: '11:15', eta: '15:00' },
    { airline: 'Emirates', flight_number: 'EK356', origin: 'DXB', destination: 'CGK', etd: '04:25', eta: '15:40' },

    // QATAR AIRWAYS (QR)
    { airline: 'Qatar Airways', flight_number: 'QR959', origin: 'CGK', destination: 'DOH', etd: '08:45', eta: '13:15' },
    { airline: 'Qatar Airways', flight_number: 'QR1186', origin: 'DOH', destination: 'JED', etd: '15:25', eta: '18:00' },
    { airline: 'Qatar Airways', flight_number: 'QR1183', origin: 'JED', destination: 'DOH', etd: '04:10', eta: '06:20' },
    { airline: 'Qatar Airways', flight_number: 'QR954', origin: 'DOH', destination: 'CGK', etd: '08:45', eta: '21:25' },

    // MALAYSIA AIRLINES (MH)
    { airline: 'Malaysia Airlines', flight_number: 'MH870', origin: 'SUB', destination: 'KUL', etd: '10:00', eta: '13:40' },
    { airline: 'Malaysia Airlines', flight_number: 'MH156', origin: 'KUL', destination: 'JED', etd: '19:00', eta: '23:40' },
    { airline: 'Malaysia Airlines', flight_number: 'MH153', origin: 'MED', destination: 'KUL', etd: '17:20', eta: '07:50 (+1)' },
    { airline: 'Malaysia Airlines', flight_number: 'MH873', origin: 'KUL', destination: 'SUB', etd: '13:15', eta: '14:50' },
];

const seedFlights = async () => {
    try {
        console.log('Starting custom flight data import...');
        await pool.query('SET search_path TO umroh_ops');

        // Clear existing flights first (just in case)
        await pool.query('TRUNCATE TABLE flights CASCADE');

        let inserted = 0;

        for (const flight of flightsData) {
            // Clean up ETA string from ' (+1)'
            let rawEtd = flight.etd;
            let rawEta = flight.eta;
            let isNextDay = rawEta.includes('(+1)');
            rawEta = rawEta.replace(' (+1)', '').trim();

            const etd_timestamp = `1970-01-01 ${rawEtd}:00`;
            const eta_timestamp = isNextDay ? `1970-01-02 ${rawEta}:00` : `1970-01-01 ${rawEta}:00`;

            await pool.query(
                `INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [flight.airline, flight.flight_number, flight.origin, flight.destination, etd_timestamp, eta_timestamp]
            );
            inserted++;
            console.log(`Inserted ${flight.airline} ${flight.flight_number}`);
        }

        console.log(`\nSuccessfully imported ${inserted} flight templates!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding flights:', error);
        process.exit(1);
    }
};

seedFlights();
