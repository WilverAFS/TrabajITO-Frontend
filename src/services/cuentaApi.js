// Cliente pequeño para los endpoints de administración de cuenta de TrabajITO.
// Usa la configuración actual del proyecto (Bearer token en localStorage).
const BASE_API = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/+$/, '')

export class ErrorCuenta extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ErrorCuenta'
    this.status = status
  }
}

async function solicitud(ruta, { method = 'GET', body, signal } = {}) {
  const token = localStorage.getItem('token')
  if (!token || token === 'undefined' || token === 'null') {
    throw new ErrorCuenta('Tu sesión no está disponible. Inicia sesión nuevamente.', 401)
  }

  let respuesta
  try {
    respuesta = await fetch(`${BASE_API}${ruta}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ErrorCuenta('No se pudo conectar con Laravel. Comprueba que el Backend esté encendido.')
  }

  const resultado = await respuesta.json().catch(() => null)
  if (!respuesta.ok || resultado?.success !== true) {
    const errores = resultado?.errors && typeof resultado.errors === 'object'
      ? Object.values(resultado.errors).flat().filter(Boolean)
      : []
    const mensaje = errores[0] || resultado?.message || `La solicitud falló (HTTP ${respuesta.status}).`
    throw new ErrorCuenta(String(mensaje), respuesta.status)
  }

  return resultado.data ?? null
}

export function obtenerMiCuenta({ signal } = {}) {
  return solicitud('/me', { signal })
}

export function actualizarMiCuenta(datos) {
  return solicitud('/me', { method: 'PATCH', body: datos })
}

export function cambiarMiContrasena(datos) {
  return solicitud('/me/password', { method: 'PATCH', body: datos })
}
