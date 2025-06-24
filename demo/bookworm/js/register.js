document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('regUsername');
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usernameHint = document.getElementById('usernameHint');
    const passwordMatchHint = document.getElementById('passwordMatchHint');
    
    // Проверка уникальности логина
    usernameInput.addEventListener('input', function() {
        const username = this.value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.username === username)) {
            usernameHint.textContent = 'Этот логин уже занят';
            usernameHint.style.color = 'var(--error-color)';
        } else {
            usernameHint.textContent = 'Логин доступен';
            usernameHint.style.color = 'var(--success-color)';
        }
    });
    
    // Проверка совпадения паролей
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== this.value) {
            passwordMatchHint.textContent = 'Пароли не совпадают';
            passwordMatchHint.style.color = 'var(--error-color)';
        } else {
            passwordMatchHint.textContent = 'Пароли совпадают';
            passwordMatchHint.style.color = 'var(--success-color)';
        }
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка совпадения паролей
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Пароли не совпадают');
            return;
        }
        
        // Проверка минимальной длины пароля
        if (passwordInput.value.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        // Создаем объект пользователя
        const newUser = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            username: usernameInput.value,
            password: passwordInput.value,
            cards: []
        };
        
        // Получаем текущий список пользователей
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Проверяем, не занят ли логин
        if (users.some(u => u.username === newUser.username)) {
            alert('Этот логин уже занят');
            return;
        }
        
        // Добавляем нового пользователя
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Авторизуем пользователя
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Перенаправляем в личный кабинет
        window.location.href = 'dashboard.html';
    });
});