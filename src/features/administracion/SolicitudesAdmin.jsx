import { useEffect, useState } from 'react'
import { Dialogo, Paginacion } from '../../components/ui/Interfaz.jsx'
import {
  aprobarSolicitudHabilitacion,
  listarSolicitudesHabilitacionAdmin,
  marcarSolicitudEnRevision,
  rechazarSolicitudHabilitacion,
} from '../../services/adminApi.js'
import { validarComentarioRechazo } from '../../utils/validaciones.js'

const ESTADOS = [
  { id: '', etiqueta: 'Todos los estados' },
  { id: '1', etiqueta: 'Pendiente' },
  { id: '2', etiqueta: 'En revisión' },
  { id: '3', etiqueta: 'Aprobada' },
  { id: '4', etiqueta: 'Rechazada' },
]

export default function SolicitudesAdmin() {
  const [solicitudes, setSolicitudes] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [idEstado, setIdEstado] = useState('1')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [recargar, setRecargar] = useState(0)

  const [accionModal, setAccionModal] = useState(null)
  const [comentario, setComentario] = useState('')
  const [errorComentario, setErrorComentario] = useState('')
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    listarSolicitudesHabilitacionAdmin({
      pagina,
      per_page: 15,
      id_estado: idEstado || undefined,
      signal: controller.signal,
    })
      .then((res) => {
        setSolicitudes(res?.data ?? [])
        setMeta(res?.meta ?? null)
        setError('')
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar las solicitudes.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [pagina, idEstado, recargar])

  const abrirModal = (solicitud, tipo) => {
    setAccionModal({ solicitud, tipo })
    setComentario('')
    setErrorComentario('')
  }

  const handleEnRevision = async (sol) => {
    setProcesando(true)
    setError('')
    setMensaje('')
    try {
      await marcarSolicitudEnRevision(sol.id_solicitud)
      setMensaje(`Solicitud #${sol.id_solicitud} marcada en revisión.`)
      setRecargar((v) => v + 1)
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la solicitud.')
    } finally {
      setProcesando(false)
    }
  }

  const handleConfirmarAccion = async () => {
    if (!accionModal) return
    const { solicitud, tipo } = accionModal

    if (tipo === 'rechazar') {
      const errValidacion = validarComentarioRechazo(comentario)
      if (errValidacion) {
        setErrorComentario(errValidacion)
        return
      }
    }

    setProcesando(true)
    setError('')
    setErrorComentario('')
    setMensaje('')

    try {
      if (tipo === 'aprobar') {
        await aprobarSolicitudHabilitacion(solicitud.id_solicitud, comentario)
        setMensaje(`Solicitud #${solicitud.id_solicitud} aprobada.`)
      } else {
        await rechazarSolicitudHabilitacion(solicitud.id_solicitud, comentario)
        setMensaje(`Solicitud #${solicitud.id_solicitud} rechazada.`)
      }
      setAccionModal(null)
      setRecargar((v) => v + 1)
    } catch (err) {
      const errCampo = err?.errores?.comentario_revision?.[0]
      if (errCampo) {
        setErrorComentario(errCampo)
      } else {
        setError(err.message || 'No se pudo completar la revisión.')
      }
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div>
      {error && <div className="admin-alerta admin-alerta-error">{error}</div>}
      {mensaje && <div className="admin-alerta admin-alerta-ok">{mensaje}</div>}

      <div className="admin-filtros">
        <select
          className="admin-select"
          value={idEstado}
          onChange={(e) => {
            setIdEstado(e.target.value)
            setPagina(1)
          }}
        >
          {ESTADOS.map((est) => (
            <option key={est.id} value={est.id}>
              {est.etiqueta}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p>Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p>No hay solicitudes de habilitación para este filtro.</p>
      ) : (
        <div className="admin-tabla-wrapper">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Trabajador</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((sol) => {
                const estadoId = Number(sol.id_estado_solicitud ?? sol.estado?.id_estado_solicitud)
                const nombreEstado = sol.estado?.nombre ?? sol.estado_solicitud?.nombre ?? `Estado ${estadoId}`
                const nombreTrabajador =
                  sol.trabajador?.nombre_completo ??
                  sol.perfil_profesional?.nombre_completo ??
                  `Trabajador #${sol.id_trabajador}`

                return (
                  <tr key={sol.id_solicitud}>
                    <td>{sol.id_solicitud}</td>
                    <td>{nombreTrabajador}</td>
                    <td>
                      <span className="admin-badge admin-badge-info">{nombreEstado}</span>
                    </td>
                    <td>{sol.fecha_solicitud ? new Date(sol.fecha_solicitud).toLocaleDateString() : '-'}</td>
                    <td>{sol.comentario_revision || '-'}</td>
                    <td>
                      <div className="admin-acciones">
                        {estadoId === 1 && (
                          <button
                            type="button"
                            className="admin-btn"
                            disabled={procesando}
                            onClick={() => handleEnRevision(sol)}
                          >
                            En revisión
                          </button>
                        )}
                        {(estadoId === 1 || estadoId === 2) && (
                          <>
                            <button
                              type="button"
                              className="admin-btn admin-btn-exito"
                              disabled={procesando}
                              onClick={() => abrirModal(sol, 'aprobar')}
                            >
                              Aprobar
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-peligro"
                              disabled={procesando}
                              onClick={() => abrirModal(sol, 'rechazar')}
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Paginacion meta={meta} onCambiar={setPagina} />

      {accionModal && (
        <Dialogo
          titulo={
            accionModal.tipo === 'aprobar'
              ? 'Aprobar solicitud de habilitación'
              : 'Rechazar solicitud de habilitación'
          }
          onClose={() => setAccionModal(null)}
        >
          <label htmlFor="comentario-revision">
            {accionModal.tipo === 'aprobar'
              ? 'Comentario de revisión (opcional):'
              : 'Motivo del rechazo (obligatorio, mín. 3 caracteres):'}
          </label>
          <textarea
            id="comentario-revision"
            className="admin-textarea"
            value={comentario}
            onChange={(e) => {
              setComentario(e.target.value)
              if (errorComentario) setErrorComentario('')
            }}
          />
          {errorComentario && <p className="admin-error-campo">{errorComentario}</p>}

          <div className="admin-modal-acciones">
            <button
              type="button"
              className="admin-btn"
              onClick={() => setAccionModal(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`admin-btn ${
                accionModal.tipo === 'aprobar' ? 'admin-btn-exito' : 'admin-btn-peligro'
              }`}
              disabled={procesando}
              onClick={handleConfirmarAccion}
            >
              {accionModal.tipo === 'aprobar' ? 'Confirmar aprobación' : 'Confirmar rechazo'}
            </button>
          </div>
        </Dialogo>
      )}
    </div>
  )
}