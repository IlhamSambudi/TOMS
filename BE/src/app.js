import express from 'express';
import cors from 'cors';
import pool from './config/db.js';

// Route imports
import groupRoutes from './routes/groupRoutes.js';
import handlingRoutes from './routes/handlingRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import transportStandaloneRoutes from './routes/transportStandaloneRoutes.js';
import assignmentStandaloneRoutes from './routes/assignmentStandaloneRoutes.js';
import rawdahRoutes from './routes/rawdahRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set search path for every request
app.use(async (req, res, next) => {
    try {
        await pool.query('SET search_path TO umroh_ops');
        next();
    } catch (err) {
        console.error('Error setting search path:', err);
        res.status(500).json({ success: false, message: 'Database error', data: null });
    }
});

// API Routes
app.use('/api/groups', groupRoutes);
app.use('/api/handling', handlingRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/transports', transportStandaloneRoutes);
app.use('/api/assignments', assignmentStandaloneRoutes);
app.use('/api/rawdah', rawdahRoutes);

// Health Check
app.get('/api/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: 'Database connected',
            data: { timestamp: result.rows[0].now }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database connection failed', data: null });
    }
});

export default app;
