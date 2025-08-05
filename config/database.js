const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Инициализация подключения к базе данных...');
console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL ? 'Установлен' : 'НЕ УСТАНОВЛЕН');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Принудительное использование IPv4
  family: 4,
  // Дополнительные настройки для стабильности
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Увеличен таймаут
  acquireTimeoutMillis: 10000,
});

// Тест подключения при запуске
pool.on('connect', (client) => {
  console.log('✅ Подключение к PostgreSQL установлено');
  console.log('🔗 Подключено к:', client.host, ':', client.port);
});

pool.on('error', (err, client) => {
  console.error('❌ Ошибка PostgreSQL:', err.message);
  console.error('🔗 Хост клиента:', client?.host);
});

// Расширенное тестирование подключения
const testConnection = async () => {
  try {
    console.log('🧪 Тестирование подключения...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version()');
    client.release();
    console.log('✅ Тестовое подключение успешно');
    console.log('⏰ Время сервера:', result.rows[0].now);
    console.log('🗄️ Версия БД:', result.rows[0].version.split(' ')[0]);
  } catch (err) {
    console.error('❌ Ошибка тестового подключения:');
    console.error('   Сообщение:', err.message);
    console.error('   Код:', err.code);
    console.error('   Адрес:', err.address);
    console.error('   Порт:', err.port);
  }
};

// Запускаем тест с задержкой
setTimeout(testConnection, 1000);

module.exports = pool;