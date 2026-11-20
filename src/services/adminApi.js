import { solicitud } from './apiClient.js'

// --- WI-5001: Gestión de usuarios ---
export function listarUsuariosAdmin({
  pagina = 1,
  per_page = 15,
  buscar,
  activo,
  es_administrador,
  signal,
} = {}) {
  const params = { page: pagina, per_page }
  if (buscar) params.buscar = buscar
  if (activo !== undefined && activo !== '') params.activo = activo
  if (es_administrador !== undefined && es_administrador !== '') {
    params.es_administrador = es_administrador
  }

  return solicitud('/admin/usuarios', {
    params,
    autenticado: true,
    conMeta: true,
    signal,
  })
}

export function obtenerUsuarioAdmin(id, { signal } = {}) {
  return solicitud(`/admin/usuarios/${encodeURIComponent(id)}`, {
    autenticado: true,
    signal,
  })
}

export function suspenderUsuarioAdmin(id) {
  return solicitud(`/admin/usuarios/${encodeURIComponent(id)}/suspender`, {
    method: 'PATCH',
    autenticado: true,
  })
}

export function reactivarUsuarioAdmin(id) {
  return solicitud(`/admin/usuarios/${encodeURIComponent(id)}/reactivar`, {
    method: 'PATCH',
    autenticado: true,
  })
}

// --- WI-5004: Verificación de trabajadores (solicitudes de habilitación) ---
export function listarSolicitudesHabilitacionAdmin({
  pagina = 1,
  per_page = 15,
  id_estado,
  direction = 'desc',
  signal,
} = {}) {
  const params = { page: pagina, per_page, sort: 'fecha_solicitud', direction }
  if (id_estado) params.id_estado = id_estado

  return solicitud('/admin/solicitudes-habilitacion', {
    params,
    autenticado: true,
    conMeta: true,
    signal,
  })
}

export function obtenerSolicitudHabilitacionAdmin(id, { signal } = {}) {
  return solicitud(`/admin/solicitudes-habilitacion/${encodeURIComponent(id)}`, {
    autenticado: true,
    signal,
  })
}

export function marcarSolicitudEnRevision(id) {
  return solicitud(`/admin/solicitudes-habilitacion/${encodeURIComponent(id)}/revisar`, {
    method: 'PATCH',
    autenticado: true,
  })
}

export function aprobarSolicitudHabilitacion(id, comentario_revision = '') {
  const data = comentario_revision.trim() ? { comentario_revision: comentario_revision.trim() } : {}
  return solicitud(`/admin/solicitudes-habilitacion/${encodeURIComponent(id)}/aprobar`, {
    method: 'PATCH',
    autenticado: true,
    data,
  })
}

export function rechazarSolicitudHabilitacion(id, comentario_revision) {
  return solicitud(`/admin/solicitudes-habilitacion/${encodeURIComponent(id)}/rechazar`, {
    method: 'PATCH',
    autenticado: true,
    data: { comentario_revision: comentario_revision.trim() },
  })
}

// --- WI-5002: Moderación de publicaciones ---
export function ocultarPublicacionAdmin(id) {
  return solicitud(`/admin/publicaciones/${encodeURIComponent(id)}/ocultar`, {
    method: 'PATCH',
    autenticado: true,
  })
}
export function obtenerPublicacionAdmin(id, { signal } = {}) {
  return solicitud(`/publicaciones/${encodeURIComponent(id)}`, {
    autenticado: true,
    signal,
  })
}
// --- WI-5003: Gestión de reportes ---
export function listarReportesAdmin({
  pagina = 1,
  per_page = 15,
  id_estado,
  tipo_objetivo,
  buscar,
  direction = 'desc',
  signal,
} = {}) {
  const params = { page: pagina, per_page, sort: 'fecha_creacion', direction }
  if (id_estado) params.id_estado = id_estado
  if (tipo_objetivo) params.tipo_objetivo = tipo_objetivo
  if (buscar) params.buscar = buscar

  return solicitud('/admin/reportes', {
    params,
    autenticado: true,
    conMeta: true,
    signal,
  })
}

export function obtenerReporteAdmin(id, { signal } = {}) {
  return solicitud(`/admin/reportes/${encodeURIComponent(id)}`, {
    autenticado: true,
    signal,
  })
}

export function marcarReporteEnRevision(id) {
  return solicitud(`/admin/reportes/${encodeURIComponent(id)}/revisar`, {
    method: 'PATCH',
    autenticado: true,
  })
}

export function resolverReporteAdmin(id, resolucion) {
  return solicitud(`/admin/reportes/${encodeURIComponent(id)}/resolver`, {
    method: 'PATCH',
    autenticado: true,
    data: { resolucion: resolucion.trim() },
  })
}