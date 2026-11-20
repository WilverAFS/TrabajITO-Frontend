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