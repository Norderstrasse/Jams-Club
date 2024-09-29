document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Test-Benutzername und Passwort
    const testUser = 'admin';
    const testPassword = 'password';

    if (username === testUser && password === testPassword) {
        // Weiterleitung zur nächsten Seite
        window.location.href = 'welcome.html';
    } else {
        alert('Ungültiger Benutzername oder Passwort.');
    }
});
