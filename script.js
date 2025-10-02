document.addEventListener('DOMContentLoaded', () => {
    const initialEvents = [
        { id: "ev1", title: "Seminario: Redes 6G", startDate: addDaysToISO(3), endDate: addDaysToISO(3), time: "10:00", description: "Charla sobre avances.", campus: "Campus San Joaquin", public: "Estudiantes", category: "Seminario", status: "Programado", duration: "1 hora", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" },
        { id: "ev2", title: "Congreso de IA", startDate: addDaysToISO(7), endDate: addDaysToISO(9), time: "09:00", description: "Congreso internacional de tres días.", campus: "Campus Valparaiso", public: "Profesores", category: "Conferencia", status: "Programado", duration: "Día completo", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" },
        { id: "ev3", title: "Ceremonia Bienvenida", startDate: addDaysToISO(12), endDate: addDaysToISO(12), time: "11:00", description: "Acto oficial.", campus: "Campus Viña del Mar", public: "Comunidad", category: "Ceremonia", status: "Programado", duration: "2 horas", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" }
    ];

    let events = JSON.parse(localStorage.getItem('events')) || initialEvents;
    let loggedIn = false;
    let currentDate = new Date();
    let selectedDate = null;
    let modalMode = 'create';
    let editingEventId = null;

    const DOMElements = {
        loginForm: document.getElementById('login-form'), adminOptions: document.getElementById('admin-options'), createEventBtn: document.getElementById('create-event-btn'),
        logoutBtn: document.getElementById('logout-btn'), eventList: document.getElementById('event-list'), upcomingList: document.getElementById('upcoming-events-list'),
        searchInput: document.getElementById('search-query'), categoryFilter: document.getElementById('filter-category'), publicFilter: document.getElementById('filter-public'),
        detailModal: document.getElementById('detail-modal'), detailTitle: document.getElementById('detail-title'), detailBody: document.getElementById('detail-body'),
        eventFormModal: document.getElementById('event-form-modal'), eventForm: document.getElementById('event-form'), formModalTitle: document.getElementById('form-modal-title'),
        monthYearDisplay: document.getElementById('month-year-display'), calendarGrid: document.getElementById('calendar-grid'),
        prevMonthBtn: document.getElementById('prev-month-btn'), nextMonthBtn: document.getElementById('next-month-btn'),
        eventListTitle: document.getElementById('event-list-title'), toastContainer: document.getElementById('toast-container')
    };

    const saveEvents = () => localStorage.setItem('events', JSON.stringify(events));

    const renderEvents = () => {
        const query = DOMElements.searchInput.value.toLowerCase();
        const cat = DOMElements.categoryFilter.value;
        const pub = DOMElements.publicFilter.value;
        DOMElements.eventListTitle.textContent = selectedDate ? `Eventos para el ${formatDate(selectedDate, { day: 'numeric', month: 'long' })}` : 'Eventos';
        const filtered = events.filter(e => {
            const matchesFilter = (e.title.toLowerCase().includes(query)) && (cat === 'Todos' || e.category === cat) && (pub === 'Todos' || e.public === pub);
            const matchesDate = !selectedDate || (selectedDate >= e.startDate && selectedDate <= e.endDate);
            return matchesFilter && matchesDate;
        });
        DOMElements.eventList.innerHTML = '';
        if (filtered.length === 0) { DOMElements.eventList.innerHTML = `<p class="text-gray-500 col-span-full text-center">No hay eventos.</p>`; return; }
        filtered.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card border rounded-lg p-4 shadow-sm bg-white text-gray-800 cursor-pointer hover:shadow-lg transition-shadow group relative';
            card.dataset.eventId = event.id;
            const adminControls = loggedIn ? `<div class="absolute bottom-2 right-2 hidden group-hover:flex gap-2"><button class="edit-btn p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-blue-600" title="Editar" data-event-id="${event.id}">✏️</button><button class="delete-btn p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-red-600" title="Eliminar" data-event-id="${event.id}">🗑️</button></div>` : '';
            const statusColor = event.status === 'En curso' ? 'bg-green-600' : 'bg-blue-600';
            card.innerHTML = `<div class="flex justify-between items-start"><h3 class="text-md font-semibold">${event.title}</h3><span class="text-xs px-2 py-1 rounded-full text-white ${statusColor}">${event.status}</span></div><p class="text-sm text-gray-500 mt-2 line-clamp-2">${event.description}</p><p class="text-sm text-gray-500 mt-3">${formatDate(event.startDate)} · ${event.time}</p><p class="text-sm text-gray-500 mt-1">${event.campus}</p>${adminControls}`;
            DOMElements.eventList.appendChild(card);
        });
    };
    
    const renderUpcomingEvents = () => {
        DOMElements.upcomingList.innerHTML = '';
        const upcoming = events.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 3);
        upcoming.forEach(event => {
            const item = document.createElement('li');
            item.className = 'py-3 cursor-pointer hover:bg-gray-50';
            item.dataset.eventId = event.id;
            item.innerHTML = `<div class="text-sm font-semibold text-gray-800">${event.title}</div><div class="text-xs text-gray-500 mt-1">${formatDate(event.startDate)} · ${event.campus}</div>`;
            DOMElements.upcomingList.appendChild(item);
        });
    };

    const renderCalendar = () => {
        DOMElements.calendarGrid.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        DOMElements.monthYearDisplay.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' })} ${year}`;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayHeaders.forEach(day => DOMElements.calendarGrid.innerHTML += `<div class="font-semibold text-xs text-gray-500 py-2">${day}</div>`);
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) DOMElements.calendarGrid.innerHTML += `<div></div>`;
        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventsOnDay = events.filter(e => dayStr >= e.startDate && dayStr <= e.endDate);
            const isSelected = dayStr === selectedDate;
            let eventsHtml = '';
            if (eventsOnDay.length > 0) {
                eventsHtml = eventsOnDay.map(e => {
                    let classes = 'bg-blue-100 text-blue-800 text-xs px-1 mt-1 truncate cursor-pointer hover:bg-blue-200 block';
                    if (e.startDate !== e.endDate) { if (dayStr === e.startDate) classes += ' rounded-l'; else if (dayStr === e.endDate) classes += ' rounded-r'; else classes += ' rounded-none'; } 
                    else { classes += ' rounded'; }
                    return `<div class="${classes}" data-event-id="${e.id}">${e.title}</div>`;
                }).join('');
            }
            const cell = document.createElement('div');
            cell.className = `calendar-day p-1 border rounded text-left align-top transition-colors ${isSelected ? 'bg-blue-100' : ''}`;
            cell.innerHTML = `<span class="day-number font-medium text-sm cursor-pointer">${day}</span>${eventsHtml}`;
            cell.dataset.date = dayStr;
            DOMElements.calendarGrid.appendChild(cell);
        }
    };

    const showToast = (message, type = 'success') => {
        const colors = { success: 'bg-green-600', info: 'bg-blue-600', error: 'bg-red-600' };
        const toast = document.createElement('div');
        toast.className = `${colors[type]} text-white text-sm py-2 px-4 rounded-lg shadow-md`;
        toast.textContent = message;
        DOMElements.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const populateFilters = () => {
        ['Todos', ...new Set(initialEvents.map(e => e.category))].forEach(c => DOMElements.categoryFilter.add(new Option(c, c)));
        ['Todos', 'Estudiantes', 'Profesores', 'Comunidad'].forEach(p => DOMElements.publicFilter.add(new Option(p, p)));
    };
    
    const updateLoginUI = () => {
        DOMElements.loginForm.classList.toggle('hidden', loggedIn);
        DOMElements.adminOptions.classList.toggle('hidden', !loggedIn);
        renderEvents();
    };

    const openEventFormModal = (mode, eventId = null) => {
        modalMode = mode;
        DOMElements.eventForm.reset();
        if (mode === 'edit') {
            editingEventId = eventId;
            const event = events.find(e => e.id === eventId);
            DOMElements.formModalTitle.textContent = 'Editar Evento';
            Object.keys(event).forEach(key => { if (DOMElements.eventForm[key]) DOMElements.eventForm[key].value = event[key]; });
            if (event.time) {
                const [hour, minute] = event.time.split(':');
                DOMElements.eventForm.startHour.value = hour;
                DOMElements.eventForm.startMinute.value = minute;
            }
        } else {
            editingEventId = null;
            DOMElements.formModalTitle.textContent = 'Crear Nuevo Evento';
        }
        DOMElements.eventFormModal.classList.remove('hidden');
    };

    const openDetailModal = (eventId) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        DOMElements.detailTitle.textContent = event.title;
        const dateRange = event.startDate === event.endDate ? formatDate(event.startDate) : `Del ${formatDate(event.startDate)} al ${formatDate(event.endDate)}`;
        DOMElements.detailBody.innerHTML = `<p><strong>Fechas:</strong> ${dateRange}</p><p><strong>Hora:</strong> ${event.time}</p><p><strong>Campus:</strong> ${event.campus}</p><p><strong>Categoría:</strong> ${event.category}</p><hr><p>${event.description}</p><hr><p><strong>Organiza:</strong> ${event.organizerUnit}</p>`;
        DOMElements.detailModal.classList.remove('hidden');
    };

    const hideAllModals = () => {
        DOMElements.detailModal.classList.add('hidden');
        DOMElements.eventFormModal.classList.add('hidden');
    };

    const fullRender = () => { renderEvents(); renderUpcomingEvents(); renderCalendar(); };

    DOMElements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (document.getElementById('user-input').value === 'admin' && document.getElementById('pass-input').value === '1234') {
            loggedIn = true; updateLoginUI(); showToast('Inicio de sesión exitoso');
        } else { showToast('Credenciales incorrectas', 'error'); }
    });

    DOMElements.logoutBtn.addEventListener('click', () => { loggedIn = false; updateLoginUI(); showToast('Sesión cerrada correctamente', 'info'); });
    DOMElements.createEventBtn.addEventListener('click', () => openEventFormModal('create'));

    DOMElements.eventForm.addEventListener('submit', (e) => {
        e.preventDefault(); if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
        const formData = new FormData(DOMElements.eventForm);
        const eventData = Object.fromEntries(formData.entries());
        eventData.time = `${eventData.startHour}:${eventData.startMinute}`;
        delete eventData.startHour;
        delete eventData.startMinute;

        if (modalMode === 'create') {
            const newEvent = { ...eventData, id: String(Date.now()), status: "Programado" };
            events.unshift(newEvent); showToast('Evento creado con éxito');
        } else {
            const eventIndex = events.findIndex(ev => ev.id === editingEventId);
            if (eventIndex > -1) events[eventIndex] = { ...events[eventIndex], ...eventData };
            showToast('Evento actualizado con éxito');
        }
        saveEvents(); hideAllModals(); DOMElements.eventForm.reset(); fullRender();
    });

    DOMElements.eventList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        const card = e.target.closest('.event-card');
        if (editBtn) { openEventFormModal('edit', editBtn.dataset.eventId); }
        else if (deleteBtn) {
            if (confirm('¿Estás seguro?')) {
                events = events.filter(ev => ev.id !== deleteBtn.dataset.eventId);
                saveEvents(); fullRender(); showToast('Evento eliminado', 'info');
            }
        } else if (card) { openDetailModal(card.dataset.eventId); }
    });

    DOMElements.upcomingList.addEventListener('click', (e) => {
        const item = e.target.closest('li[data-event-id]');
        if (item) openDetailModal(item.dataset.eventId);
    });
    
    DOMElements.calendarGrid.addEventListener('click', (e) => {
        const eventEl = e.target.closest('div[data-event-id]');
        const dayEl = e.target.closest('span.day-number');
        if (eventEl) {
            openDetailModal(eventEl.dataset.eventId);
        } else if (dayEl) {
            const date = dayEl.closest('.calendar-day').dataset.date;
            selectedDate = selectedDate === date ? null : date;
            fullRender();
        }
    });

    DOMElements.prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); fullRender(); });
    DOMElements.nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); fullRender(); });
    
    document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(btn => btn.addEventListener('click', hideAllModals));
    [DOMElements.searchInput, DOMElements.categoryFilter, DOMElements.publicFilter].forEach(el => el.addEventListener('input', ()=>{ selectedDate = null; fullRender(); }));

    function formatDate(d, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
        const dd = new Date(d);
        dd.setMinutes(dd.getMinutes() + dd.getTimezoneOffset());
        return dd.toLocaleDateString('es-ES', options);
    }

    function addDaysToISO(n) {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return d.toISOString().slice(0, 10);
    }
    
    const init = () => { populateFilters(); fullRender(); updateLoginUI(); };
    init();
});
document.addEventListener('DOMContentLoaded', () => {
    const initialEvents = [
        { id: "ev1", title: "Seminario: Redes 6G", startDate: addDaysToISO(3), endDate: addDaysToISO(3), time: "10:00", description: "Charla sobre avances.", campus: "Campus San Joaquin", public: "Estudiantes", category: "Seminario", status: "Programado", duration: "1 hora", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" },
        { id: "ev2", title: "Congreso de IA", startDate: addDaysToISO(7), endDate: addDaysToISO(9), time: "09:00", description: "Congreso internacional de tres días.", campus: "Campus Valparaiso", public: "Profesores", category: "Conferencia", status: "Programado", duration: "Día completo", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" },
        { id: "ev3", title: "Ceremonia Bienvenida", startDate: addDaysToISO(12), endDate: addDaysToISO(12), time: "11:00", description: "Acto oficial.", campus: "Campus Viña del Mar", public: "Comunidad", category: "Ceremonia", status: "Programado", duration: "2 horas", organizerUnit: "Departamento Académico", specificDepartment: "Escuela de Ingeniería" }
    ];

    let events = JSON.parse(localStorage.getItem('events')) || initialEvents;
    let loggedIn = false;
    let currentDate = new Date();
    let selectedDate = null;
    let modalMode = 'create';
    let editingEventId = null;

    const DOMElements = {
        loginForm: document.getElementById('login-form'), adminOptions: document.getElementById('admin-options'), createEventBtn: document.getElementById('create-event-btn'),
        logoutBtn: document.getElementById('logout-btn'), eventList: document.getElementById('event-list'), upcomingList: document.getElementById('upcoming-events-list'),
        searchInput: document.getElementById('search-query'), categoryFilter: document.getElementById('filter-category'), publicFilter: document.getElementById('filter-public'),
        detailModal: document.getElementById('detail-modal'), detailTitle: document.getElementById('detail-title'), detailBody: document.getElementById('detail-body'),
        eventFormModal: document.getElementById('event-form-modal'), eventForm: document.getElementById('event-form'), formModalTitle: document.getElementById('form-modal-title'),
        monthYearDisplay: document.getElementById('month-year-display'), calendarGrid: document.getElementById('calendar-grid'),
        prevMonthBtn: document.getElementById('prev-month-btn'), nextMonthBtn: document.getElementById('next-month-btn'),
        eventListTitle: document.getElementById('event-list-title'), toastContainer: document.getElementById('toast-container')
    };

    const saveEvents = () => localStorage.setItem('events', JSON.stringify(events));

    const renderEvents = () => {
        const query = DOMElements.searchInput.value.toLowerCase();
        const cat = DOMElements.categoryFilter.value;
        const pub = DOMElements.publicFilter.value;
        DOMElements.eventListTitle.textContent = selectedDate ? `Eventos para el ${formatDate(selectedDate, { day: 'numeric', month: 'long' })}` : 'Eventos';
        const filtered = events.filter(e => {
            const matchesFilter = (e.title.toLowerCase().includes(query)) && (cat === 'Todos' || e.category === cat) && (pub === 'Todos' || e.public === pub);
            const matchesDate = !selectedDate || (selectedDate >= e.startDate && selectedDate <= e.endDate);
            return matchesFilter && matchesDate;
        });
        DOMElements.eventList.innerHTML = '';
        if (filtered.length === 0) { DOMElements.eventList.innerHTML = `<p class="text-gray-500 col-span-full text-center">No hay eventos.</p>`; return; }
        filtered.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card border rounded-lg p-4 shadow-sm bg-white text-gray-800 cursor-pointer hover:shadow-lg transition-shadow group relative';
            card.dataset.eventId = event.id;
            const adminControls = loggedIn ? `<div class="absolute bottom-2 right-2 hidden group-hover:flex gap-2"><button class="edit-btn p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-blue-600" title="Editar" data-event-id="${event.id}">✏️</button><button class="delete-btn p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-red-600" title="Eliminar" data-event-id="${event.id}">🗑️</button></div>` : '';
            const statusColor = event.status === 'En curso' ? 'bg-green-600' : 'bg-blue-600';
            card.innerHTML = `<div class="flex justify-between items-start"><h3 class="text-md font-semibold">${event.title}</h3><span class="text-xs px-2 py-1 rounded-full text-white ${statusColor}">${event.status}</span></div><p class="text-sm text-gray-500 mt-2 line-clamp-2">${event.description}</p><p class="text-sm text-gray-500 mt-3">${formatDate(event.startDate)} · ${event.time}</p><p class="text-sm text-gray-500 mt-1">${event.campus}</p>${adminControls}`;
            DOMElements.eventList.appendChild(card);
        });
    };
    
    const renderUpcomingEvents = () => {
        DOMElements.upcomingList.innerHTML = '';
        const upcoming = events.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 3);
        upcoming.forEach(event => {
            const item = document.createElement('li');
            item.className = 'py-3 cursor-pointer hover:bg-gray-50';
            item.dataset.eventId = event.id;
            item.innerHTML = `<div class="text-sm font-semibold text-gray-800">${event.title}</div><div class="text-xs text-gray-500 mt-1">${formatDate(event.startDate)} · ${event.campus}</div>`;
            DOMElements.upcomingList.appendChild(item);
        });
    };

    const renderCalendar = () => {
        DOMElements.calendarGrid.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        DOMElements.monthYearDisplay.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' })} ${year}`;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayHeaders.forEach(day => DOMElements.calendarGrid.innerHTML += `<div class="font-semibold text-xs text-gray-500 py-2">${day}</div>`);
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) DOMElements.calendarGrid.innerHTML += `<div></div>`;
        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventsOnDay = events.filter(e => dayStr >= e.startDate && dayStr <= e.endDate);
            const isSelected = dayStr === selectedDate;
            let eventsHtml = '';
            if (eventsOnDay.length > 0) {
                eventsHtml = eventsOnDay.map(e => {
                    let classes = 'bg-blue-100 text-blue-800 text-xs px-1 mt-1 truncate cursor-pointer hover:bg-blue-200 block';
                    if (e.startDate !== e.endDate) { if (dayStr === e.startDate) classes += ' rounded-l'; else if (dayStr === e.endDate) classes += ' rounded-r'; else classes += ' rounded-none'; } 
                    else { classes += ' rounded'; }
                    return `<div class="${classes}" data-event-id="${e.id}">${e.title}</div>`;
                }).join('');
            }
            const cell = document.createElement('div');
            cell.className = `calendar-day p-1 border rounded text-left align-top transition-colors ${isSelected ? 'bg-blue-100' : ''}`;
            cell.innerHTML = `<span class="day-number font-medium text-sm cursor-pointer">${day}</span>${eventsHtml}`;
            cell.dataset.date = dayStr;
            DOMElements.calendarGrid.appendChild(cell);
        }
    };

    const showToast = (message, type = 'success') => {
        const colors = { success: 'bg-green-600', info: 'bg-blue-600', error: 'bg-red-600' };
        const toast = document.createElement('div');
        toast.className = `${colors[type]} text-white text-sm py-2 px-4 rounded-lg shadow-md`;
        toast.textContent = message;
        DOMElements.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const populateFilters = () => {
        ['Todos', ...new Set(initialEvents.map(e => e.category))].forEach(c => DOMElements.categoryFilter.add(new Option(c, c)));
        ['Todos', 'Estudiantes', 'Profesores', 'Comunidad'].forEach(p => DOMElements.publicFilter.add(new Option(p, p)));
    };
    
    const updateLoginUI = () => {
        DOMElements.loginForm.classList.toggle('hidden', loggedIn);
        DOMElements.adminOptions.classList.toggle('hidden', !loggedIn);
        renderEvents();
    };

    const openEventFormModal = (mode, eventId = null) => {
        modalMode = mode;
        DOMElements.eventForm.reset();
        if (mode === 'edit') {
            editingEventId = eventId;
            const event = events.find(e => e.id === eventId);
            DOMElements.formModalTitle.textContent = 'Editar Evento';
            Object.keys(event).forEach(key => { if (DOMElements.eventForm[key]) DOMElements.eventForm[key].value = event[key]; });
            if (event.time) {
                const [hour, minute] = event.time.split(':');
                DOMElements.eventForm.startHour.value = hour;
                DOMElements.eventForm.startMinute.value = minute;
            }
        } else {
            editingEventId = null;
            DOMElements.formModalTitle.textContent = 'Crear Nuevo Evento';
        }
        DOMElements.eventFormModal.classList.remove('hidden');
    };

    const openDetailModal = (eventId) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        DOMElements.detailTitle.textContent = event.title;
        const dateRange = event.startDate === event.endDate ? formatDate(event.startDate) : `Del ${formatDate(event.startDate)} al ${formatDate(event.endDate)}`;
        DOMElements.detailBody.innerHTML = `<p><strong>Fechas:</strong> ${dateRange}</p><p><strong>Hora:</strong> ${event.time}</p><p><strong>Campus:</strong> ${event.campus}</p><p><strong>Categoría:</strong> ${event.category}</p><hr><p>${event.description}</p><hr><p><strong>Organiza:</strong> ${event.organizerUnit}</p>`;
        DOMElements.detailModal.classList.remove('hidden');
    };

    const hideAllModals = () => {
        DOMElements.detailModal.classList.add('hidden');
        DOMElements.eventFormModal.classList.add('hidden');
    };

    const fullRender = () => { renderEvents(); renderUpcomingEvents(); renderCalendar(); };

    DOMElements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (document.getElementById('user-input').value === 'admin' && document.getElementById('pass-input').value === '1234') {
            loggedIn = true; updateLoginUI(); showToast('Inicio de sesión exitoso');
        } else { showToast('Credenciales incorrectas', 'error'); }
    });

    DOMElements.logoutBtn.addEventListener('click', () => { loggedIn = false; updateLoginUI(); showToast('Sesión cerrada correctamente', 'info'); });
    DOMElements.createEventBtn.addEventListener('click', () => openEventFormModal('create'));

    DOMElements.eventForm.addEventListener('submit', (e) => {
        e.preventDefault(); if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
        const formData = new FormData(DOMElements.eventForm);
        const eventData = Object.fromEntries(formData.entries());
        eventData.time = `${eventData.startHour}:${eventData.startMinute}`;
        delete eventData.startHour;
        delete eventData.startMinute;

        if (modalMode === 'create') {
            const newEvent = { ...eventData, id: String(Date.now()), status: "Programado" };
            events.unshift(newEvent); showToast('Evento creado con éxito');
        } else {
            const eventIndex = events.findIndex(ev => ev.id === editingEventId);
            if (eventIndex > -1) events[eventIndex] = { ...events[eventIndex], ...eventData };
            showToast('Evento actualizado con éxito');
        }
        saveEvents(); hideAllModals(); DOMElements.eventForm.reset(); fullRender();
    });

    DOMElements.eventList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        const card = e.target.closest('.event-card');
        if (editBtn) { openEventFormModal('edit', editBtn.dataset.eventId); }
        else if (deleteBtn) {
            if (confirm('¿Estás seguro?')) {
                events = events.filter(ev => ev.id !== deleteBtn.dataset.eventId);
                saveEvents(); fullRender(); showToast('Evento eliminado', 'info');
            }
        } else if (card) { openDetailModal(card.dataset.eventId); }
    });

    DOMElements.upcomingList.addEventListener('click', (e) => {
        const item = e.target.closest('li[data-event-id]');
        if (item) openDetailModal(item.dataset.eventId);
    });
    
    DOMElements.calendarGrid.addEventListener('click', (e) => {
        const eventEl = e.target.closest('div[data-event-id]');
        const dayEl = e.target.closest('span.day-number');
        if (eventEl) {
            openDetailModal(eventEl.dataset.eventId);
        } else if (dayEl) {
            const date = dayEl.closest('.calendar-day').dataset.date;
            selectedDate = selectedDate === date ? null : date;
            fullRender();
        }
    });

    DOMElements.prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); fullRender(); });
    DOMElements.nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); fullRender(); });
    
    document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(btn => btn.addEventListener('click', hideAllModals));
    [DOMElements.searchInput, DOMElements.categoryFilter, DOMElements.publicFilter].forEach(el => el.addEventListener('input', ()=>{ selectedDate = null; fullRender(); }));

    function formatDate(d, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
        const dd = new Date(d);
        dd.setMinutes(dd.getMinutes() + dd.getTimezoneOffset());
        return dd.toLocaleDateString('es-ES', options);
    }

    function addDaysToISO(n) {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return d.toISOString().slice(0, 10);
    }
    
    const init = () => { populateFilters(); fullRender(); updateLoginUI(); };
    init();
});