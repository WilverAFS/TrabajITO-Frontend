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