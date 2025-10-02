import { useEffect, useState } from 'react';

const defaultEvent = {
  title: '',
  startDate: '',
  endDate: '',
  time: '',
  campus: '',
  category: '',
  public: '',
  status: 'Programado',
  duration: '',
  description: '',
  organizerUnit: '',
  specificDepartment: '',
};

const categories = ['Seminario', 'Taller', 'Conferencia', 'Ceremonia', 'Social'];
const publics = ['Estudiantes', 'Profesores', 'Comunidad'];
const campuses = ['Campus San Joaquin', 'Campus Valparaiso', 'Campus Vina del Mar', 'Campus Concepcion'];
const durations = ['30 minutos', '1 hora', '2 horas', '4 horas', 'Dia completo'];
const statuses = ['Programado', 'En curso', 'Finalizado'];

const Field = ({ label, children }) => (
  <label className="block text-sm text-white">
    <span className="font-semibold">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full bg-white/10 border border-blue-500 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 ${props.className || ''}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full bg-blue-800 border border-blue-500 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 ${props.className || ''}`}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={`w-full bg-white/10 border border-blue-500 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 ${props.className || ''}`}
  />
);

const EventForm = ({ mode, initialValues, onSubmit, onCancel }) => {
  const [form, setForm] = useState(defaultEvent);

  useEffect(() => {
    if (initialValues) {
      setForm({ ...defaultEvent, ...initialValues });
    } else {
      setForm(defaultEvent);
    }
  }, [initialValues]);

  const handleChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="text-white">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {mode === 'edit' ? 'Editar evento' : 'Crear evento'}
          </h2>
          <p className="text-sm text-blue-200">
            Los cambios se guardaran en localStorage.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-2xl text-blue-200 hover:text-white"
          aria-label="Cerrar"
        >
          X
        </button>
      </header>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-blue-600 pb-2">Datos del evento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="Titulo del evento">
              <Input value={form.title} onChange={handleChange('title')} required />
            </Field>
          </div>
          <Field label="Fecha de inicio">
            <Input type="date" value={form.startDate} onChange={handleChange('startDate')} required />
          </Field>
          <Field label="Fecha de fin">
            <Input type="date" value={form.endDate} onChange={handleChange('endDate')} required />
          </Field>
          <Field label="Hora de inicio">
            <Input type="time" value={form.time} onChange={handleChange('time')} required />
          </Field>
          <Field label="Duracion">
            <Select value={form.duration} onChange={handleChange('duration')} required>
              <option value="">Seleccionar...</option>
              {durations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Descripcion">
            <TextArea rows={4} value={form.description} onChange={handleChange('description')} required />
          </Field>
          <Field label="Campus">
            <Select value={form.campus} onChange={handleChange('campus')} required>
              <option value="">Seleccionar...</option>
              {campuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Categoria">
            <Select value={form.category} onChange={handleChange('category')} required>
              <option value="">Seleccionar...</option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Publico">
            <Select value={form.public} onChange={handleChange('public')} required>
              <option value="">Seleccionar...</option>
              {publics.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select value={form.status} onChange={handleChange('status')} required>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold border-b border-blue-600 pb-2">
          Datos del organizador
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Unidad que organiza">
            <Input value={form.organizerUnit} onChange={handleChange('organizerUnit')} required />
          </Field>
          <Field label="Departamento especifico">
            <Input value={form.specificDepartment} onChange={handleChange('specificDepartment')} required />
          </Field>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-blue-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-400 text-blue-900 rounded font-semibold hover:bg-yellow-500"
        >
          Guardar evento
        </button>
      </div>
    </form>
  );
};

export default EventForm;
