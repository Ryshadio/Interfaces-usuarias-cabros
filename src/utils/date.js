const toISODate = (date) => date.toISOString().slice(0, 10);

export const parseISODate = (value) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  const date = parseISODate(value);
  if (!date) {
    return value;
  }
  return date.toLocaleDateString('es-ES', options);
};

export const buildCalendarMatrix = (referenceDate) => {
  const current = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const firstDayIndex = (current.getDay() + 6) % 7; // lunes = 0
  const daysInCurrentMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = firstDayIndex; i > 0; i -= 1) {
    const date = new Date(current.getFullYear(), current.getMonth(), 1 - i);
    cells.push({
      iso: toISODate(date),
      day: date.getDate(),
      inCurrentMonth: false,
    });
  }
  for (let d = 1; d <= daysInCurrentMonth; d += 1) {
    const date = new Date(current.getFullYear(), current.getMonth(), d);
    cells.push({
      iso: toISODate(date),
      day: d,
      inCurrentMonth: true,
    });
  }
  while (cells.length % 7 !== 0) {
    const last = parseISODate(cells[cells.length - 1].iso);
    const date = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    cells.push({
      iso: toISODate(date),
      day: date.getDate(),
      inCurrentMonth: false,
    });
  }
  return cells;
};
