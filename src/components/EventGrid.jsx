import { formatDate } from '../utils/date.js';

const statusColor = {
  Programado: 'bg-blue-600',
  'En curso': 'bg-green-600',
  Finalizado: 'bg-gray-500',
};

const EventCard = ({ event, loggedIn, onSelect, onEdit, onDelete }) => {
  const badgeColor = statusColor[event.status] || 'bg-blue-600';

  return (
    <article
      className="event-card border rounded-lg p-4 shadow-sm bg-white text-gray-800 hover:shadow-lg transition-shadow group relative"
      onClick={() => onSelect(event.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold">{event.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full text-white ${badgeColor}`}>
          {event.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
      <p className="text-sm text-gray-500 mt-3">
        {formatDate(event.startDate)} - {event.time}
      </p>
      <p className="text-sm text-gray-500 mt-1">{event.campus}</p>
      {loggedIn && (
        <div className="absolute bottom-2 right-2 hidden group-hover:flex gap-2">
          <button
            onClick={(eventClick) => {
              eventClick.stopPropagation();
              onEdit(event.id);
            }}
            className="p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={(eventClick) => {
              eventClick.stopPropagation();
              onDelete(event.id);
            }}
            className="p-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      )}
    </article>
  );
};

const EventGrid = ({ title, events, loggedIn, onSelect, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <span className="text-xs text-gray-400">{events.length} evento(s)</span>
    </div>
    {events.length === 0 ? (
      <p className="text-gray-500 text-center">No hay eventos para los filtros seleccionados.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            loggedIn={loggedIn}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);

export default EventGrid;
