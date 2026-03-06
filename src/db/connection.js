const sql = require('mssql');
const config = require('../config/env');

let pool = null;

const connectDB = async () => {
    try {
        if (pool) return pool;
        pool = await sql.connect(config.db);
        console.log('MSSQL Connected...');
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const getPool = () => pool;

module.exports = {
    connectDB,
    getPool,
    sql,
};
