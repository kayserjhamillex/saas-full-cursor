export const modules = [
  { key: 'dashboard', to: '/', label: 'Inicio', enabled: true },
  { key: 'patients', to: '/pacientes', label: 'Pacientes', enabled: true },
  { key: 'clinical', to: '/historias-clinicas', label: 'Historias clinicas', enabled: true },
  { key: 'scheduling', to: '/agendamiento', label: 'Agendamiento', enabled: true },
  { key: 'availability', to: '/disponibilidad', label: 'Disponibilidad', enabled: true },
  { key: 'inventory', to: '/inventario', label: 'Inventario', enabled: false },
  { key: 'assets', to: '/patrimonio', label: 'Patrimonio', enabled: false },
  { key: 'hr', to: '/rrhh', label: 'RRHH', enabled: false },
  { key: 'finance', to: '/finanzas', label: 'Economia y financiacion', enabled: false },
  { key: 'ai', to: '/ia', label: 'IA clinica', enabled: false },
  { key: 'external', to: '/servicios', label: 'Servicios externos', enabled: true },
]

export const dashboardSummary = [
  { label: 'Citas del dia', value: '32' },
  { label: 'Pacientes en sala', value: '11' },
  { label: 'Alertas clinicas', value: '4' },
]

export const shellPlaceholderRoutes = [
  {
    path: '/',
    title: 'Inicio',
    description: 'Vista principal para seguimiento rapido de operacion, prioridades, pagos y riesgo clinico.',
    bullets: [
      'Atencion en curso',
      'Pendientes de caja',
      'Recordatorios de agenda',
      'Estado de modulos por suscripcion',
    ],
  },
  {
    path: '/pacientes',
    title: 'Pacientes',
    description: 'Gestion de ficha, historial y accesos directos a atencion frecuente.',
    bullets: ['Busqueda por documento', 'Ultimas consultas', 'Alertas de seguimiento'],
  },
  {
    path: '/historias-clinicas',
    title: 'Historias clinicas',
    description: 'Gestion longitudinal de consultas, diagnosticos, tratamientos y evoluciones.',
    bullets: ['Timeline clinico', 'Odontograma', 'Notas de evolucion'],
  },
  {
    path: '/agendamiento',
    title: 'Agendamiento',
    description: 'Planificacion de citas con reglas de disponibilidad y no solapamiento.',
    bullets: ['Calendario', 'Reprogramaciones', 'Estados de cita'],
  },
  {
    path: '/disponibilidad',
    title: 'Disponibilidad',
    description: 'Bloques de horario por profesional, fecha y estado operativo.',
    bullets: ['Horario base', 'Bloqueos', 'Huecos disponibles'],
  },
]

export const shellLockedRoutes = [
  { path: '/inventario', title: 'Inventario' },
  { path: '/patrimonio', title: 'Patrimonio' },
  { path: '/rrhh', title: 'RRHH' },
  { path: '/finanzas', title: 'Economia y financiacion' },
  { path: '/ia', title: 'IA clinica' },
]
