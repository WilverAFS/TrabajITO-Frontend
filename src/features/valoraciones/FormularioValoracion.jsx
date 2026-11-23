import { useState } from 'react'
import { Avisos, Campo, Dialogo } from '../../components/ui/Interfaz.jsx'
import {
  actualizarValoracion,
  crearValoracion,
} from '../../services/publicacionesApi.js'
import { obtenerTrabajadorPublico } from '../../services/trabajadoresApi.js'
import {
  validarCalificacion,
  validarComentarioValoracion,
} from '../../utils/validaciones.js'

function extraerErrores(error) {
  if (error?.status !== 422 || !error.errors) return {}

  const resultado = {}

  for (const campo of ['calificacion', 'comentario']) {
    const mensajes = error.errors[campo]
    if (Array.isArray(mensajes) && mensajes.length) {
      resultado[campo] = String(mensajes[0])
    } else if (typeof mensajes === 'string' && mensajes) {
      resultado[campo] = mensajes
    }
  }

  return resultado
}

export default function FormularioValoracion({
  idPublicacion,
  idTrabajador,
  valoracion = null,
  onClose,
  onGuardada,
}) {
  const [calificacion, setCalificacion] = useState(
    Number(valoracion?.calificacion) || 5,
  )
  const [comentario, setComentario] = useState(valoracion?.comentario ?? '')
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const esEdicion = Boolean(valoracion?.id_valoracion)

  async function enviar(evento) {
    evento.preventDefault()
    if (guardando) return

    const erroresLocales = {
      calificacion: validarCalificacion(calificacion),
      comentario: validarComentarioValoracion(comentario),
    }

    setErrores(erroresLocales)
    setError('')

    if (Object.values(erroresLocales).some(Boolean)) return

    setGuardando(true)

    try {
      const datos = {
        calificacion: Number(calificacion),
        comentario: comentario.trim() || null,
      }

      const resultado = esEdicion
        ? await actualizarValoracion(valoracion.id_valoracion, datos)
        : await crearValoracion(idPublicacion, datos)

      let perfil = null

      if (idTrabajador) {
        try {
          perfil = await obtenerTrabajadorPublico(idTrabajador)
        } catch {
          // La valoración ya se guardó; un fallo al refrescar el perfil
          // no debe presentarse como un fallo al guardar.
        }
      }

      if (perfil) {
        window.dispatchEvent(new CustomEvent('trabajito:valoracion-actualizada', {
          detail: {
            idTrabajador: Number(idTrabajador),
            perfil,
          },
        }))
      }

      onGuardada?.({ valoracion: resultado, perfil })
      onClose()
    } catch (err) {
      setErrores(extraerErrores(err))
      setError(
        err?.status === 422
          ? 'Revisa los campos señalados.'
          : err.message || 'No se pudo guardar la valoración.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo
      titulo={esEdicion ? 'Editar valoración' : 'Valorar servicio'}
      onClose={guardando ? () => {} : onClose}
    >
      <form className="tj-form tj-form-valoracion" onSubmit={enviar} noValidate>
        <p className="tj-muted">
          {esEdicion
            ? 'Puedes modificar tu calificación y tu reseña.'
            : 'Cuéntanos cómo fue tu experiencia con este servicio.'}
        </p>

        <Campo etiqueta="Calificación">
          {() => (
            <div
              className="tj-estrellas-selector"
              role="radiogroup"
              aria-label="Calificación de 1 a 5 estrellas"
            >
              {[1, 2, 3, 4, 5].map((numero) => (
                <label key={numero} className="tj-estrella-opcion">
                  <input
                    type="radio"
                    name="calificacion"
                    value={numero}
                    checked={calificacion === numero}
                    onChange={() => {
                      setCalificacion(numero)
                      setErrores((actuales) => ({
                        ...actuales,
                        calificacion: '',
                      }))
                    }}
                    aria-label={`${numero} ${numero === 1 ? 'estrella' : 'estrellas'}`}
                  />
                  <span aria-hidden="true">{numero <= calificacion ? '★' : '☆'}</span>
                </label>
              ))}
            </div>
          )}
        </Campo>
        {errores.calificacion && (
          <p className="tj-error-campo" role="alert">{errores.calificacion}</p>
        )}

        <Campo
          etiqueta="Reseña"
          ayuda={`${comentario.length}/1000 caracteres. Este campo es opcional.`}
        >
          {(id, ayudaId) => (
            <textarea
              id={id}
              value={comentario}
              rows={4}
              maxLength={1000}
              aria-describedby={ayudaId}
              aria-invalid={Boolean(errores.comentario)}
              onChange={(evento) => {
                setComentario(evento.target.value)
                setErrores((actuales) => ({
                  ...actuales,
                  comentario: '',
                }))
              }}
              placeholder="Describe brevemente tu experiencia..."
            />
          )}
        </Campo>
        {errores.comentario && (
          <p className="tj-error-campo" role="alert">{errores.comentario}</p>
        )}

        <Avisos error={error} />

        <div className="tj-actions">
          <button
            className="tj-button tj-button-secondary"
            type="button"
            disabled={guardando}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="tj-button" type="submit" disabled={guardando}>
            {guardando
              ? 'Guardando...'
              : esEdicion
                ? 'Guardar cambios'
                : 'Enviar valoración'}
          </button>
        </div>
      </form>
    </Dialogo>
  )
}
