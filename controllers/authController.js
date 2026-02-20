const { pool } = require('../db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { uid, username, password, email, phone } = req.body;
    const role = 'customer';
    const balance = 100000;

    try {
        const [existing] = await pool.query('SELECT * FROM kodusers WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        await pool.query('INSERT INTO kodusers (uid, username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uid, username, email, password, phone, role, balance]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET environment variable is not set');
        return res.status(500).json({ message: 'Server configuration error (JWT_SECRET)' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM kodusers WHERE username = ? AND password = ?', [username, password]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const token = jwt.sign({ sub: username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '45m' });

        const expiry = new Date(Date.now() + 45 * 60000);
        await pool.query('INSERT INTO CJWIT (token, uid, expiry) VALUES (?, ?, ?)', [token, user.uid, expiry]);

        res.cookie('token', token, { httpOnly: true, maxAge: 45 * 60000, sameSite: 'lax' });
        res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
};
