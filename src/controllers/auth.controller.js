const jwt = require('jsonwebtoken');
const config = require('../config/env');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Demo logic, replace with real DB lookup
        if (username === 'admin' && password === 'admin') {
            const payload = {
                user: { id: 1, role: 'admin' }
            };

            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
            return res.json({ token, user: { id: 1, username } });
        }

        return res.status(400).json({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getMe = async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    login,
    getMe
};
