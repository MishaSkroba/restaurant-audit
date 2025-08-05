require('dotenv').config();

// Проверка обязательных переменных окружения
const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Отсутствуют обязательные переменные окружения:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
}

console.log('✅ Все переменные окружения настроены');

const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const restaurantsRoutes = require('./routes/restaurants');

const app = express();
// Базовая безопасность
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Логирование запросов
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Ограничение количества запросов
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: {
        error: 'Слишком много запросов, попробуйте позже'
    }
});
app.use('/api/', limiter);

// Более строгие ограничения для POST запросов
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // максимум 20 POST запросов
    message: {
        error: 'Превышен лимит создания записей'
    }
});
app.use('/api/restaurants', strictLimiter);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/restaurants', restaurantsRoutes);

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ТЕСТОВЫЕ ЭНДПОИНТЫ 
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    res.json({ 
      success: true, 
      message: 'Подключение к БД работает', 
      time: result.rows[0].current_time,
      version: result.rows[0].db_version
    });
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

app.get('/api/test-table', async (req, res) => {
  try {
    const pool = require('./config/database');
    
    // Проверяем существование таблицы
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'restaurants'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      return res.json({
        success: false,
        message: 'Таблица restaurants не существует',
        table_exists: false
      });
    }
    
    // Получаем структуру таблицы
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'restaurants'
      ORDER BY ordinal_position;
    `);
    
    // Подсчитываем количество записей
    const count = await pool.query('SELECT COUNT(*) as total FROM restaurants');
    
    res.json({ 
      success: true,
      table_exists: true,
      total_records: parseInt(count.rows[0].total),
      columns: columns.rows
    });
  } catch (err) {
    console.error('❌ Ошибка проверки таблицы:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});