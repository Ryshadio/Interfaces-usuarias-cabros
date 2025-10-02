import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import EventFilters from './components/EventFilters.jsx';
import EventGrid from './components/EventGrid.jsx';
import UpcomingEvents from './components/UpcomingEvents.jsx';
import Calendar from './components/Calendar.jsx';
import Modal from './components/Modal.jsx';
import EventForm from './components/EventForm.jsx';
import ToastStack from './components/ToastStack.jsx';
import { initialEvents } from './data/initialEvents.js';
import { formatDate } from './utils/date.js';

const STORAGE_KEY = 'event-tracker-events';

const App = () => {
  const loadEvents = () => {
    if (typeof window === 'undefined') {
      return initialEvents;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error parsing events from localStorage', error);
    }
    return initialEvents;
  };

  const [events, setEvents] = useState(loadEvents);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    category: 'Todos',
    public: 'Todos',
    selectedDate: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [detailEventId, setDetailEventId] = useState(null);
  const [formState, setFormState] = useState({ open: false, mode: 'create', event: null });
  const [toasts, setToasts] = useState([]);

  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const handleLogin = ({ username, password }) => {
    if (username === 'admin' && password === '1234') {
      setLoggedIn(true);
      pushToast('Inicio de sesion exitoso', 'success');
      return true;
    }
    pushToast('Credenciales incorrectas', 'error');
    return false;
  };

  const handleLogout = () => {
    setLoggedIn(false);
    pushToast('Sesion cerrada correctamente', 'info');
  };

  const categoryOptions = useMemo(() => {
    const unique = new Set(events.map((event) => event.category));
    return ['Todos', ...Array.from(unique).sort()];
  }, [events]);

  const publicOptions = useMemo(() => {
    const unique = new Set(events.map((event) => event.public));
    return ['Todos', ...Array.from(unique).sort()];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery = event.title.toLowerCase().includes(normalizedQuery);
      const matchesCategory = filters.category === 'Todos' || event.category === filters.category;
      const matchesPublic = filters.public === 'Todos' || event.public === filters.public;
      const matchesDate =
        !filters.selectedDate ||
        (event.startDate <= filters.selectedDate && event.endDate >= filters.selectedDate);
      return matchesQuery && matchesCategory && matchesPublic && matchesDate;
    });
  }, [events, filters]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);
    return events
      .filter((event) => event.endDate >= todayIso)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 5);
  }, [events]);

  const detailEvent = detailEventId ? events.find((event) => event.id === detailEventId) : null;

  const openCreateModal = () => {
    setFormState({ open: true, mode: 'create', event: null });
  };

  const openEditModal = (id) => {
    const found = events.find((event) => event.id === id);
    if (found) {
      setFormState({ open: true, mode: 'edit', event: found });
    }
  };

  const closeFormModal = () => {
    setFormState({ open: false, mode: 'create', event: null });
  };

  const handleDeleteEvent = (id) => {
    const target = events.find((event) => event.id === id);
    if (!target) {
      return;
    }
    if (window.confirm(`Seguro que deseas eliminar "${target.title}"?`)) {
      setEvents((current) => current.filter((event) => event.id !== id));
      pushToast('Evento eliminado', 'info');
      if (detailEventId === id) {
        setDetailEventId(null);
      }
    }
  };

  const handleSubmitEvent = (formData) => {
    if (formData.endDate < formData.startDate) {
      pushToast('La fecha de fin debe ser posterior a la de inicio', 'error');
      return;
    }

    if (formState.mode === 'edit' && formState.event) {
      setEvents((current) =>
        current.map((event) =>
          event.id === formState.event.id ? { ...formData, id: event.id } : event
        )
      );
      pushToast('Evento actualizado con exito', 'success');
    } else {
      const newEvent = {
        ...formData,
        id: `ev-${Date.now()}`,
      };
      setEvents((current) => [newEvent, ...current]);
      pushToast('Evento creado con exito', 'success');
    }
    closeFormModal();
  };

  const currentTitle = filters.selectedDate
    ? `Eventos para el ${formatDate(filters.selectedDate, { day: 'numeric', month: 'long' })}`
    : 'Eventos';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 h-3 w-full" />

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <Header
          loggedIn={loggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onOpenCreate={openCreateModal}
        />

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <EventFilters
              filters={filters}
              categoryOptions={categoryOptions}
              publicOptions={publicOptions}
              onChange={(nextFilters) => setFilters(nextFilters)}
              onClearDate={() => setFilters((current) => ({ ...current, selectedDate: null }))}
            />
            <UpcomingEvents events={upcomingEvents} onSelect={setDetailEventId} />
          </aside>

          <main className="lg:col-span-3">
            <EventGrid
              title={currentTitle}
              events={filteredEvents}
              loggedIn={loggedIn}
              onSelect={setDetailEventId}
              onEdit={openEditModal}
              onDelete={handleDeleteEvent}
            />

            <Calendar
              currentDate={currentDate}
              onPrev={() => setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
              onNext={() => setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
              events={events}
              onSelectDate={(iso) =>
                setFilters((current) => ({
                  ...current,
                  selectedDate: current.selectedDate === iso ? null : iso,
                }))
              }
              selectedDate={filters.selectedDate}
            />
          </main>
        </section>
      </div>

      <Modal
        open={Boolean(detailEvent)}
        onClose={() => setDetailEventId(null)}
        showClose={false}
        contentClassName="bg-white rounded-lg w-full max-w-2xl"
      >
        {detailEvent && (
          <div>
            <header className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{detailEvent.title}</h2>
                <p className="text-sm text-gray-500">{detailEvent.campus}</p>
              </div>
              <button
                onClick={() => setDetailEventId(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Cerrar"
              >
                X
              </button>
            </header>
            <div className="p-6 space-y-4 text-gray-700">
              <p>
                <strong>Fechas:</strong>{' '}
                {detailEvent.startDate === detailEvent.endDate
                  ? formatDate(detailEvent.startDate)
                  : `Del ${formatDate(detailEvent.startDate)} al ${formatDate(detailEvent.endDate)}`}
              </p>
              <p>
                <strong>Hora:</strong> {detailEvent.time}
              </p>
              <p>
                <strong>Categoria:</strong> {detailEvent.category}
              </p>
              <p>
                <strong>Publico:</strong> {detailEvent.public}
              </p>
              <p className="leading-relaxed whitespace-pre-line">{detailEvent.description}</p>
              <hr />
              <p>
                <strong>Organiza:</strong> {detailEvent.organizerUnit}
              </p>
              <p>
                <strong>Departamento:</strong> {detailEvent.specificDepartment}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={formState.open}
        onClose={closeFormModal}
        showClose={false}
        contentClassName="bg-blue-800 rounded-lg w-full max-w-4xl"
      >
        {formState.open && (
          <div className="p-8">
            <EventForm
              mode={formState.mode}
              initialValues={formState.event}
              onSubmit={handleSubmitEvent}
              onCancel={closeFormModal}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;





