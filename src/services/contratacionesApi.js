import { solicitud } from './apiClient.js'

// API 20: crear solicitud de contratación (autenticado).
export function crearContratacion({ id_trabajador, descripcion_servicio }, { signal } = {}) {
  return solicitud('/contrataciones', {
    method: 'POST',
    autenticado: true,
    data: {
      id_trabajador: Number(id_trabajador),
      descripcion_servicio,
    },
    signal,
  })
}