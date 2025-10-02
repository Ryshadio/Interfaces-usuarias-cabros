const today = new Date();

const offsetISODate = (days) => {
  const copy = new Date(today);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().slice(0, 10);
};

export const initialEvents = [
  {
    id: 'ev1',
    title: 'Seminario Redes 6G',
    startDate: offsetISODate(3),
    endDate: offsetISODate(3),
    time: '10:00',
    description: 'Repaso rapido de la evolucion hacia redes 6G y casos de uso.',
    campus: 'Campus San Joaquin',
    public: 'Estudiantes',
    category: 'Seminario',
    status: 'Programado',
    duration: '1 hora',
    organizerUnit: 'Departamento Academico',
    specificDepartment: 'Escuela de Ingenieria'
  },
  {
    id: 'ev2',
    title: 'Congreso IA 2025',
    startDate: offsetISODate(7),
    endDate: offsetISODate(9),
    time: '09:00',
    description: 'Tres dias de charlas y demos sobre inteligencia artificial aplicada.',
    campus: 'Campus Valparaiso',
    public: 'Profesores',
    category: 'Conferencia',
    status: 'Programado',
    duration: 'Dia completo',
    organizerUnit: 'Departamento Academico',
    specificDepartment: 'Escuela de Ingenieria'
  },
  {
    id: 'ev3',
    title: 'Ceremonia de Bienvenida',
    startDate: offsetISODate(12),
    endDate: offsetISODate(12),
    time: '11:00',
    description: 'Inicio de semestre para nuevas cohortes.',
    campus: 'Campus Vina del Mar',
    public: 'Comunidad',
    category: 'Ceremonia',
    status: 'Programado',
    duration: '2 horas',
    organizerUnit: 'Departamento Academico',
    specificDepartment: 'Escuela de Ingenieria'
  }
];

