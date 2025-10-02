import { buildCalendarMatrix } from '../utils/date.js';

const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const Calendar = ({
  currentDate,
  onPrev,
  onNext,
  events,
  onSelectDate,
  selectedDate,
}) => {
  const monthLabel = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  const matrix = buildCalendarMatrix(currentDate);

  const eventsByDay = events.reduce((acc, event) => {
    const start = new Date(`${event.startDate}T00:00:00`);
    const end = new Date(`${event.endDate}T00:00:00`);
    const cursor = new Date(start);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      acc[iso] = acc[iso] || [];
      acc[iso].push(event);
      cursor.setDate(cursor.getDate() + 1);
    }
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrev}
          className="p-2 border rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold capitalize">{monthLabel}</h2>
        <button
          onClick={onNext}
          className="p-2 border rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2 uppercase">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {matrix.map((cell) => {
          const dayEvents = (eventsByDay[cell.iso] || []).slice(0, 2);
          const hasMore = (eventsByDay[cell.iso] || []).length - dayEvents.length;
          const isSelected = selectedDate === cell.iso;
          const baseClasses = 'calendar-day rounded border min-h-[90px] flex flex-col gap-1 p-2 cursor-pointer';
          const variant = cell.inCurrentMonth ? 'bg-white hover:border-blue-300' : 'bg-gray-50 text-gray-400';
          const selected = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : '';
          return (
            <div
              key={cell.iso}
              className={`${baseClasses} ${variant} ${selected}`.trim()}
              onClick={() => onSelectDate(cell.iso)}
              data-date={cell.iso}
            >
              <span className="day-number text-sm font-semibold">{cell.day}</span>
              <div className="flex flex-col gap-1">
                {dayEvents.map((event) => (
                  <span
                    key={event.id}
                    className="text-[11px] px-2 py-1 rounded bg-blue-100 text-blue-800 truncate"
                  >
                    {event.title}
                  </span>
                ))}
                {hasMore > 0 && (
                  <span className="text-[11px] text-gray-500">+{hasMore} mas</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
