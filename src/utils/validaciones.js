export function validarBusqueda(texto = '') {
  const limpio = String(texto).trim()
  if (limpio.length > 150) {
    return 'La búsqueda no puede superar los 150 caracteres.'
  }
  return ''
}

export function validarDescripcionServicio(texto = '') {
  const limpio = String(texto).trim()
  if (!limpio) {
    return 'Describe el servicio que necesitas.'
  }
  if (limpio.length < 10) {
    return 'La descripción debe tener al menos 10 caracteres.'
  }
  if (limpio.length > 2000) {
    return 'La descripción no puede superar los 2000 caracteres.'
  }
  return ''
}
export function validarComentarioRechazo(texto = '') {
  const limpio = String(texto).trim()
  if (!limpio) {
    return 'Debes indicar el motivo del rechazo.'
  }
  if (limpio.length < 3) {
    return 'El comentario debe tener al menos 3 caracteres.'
  }
  if (limpio.length > 2000) {
    return 'El comentario no puede superar los 2000 caracteres.'
  }
  return ''
}

export function validarResolucionReporte(texto = '') {
  const limpio = String(texto).trim()
  if (!limpio) {
    return 'Debes escribir la resolución del reporte.'
  }
  if (limpio.length < 10) {
    return 'La resolución debe tener al menos 10 caracteres.'
  }
  if (limpio.length > 2000) {
    return 'La resolución no puede superar los 2000 caracteres.'
  }
  return ''
}


/**
 * Reglas compartidas de datos personales.
 * Basadas en ValidationRules.php del Backend.
 */

export const PATRON_NOMBRE_ESPANOL = String.raw`\p{Script=Latin}[\p{Script=Latin}\p{M}]*(?: \p{Script=Latin}[\p{Script=Latin}\p{M}]*)*`

const REGEX_NOMBRE = new RegExp(
  `^(?:${PATRON_NOMBRE_ESPANOL})$`,
  'u',
)

export function validarNombreEspanol(valor, tipo = 'nombre') {
  const texto = String(valor ?? '').trim()
  const esApellido = tipo === 'apellido'
  const limite = esApellido ? 150 : 100
  const etiqueta = esApellido ? 'Los apellidos' : 'El nombre'

  if (!texto) {
    return `${etiqueta} es obligatorio.`
  }

  if (texto.length > limite) {
    return `${etiqueta} no puede superar los ${limite} caracteres.`
  }

  if (!REGEX_NOMBRE.test(texto)) {
    return `${etiqueta} solo puede contener letras y espacios simples.`
  }

  return ''
}

/**
 * Requisitos para mostrar mientras se escribe.
 * Solo se aplican a contraseñas nuevas.
 */
export function comprobarRequisitosContrasena(valor = '') {
  const clave = String(valor)

  return [
    {
      id: 'longitud',
      texto: 'Mínimo 8 caracteres',
      cumple: clave.length >= 8,
    },
    {
      id: 'mayuscula',
      texto: 'Al menos una mayúscula',
      cumple: /\p{Lu}/u.test(clave),
    },
    {
      id: 'minuscula',
      texto: 'Al menos una minúscula',
      cumple: /\p{Ll}/u.test(clave),
    },
    {
      id: 'numero',
      texto: 'Al menos un número',
      cumple: /[0-9]/.test(clave),
    },
    {
      id: 'simbolo',
      texto: 'Al menos un símbolo',
      cumple: /[^\p{L}\p{N}\s]/u.test(clave),
    },
  ]
}

export function validarContrasenaNueva(valor) {
  const requisitos = comprobarRequisitosContrasena(valor)

  if (requisitos.every((requisito) => requisito.cumple)) {
    return ''
  }

  return 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y símbolos.'
}

export function validarConfirmacionContrasena(
  contrasena,
  confirmacion,
) {
  if (!confirmacion) {
    return 'Debes confirmar la contraseña.'
  }

  if (contrasena !== confirmacion) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

export function validarCorreoElectronico(valor) {
  const correo = String(valor ?? '').trim()

  if (!correo) {
    return 'El correo electrónico es obligatorio.'
  }

  if (correo.length > 255) {
    return 'El correo no puede superar los 255 caracteres.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return 'Ingresa un correo electrónico válido.'
  }

  return ''
}

export function validarTelefono(valor) {
  const telefono = String(valor ?? '').trim()

  if (!telefono) return '' // El teléfono es opcional.
  if (!/^[0-9]{10}$/.test(telefono)) {
    return 'El teléfono debe contener exactamente 10 dígitos.'
  }
  return ''
}