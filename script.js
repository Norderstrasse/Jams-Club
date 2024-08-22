document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();

});
async function fetchHolidays(year) {
    const response = await fetch(`https://get.api-feiertage.de?years=${year}&states=hh`);
    const data = await response.json();
    return data.feiertage;
}

let selectedWeekdays = [];

function toggleWeekday(weekday) {
    const index = selectedWeekdays.indexOf(weekday);
    if (index > -1) {
        selectedWeekdays.splice(index, 1); // Remove the weekday if it's already selected
        showWeekday(weekday); // Show the weekday
    } else {
        selectedWeekdays.push(weekday); // Add the weekday if it's not selected
        hideWeekday(weekday); // Hide the weekday
    }
}

function hideWeekday(weekday) {
    const calendar = document.getElementById('calendar');
    const weeks = calendar.getElementsByClassName('week');

    for (let week of weeks) {
        const days = week.getElementsByClassName('day');
        for (let day of days) {
            const dayHeader = day.querySelector('h3');
            if (dayHeader && dayHeader.textContent.includes(weekday)) {
                day.classList.add('hidden');
            }
        }
    }
}

function showWeekday(weekday) {
    const calendar = document.getElementById('calendar');
    const weeks = calendar.getElementsByClassName('week');

    for (let week of weeks) {
        const days = week.getElementsByClassName('day');
        for (let day of days) {
            const dayHeader = day.querySelector('h3');
            if (dayHeader && dayHeader.textContent.includes(weekday)) {
                day.classList.remove('hidden');
            }
        }
    }
}

async function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Vorherigen Kalender löschen

    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    let week = document.createElement('div');
    week.classList.add('week');

    const adjustedStartDay = (startDay === 0) ? 6 : startDay - 1;
    const holidays = await fetchHolidays(year);

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = adjustedStartDay; i > 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.classList.add('outOfMonth');
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${weekdays[adjustedStartDay - i]} ${prevMonthDays - i + 1}`;
        dayCell.appendChild(dayHeader);
        addAddFormButton(dayCell, prevMonthDays - i + 1);

        formattedDate = `${year}-${String(parseInt(month-1) + 1).padStart(2, '0')}-${String(prevMonthDays - i + 1).padStart(2, '0')}`;
        if (holidays.some(holiday => holiday.date === formattedDate)) {
            dayCell.classList.add('holiday');
        }

        week.appendChild(dayCell);
    }


    for (let day = 1; day <= daysInMonth; day++) {
        if (week.children.length === 7) {
            calendar.appendChild(week);
            week = document.createElement('div');
            week.classList.add('week');
        }

        const dayCell = document.createElement('div');
        dayCell.classList.add('day');

        const dayHeader = document.createElement('h3');
        const date = new Date(year, month, day);
        dayHeader.textContent = `${weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1]} ${day}`;
        dayCell.appendChild(dayHeader);

        addAddFormButton(dayCell, day);

        // Check if the current day is a holiday
        formattedDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (holidays.some(holiday => holiday.date === formattedDate)) {
            dayCell.classList.add('holiday');
        }

        week.appendChild(dayCell);
    }

    const nextMonthDays = 7 - week.children.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.classList.add('outOfMonth');
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${weekdays[(adjustedStartDay + daysInMonth + i - 1) % 7]} ${i}`;
        dayCell.appendChild(dayHeader);
        addAddFormButton(dayCell, i);

        formattedDate = `${year}-${String(parseInt(month) + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (holidays.some(holiday => holiday.date === formattedDate)) {
            dayCell.classList.add('holiday');
        }

        week.appendChild(dayCell);
    }

    if (week.children.length > 0) {
        calendar.appendChild(week);
    }
}

function addAddFormButton(dayCell, day) {
    const button = document.createElement('button');
    button.textContent = 'Personal hinzufügen';
    button.addEventListener('click', function() {
        addPersonForm(dayCell, day);
    });
    dayCell.appendChild(button);
}

function addPersonForm(dayCell, day) {
    const form = document.createElement('form');
    form.innerHTML = `
        <label for="worker-${day}">Arbeiter</label>
        <select id="worker-${day}" name="worker">
            <option value="Arbeiter1">Arbeiter1</option>
            <option value="Arbeiter2">Arbeiter2</option>
            <option value="Arbeiter3">Arbeiter3</option>
        </select>

        <label for="position-${day}">Position</label>
        <select id="position-${day}" name="position">
            <option value="Position1">Position1</option>
            <option value="Position2">Position2</option>
            <option value="Position3">Position3</option>
        </select>

        <label for="time-${day}">Uhrzeit</label>
        <input type="time" id="time-${day}" name="time">
    `;
    dayCell.appendChild(form); // Formular nach der Überschrift hinzufügen
}
