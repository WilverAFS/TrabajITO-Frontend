import { useCallback, useEffect, useState } from 'react'

// Los parámetros son los valores serializables de la consulta, no callbacks.
export function useConsulta(consultar, parametros = {}, habilitada = true) {
  const clave = JSON.stringify(parametros)
  const [version, setVersion] = useState(0)
  const [respuesta, setRespuesta] = useState(null)

  useEffect(() => {
    if (!habilitada) return undefined
    const controlador = new AbortController()
    const opciones = { ...JSON.parse(clave), signal: controlador.signal }

    consultar(opciones)
      .then((datos) => {
        if (!controlador.signal.aborted) setRespuesta({ clave, version, datos, error: '' })
      })
      .catch((error) => {
        if (!controlador.signal.aborted && error.name !== 'AbortError') {
          setRespuesta({ clave, version, datos: null, error: error.message, estado: error.status })
        }
      })

    return () => controlador.abort()
  }, [consultar, clave, version, habilitada])

  const refrescar = useCallback(() => setVersion((anterior) => anterior + 1), [])
  const actual = habilitada && respuesta?.clave === clave ? respuesta : null
  return {
    datos: actual?.datos,
    cargando: habilitada && actual?.version !== version,
    error: actual?.version === version ? actual.error : '',
    estado: actual?.version === version ? actual.estado : undefined,
    refrescar,
  }
}
