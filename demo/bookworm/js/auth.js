document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Проверка администратора
        if (username === 'admin' && password === 'bookworm') {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
            return;
        }
        
        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Поиск пользователя
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Неверный логин или пароль');
        }
    });
    
    // Если пользователь уже авторизован, перенаправляем
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'dashboard.html';
    }
    
    // Если админ уже авторизован, перенаправляем
    if (localStorage.getItem('isAdmin')) {
        window.location.href = 'admin.html';
    }
});