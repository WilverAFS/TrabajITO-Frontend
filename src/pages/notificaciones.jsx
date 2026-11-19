import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  listarNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasNotificacionesComoLeidas,
} from '../services/notificacionesApi.js'
import './Bandejas.css'

function fecha(valor) {
  if (!valor) return 'Sin fecha'
  const date = new Date(valor)
  return Number.isNaN(date.getTime())
    ? valor
    : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Notificaciones() {
  const [registros, setRegistros] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [filtro, setFiltro] = useState('')
  const [pagina, setPagina] = useState(1)
  const [meta, setMeta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargar = useCallback(async (signal) => {
    setCargando(true)
    setError('')
    try {
      const resultado = await listarNotificaciones({
        leida: filtro || undefined,
        pagina,
        porPagina: 10,
        signal,
      })
      if (signal?.aborted) return
      const lista = Array.isArray(resultado.data) ? resultado.data : []
      setRegistros(lista)
      setMeta(resultado.meta)
      setSeleccionada((actual) => {
        if (actual && lista.some((item) => item.id_notificacion === actual.id_notificacion)) {
          return actual.id_notificacion
        }
        return lista[0]?.id_notificacion ?? null
      })
    } catch (err) {
      if (err.name !== 'AbortError' && !signal?.aborted) setError(err.message)
    } finally {
      if (!signal?.aborted) setCargando(false)
    }
  }, [filtro, pagina])

  useEffect(() => {
    const controlador = new AbortController()

    Promise.resolve().then(() => {
      if (!controlador.signal.aborted) cargar(controlador.signal)
    })

    return () => controlador.abort()
  }, [cargar])

  const detalle = registros.find((item) => item.id_notificacion === seleccionada) ?? null
  const paginaActual = Number(meta?.current_page ?? pagina)
  const paginasTotales = Number(meta?.last_page ?? 1)
  const total = Number(meta?.total ?? registros.length)

  async function marcarComoLeida() {
    if (!detalle || detalle.leida || actualizando) return
    setActualizando(true)
    setError('')
    setMensaje('')

    try {
      const actualizado = await marcarNotificacionComoLeida(detalle.id_notificacion)
      setRegistros((anteriores) => anteriores.map((item) => (
        item.id_notificacion === detalle.id_notificacion
          ? { ...item, ...(actualizado ?? {}), leida: true }
          : item
      )))
      setMensaje('La notificación se marcó como leída.')
    } catch (err) {
      setError(err.message)
    } finally {
      setActualizando(false)
    }
  }

  async function marcarTodas() {
    if (actualizando) return
    setActualizando(true)
    setError('')
    setMensaje('')

    try {
      await marcarTodasNotificacionesComoLeidas()
      setMensaje('Todas tus notificaciones se marcaron como leídas.')
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setActualizando(false)
    }
  }

  return (
    <main className="bt-pagina">
      <div className="bt-contenedor">
        <Link className="bt-volver" to="/inicio">← Volver al inicio</Link>

        <header className="bt-encabezado">
          <span className="bt-etiqueta">Centro de actividad</span>
          <h1>Notificaciones</h1>
          <p>Consulta los avisos de tu cuenta y administra cuáles ya has leído.</p>
        </header>

        {error && <div className="bt-mensaje error" role="alert">{error}</div>}
        {mensaje && <div className="bt-mensaje exito" role="status">{mensaje}</div>}

        <section className="bt-panel">
          <div className="bt-filtros">
            <div className="bt-campo">
              <label htmlFor="notificaciones-filtro">Mostrar</label>
              <select
                id="notificaciones-filtro"
                value={filtro}
                onChange={(e) => { setFiltro(e.target.value); setPagina(1); setSeleccionada(null); setMensaje('') }}
              >
                <option value="">Todas</option>
                <option value="false">No leídas</option>
                <option value="true">Leídas</option>
              </select>
            </div>
            <button
              type="button"
              className="bt-boton secundario"
              disabled={actualizando || cargando || registros.length === 0}
              onClick={marcarTodas}
            >
              Marcar todas como leídas
            </button>
          </div>

          <div className="bt-contenido-doble">
            <div>
              <h2>Mis notificaciones ({total})</h2>

              {cargando ? (
                <div className="bt-vacio" role="status">Consultando notificaciones...</div>
              ) : registros.length === 0 ? (
                <div className="bt-vacio">No tienes notificaciones en esta categoría.</div>
              ) : (
                <div className="bt-lista">
                  {registros.map((item) => (
                    <button
                      type="button"
                      key={item.id_notificacion}
                      className={`bt-elemento ${seleccionada === item.id_notificacion ? 'activo' : ''}`}
                      onClick={() => { setSeleccionada(item.id_notificacion); setMensaje('') }}
                    >
                      <span className="bt-elemento-contenido">
                        <strong>{item.titulo || item.tipo?.tipo_notificacion || 'Notificación'}</strong>
                        <small>{item.mensaje}</small>
                        <small>{fecha(item.fecha_creacion)}</small>
                      </span>
                      <span className={`bt-estado ${item.leida ? 'leida' : ''}`}>
                        {item.leida ? 'Leída' : 'No leída'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="bt-paginacion">
                <span>Página {paginaActual} de {paginasTotales}</span>
                <div className="bt-paginacion-acciones">
                  <button
                    type="button"
                    className="bt-boton secundario"
                    disabled={cargando || paginaActual <= 1}
                    onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className="bt-boton secundario"
                    disabled={cargando || paginaActual >= paginasTotales}
                    onClick={() => setPagina((actual) => actual + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            <aside className="bt-detalle">
              <h2>Detalle de notificación</h2>
              {!detalle ? (
                <div className="bt-vacio">Selecciona una notificación para leer su contenido.</div>
              ) : (
                <>
                  <div className="bt-dato">
                    <span>Título</span>
                    <strong>{detalle.titulo || 'Notificación'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Tipo</span>
                    <strong>{detalle.tipo?.tipo_notificacion ?? 'General'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Fecha</span>
                    <strong>{fecha(detalle.fecha_creacion)}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Estado de lectura</span>
                    <strong>{detalle.leida ? 'Leída' : 'No leída'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Mensaje</span>
                    <strong>{detalle.mensaje || 'Esta notificación no contiene un mensaje.'}</strong>
                  </div>

                  {!detalle.leida && (
                    <div className="bt-acciones">
                      <button
                        type="button"
                        className="bt-boton"
                        disabled={actualizando}
                        onClick={marcarComoLeida}
                      >
                        {actualizando ? 'Actualizando...' : 'Marcar como leída'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
