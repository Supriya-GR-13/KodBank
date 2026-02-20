const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Required for Aiven if no CA cert provided, or use true if system has CA
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to Aiven MySQL Database');

        // Create kodusers table
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
        console.log('Table kodusers created or already exists');

        // Create CJWIT table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS CJWIT (
                tid INT AUTO_INCREMENT PRIMARY KEY,
                token TEXT NOT NULL,
                uid VARCHAR(255) NOT NULL,
                expiry TIMESTAMP,
                FOREIGN KEY (uid) REFERENCES kodusers(uid) ON DELETE CASCADE
            )
        `);
        console.log('Table CJWIT created or already exists');

        connection.release();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

module.exports = { pool, initDB };
