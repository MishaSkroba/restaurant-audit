// Обработка отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('restaurantForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) {
        console.error('❌ Форма не найдена!');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // ВАЖНО: предотвращаем стандартную отправку формы
        
        console.log('📝 Начинаем отправку формы...');
        
        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Сохраняется...';
        
        try {
            // Собираем данные формы
            const formData = new FormData(form);
            const data = {};
            
            // Преобразуем FormData в обычный объект
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            console.log('📦 Данные для отправки:', data);
            
            // Валидация
            if (!data.name || data.name.trim() === '') {
                throw new Error('Название заведения обязательно для заполнения');
            }
            
            // Отправляем POST запрос
            console.log('🚀 Отправляем POST запрос на /api/restaurants...');
            
            const response = await fetch('/api/restaurants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('📡 Ответ сервера получен, статус:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Заведение успешно сохранено:', result);
            
            // Показываем сообщение об успехе
            showSuccessMessage('Заведение успешно добавлено!');
            
            // Очищаем форму
            form.reset();
            
            // Предлагаем перейти к списку
            setTimeout(() => {
                if (confirm('Заведение сохранено! Перейти к списку всех заведений?')) {
                    window.location.href = 'list.html';
                }
            }, 1500);
            
        } catch (error) {
            console.error('❌ Ошибка при сохранении:', error);
            showErrorMessage('Ошибка при сохранении: ' + error.message);
        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Сохранить заведение';
        }
    });
});

// Функция показа сообщения об успехе
function showSuccessMessage(message) {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();
    alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>✅ Успех!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth' });
}

// Функция показа сообщения об ошибке
function showErrorMessage(message) {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>❌ Ошибка!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth' });
}

// Создание контейнера для уведомлений
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.className = 'mb-4';
    
    const form = document.getElementById('restaurantForm');
    form.parentNode.insertBefore(container, form);
    
    return container;
}

// Функция для работы с checkbox-ами
function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`Checkbox ${this.name}: ${this.checked}`);
        });
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    setupCheckboxes();
    console.log('✅ Форма инициализирована');
});