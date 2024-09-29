document.addEventListener('DOMContentLoaded', function() {

  generateCalendarFirst();

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
  const currentDate = new Date()
  const month = document.getElementById('month').value
  const year = document.getElementById('year').value;
  const daysInMonth = new Date(year, parseInt(month), 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

  let week = document.createElement('div');
  week.classList.add('week');

  const adjustedStartDay = (startDay === 0) ? 6 : startDay - 1;
  let holidays = null;
  try {
    holidays = await fetchHolidays(2024);
    if (!holidays.some) {
      const error = "API Verbunden"
      console.log(error)
    }

  }
  catch (Exception){
    const errormessage = document.createElement('h6');
    errormessage.textContent = "Fehler mit API Feiertage"
    document.getElementById('lastElement').appendChild(errormessage);
  }

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
  selectedWeekdays.forEach(weekday => hideWeekday(weekday));
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

async function generateCalendarFirst() {

  const date = new Date();

// Das <select> Element auswählen
  var selectElement = document.getElementById('month');

// Die Option mit dem aktuellen Monat als ausgewählt markieren
  selectElement.value = date.getMonth().toString();


  const calendar = document.getElementById('calendar');
  calendar.innerHTML = ''; // Clear previous calendar
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, parseInt(month), 0).getDate();
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

  if (week.children.length > 0) {
    calendar.appendChild(week);
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
  selectedWeekdays.forEach(weekday => hideWeekday(weekday));

}

async function saveDataToServer(data) {
  const response = await fetch('arn:aws:apigateway:eu-north-1::/apis/5cyawpj4lj/routes/l16u96f', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (response.ok) {
    console.log('Daten erfolgreich gespeichert');
  } else {
    console.error('Fehler beim Speichern der Daten');
  }
}

async function fetchData() {
  const response = await fetch('arn:aws:apigateway:eu-north-1::/apis/5cyawpj4lj/routes/s8qtm1a');
  const data = await response.json();
  const container = document.getElementById('data-container');
  data.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `Tag: ${item.day}, Arbeiter: ${item.worker}, Position: ${item.position}, Uhrzeit: ${item.time}`;
    container.appendChild(div);
  });
}
