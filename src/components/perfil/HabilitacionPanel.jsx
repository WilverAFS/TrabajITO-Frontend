import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import {
  listarSolicitudesHabilitacion,
  enviarSolicitudHabilitacion,
} from '../../services/perfilComplementosApi.js'
import AlertasPanel from './AlertasPanel.jsx'
import { Dialogo } from '../ui/Interfaz.jsx'
import { ListaComplementos, ElementoListaComplemento } from './ListaComplementos.jsx'

function fechaLegible(fecha) {
  if (!fecha) return 'No registrada'
  const dato = new Date(fecha)
  return Number.isNaN(dato.getTime())
    ? String(fecha)
    : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(dato)
}

export default function HabilitacionPanel({ perfilActivo }) {
  const contexto = useOutletContext()
  const esAdministrador = Boolean(contexto?.usuario?.es_administrador)

  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(!esAdministrador)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)

  const manejarError = useCallback((err) => {
    if (err?.name === 'AbortError') return
    // El cliente central elimina el token y notifica la sesión expirada.
    if (err?.status === 401) return
    setError(err?.message || 'No fue posible completar la operación.')
  }, [])

  const cargar = useCallback(async (signal) => {
    const lista = await listarSolicitudesHabilitacion({ signal })
    setSolicitudes(Array.isArray(lista) ? lista : [])
  }, [])

  useEffect(() => {
    if (esAdministrador) return undefined

    const controller = new AbortController()
    listarSolicitudesHabilitacion({ signal: controller.signal })
      .then((lista) => {
        if (!controller.signal.aborted) setSolicitudes(Array.isArray(lista) ? lista : [])
      })
      .catch((err) => { if (!controller.signal.aborted) manejarError(err) })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [esAdministrador, manejarError])

  if (esAdministrador) {
    return (
      <div className="pc-panel">
        <div className="pc-seccion-titulo">
          <h3>Solicitudes de habilitación</h3>
          <p>
            Las cuentas con rol de administrador no pueden habilitar ni solicitar la
            habilitación de un perfil profesional.
          </p>
        </div>
      </div>
    )
  }

  const enProceso = solicitudes.some((solicitud) =>
    [1, 2].includes(Number(solicitud.estado?.id_estado_solicitud))
  )

  async function confirmarEnvio() {
    setError('')
    setExito('')
    setOcupado(true)
    try {
      await enviarSolicitudHabilitacion()
      await cargar()
      setConfirmacionAbierta(false)
      setExito('Solicitud enviada correctamente. Ahora debes esperar la revisión administrativa.')
    } catch (err) {
      // Si el estado cambió en otra sesión, recuperamos el historial actualizado.
      if (err?.status === 409) {
        try { await cargar() } catch { /* Conservamos el mensaje original */ }
      }
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="pc-panel">
      <div className="pc-seccion-titulo">
        <h3>Solicitudes de habilitación</h3>
        <p>Una vez registrado tu perfil profesional, puedes pedir una revisión para que se habilite en TrabajITO.</p>
      </div>
      <AlertasPanel error={error} exito={exito} />

      <div className="pc-subtarjeta pc-habilitacion-accion">
        <div>
          <h4>Estado actual</h4>
          {perfilActivo ? <p className="pc-pill pc-pill-ok">Perfil habilitado</p>
            : enProceso ? <p className="pc-pill">Solicitud pendiente o en revisión</p>
              : <p className="pc-pill">Perfil aún no habilitado</p>}
          <p className="pc-leyenda">El Backend impide duplicar solicitudes pendientes o enviar otra cuando el perfil ya está habilitado.</p>
        </div>
        <button
          type="button"
          className="pc-boton"
          onClick={() => setConfirmacionAbierta(true)}
          disabled={cargando || ocupado || perfilActivo || enProceso}
        >
          {ocupado ? 'Enviando...' : perfilActivo ? 'Perfil habilitado' : enProceso ? 'Solicitud en proceso' : 'Solicitar habilitación'}
        </button>
      </div>

      <section className="pc-subtarjeta" aria-label="Historial de solicitudes">
        <h4>Historial de solicitudes ({solicitudes.length})</h4>
        {cargando ? <p role="status">Cargando historial...</p> : solicitudes.length === 0 ? (
          <p className="pc-vacio">No existen solicitudes registradas.</p>
        ) : (
          <ListaComplementos label="Historial de solicitudes">
            {solicitudes.map((solicitud) => (
              <ElementoListaComplemento key={solicitud.id_solicitud}>
                <div className="pc-item-encabezado">
                  <strong>Solicitud #{solicitud.id_solicitud}</strong>
                  <span className="pc-pill">{solicitud.estado?.estado_solicitud || 'Sin estado'}</span>
                </div>
                <p>Enviada: {fechaLegible(solicitud.fecha_solicitud)}</p>
                {solicitud.fecha_revision && <p>Revisada: {fechaLegible(solicitud.fecha_revision)}</p>}
                {solicitud.administrador_revisor?.nombre_completo && <p>Revisor: {solicitud.administrador_revisor.nombre_completo}</p>}
                {solicitud.comentario_revision && <p>Comentario: {solicitud.comentario_revision}</p>}
              </ElementoListaComplemento>
            ))}
          </ListaComplementos>
        )}
      </section>

      {confirmacionAbierta && (
        <Dialogo
          titulo="Solicitar habilitación"
          onClose={() => {
            if (!ocupado) setConfirmacionAbierta(false)
          }}
        >
          <p>
            ¿Enviar una solicitud de habilitación para tu perfil profesional?
          </p>

          {error && <p role="alert">{error}</p>}

          <div className="pc-botones">
            <button
              type="button"
              className="pc-boton pc-boton-claro"
              disabled={ocupado}
              onClick={() => setConfirmacionAbierta(false)}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="pc-boton"
              disabled={ocupado}
              onClick={confirmarEnvio}
            >
              {ocupado ? 'Enviando...' : 'Sí, enviar solicitud'}
            </button>
          </div>
        </Dialogo>
      )}
    </div>
  )
}