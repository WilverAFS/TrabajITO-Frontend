import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Dialogo, Paginacion } from '../../components/ui/Interfaz.jsx'
import {
  listarReportesAdmin,
  marcarReporteEnRevision,
  obtenerReporteAdmin,
  resolverReporteAdmin,
} from '../../services/adminApi.js'
import { validarResolucionReporte } from '../../utils/validaciones.js'

const ESTADOS = [
  { id: '', etiqueta: 'Todos los estados' },
  { id: '1', etiqueta: 'Pendiente' },
  { id: '2', etiqueta: 'En revisión' },
  { id: '3', etiqueta: 'Concluido' },
]

export default function ReportesAdmin() {
  const [reportes, setReportes] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [idEstado, setIdEstado] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [recargar, setRecargar] = useState(0)

  const [detalle, setDetalle] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [resolucion, setResolucion] = useState('')
  const [errorResolucion, setErrorResolucion] = useState('')
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    const controller = new AbortController()


    listarReportesAdmin({
      pagina,
      per_page: 15,
      id_estado: idEstado || undefined,
      signal: controller.signal,
    })
      .then((res) => {
        setReportes(res?.data ?? [])
        setMeta(res?.meta ?? null)
        setError('')
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar los reportes.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [pagina, idEstado, recargar])

  const handleVerDetalle = async (idReporte) => {
    setCargandoDetalle(true)
    setError('')
    setResolucion('')
    setErrorResolucion('')
    try {
      const datos = await obtenerReporteAdmin(idReporte)
      setDetalle(datos)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el detalle del reporte.')
    } finally {
      setCargandoDetalle(false)
    }
  }

  const handleMarcarEnRevision = async (idReporte) => {
    setProcesando(true)
    setError('')
    setMensaje('')
    try {
      await marcarReporteEnRevision(idReporte)
      setMensaje(`Reporte #${idReporte} marcado en revisión.`)
      setRecargar((v) => v + 1)
      if (detalle?.id_reporte === idReporte) {
        const actualizado = await obtenerReporteAdmin(idReporte)
        setDetalle(actualizado)
      }
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado del reporte.')
    } finally {
      setProcesando(false)
    }
  }

  const handleResolver = async (e) => {
    e.preventDefault()
    if (!detalle) return

    const errVal = validarResolucionReporte(resolucion)
    if (errVal) {
      setErrorResolucion(errVal)
      return
    }

    setProcesando(true)
    setError('')
    setErrorResolucion('')
    setMensaje('')
    try {
      await resolverReporteAdmin(detalle.id_reporte, resolucion)
      setMensaje(`Reporte #${detalle.id_reporte} resuelto correctamente.`)
      setDetalle(null)
      setResolucion('')
      setRecargar((v) => v + 1)
    } catch (err) {
      const errCampo = err?.errores?.resolucion?.[0]
      if (err?.status === 409) {
         setErrorResolucion('Este reporte ya fue concluido anteriormente.')
      } else {
         setErrorResolucion(errCampo || err.message || 'No se pudo resolver el reporte.')
  }
} finally {
      setProcesando(false)
    }
  }

  const estadoDetalleId = Number(
    detalle?.id_estado_reporte ?? detalle?.estado?.id_estado_reporte,
  )

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
        <p>Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <p>No hay reportes para el filtro seleccionado.</p>
      ) : (
        <div className="admin-tabla-wrapper">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((rep) => {
                const estadoId = Number(
                  rep.id_estado_reporte ?? rep.estado?.id_estado_reporte,
                )
                const nombreEstado = rep.estado?.estado_reporte || `Estado ${estadoId}`
                return (
                  <tr key={rep.id_reporte}>
                    <td>{rep.id_reporte}</td>
                    <td>{rep.tipo_objetivo}</td>
                    <td>{rep.motivo}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          estadoId === 3 ? 'admin-badge-ok' : 'admin-badge-alerta'
                        }`}
                      >
                        {nombreEstado}
                      </span>
                    </td>
                    <td>
                      {rep.fecha_creacion
                        ? new Date(rep.fecha_creacion).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      <div className="admin-acciones">
                        <button
                          type="button"
                          className="admin-btn admin-btn-primario"
                          disabled={cargandoDetalle}
                          onClick={() => handleVerDetalle(rep.id_reporte)}
                        >
                          Ver / Resolver
                        </button>
                        {estadoId === 1 && (
                          <button
                            type="button"
                            className="admin-btn"
                            disabled={procesando}
                            onClick={() => handleMarcarEnRevision(rep.id_reporte)}
                          >
                            En revisión
                          </button>
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

{detalle && (
        <Dialogo
          titulo={`Detalle del reporte #${detalle.id_reporte}`}
          onClose={() => setDetalle(null)}
        >
          <div className="admin-detalle-lista">
            <div><strong>Tipo:</strong> {detalle.tipo_objetivo}</div>
            <div><strong>Motivo:</strong> {detalle.motivo}</div>
            <div><strong>Descripción:</strong> {detalle.descripcion || 'Sin descripción'}</div>
            <div>
              <strong>Autor del reporte:</strong>{' '}
              {detalle.denunciante?.nombre_completo ||
                `${detalle.denunciante?.nombre ?? ''} ${detalle.denunciante?.apellido ?? ''}`.trim() ||
                'No disponible'}
            </div>

            {detalle.tipo_objetivo === 'PUBLICACION' && detalle.objetivo && (
              <div>
                <strong>Publicación reportada:</strong> {detalle.objetivo.titulo} (
                {detalle.objetivo.visible ? 'Visible' : 'Oculta'}){' '}
                <Link to={`/publicaciones/${detalle.objetivo.id_publicacion}`}>
                  Ver publicación
                </Link>
              </div>
            )}

            {detalle.tipo_objetivo === 'PERFIL' && detalle.objetivo && (
              <div>
                <strong>Perfil reportado:</strong> {detalle.objetivo.nombre_completo}{' '}
                <Link to={`/perfiles/${detalle.objetivo.id_trabajador}`}>
                  Ver perfil
                </Link>
              </div>
            )}

            {estadoDetalleId === 3 ? (
              <div className="admin-alerta admin-alerta-ok">
                <strong>Resolución:</strong> {detalle.resolucion || 'Reporte ya resuelto.'}
              </div>
            ) : (
              <form onSubmit={handleResolver}>
                <label htmlFor="resolucion-reporte">
                  <strong>Resolución (mín. 10 caracteres):</strong>
                </label>
                <textarea
                  id="resolucion-reporte"
                  className="admin-textarea"
                  value={resolucion}
                  onChange={(e) => {
                    setResolucion(e.target.value)
                    if (errorResolucion) setErrorResolucion('')
                  }}
                />
                {errorResolucion && (
                  <p className="admin-error-campo">{errorResolucion}</p>
                )}
                <div className="admin-modal-acciones">
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => setDetalle(null)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-exito"
                    disabled={procesando}
                  >
                    Resolver reporte
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialogo>
      )}
    </div>
  )
}