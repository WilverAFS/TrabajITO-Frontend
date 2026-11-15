// API 15: perfil profesional. No modifica el servicio de cuenta existente.
const BASE_API = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/+$/, '')

export class ErrorPerfil extends Error {
  constructor(mensaje, status = 0, codigo = '') {
    super(mensaje)
    this.name = 'ErrorPerfil'
    this.status = status
    this.codigo = codigo
  }
}

async function solicitud(ruta, { method = 'GET', body, autenticado = false, signal } = {}) {
  const headers = { Accept: 'application/json' }

  if (autenticado) {
    const token = localStorage.getItem('token')
    if (!token || token === 'undefined' || token === 'null') {
      throw new ErrorPerfil('Debes iniciar sesión nuevamente.', 401, 'UNAUTHENTICATED')
    }
    headers.Authorization = `Bearer ${token}`
  }

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let respuesta
  try {
    respuesta = await fetch(`${BASE_API}${ruta}`, {
      method,
      headers,
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ErrorPerfil('No fue posible conectar con Laravel. Comprueba que el Backend esté encendido.')
  }

  const resultado = respuesta.status === 204
    ? null
    : await respuesta.json().catch(() => null)

  if (!respuesta.ok || (respuesta.status !== 204 && resultado?.success !== true)) {
    const errores = resultado?.errors && typeof resultado.errors === 'object'
      ? Object.values(resultado.errors).flat().filter(Boolean)
      : []

    // El token inválido no debe reutilizarse en llamadas posteriores.
    if (respuesta.status === 401 && autenticado) localStorage.removeItem('token')

    throw new ErrorPerfil(
      String(errores[0] || resultado?.message || `Error HTTP ${respuesta.status}`),
      respuesta.status,
      resultado?.error_code || ''
    )
  }

  return resultado?.data ?? null
}

// Catálogos públicos usados por el formulario.
export function obtenerEstados(opciones = {}) {
  return solicitud('/estados', opciones)
}

export function obtenerMunicipios(idEstado, opciones = {}) {
  return solicitud(`/estados/${encodeURIComponent(idEstado)}/municipios`, opciones)
}

export function obtenerOficios(opciones = {}) {
  return solicitud('/oficios', opciones)
}

// Endpoints propios del módulo de perfil profesional.
export function obtenerPerfilProfesional(opciones = {}) {
  return solicitud('/me/perfil', { ...opciones, autenticado: true })
}

export function crearPerfilProfesional(datos) {
  return solicitud('/perfiles', { method: 'POST', autenticado: true, body: datos })
}

export function actualizarPerfilProfesional(datos) {
  return solicitud('/me/perfil', { method: 'PATCH', autenticado: true, body: datos })
}

export function actualizarOficiosProfesionales(oficios) {
  return solicitud('/me/perfil/oficios', {
    method: 'PUT',
    autenticado: true,
    body: { oficios },
  })
}
