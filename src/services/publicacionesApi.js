import { solicitud } from './apiClient.js'

export function listarTrabajosPublicos({ id, signal }) {
  return solicitud(`/publicaciones/trabajador/${encodeURIComponent(id)}`, { signal })
}

export function obtenerPublicacion({ id, privada = false, signal }) {
  return solicitud(`/publicaciones/${encodeURIComponent(id)}`, { autenticado: privada, signal })
}

export function listarMisTrabajos({ signal } = {}) {
  return solicitud('/me/perfil/publicaciones', { autenticado: true, signal })
}

export function listarTiposPublicacion({ signal } = {}) {
  return solicitud('/tipos-publicacion', { autenticado: true, signal })
}

export function crearPublicacion(id, data) {
  return solicitud(`/contrataciones/${encodeURIComponent(id)}/publicacion`, {
    method: 'POST', autenticado: true, data,
  })
}

export function editarPublicacion(id, data) {
  return solicitud(`/publicaciones/${encodeURIComponent(id)}`, {
    method: 'PATCH', autenticado: true, data,
  })
}

export function cargarEvidencias(id, archivos) {
  const data = new FormData()
  for (const archivo of archivos) data.append('archivos[]', archivo)
  return solicitud(`/publicaciones/${encodeURIComponent(id)}/evidencias`, {
    method: 'POST', autenticado: true, data,
  })
}

export function eliminarEvidencia(id) {
  return solicitud(`/evidencias/${encodeURIComponent(id)}`, { method: 'DELETE', autenticado: true })
}
