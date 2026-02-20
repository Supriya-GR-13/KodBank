const { pool } = require('./db');

async function listUsers() {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT uid, username, password, email FROM kodusers');
        console.log('--- Registered Users ---');
        console.table(users);
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error);
        process.exit(1);
    }
}

listUsers();
