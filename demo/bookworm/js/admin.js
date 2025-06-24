document.addEventListener('DOMContentLoaded', function() {
    // Проверка прав администратора
    if (localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Выход из системы
    document.getElementById('adminLogout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    });

    // Загрузка карточек на модерацию
    loadPendingCards();

    // Модальное окно для отклонения
    const modal = document.getElementById('rejectModal');
    const closeBtn = document.querySelector('.close');
    const rejectForm = document.getElementById('rejectForm');
    
    // Открытие модального окна
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('reject-btn')) {
            const cardId = e.target.getAttribute('data-card-id');
            document.getElementById('rejectCardId').value = cardId;
            modal.style.display = 'block';
        }
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Обработка отклонения карточки
    rejectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const cardId = document.getElementById('rejectCardId').value;
        const reason = document.getElementById('rejectReason').value;
        
        rejectCard(cardId, reason);
        modal.style.display = 'none';
        rejectForm.reset();
    });
    
    // Функция загрузки карточек на модерацию
    function loadPendingCards() {
        const adminContainer = document.querySelector('.admin-cards');
        adminContainer.innerHTML = '';
        
        // Получаем всех пользователей
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Собираем все карточки со статусом pending
        let pendingCards = [];
        users.forEach(user => {
            if (user.cards) {
                user.cards.forEach(card => {
                    if (card.status === 'pending') {
                        pendingCards.push({
                            ...card,
                            user: user.username,
                            userFullName: user.fullName
                        });
                    }
                });
            }
        });
        
        // Если карточек нет
        if (pendingCards.length === 0) {
            adminContainer.innerHTML = '<p class="no-cards">Нет карточек на модерации</p>';
            return;
        }
        
        // Отображаем карточки
        pendingCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'admin-card';
            
            cardElement.innerHTML = `
                <h3>${card.bookTitle}</h3>
                <div class="card-meta">
                    <span class="card-author">${card.bookAuthor}</span>
                    <span class="card-type">${card.cardType === 'share' ? 'Поделиться' : 'Хочу получить'}</span>
                </div>
                <div class="card-user">От пользователя: ${card.userFullName} (${card.user})</div>
                
                ${card.description ? `<div class="card-description">${card.description}</div>` : ''}
                
                <div class="card-actions">
                    <button class="btn-primary approve-btn" data-card-id="${card.id}" data-user="${card.user}">Одобрить</button>
                    <button class="btn-warning reject-btn" data-card-id="${card.id}">Отклонить</button>
                </div>
            `;
            
            adminContainer.appendChild(cardElement);
        });
        
        // Обработчики для кнопок одобрения
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cardId = this.getAttribute('data-card-id');
                const username = this.getAttribute('data-user');
                approveCard(cardId, username);
            });
        });
    }
    
    // Функция одобрения карточки
    function approveCard(cardId, username) {
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) return;
        
        // Находим карточку и меняем статус
        const cardIndex = users[userIndex].cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;
        
        users[userIndex].cards[cardIndex].status = 'approved';
        localStorage.setItem('users', JSON.stringify(users));
        
        // Обновляем список карточек
        loadPendingCards();
    }
    
    // Функция отклонения карточки
    function rejectCard(cardId, reason) {
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Находим пользователя и карточку
        for (let user of users) {
            if (user.cards) {
                const cardIndex = user.cards.findIndex(c => c.id === cardId);
                if (cardIndex !== -1) {
                    // Обновляем статус и добавляем причину
                    user.cards[cardIndex].status = 'rejected';
                    user.cards[cardIndex].rejectReason = reason;
                    break;
                }
            }
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        loadPendingCards();
    }
});