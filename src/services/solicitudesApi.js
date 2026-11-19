import { solicitud } from './apiClient.js'

// Historial de solicitudes del perfil profesional autenticado.
export function listarMisSolicitudes({ signal } = {}) {
  return solicitud('/me/perfil/solicitudes-habilitacion', {
    autenticado: true,
    signal,
  })
}
