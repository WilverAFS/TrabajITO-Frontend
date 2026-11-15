import axios from 'axios'

// Única lectura de la configuración del Backend en todo el frontend.
export const TOKEN_KEY = 'token'
export const EVENTO_SESION_EXPIRADA = 'trabajito:sesion-expirada'

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL ?? '').trim()

if (!API_BASE_URL) {
  throw new Error(
    'Falta VITE_API_BASE_URL. Define la URL base de la API en tu archivo .env ' +
    '(incluyendo su prefijo de versión) y reinicia Vite. Consulta .env.example.',
  )
}

export const apiBaseUrl = API_BASE_URL.replace(/\/+$/, '')
const apiOrigin = new URL(apiBaseUrl).origin

const cliente = axios.create({
  baseURL: apiBaseUrl,
  headers: { Accept: 'application/json' },
})

const MENSAJES_POR_ESTADO = {
  401: 'Tu sesión no está disponible. Inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'La operación entra en conflicto con el estado actual del recurso.',
  413: 'El archivo es demasiado grande.',
  415: 'El tipo de archivo no está permitido.',
  422: 'Los datos enviados no son válidos.',
  429: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
  500: 'Ocurrió un error interno en el servidor.',
}

export class ApiError extends Error {
  constructor(mensaje, { status = 0, codigo = '', errors = null } = {}) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.codigo = codigo
    this.errors = errors
  }
}

export function obtenerToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  return !token || token === 'undefined' || token === 'null' ? null : token
}

export function guardarToken(token) {
  if (!token) {
    eliminarToken()
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY)
}

let notificacionSesionEnCurso = false

function notificarSesionExpirada() {
  eliminarToken()
  if (notificacionSesionEnCurso) return

  notificacionSesionEnCurso = true
  window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA))
  window.setTimeout(() => {
    notificacionSesionEnCurso = false
  }, 1000)
}

function primerMensajeDeErrores(errors) {
  if (!errors || typeof errors !== 'object') return ''
  return Object.values(errors).flat().filter(Boolean)[0] ?? ''
}

function normalizarError(error, { autenticado = false, notificarSesion = true } = {}) {
  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    const cancelado = new Error('Solicitud cancelada')
    cancelado.name = 'AbortError'
    return cancelado
  }

  if (!error.response) {
    return new ApiError(
      'No se pudo conectar con el servidor. Comprueba que el Backend esté encendido.',
    )
  }

  const { status, data } = error.response
  const errors = data?.errors && typeof data.errors === 'object' ? data.errors : null
  const mensaje = String(
    primerMensajeDeErrores(errors)
    || data?.message
    || MENSAJES_POR_ESTADO[status]
    || `La solicitud falló (HTTP ${status}).`,
  )

  if (status === 401 && autenticado) {
    if (notificarSesion) notificarSesionExpirada()
    else eliminarToken()
  }

  return new ApiError(mensaje, {
    status,
    codigo: data?.error_code || '',
    errors,
  })
}

// Realiza una petición a la API y devuelve el contenido de `data`.
export async function solicitud(ruta, {
  method = 'GET',
  data,
  params,
  autenticado = false,
  notificarSesion = true,
  signal,
  headers,
} = {}) {
  const token = autenticado ? obtenerToken() : null
  if (autenticado && !token) {
    if (notificarSesion) notificarSesionExpirada()
    throw new ApiError(MENSAJES_POR_ESTADO[401], {
      status: 401,
      codigo: 'UNAUTHENTICATED',
    })
  }

  const cabeceras = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  let respuesta
  try {
    respuesta = await cliente.request({
      url: ruta,
      method,
      data,
      params,
      signal,
      headers: cabeceras,
    })
  } catch (error) {
    throw normalizarError(error, { autenticado, notificarSesion })
  }

  if (respuesta.status === 204) return null

  const cuerpo = respuesta.data
  if (cuerpo && cuerpo.success === false) {
    throw new ApiError(String(cuerpo.message || MENSAJES_POR_ESTADO[respuesta.status] || 'La solicitud falló.'), {
      status: respuesta.status,
      codigo: cuerpo.error_code || '',
      errors: cuerpo.errors && typeof cuerpo.errors === 'object' ? cuerpo.errors : null,
    })
  }

  return cuerpo?.data ?? null
}

// Resuelve rutas públicas servidas por Laravel (por ejemplo /storage/...).
export function resolverUrlBackend(ruta) {
  if (typeof ruta !== 'string' || !ruta.startsWith('/')) return null
  return new URL(ruta, `${apiOrigin}/`).href
}

export default cliente
