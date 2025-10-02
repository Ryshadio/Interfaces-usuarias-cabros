import { formatDate } from '../utils/date.js';

const UpcomingEvents = ({ events, onSelect }) => {
  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-base font-semibold mb-2">Proximos eventos</h2>
        <p className="text-sm text-gray-500">Sin eventos en los proximos dias.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-base font-semibold mb-3">Proximos eventos</h2>
      <ul className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id} data-event-id={event.id} className="py-3">
            <button
              onClick={() => onSelect(event.id)}
              className="text-left w-full"
            >
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-500">
                {formatDate(event.startDate, { day: 'numeric', month: 'long' })}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
