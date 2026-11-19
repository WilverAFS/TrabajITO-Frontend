export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export function fechaLegible(fecha, conHora = false) {
  if (!fecha) return '—'
  const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(fecha)
  const fechaLocal = new Date(soloFecha ? `${fecha}T12:00:00` : fecha)
  if (Number.isNaN(fechaLocal.getTime())) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium', ...(conHora ? { timeStyle: 'short' } : {}),
  }).format(fechaLocal)
}

export function iniciales(nombre = '') {
  return nombre.trim().split(/\s+/).slice(0, 2).map((porcion) => porcion[0] ?? '').join('').toUpperCase()
}
