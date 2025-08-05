const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Используем готовый pool

// НЕ импортируем Pool повторно!
// const { Pool } = require('pg'); // ← Удалить эту строку!

// Получить все заведения
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM restaurants ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить одно заведение
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заведение не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новое заведение
router.post('/', async (req, res) => {
  console.log('📝 Получен POST запрос на создание заведения');
  console.log('📦 Данные запроса:', JSON.stringify(req.body, null, 2));
  
  try {
    const data = req.body;
    
    // Валидация обязательных полей
    if (!data.name || data.name.trim() === '') {
      console.log('❌ Ошибка валидации: отсутствует название');
      return res.status(400).json({ error: 'Название заведения обязательно' });
    }
    
    const query = `
      INSERT INTO restaurants (
        name, address, chairs_count, armchairs_count, bar_stools_count,
        large_tables_count, small_tables_count, medium_tables_count,
        hangers_count, kids_tables_count, medium_sofas_count, large_sofas_count,
        air_conditioners_count, heat_curtains_count, fans_count,
        pendant_lights_count, spots_count, toilets_count, toilet_brushes_count,
        urinals_count, sinks_count, hand_dryer, refrigerators_count,
        medium_plants_count, large_plants_count, has_music, paintings_count,
        decorative_lantern, cameras_count, motion_sensors_count, has_logo,
        total_seats, hall_area_sqm
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32, $33
      ) RETURNING *
    `;

    // Преобразование типов данных
    const values = [
      data.name?.toString() || '',
      data.address?.toString() || '',
      parseInt(data.chairs_count) || 0,
      parseInt(data.armchairs_count) || 0,
      parseInt(data.bar_stools_count) || 0,
      parseInt(data.large_tables_count) || 0,
      parseInt(data.small_tables_count) || 0,
      parseInt(data.medium_tables_count) || 0,
      parseInt(data.hangers_count) || 0,
      parseInt(data.kids_tables_count) || 0,
      parseInt(data.medium_sofas_count) || 0,
      parseInt(data.large_sofas_count) || 0,
      parseInt(data.air_conditioners_count) || 0,
      parseInt(data.heat_curtains_count) || 0,
      parseInt(data.fans_count) || 0,
      parseInt(data.pendant_lights_count) || 0,
      parseInt(data.spots_count) || 0,
      parseInt(data.toilets_count) || 0,
      parseInt(data.toilet_brushes_count) || 0,
      parseInt(data.urinals_count) || 0,
      parseInt(data.sinks_count) || 0,
      Boolean(data.hand_dryer === 'true' || data.hand_dryer === true),
      parseInt(data.refrigerators_count) || 0,
      parseInt(data.medium_plants_count) || 0,
      parseInt(data.large_plants_count) || 0,
      Boolean(data.has_music === 'true' || data.has_music === true),
      parseInt(data.paintings_count) || 0,
      Boolean(data.decorative_lantern === 'true' || data.decorative_lantern === true),
      parseInt(data.cameras_count) || 0,
      parseInt(data.motion_sensors_count) || 0,
      Boolean(data.has_logo === 'true' || data.has_logo === true),
      parseInt(data.total_seats) || 0,
      parseFloat(data.hall_area_sqm) || 0
    ];

    console.log('🔧 Подготовленные значения для БД:', values);
    console.log('📊 Выполняется SQL запрос...');

    const result = await pool.query(query, values);
    
    console.log('✅ Заведение успешно создано:', result.rows[0]);
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error('❌ ОШИБКА при создании заведения:');
    console.error('Сообщение ошибки:', err.message);
    console.error('Код ошибки:', err.code);
    console.error('Детали:', err.detail);
    console.error('Стек ошибки:', err.stack);
    
    res.status(500).json({ 
      error: 'Ошибка при создании записи: ' + err.message,
      code: err.code 
    });
  }
});

// Обновить заведение
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const query = `
            UPDATE restaurants SET 
                name = $1, address = $2, chairs_count = $3, armchairs_count = $4,
                bar_stools_count = $5, large_tables_count = $6, small_tables_count = $7,
                medium_tables_count = $8, hangers_count = $9, kids_tables_count = $10,
                medium_sofas_count = $11, large_sofas_count = $12, air_conditioners_count = $13,
                heat_curtains_count = $14, fans_count = $15, pendant_lights_count = $16,
                spots_count = $17, toilets_count = $18, toilet_brushes_count = $19,
                urinals_count = $20, sinks_count = $21, hand_dryer = $22,
                refrigerators_count = $23, medium_plants_count = $24, large_plants_count = $25,
                has_music = $26, paintings_count = $27, decorative_lantern = $28,
                cameras_count = $29, motion_sensors_count = $30, has_logo = $31,
                total_seats = $32, hall_area_sqm = $33, updated_at = CURRENT_TIMESTAMP
            WHERE id = $34 RETURNING *
        `;
        
        const values = [
            data.name, data.address, data.chairs_count || 0, data.armchairs_count || 0,
            data.bar_stools_count || 0, data.large_tables_count || 0, data.small_tables_count || 0,
            data.medium_tables_count || 0, data.hangers_count || 0, data.kids_tables_count || 0,
            data.medium_sofas_count || 0, data.large_sofas_count || 0, data.air_conditioners_count || 0,
            data.heat_curtains_count || 0, data.fans_count || 0, data.pendant_lights_count || 0,
            data.spots_count || 0, data.toilets_count || 0, data.toilet_brushes_count || 0,
            data.urinals_count || 0, data.sinks_count || 0, data.hand_dryer || false,
            data.refrigerators_count || 0, data.medium_plants_count || 0, data.large_plants_count || 0,
            data.has_music || false, data.paintings_count || 0, data.decorative_lantern || false,
            data.cameras_count || 0, data.motion_sensors_count || 0, data.has_logo || false,
            data.total_seats || 0, data.hall_area_sqm || 0, id
        ];
        
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заведение не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при обновлении' });
    }
});

// Удалить заведение
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заведение не найдено' });
        }
        
        res.json({ message: 'Заведение удалено', deleted: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при удалении' });
    }
});

module.exports = router;