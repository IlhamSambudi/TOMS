import app from './app.js';
import dotenv from 'dotenv';
import createTables from './config/setupDb.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

createTables().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
