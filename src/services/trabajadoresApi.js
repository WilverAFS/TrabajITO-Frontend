import { solicitud } from './apiClient.js'

// API 19: exploración pública de trabajadores.
export function listarTrabajadores({
  pagina = 1,
  id_oficio,
  id_municipio,
  calificacion_minima,
  buscar,
  per_page,
  sort,
  direction,
  signal,
} = {}) {
  const params = { page: pagina }

  if (id_oficio) params.id_oficio = id_oficio
  if (id_municipio) params.id_municipio = id_municipio
  if (calificacion_minima) params.calificacion_minima = calificacion_minima
  if (buscar) params.buscar = buscar
  if (per_page) params.per_page = per_page
  if (sort) params.sort = sort
  if (direction) params.direction = direction

  return solicitud('/trabajadores', { params, signal })
}
export function obtenerTrabajadorPublico(id, { signal } = {}) {
  return solicitud(`/trabajadores/${id}`, { signal, autenticado: false });
}