document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Выход из системы
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Форма создания карточки
    const cardForm = document.getElementById('cardForm');
    
    cardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные из формы
        const bookAuthor = document.getElementById('bookAuthor').value;
        const bookTitle = document.getElementById('bookTitle').value;
        const cardType = document.querySelector('input[name="cardType"]:checked').value;
        const description = document.getElementById('bookDescription').value;
        
        // Создаем объект карточки
        const newCard = {
            id: Date.now().toString(),
            bookAuthor,
            bookTitle,
            cardType,
            description,
            status: 'pending', // по умолчанию на рассмотрении
            createdAt: new Date().toISOString()
        };
        
        // Добавляем карточку к пользователю
        if (!currentUser.cards) currentUser.cards = [];
        currentUser.cards.push(newCard);
        
        // Обновляем данные в localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        users[userIndex] = currentUser;
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Показываем уведомление и перенаправляем
        alert('Карточка успешно создана и отправлена на модерацию!');
        window.location.href = 'dashboard.html';
    });
    
    // Валидация формы
    document.getElementById('bookAuthor').addEventListener('input', validateForm);
    document.getElementById('bookTitle').addEventListener('input', validateForm);
    
    function validateForm() {
        const authorValid = document.getElementById('bookAuthor').value.trim() !== '';
        const titleValid = document.getElementById('bookTitle').value.trim() !== '';
        
        const submitBtn = cardForm.querySelector('button[type="submit"]');
        submitBtn.disabled = !(authorValid && titleValid);
    }
    
    // Инициализация валидации
    validateForm();
});