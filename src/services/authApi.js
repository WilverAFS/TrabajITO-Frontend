import { solicitud, guardarToken, eliminarToken, obtenerToken } from './apiClient.js'

// Autenticación con Laravel Sanctum. El token sigue almacenándose en
// localStorage bajo la misma clave utilizada por la aplicación existente.
export function iniciarSesion({ correo, password, device_name = 'react-web' }) {
  return solicitud('/auth/login', {
    method: 'POST',
    data: { correo, password, device_name },
  }).then((datos) => {
    if (datos?.token) guardarToken(datos.token)
    return datos
  })
}

export function registrarCuenta({
  nombre,
  apellido,
  correo,
  password,
  password_confirmation,
  device_name = 'react-web',
}) {
  return solicitud('/auth/register', {
    method: 'POST',
    data: { nombre, apellido, correo, password, password_confirmation, device_name },
  })
}

export function solicitarRecuperacion({ correo }) {
  return solicitud('/auth/forgot-password', {
    method: 'POST',
    data: { correo },
  })
}

export function restablecerContrasena({
  correo,
  token,
  password,
  password_confirmation,
}) {
  return solicitud('/auth/reset-password', {
    method: 'POST',
    data: { correo, token, password, password_confirmation },
  })
}

export function obtenerUsuarioActual({ signal, notificarSesion = true } = {}) {
  return solicitud('/me', { signal, autenticado: true, notificarSesion })
}

export async function cerrarSesion() {
  try {
    if (obtenerToken()) {
      // El cierre de sesión ya redirige desde su vista; evita otra redirección.
      await solicitud('/auth/logout', {
        method: 'POST',
        autenticado: true,
        notificarSesion: false,
      })
    }
  } finally {
    eliminarToken()
  }
}