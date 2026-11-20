import { solicitud } from './apiClient.js'

// Listar notificaciones con filtro y paginación.
export function listarNotificaciones({
  leida,
  pagina = 1,
  porPagina = 10,
  signal,
} = {}) {
  const params = {
    page: pagina,
    per_page: porPagina,
  }

  if (leida !== undefined && leida !== null && leida !== '') {
    params.leida = leida
  }

  return solicitud('/notificaciones', {
    params,
    autenticado: true,
    conMeta: true,
    signal,
  })
}

export function contarNotificacionesNoLeidas({ signal } = {}) {
  return solicitud('/notificaciones/no-leidas/count', {
    autenticado: true,
    signal,
  })
}

export function marcarNotificacionComoLeida(id, { signal } = {}) {
  return solicitud(
    `/notificaciones/${encodeURIComponent(id)}/leer`,
    {
      method: 'PATCH',
      autenticado: true,
      signal,
    },
  )
}

export function marcarTodasNotificacionesComoLeidas({ signal } = {}) {
  return solicitud('/notificaciones/leer-todas', {
    method: 'PATCH',
    autenticado: true,
    signal,
  })
}
