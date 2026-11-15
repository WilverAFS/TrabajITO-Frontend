import { solicitud } from './apiClient.js'

// Endpoints de administración de la cuenta autenticada.
export function obtenerMiCuenta({ signal } = {}) {
  return solicitud('/me', { signal, autenticado: true })
}

export function actualizarMiCuenta(datos) {
  return solicitud('/me', { method: 'PATCH', data: datos, autenticado: true })
}

export function cambiarMiContrasena(datos) {
  return solicitud('/me/password', { method: 'PATCH', data: datos, autenticado: true })
}
