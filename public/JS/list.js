let restaurants = [];

// Загрузка данных при открытии страницы
window.addEventListener('DOMContentLoaded', loadRestaurants);

async function loadRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        
        if (response.ok) {
            restaurants = await response.json();
            displayRestaurants();
        } else {
            showError('Ошибка загрузки данных');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showError('Ошибка соединения с сервером');
    }
}

function displayRestaurants() {
    const loadingMessage = document.getElementById('loadingMessage');
    const restaurantsList = document.getElementById('restaurantsList');
    const emptyMessage = document.getElementById('emptyMessage');
    
    loadingMessage.classList.add('d-none');
    
    if (restaurants.length === 0) {
        emptyMessage.classList.remove('d-none');
        return;
    }
    
    restaurantsList.classList.remove('d-none');
    
    const html = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
    restaurantsList.innerHTML = html;
}

function createRestaurantCard(restaurant) {
    const date = new Date(restaurant.created_at).toLocaleDateString('ru-RU');
    
    return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h5 class="card-title">${restaurant.name}</h5>
                        <p class="card-text">
                            <strong>Адрес:</strong> ${restaurant.address || 'Не указан'}<br>
                            <strong>Посадочных мест:</strong> ${restaurant.total_seats}<br>
                            <strong>Площадь зала:</strong> ${restaurant.hall_area_sqm} кв.м.<br>
                            <small class="text-muted">Дата аудита: ${date}</small>
                        </p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-info mb-2" onclick="showDetails(${restaurant.id})">
                            Подробнее
                        </button><br>
                        <button class="btn btn-warning mb-2" onclick="editRestaurant(${restaurant.id})">
                            Редактировать
                        </button><br>
                        <button class="btn btn-danger" onclick="deleteRestaurant(${restaurant.id})">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showDetails(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = createDetailsContent(restaurant);
    
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}

function createDetailsContent(restaurant) {
    return `
        <div class="row">
            <div class="col-md-12">
                <h6 class="text-primary">Основная информация</h6>
                <p><strong>Название:</strong> ${restaurant.name}</p>
                <p><strong>Адрес:</strong> ${restaurant.address || 'Не указан'}</p>
                <hr>
                
                <h6 class="text-primary">Мебель и сидения</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p>Стулья: ${restaurant.chairs_count}</p>
                        <p>Кресла: ${restaurant.armchairs_count}</p>
                        <p>Барные стулья: ${restaurant.bar_stools_count}</p>
                        <p>Большие столы: ${restaurant.large_tables_count}</p>
                        <p>Маленькие столы: ${restaurant.small_tables_count}</p>
                        <p>Средние столы: ${restaurant.medium_tables_count}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Вешалки: ${restaurant.hangers_count}</p>
                        <p>Детские столики: ${restaurant.kids_tables_count}</p>
                        <p>Средние диваны: ${restaurant.medium_sofas_count}</p>
                        <p>Большие диваны: ${restaurant.large_sofas_count}</p>
                    </div>
                </div>
                <hr>
                
                <h6 class="text-primary">Климат и освещение</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p>Кондиционеры: ${restaurant.air_conditioners_count}</p>
                        <p>Тепловые завесы: ${restaurant.heat_curtains_count}</p>
                        <p>Вентиляторы: ${restaurant.fans_count}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Подвесные светильники: ${restaurant.pendant_lights_count}</p>
                        <p>Споты: ${restaurant.spots_count}</p>
                    </div>
                </div>
                <hr>
                
                <h6 class="text-primary">Санузел</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p>Унитазы: ${restaurant.toilets_count}</p>
                        <p>Ершики: ${restaurant.toilet_brushes_count}</p>
                        <p>Писуары: ${restaurant.urinals_count}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Умывальники: ${restaurant.sinks_count}</p>
                        <p>Сушилка для рук: ${restaurant.hand_dryer ? 'Есть' : 'Нет'}</p>
                    </div>
                </div>
                <hr>
                
                <h6 class="text-primary">Декор и безопасность</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p>Холодильные лари: ${restaurant.refrigerators_count}</p>
                        <p>Средние растения: ${restaurant.medium_plants_count}</p>
                        <p>Большие растения: ${restaurant.large_plants_count}</p>
                        <p>Картины: ${restaurant.paintings_count}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Музыка: ${restaurant.has_music ? 'Есть' : 'Нет'}</p>
                        <p>Декоративный фонарь: ${restaurant.decorative_lantern ? 'Есть' : 'Нет'}</p>
                        <p>Камеры видеонаблюдения: ${restaurant.cameras_count}</p>
                        <p>Датчики движения: ${restaurant.motion_sensors_count}</p>
                        <p>Логотип: ${restaurant.has_logo ? 'Есть' : 'Нет'}</p>
                    </div>
                </div>
                <hr>
                
                <h6 class="text-primary">Общие характеристики</h6>
                <p><strong>Посадочных мест:</strong> ${restaurant.total_seats}</p>
                <p><strong>Площадь зала:</strong> ${restaurant.hall_area_sqm} кв.м.</p>
            </div>
        </div>
    `;
}

async function deleteRestaurant(id) {
    if (!confirm('Вы уверены, что хотите удалить это заведение?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/restaurants/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Заведение удалено');
            loadRestaurants(); // Обновляем список
        } else {
            const error = await response.json();
            alert('Ошибка при удалении: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка соединения с сервером');
    }
}

function editRestaurant(id) {
    // Переходим на форму редактирования (пока просто на форму добавления)
    window.location.href = `form.html?edit=${id}`;
}

function showError(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
}