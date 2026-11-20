import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import { listarMisSolicitudes } from '../services/solicitudesApi.js'
import './Bandejas.css'

function fecha(valor) {
  if (!valor) return 'Pendiente'
  const fechaSolicitud = new Date(valor)
  if (Number.isNaN(fechaSolicitud.getTime())) return valor
  return fechaSolicitud.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function Solicitudes() {
  const { usuario } = useOutletContext()
  const [solicitudes, setSolicitudes] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [filtro, setFiltro] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    listarMisSolicitudes({ signal: controlador.signal })
      .then((respuesta) => {
        if (controlador.signal.aborted) return
        const registros = Array.isArray(respuesta) ? respuesta : []
        setSolicitudes(registros)
        setSeleccionada(registros[0] ?? null)
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controlador.signal.aborted) return
        setError(err.message)
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [])

  const estados = useMemo(() => {
    const valores = solicitudes.map((item) => item.estado?.estado_solicitud).filter(Boolean)
    return [...new Set(valores)]
  }, [solicitudes])

  const filtradas = useMemo(() => {
    if (!filtro) return solicitudes
    return solicitudes.filter((item) => item.estado?.estado_solicitud === filtro)
  }, [solicitudes, filtro])

  const esAdministrador = Boolean(usuario?.es_administrador)

  return (
    <main className="bt-pagina">
      <div className="bt-contenedor">
        <Link className="bt-volver" to="/inicio">← Volver al inicio</Link>

        <header className="bt-encabezado">
          <span className="bt-etiqueta">Bandeja de trabajo</span>
          <h1>Solicitudes</h1>
          <p>Consulta el historial y el resultado de tus solicitudes de habilitación como trabajador.</p>
        </header>

        {error && (
          <div className="bt-mensaje error" role="alert">
            {error}
            {esAdministrador && (
              <p>
                Esta ruta consulta el historial personal del perfil profesional.
                La revisión de solicitudes de todos los trabajadores corresponde
                a la bandeja administrativa.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bt-acciones">
            <button className="bt-boton secundario" type="button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {!error && (
          <section className="bt-contenido-doble">
            <div className="bt-panel">
              <h2>Historial de solicitudes</h2>

              <div className="bt-filtros">
                <div className="bt-campo">
                  <label htmlFor="solicitudes-estado">Filtrar por estado</label>
                  <select id="solicitudes-estado" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                    <option value="">Todos los estados</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>

              {cargando ? (
                <div className="bt-vacio" role="status">Consultando tus solicitudes...</div>
              ) : filtradas.length === 0 ? (
                <div className="bt-vacio">
                  {solicitudes.length === 0
                    ? 'Todavía no tienes solicitudes de habilitación registradas.'
                    : 'No hay solicitudes que coincidan con ese estado.'}
                </div>
              ) : (
                <div className="bt-lista">
                  {filtradas.map((item) => (
                    <button
                      className={`bt-elemento ${seleccionada?.id_solicitud === item.id_solicitud ? 'activo' : ''}`}
                      type="button"
                      key={item.id_solicitud}
                      onClick={() => setSeleccionada(item)}
                    >
                      <span className="bt-elemento-contenido">
                        <strong>Solicitud #{item.id_solicitud}</strong>
                        <small>Enviada: {fecha(item.fecha_solicitud)}</small>
                      </span>
                      <span className="bt-estado">{item.estado?.estado_solicitud ?? 'Sin estado'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <aside className="bt-detalle">
              <h2>Detalle de solicitud</h2>
              {!seleccionada ? (
                <div className="bt-vacio">Selecciona una solicitud para consultar su información.</div>
              ) : (
                <>
                  <div className="bt-dato">
                    <span>Identificador</span>
                    <strong>#{seleccionada.id_solicitud}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Estado actual</span>
                    <strong>{seleccionada.estado?.estado_solicitud ?? 'Sin estado'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Fecha de solicitud</span>
                    <strong>{fecha(seleccionada.fecha_solicitud)}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Fecha de revisión</span>
                    <strong>{fecha(seleccionada.fecha_revision)}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Administrador revisor</span>
                    <strong>{seleccionada.administrador_revisor?.nombre_completo ?? 'Aún sin asignar'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Comentario de revisión</span>
                    <strong>{seleccionada.comentario_revision || 'No se ha agregado un comentario.'}</strong>
                  </div>
                </>
              )}
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}
