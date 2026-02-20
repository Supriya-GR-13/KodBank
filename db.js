const mysql = require('mysql2/promise');
require('dotenv').config();

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('CRITICAL ERROR: Missing environment variables:', missingEnv.join(', '));
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 17177,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 5, // Reduced for serverless environment
    queueLimit: 0,
    connectTimeout: 10000 // 10 seconds timeout
});

async function initDB() {
    // Skip init if environment variables are missing to avoid crash
    if (missingEnv.length > 0) {
        console.warn('Skipping DB Init: Missing environment variables');
        return;
    }

    try {
        const connection = await pool.getConnection();
        console.log('Connected to Aiven MySQL Database');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS kodusers (
                uid VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(255),
                role VARCHAR(50) DEFAULT 'customer',
                balance DECIMAL(15, 2) DEFAULT 100000.00
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS CJWIT (
                tid INT AUTO_INCREMENT PRIMARY KEY,
                token TEXT NOT NULL,
                uid VARCHAR(255) NOT NULL,
                expiry TIMESTAMP,
                FOREIGN KEY (uid) REFERENCES kodusers(uid) ON DELETE CASCADE
            )
        `);

        connection.release();
    } catch (error) {
        console.error('Database Initialization Error:', error.message);
        // Don't throw the error, just log it so the server can still start (to show a friendly 500 error later if needed)
    }
}

module.exports = { pool, initDB };
