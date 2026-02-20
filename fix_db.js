const { pool } = require('./db');

async function fixSchema() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to DB for schema fix');

        // Check columns in kodusers
        const [columns] = await connection.query(`SHOW COLUMNS FROM kodusers LIKE 'role'`);
        if (columns.length === 0) {
            console.log('Adding missing column: role');
            await connection.query(`ALTER TABLE kodusers ADD COLUMN role VARCHAR(50) DEFAULT 'customer'`);
        } else {
            console.log('Column role already exists');
        }

        const [balanceCol] = await connection.query(`SHOW COLUMNS FROM kodusers LIKE 'balance'`);
        if (balanceCol.length === 0) {
            console.log('Adding missing column: balance');
            await connection.query(`ALTER TABLE kodusers ADD COLUMN balance DECIMAL(15, 2) DEFAULT 100000.00`);
        } else {
            console.log('Column balance already exists');
        }

        console.log('Schema fix complete');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Schema fix failed:', error);
        process.exit(1);
    }
}

fixSchema();
