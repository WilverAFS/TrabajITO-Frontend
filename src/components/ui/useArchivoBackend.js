import { useEffect, useState } from 'react'
import {
  obtenerArchivoBackend,
  obtenerToken,
  resolverUrlBackend,
} from '../../services/apiClient.js'

// Gestiona recursos públicos y archivos privados mediante URLs temporales.
export function useArchivoBackend(ruta, { privado = false } = {}) {
  const rutaResuelta = resolverUrlBackend(ruta)
  const token = privado && rutaResuelta ? obtenerToken() : null

  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    if (!privado || !rutaResuelta || !token) {
      return undefined
    }

    const controlador = new AbortController()
    let urlTemporal = null

    obtenerArchivoBackend(rutaResuelta, {
      signal: controlador.signal,
    })
      .then((archivo) => {
        if (controlador.signal.aborted) return

        urlTemporal = URL.createObjectURL(archivo)

        setResultado({
          ruta: rutaResuelta,
          token,
          url: urlTemporal,
          tipo: archivo.type,
          error: '',
        })
      })
      .catch((error) => {
        if (
          controlador.signal.aborted ||
          error.name === 'AbortError'
        ) return

        setResultado({
          ruta: rutaResuelta,
          token,
          url: null,
          tipo: '',
          error: error.message || 'No fue posible abrir el archivo.',
        })
      })

    return () => {
      controlador.abort()

      if (urlTemporal) {
        URL.revokeObjectURL(urlTemporal)
      }
    }
  }, [privado, rutaResuelta, token])

  if (!privado || !rutaResuelta) {
    return {
      url: rutaResuelta,
      tipo: '',
      cargando: false,
      error: '',
    }
  }

  if (!token) {
    return {
      url: null,
      tipo: '',
      cargando: false,
      error: 'Debes iniciar sesión para consultar este archivo.',
    }
  }

  const actual =
    resultado?.ruta === rutaResuelta &&
    resultado?.token === token
      ? resultado
      : null

  return {
    url: actual?.url ?? null,
    tipo: actual?.tipo ?? '',
    cargando: !actual,
    error: actual?.error ?? '',
  }
}
