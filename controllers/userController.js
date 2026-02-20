const { pool } = require('../db');

exports.getBalance = async (req, res) => {
    // req.user is populated by middleware
    const username = req.user.sub;

    try {
        const [users] = await pool.query('SELECT balance FROM kodusers WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: users[0].balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
