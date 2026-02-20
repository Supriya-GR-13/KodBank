const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initDB } = require('./db');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// JWT Verification Middleware
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Verify with DB (CJWIT table) as requested
        const { pool } = require('./db');
        const [tokens] = await pool.query('SELECT * FROM CJWIT WHERE token = ?', [token]);

        if (tokens.length === 0) {
            return res.status(401).json({ message: 'Invalid or expired token (not found in DB)' });
        }

        // Optional: Check expiry in DB if not handled by JWT verify (JWT verify handles 'exp' claim)
        // bit extra check:
        const dbToken = tokens[0];
        if (new Date(dbToken.expiry) < new Date()) {
            return res.status(401).json({ message: 'Token expired in DB' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/balance', verifyToken, userController.getBalance);

// Start server
// Start server
if (require.main === module) {
    initDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    });
}

module.exports = app;
