import { solicitud } from './apiClient.js'

// API 15: perfil profesional del usuario autenticado.
export function obtenerPerfilProfesional({ signal } = {}) {
  return solicitud('/me/perfil', { signal, autenticado: true })
}

export function crearPerfilProfesional(datos) {
  return solicitud('/perfiles', { method: 'POST', data: datos, autenticado: true })
}

export function actualizarPerfilProfesional(datos) {
  return solicitud('/me/perfil', { method: 'PATCH', data: datos, autenticado: true })
}

export function actualizarOficiosProfesionales(oficios) {
  return solicitud('/me/perfil/oficios', {
    method: 'PUT',
    data: { oficios },
    autenticado: true,
  })
}
