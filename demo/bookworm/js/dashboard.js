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
    
    // Работа с вкладками
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и контенту
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Загружаем соответствующие карточки
            loadCards(tabId);
        });
    });
    
    // Функция загрузки карточек
    function loadCards(tabType) {
        const cardsContainer = document.querySelector(`#${tabType}-tab .cards-grid`);
        cardsContainer.innerHTML = '';
        
        // Получаем карточки пользователя
        const userCards = currentUser.cards || [];
        
        // Фильтруем карточки по статусу
        let filteredCards = [];
        switch (tabType) {
            case 'active':
                filteredCards = userCards.filter(card => card.status === 'approved');
                break;
            case 'pending':
                filteredCards = userCards.filter(card => card.status === 'pending');
                break;
            case 'rejected':
                filteredCards = userCards.filter(card => card.status === 'rejected');
                break;
        }
        
        // Если карточек нет
        if (filteredCards.length === 0) {
            cardsContainer.innerHTML = '<p class="no-cards">Нет карточек для отображения</p>';
            return;
        }
        
        // Отображаем карточки
        filteredCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            let cardHTML = `
                <h3>${card.bookTitle}</h3>
                <p class="card-author">${card.bookAuthor}</p>
                <p class="card-type">${card.cardType === 'share' ? 'Готов поделиться' : 'Хочу в свою библиотеку'}</p>
            `;
            
            if (card.description) {
                cardHTML += `<p class="card-description">${card.description}</p>`;
            }
            
            if (tabType === 'rejected' && card.rejectReason) {
                cardHTML += `<div class="reject-reason">
                    <strong>Причина отклонения:</strong>
                    <p>${card.rejectReason}</p>
                </div>`;
            }
            
            if (tabType !== 'pending') {
                cardHTML += `<button class="btn-danger delete-card" data-card-id="${card.id}">Удалить</button>`;
            } else {
                cardHTML += `<p class="card-status">На рассмотрении</p>`;
            }
            
            cardElement.innerHTML = cardHTML;
            cardsContainer.appendChild(cardElement);
        });
        
        // Обработчики для кнопок удаления
        document.querySelectorAll('.delete-card').forEach(btn => {
            btn.addEventListener('click', function() {
                const cardId = this.getAttribute('data-card-id');
                deleteCard(cardId);
            });
        });
    }
    
    // Функция удаления карточки
    function deleteCard(cardId) {
        if (!confirm('Вы уверены, что хотите удалить эту карточку?')) return;
        
        // Обновляем список карточек пользователя
        const updatedCards = currentUser.cards.filter(card => card.id !== cardId);
        currentUser.cards = updatedCards;
        
        // Обновляем данные в localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Перезагружаем карточки
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        loadCards(activeTab);
    }
    
    // Загружаем карточки при загрузке страницы
    loadCards('active');
});