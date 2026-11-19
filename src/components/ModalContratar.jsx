import { useState } from 'react'
import { Link } from 'react-router'
import { Avisos, Dialogo } from './ui/Interfaz.jsx'
import { crearContratacion } from '../services/contratacionesApi.js'
import { validarDescripcionServicio } from '../utils/validaciones.js'

export default function ModalContratar({ trabajador, onClose }) {
  const [descripcion, setDescripcion] = useState('')
  const [errorCampo, setErrorCampo] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [creada, setCreada] = useState(false)

  const handleSubmit = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')

    const errLocal = validarDescripcionServicio(descripcion)
    if (errLocal) {
      setErrorCampo(errLocal)
      return
    }

    setErrorCampo('')
    setEnviando(true)

    try {
      await crearContratacion({
        id_trabajador: trabajador.id_trabajador,
        descripcion_servicio: descripcion.trim(),
      })
      setCreada(true)
    } catch (err) {
      const err422 = err.errors?.descripcion_servicio?.[0]
      if (err422) {
        setErrorCampo(err422)
      } else {
        setErrorGeneral(err.message || 'No se pudo enviar la solicitud.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialogo titulo={`Contratar a ${trabajador.usuario?.nombre_completo || 'trabajador'}`} onClose={onClose}>
      {creada ? (
        <div className="tj-stack">
          <Avisos exito="Solicitud de contratación enviada correctamente." />
          <p>Puedes dar seguimiento al estado de tu solicitud desde tu bandeja.</p>
          <div className="tj-actions">
            <Link to="/contrataciones" className="tj-button" onClick={onClose}>
              Ir a mis contrataciones
            </Link>
            <button type="button" className="tj-button tj-button-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="tj-form" noValidate>
          <div className="tj-field">
            <label htmlFor="contratar-descripcion">Descripción del servicio</label>
            <textarea
              id="contratar-descripcion"
              rows={5}
              maxLength={2000}
              placeholder="Explica qué trabajo necesitas, ubicación aproximada y detalles importantes (10 a 2000 caracteres)."
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value)
                if (errorCampo) setErrorCampo('')
              }}
              aria-invalid={Boolean(errorCampo)}
              required
            />
            <small>{descripcion.trim().length} / 2000 caracteres</small>
            {errorCampo && <p className="tj-alert tj-alert-error" role="alert">{errorCampo}</p>}
          </div>

          <Avisos error={errorGeneral} />

          <div className="tj-actions">
            <button type="button" className="tj-button tj-button-secondary" onClick={onClose} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="tj-button" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      )}
    </Dialogo>
  )
}