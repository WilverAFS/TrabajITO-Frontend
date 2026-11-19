import { useRef, useState } from 'react'

export function useAccion() {
  const bloqueo = useRef(false)
  const [estado, setEstado] = useState({ ocupada: false, error: '', exito: '' })

  async function ejecutar(operacion, { exito = '', alCompletar, alConflicto } = {}) {
    if (bloqueo.current) return
    bloqueo.current = true
    setEstado({ ocupada: true, error: '', exito: '' })

    try {
      const resultado = await operacion()
      setEstado({ ocupada: false, error: '', exito })
      alCompletar?.(resultado)
    } catch (error) {
      setEstado({ ocupada: false, error: error.message, exito: '' })
      if (error.status === 409) alConflicto?.()
    } finally {
      bloqueo.current = false
    }
  }

  return { ...estado, ejecutar }
}
