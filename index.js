const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./src/config/env');
const { connectDB } = require('./src/db/connection');
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler
app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};

startServer();
