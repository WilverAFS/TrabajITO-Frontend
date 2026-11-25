
import {
  solicitud,
  guardarToken,
  eliminarToken,
  obtenerToken,
} from './apiClient.js'

// Autenticación con Laravel Sanctum.
export function iniciarSesion({
  correo,
  password,
  device_name = 'react-web',
}) {
  return solicitud('/auth/login', {
    method: 'POST',
    data: { correo, password, device_name },
  }).then((datos) => {
    if (datos?.token) guardarToken(datos.token)
    return datos
  })
}

// Registro con autenticación automática.
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
    data: {
      nombre,
      apellido,
      correo,
      password,
      password_confirmation,
      device_name,
    },
  }).then((datos) => {
    if (!datos?.token) {
      throw new Error(
        'La cuenta fue registrada, pero no se pudo iniciar la sesión.',
      )
    }

    guardarToken(datos.token)
    return datos
  })
}

// Solicitar enlace de recuperación de contraseña.
export function solicitarRecuperacion({ correo }) {
  return solicitud('/auth/forgot-password', {
    method: 'POST',
    data: { correo },
  })
}

// Restablecer contraseña mediante el token de recuperación.
export function restablecerContrasena({
  correo,
  token,
  password,
  password_confirmation,
}) {
  return solicitud('/auth/reset-password', {
    method: 'POST',
    data: {
      correo,
      token,
      password,
      password_confirmation,
    },
  })
}

// Consultar el usuario autenticado.
export function obtenerUsuarioActual({
  signal,
  notificarSesion = true,
} = {}) {
  return solicitud('/me', {
    signal,
    autenticado: true,
    notificarSesion,
  })
}

// Cerrar sesión y eliminar el token almacenado.
export async function cerrarSesion() {
  try {
    if (obtenerToken()) {
      // Evita una redirección adicional durante el cierre de sesión.
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
