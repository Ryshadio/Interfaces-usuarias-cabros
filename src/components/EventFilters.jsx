const FieldLabel = ({ children }) => (
  <label className="block text-sm font-medium text-gray-600 mb-1">{children}</label>
);

const EventFilters = ({ filters, categoryOptions, publicOptions, onChange, onClearDate }) => {
  const handleChange = (key) => (event) => {
    onChange({ ...filters, [key]: event.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
      <div className="mb-5">
        <FieldLabel>Buscar</FieldLabel>
        <input
          value={filters.query}
          onChange={handleChange('query')}
          placeholder="Buscar por titulo"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="mb-5">
        <FieldLabel>Categoria</FieldLabel>
        <select
          value={filters.category}
          onChange={handleChange('category')}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white"
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <FieldLabel>Publico</FieldLabel>
        <select
          value={filters.public}
          onChange={handleChange('public')}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white"
        >
          {publicOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {filters.selectedDate && (
        <button
          onClick={onClearDate}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Limpiar fecha seleccionada
        </button>
      )}
    </div>
  );
};

export default EventFilters;
