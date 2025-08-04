const { Pool } = require('pg');
require('dotenv').config();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { 
        rejectUnauthorized: false 
    } : false,
    // Дополнительные настройки безопасности
    max: 20, // максимум соединений
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Обработка ошибок подключения
pool.on('error', (err, client) => {
    console.error('Ошибка клиента базы данных:', err);
});

module.exports = pool;