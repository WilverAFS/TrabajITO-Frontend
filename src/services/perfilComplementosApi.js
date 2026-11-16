import { resolverUrlBackend, solicitud } from './apiClient.js'

// API 16, 17 y 18: disponibilidad, certificados y habilitación.
export function listarDisponibilidades({ signal } = {}) {
  return solicitud('/me/perfil/disponibilidades', { signal, autenticado: true })
}

export function crearDisponibilidad(datos) {
  return solicitud('/me/perfil/disponibilidades', {
    method: 'POST',
    data: datos,
    autenticado: true,
  })
}

export function editarDisponibilidad(id, datos) {
  return solicitud(`/me/perfil/disponibilidades/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    data: datos,
    autenticado: true,
  })
}

export function eliminarDisponibilidad(id) {
  return solicitud(`/me/perfil/disponibilidades/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    autenticado: true,
  })
}

export function listarCertificados({ signal } = {}) {
  return solicitud('/me/perfil/certificados', { signal, autenticado: true })
}

export function crearCertificado(formulario) {
  // FormData: Axios deja que el navegador genere el boundary.
  return solicitud('/me/perfil/certificados', {
    method: 'POST',
    data: formulario,
    autenticado: true,
  })
}

export function eliminarCertificado(id) {
  return solicitud(`/me/perfil/certificados/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    autenticado: true,
  })
}

// Documento_url viene como /storage/... y se publica desde Laravel, NO Vite.
export function enlaceDocumento(documentoUrl) {
  if (typeof documentoUrl !== 'string' || !documentoUrl.startsWith('/storage/')) return null
  return resolverUrlBackend(documentoUrl)
}

export function listarSolicitudesHabilitacion({ signal } = {}) {
  return solicitud('/me/perfil/solicitudes-habilitacion', { signal, autenticado: true })
}

export function enviarSolicitudHabilitacion() {
  return solicitud('/me/perfil/solicitudes-habilitacion', {
    method: 'POST',
    autenticado: true,
  })
}
