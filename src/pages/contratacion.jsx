import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Dialogo } from '../components/ui/Interfaz.jsx'
import {
  ejecutarAccionContratacion,
  listarContrataciones,
  obtenerContratacion,
} from '../services/contratacionesApi.js'
import './Bandejas.css'

function fecha(valor) {
  if (!valor) return 'No registrada'
  const date = new Date(valor)
  return Number.isNaN(date.getTime())
    ? valor
    : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

const mensajesConfirmacion = {
  rechazar: 'rechazar esta contratación',
  cancelar: 'cancelar esta contratación',
  finalizar: 'finalizar este trabajo',
}

const nombresAcciones = {
  aceptar: 'Aceptar contratación',
  rechazar: 'Rechazar contratación',
  iniciar: 'Iniciar trabajo',
  finalizar: 'Finalizar trabajo',
  cancelar: 'Cancelar contratación',
}

export default function Contrataciones() {
  const [registros, setRegistros] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [participacion, setParticipacion] = useState('')
  const [estado, setEstado] = useState('')
  const [pagina, setPagina] = useState(1)
  const [meta, setMeta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [accionEnCurso, setAccionEnCurso] = useState('')
  const [error, setError] = useState('')
  const [errorDetalle, setErrorDetalle] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [accionPendiente, setAccionPendiente] = useState(null)

  const cargar = useCallback(async (signal) => {
    setCargando(true)
    setError('')
    try {
      const resultado = await listarContrataciones({
        participacion: participacion || undefined,
        id_estado: estado || undefined,
        pagina,
        porPagina: 10,
        signal,
      })
      if (signal?.aborted) return
      const lista = Array.isArray(resultado.data) ? resultado.data : []
      setRegistros(lista)
      setMeta(resultado.meta)
      setSeleccionada((actual) => {
        if (actual && lista.some((item) => item.id_contratacion === actual.id_contratacion)) {
          return actual.id_contratacion
        }
        return lista[0]?.id_contratacion ?? null
      })
    } catch (err) {
      if (err.name !== 'AbortError' && !signal?.aborted) setError(err.message)
    } finally {
      if (!signal?.aborted) setCargando(false)
    }
  }, [participacion, estado, pagina])

  useEffect(() => {
    const controlador = new AbortController()

    Promise.resolve().then(() => {
      if (!controlador.signal.aborted) cargar(controlador.signal)
    })

    return () => controlador.abort()
  }, [cargar])

  useEffect(() => {
    if (!seleccionada) return undefined

    const controlador = new AbortController()

    Promise.resolve()
      .then(() => {
        if (controlador.signal.aborted) return null

        setCargandoDetalle(true)
        setErrorDetalle('')
        return obtenerContratacion(seleccionada, {
          signal: controlador.signal,
        })
      })
      .then((resultado) => {
        if (!controlador.signal.aborted && resultado) {
          setDetalle(resultado)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !controlador.signal.aborted) {
          setErrorDetalle(err.message)
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargandoDetalle(false)
      })

    return () => controlador.abort()
  }, [seleccionada])

  async function procesarAccion(accion) {
    if (!detalle || accionEnCurso) return

    setAccionEnCurso(accion)
    setErrorDetalle('')
    setMensaje('')

    try {
      await ejecutarAccionContratacion(detalle.id_contratacion, accion)
      const actualizado = await obtenerContratacion(detalle.id_contratacion)
      setDetalle(actualizado)
      setMensaje('La contratación se actualizó correctamente.')
      await cargar()
    } catch (err) {
      setErrorDetalle(err.message)
    } finally {
      setAccionEnCurso('')
    }
  }

  function ejecutarAccion(accion) {
    if (!detalle || accionEnCurso) return

    if (['rechazar', 'cancelar', 'finalizar'].includes(accion)) {
      setAccionPendiente(accion)
      return
    }

    procesarAccion(accion)
  }

  async function confirmarAccionPendiente() {
    const accion = accionPendiente
    setAccionPendiente(null)

    if (accion) {
      await procesarAccion(accion)
    }
  }

  const acciones = Array.isArray(detalle?.acciones_disponibles)
    ? detalle.acciones_disponibles
    : []

  const accionesVisibles = acciones.filter(
    (accion) => accion !== 'crear_publicacion'
  )

  const paginasTotales = Number(meta?.last_page ?? 1)
  const paginaActual = Number(meta?.current_page ?? pagina)
  const total = Number(meta?.total ?? registros.length)

  return (
    <main className="bt-pagina">
      <div className="bt-contenedor">
        <Link className="bt-volver" to="/inicio">← Volver al inicio</Link>

        <header className="bt-encabezado">
          <span className="bt-etiqueta">Bandeja de trabajo</span>
          <h1>Contrataciones</h1>
          <p>Consulta los servicios en los que participas y administra las acciones disponibles.</p>
        </header>

        {error && <div className="bt-mensaje error" role="alert">{error}</div>}

        <section className="bt-panel">
          <div className="bt-filtros">
            <div className="bt-campo">
              <label htmlFor="contratacion-participacion">Mi participación</label>
              <select
                id="contratacion-participacion"
                value={participacion}
                onChange={(e) => { setParticipacion(e.target.value); setPagina(1); setSeleccionada(null) }}
              >
                <option value="">Todas</option>
                <option value="cliente">Como cliente</option>
                <option value="trabajador">Como trabajador</option>
              </select>
            </div>

            <div className="bt-campo">
              <label htmlFor="contratacion-estado">Estado</label>
              <select
                id="contratacion-estado"
                value={estado}
                onChange={(e) => { setEstado(e.target.value); setPagina(1); setSeleccionada(null) }}
              >
                <option value="">Todos los estados</option>
                <option value="1">Pendiente</option>
                <option value="2">Aceptada</option>
                <option value="3">Rechazada</option>
                <option value="4">En curso</option>
                <option value="5">Finalizada</option>
                <option value="6">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="bt-contenido-doble">
            <div>
              <h2>Mis contrataciones ({total})</h2>

              {cargando ? (
                <div className="bt-vacio" role="status">Consultando contrataciones...</div>
              ) : registros.length === 0 ? (
                <div className="bt-vacio">No se encontraron contrataciones con los filtros seleccionados.</div>
              ) : (
                <div className="bt-lista">
                  {registros.map((item) => (
                    <button
                      type="button"
                      key={item.id_contratacion}
                      className={`bt-elemento ${seleccionada === item.id_contratacion ? 'activo' : ''}`}
                      onClick={() => setSeleccionada(item.id_contratacion)}
                    >
                      <span className="bt-elemento-contenido">
                        <strong>Contratación #{item.id_contratacion}</strong>
                        <small>{item.descripcion_servicio}</small>
                        <small>Cliente: {item.cliente?.nombre_completo ?? 'No disponible'}</small>
                        <small>Trabajador: {item.trabajador?.nombre_completo ?? 'No disponible'}</small>
                      </span>
                      <span className="bt-estado">{item.estado?.estado_contratacion ?? 'Sin estado'}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="bt-paginacion">
                <span>Página {paginaActual} de {paginasTotales}</span>
                <div className="bt-paginacion-acciones">
                  <button
                    className="bt-boton secundario"
                    type="button"
                    disabled={cargando || paginaActual <= 1}
                    onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    className="bt-boton secundario"
                    type="button"
                    disabled={cargando || paginaActual >= paginasTotales}
                    onClick={() => setPagina((actual) => actual + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            <aside className="bt-detalle">
              <h2>Detalle de contratación</h2>

              {cargandoDetalle ? (
                <div className="bt-vacio" role="status">Cargando detalle...</div>
              ) : errorDetalle ? (
                <div className="bt-mensaje error" role="alert">{errorDetalle}</div>
              ) : !detalle || detalle.id_contratacion !== seleccionada ? (
                <div className="bt-vacio">Selecciona una contratación para ver sus detalles.</div>
              ) : (
                <>
                  <div className="bt-dato">
                    <span>Identificador</span>
                    <strong>#{detalle.id_contratacion}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Descripción del servicio</span>
                    <strong>{detalle.descripcion_servicio || 'Sin descripción'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Estado</span>
                    <strong>{detalle.estado?.estado_contratacion ?? 'Sin estado'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Cliente</span>
                    <strong>{detalle.cliente?.nombre_completo ?? 'No disponible'}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Trabajador</span>
                    <strong>{detalle.trabajador?.nombre_completo ?? 'No disponible'}</strong>
                  </div>
                  {detalle.trabajador?.telefono && (
                    <div className="bt-dato">
                      <span>Teléfono del trabajador</span>
                      <strong>{detalle.trabajador.telefono}</strong>
                    </div>
                  )}
                  {Array.isArray(detalle.trabajador?.oficios) && detalle.trabajador.oficios.length > 0 && (
                    <div className="bt-dato">
                      <span>Oficios</span>
                      <strong>{detalle.trabajador.oficios.map((oficio) => oficio.nombre ?? '').filter(Boolean).join(', ') || 'No disponibles'}</strong>
                    </div>
                  )}
                  <div className="bt-dato">
                    <span>Fecha de solicitud</span>
                    <strong>{fecha(detalle.fecha_solicitud)}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Fecha de respuesta</span>
                    <strong>{fecha(detalle.fecha_respuesta)}</strong>
                  </div>
                  <div className="bt-dato">
                    <span>Fecha de finalización</span>
                    <strong>{fecha(detalle.fecha_finalizacion)}</strong>
                  </div>
                  {detalle.publicacion?.id_publicacion && (
                    <div className="bt-dato">
                      <span>Publicación relacionada</span>
                      <strong>#{detalle.publicacion.id_publicacion}</strong>
                    </div>
                  )}

                  {mensaje && <div className="bt-mensaje exito" role="status">{mensaje}</div>}
                  {accionesVisibles.length > 0 && (
                    <div className="bt-acciones">
                      {accionesVisibles.map((accion) => (
                        <button
                          key={accion}
                          type="button"
                          className={`bt-boton ${['rechazar', 'cancelar'].includes(accion) ? 'peligro' : ''}`}
                          disabled={Boolean(accionEnCurso)}
                          onClick={() => ejecutarAccion(accion)}
                        >
                          {accionEnCurso === accion ? 'Procesando...' : nombresAcciones[accion] ?? accion}
                        </button>
                      ))}
                    </div>
                  )}
                  {accionesVisibles.length === 0 && (
                    <p className="bt-mensaje exito">No hay acciones disponibles para tu usuario en el estado actual.</p>
                  )}
                </>
              )}
            </aside>
          </div>
        </section>
      </div>
      {accionPendiente && (
        <Dialogo
          titulo="Confirmar acción"
          onClose={() => setAccionPendiente(null)}
        >
          <p>
            ¿Confirmas que deseas {mensajesConfirmacion[accionPendiente]}?
          </p>
          <div className="bt-acciones">
            <button
              className="bt-boton secundario"
              type="button"
              onClick={() => setAccionPendiente(null)}
            >
              Volver
            </button>
            <button
              className="bt-boton peligro"
              type="button"
              disabled={Boolean(accionEnCurso)}
              onClick={confirmarAccionPendiente}
            >
              Confirmar
            </button>
          </div>
        </Dialogo>
      )}
    </main>
  )
}
