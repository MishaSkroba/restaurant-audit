const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Инициализация подключения к базе данных...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Дополнительные настройки для стабильности
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Тест подключения при запуске
pool.on('connect', () => {
  console.log('✅ Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
  console.error('❌ Ошибка PostgreSQL:', err);
});

// Тестируем подключение при загрузке модуля
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Ошибка тестового запроса:', err.message);
  } else {
    console.log('✅ Тестовое подключение успешно:', res.rows[0].now);
  }
});

module.exports = pool;