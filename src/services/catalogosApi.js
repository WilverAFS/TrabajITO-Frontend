import { solicitud } from './apiClient.js'

// Catálogos públicos de Laravel compartidos por varias vistas.
export function listarEstados({ signal } = {}) {
  return solicitud('/estados', { signal })
}

export function listarMunicipios(idEstado, { signal } = {}) {
  return solicitud(`/estados/${encodeURIComponent(idEstado)}/municipios`, { signal })
}

export function listarOficios({ signal } = {}) {
  return solicitud('/oficios', { signal })
}
