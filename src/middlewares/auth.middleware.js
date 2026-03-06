const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authGuard = (req, res, next) => {
    if (!config.enableAuth) {
        return next();
    }

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authGuard;
