const express = require('express');
const router = express.Router();
const authGuard = require('../middlewares/auth.middleware');

router.get('/stats', authGuard, (req, res) => {
    res.json({
        users: 150,
        sales: 4500,
        activeSessions: 32
    });
});

module.exports = router;
