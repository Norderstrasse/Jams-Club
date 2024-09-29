document.addEventListener('DOMContentLoaded', function() {
    // Beispiel-Nachrichten
    const messages = [
        'Willkommen zur Plattform!',
        'Neue Updates verfügbar.',
        'Wartungsarbeiten am Wochenende.'
    ];

    // Beispiel-Online-Nutzer
    const onlineUsers = [
        'Benutzer1',
        'Benutzer2',
        'Benutzer3'
    ];

    // Nachrichten einfügen
    const messagesList = document.getElementById('messages');
    messages.forEach(message => {
        const li = document.createElement('li');
        li.textContent = message;
        messagesList.appendChild(li);
    });

    // Online-Nutzer einfügen
    const onlineUsersList = document.getElementById('onlineUsers');
    onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        onlineUsersList.appendChild(li);
    });

    // Einfacher Kalender
    const calendar = document.getElementById('calendar');
    const today = new Date();
    calendar.textContent = `Heute ist der ${today.toLocaleDateString()}`;
});
