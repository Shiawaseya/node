require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    server: process.env.DB_SERVER || 'localhost',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'boilerplate_db',
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET || 'super_secret_key',
  enableAuth: process.env.ENABLE_AUTH === 'true',
};
