// TrabajITO: API 16 (Disponibilidad), 17 (Certificados) y 18 (Habilitación).
// Usa el mismo token y BASE_API que perfilProfesionalApi.js (API 15).
import { ErrorPerfil } from './perfilProfesionalApi.js'

const BASE_API = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/+$/, '')

async function solicitar(ruta, { method = 'GET', datos, archivo, signal } = {}) {
  const token = localStorage.getItem('token')
  if (!token || token === 'undefined' || token === 'null') {
    throw new ErrorPerfil('Debes iniciar sesión nuevamente.', 401, 'UNAUTHENTICATED')
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  // Para FormData el navegador genera el Content-Type con boundary.
  if (datos !== undefined) headers['Content-Type'] = 'application/json'

  let respuesta
  try {
    respuesta = await fetch(`${BASE_API}${ruta}`, {
      method,
      headers,
      signal,
      ...(archivo instanceof FormData
        ? { body: archivo }
        : datos !== undefined ? { body: JSON.stringify(datos) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ErrorPerfil('No se pudo conectar con Laravel. Revisa que el Backend esté ejecutándose.')
  }

  if (respuesta.status === 204 && respuesta.ok) return null

  const resultado = await respuesta.json().catch(() => null)
  if (!respuesta.ok || resultado?.success !== true) {
    const errores = resultado?.errors && typeof resultado.errors === 'object'
      ? Object.values(resultado.errors).flat().filter(Boolean)
      : []

    if (respuesta.status === 401) localStorage.removeItem('token')

    throw new ErrorPerfil(
      String(errores[0] || resultado?.message || `Error HTTP ${respuesta.status}`),
      respuesta.status,
      resultado?.error_code || ''
    )
  }

  return resultado?.data ?? null
}

// API 16
export const listarDisponibilidades = (opciones = {}) =>
  solicitar('/me/perfil/disponibilidades', opciones)

export const crearDisponibilidad = (datos) =>
  solicitar('/me/perfil/disponibilidades', { method: 'POST', datos })

export const editarDisponibilidad = (id, datos) =>
  solicitar(`/me/perfil/disponibilidades/${encodeURIComponent(id)}`, {
    method: 'PATCH', datos,
  })

export const eliminarDisponibilidad = (id) =>
  solicitar(`/me/perfil/disponibilidades/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

// API 17
export const listarCertificados = (opciones = {}) =>
  solicitar('/me/perfil/certificados', opciones)

export const crearCertificado = (formulario) =>
  solicitar('/me/perfil/certificados', { method: 'POST', archivo: formulario })

export const eliminarCertificado = (id) =>
  solicitar(`/me/perfil/certificados/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

// Documento_url viene como /storage/... y se publica desde Laravel, NO Vite.
export function enlaceDocumento(documentoUrl) {
  if (typeof documentoUrl !== 'string' || !documentoUrl.startsWith('/storage/')) return null
  return new URL(documentoUrl, new URL(BASE_API).origin).href
}

// API 18 (el POST no acepta ni necesita datos de revisión)
export const listarSolicitudesHabilitacion = (opciones = {}) =>
  solicitar('/me/perfil/solicitudes-habilitacion', opciones)

export const enviarSolicitudHabilitacion = () =>
  solicitar('/me/perfil/solicitudes-habilitacion', { method: 'POST' })
