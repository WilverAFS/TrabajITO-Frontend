import { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useOutletContext } from 'react-router'
import { Avisos, CabeceraPagina, Campo, Resultado } from '../../components/ui/Interfaz.jsx'
import { fechaLegible } from '../../components/ui/formatos.js'
import { useAccion } from '../../components/ui/useAccion.js'
import { useConsulta } from '../../components/ui/useConsulta.js'
import { cargarEvidencias, eliminarEvidencia, listarMisTrabajos, obtenerPublicacion } from '../../services/publicacionesApi.js'
import { GaleriaEvidencias, Opinion, TarjetaTrabajo } from './ContenidoTrabajo.jsx'
import EditarPublicacion from './EditarPublicacion.jsx'
import FormularioValoracion from '../valoraciones/FormularioValoracion.jsx'
import { obtenerToken } from '../../services/apiClient.js'
import { obtenerUsuarioActual } from '../../services/authApi.js'
import { obtenerContratacion } from '../../services/contratacionesApi.js'

export function PortafolioPropio() {
  const { usuario } = useOutletContext() ?? {}
  const consulta = useConsulta(listarMisTrabajos, {}, Boolean(usuario?.es_trabajador_habilitado))
  if (!usuario?.es_trabajador_habilitado) {
    return <div className="tj-container tj-section tj-stack">
      <h1>Mi portafolio</h1>
      <p>Esta herramienta estará disponible cuando el administrador habilite tu perfil profesional.</p>
      <Link to="/perfil-profesional" className="tj-button tj-button-secondary">Consultar habilitación</Link>
    </div>
  }
  return <>
    <CabeceraPagina titulo="Mi portafolio" descripcion="Gestiona tus trabajos publicados, evidencias y opiniones asociadas."
      acciones={usuario?.id_trabajador && <Link className="tj-button tj-button-secondary" to={`/perfiles/${usuario.id_trabajador}#opiniones`}>Consultar mi reputación</Link>} />
    <div className="tj-container tj-section tj-stack">
      <Resultado consulta={consulta} vacio={consulta.datos?.length === 0 ? 'Aún no tienes trabajos publicados.' : ''}>
        <div className="tj-grid">{consulta.datos?.map((trabajo) => <TarjetaTrabajo propio trabajo={trabajo} key={trabajo.id_publicacion} />)}</div>
      </Resultado>
      <div className="tj-actions">
        <Link to="/portafolio/nueva" className="tj-button">Publicar trabajo finalizado</Link>
        <Link to="/perfil-profesional" className="tj-button tj-button-secondary">Mi perfil profesional</Link>
      </div>
    </div>
  </>
}

function GestionEvidencias({ publicacion, refrescar }) {
  const accion = useAccion()

  function cargar(evento) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const archivos = [...formulario.elements.archivos.files]
    accion.ejecutar(() => {
      if (!archivos.length) throw new Error('Selecciona al menos un archivo.')
      if (archivos.length > 13) throw new Error('Selecciona hasta 13 archivos.')
      return cargarEvidencias(publicacion.id_publicacion, archivos)
    }, {
      exito: 'Evidencias cargadas.',
      alCompletar: () => { formulario.reset(); refrescar() },
      alConflicto: refrescar,
    })
  }

  function retirar(id) {
    if (!window.confirm('¿Retirar definitivamente este archivo del portafolio?')) return
    accion.ejecutar(() => eliminarEvidencia(id), { exito: 'Archivo retirado.', alCompletar: refrescar, alConflicto: refrescar })
  }

  return <section className="tj-card tj-stack">
    <div><h2>Evidencias del trabajo</h2><p className="tj-muted">Hasta 10 imágenes de 10 MB y 3 videos de 100 MB por publicación.</p></div>
    <GaleriaEvidencias evidencias={publicacion.evidencias} titulo={publicacion.titulo} eliminar={retirar} ocupada={accion.ocupada} />
    <form onSubmit={cargar} className="tj-form">
      <Campo etiqueta="Archivos" name="archivos" type="file" multiple required
        accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.webm,.mov" />
      <Avisos error={accion.error} exito={accion.exito} />
      <div><button type="submit" className="tj-button" disabled={accion.ocupada}>{accion.ocupada ? 'Cargando archivos…' : 'Cargar evidencias'}</button></div>
    </form>
  </section>
}

export function DetallePublicacion({ edicion = false }) {
  const { id } = useParams()
  const { usuario } = useOutletContext() ?? {}
  const { state } = useLocation()
  const consulta = useConsulta(obtenerPublicacion, { id, privada: Boolean(usuario) })
  const trabajo = consulta.datos

  const [resultadoElegibilidad, setResultadoElegibilidad] = useState(null)
  const [modalValoracion, setModalValoracion] = useState(false)
  const idContratacion = trabajo?.contratacion?.id_contratacion
  const valoracionActual = trabajo?.valoracion ?? null
  const tieneSesion = Boolean(obtenerToken())
  const cargandoElegibilidad = Boolean(
    idContratacion && tieneSesion
    && resultadoElegibilidad?.idContratacion !== idContratacion
  )
  const datosElegibilidad = resultadoElegibilidad?.idContratacion === idContratacion
    ? resultadoElegibilidad
    : null
  const usuarioSesion = datosElegibilidad?.usuario
  const contratacionValoracion = datosElegibilidad?.contratacion

  useEffect(() => {
    if (!idContratacion || !obtenerToken()) return undefined

    let activo = true

    obtenerUsuarioActual({ notificarSesion: false })
      .then(async (usuarioActual) => {
        const datosContratacion = await obtenerContratacion(idContratacion)
        if (activo) {
          setResultadoElegibilidad({
            idContratacion,
            usuario: usuarioActual,
            contratacion: datosContratacion,
          })
        }
      })
      .catch(() => {
        if (activo) {
          setResultadoElegibilidad({
            idContratacion,
            usuario: null,
            contratacion: null,
            error: true,
          })
        }
      })

    return () => { activo = false }
  }, [idContratacion])

  const esClienteContratante =
    Number(contratacionValoracion?.cliente?.id_usuario) === Number(usuarioSesion?.id_usuario)

  const contratacionFinalizada =
    Number(contratacionValoracion?.estado?.id_estado_contratacion) === 5

  const puedeValorar = Boolean(esClienteContratante && contratacionFinalizada)

  const acceso = !edicion || Number(trabajo?.trabajador?.id_trabajador) === Number(usuario?.id_trabajador)
  const regreso = edicion ? '/portafolio' : trabajo?.trabajador ? `/perfiles/${trabajo.trabajador.id_trabajador}#portafolio` : '/catalogo'

  return <>
    <CabeceraPagina titulo={acceso && trabajo ? trabajo.titulo : edicion ? 'Gestionar publicación' : 'Trabajo publicado'}
      descripcion={acceso && trabajo ? `${trabajo.trabajador?.nombre_completo || ''} · ${fechaLegible(trabajo.fecha_publicacion)}` : undefined}
      volver={{ to: regreso, texto: edicion ? 'Volver a mi portafolio' : 'Volver al catálogo o perfil' }} />
    <div className="tj-container tj-section tj-stack">
      <Resultado consulta={consulta} vacio={trabajo && !acceso ? 'Solo quien publicó este trabajo puede editarlo.' : ''}>
        {trabajo && acceso && (
          <>
            {edicion ? <>
              <Avisos exito={state?.mensaje} />
              {!trabajo.visible && <p className="tj-alert">Esta publicación está oculta.</p>}
              <EditarPublicacion publicacion={trabajo} refrescar={consulta.refrescar} />
              <GestionEvidencias publicacion={trabajo} refrescar={consulta.refrescar} />
            </> : <section className="tj-card tj-stack">
              <div><h2>Descripción del trabajo</h2><p className="tj-text-preserve">{trabajo.descripcion}</p></div>
              {trabajo.evidencias?.length > 0 && <GaleriaEvidencias evidencias={trabajo.evidencias} titulo={trabajo.titulo} />}
            </section>}
            {!edicion && (
              <section className="tj-card tj-stack">
                <h2>Valoración del servicio</h2>

                {cargandoElegibilidad ? (
                  <p className="tj-muted" role="status">Comprobando si puedes valorar este servicio...</p>
                ) : puedeValorar ? (
                  <>
                    <p className="tj-muted">
                      {valoracionActual
                        ? 'Ya compartiste tu experiencia. Puedes modificar tu valoración.'
                        : 'Tu contratación está finalizada. Comparte tu experiencia con este trabajador.'}
                    </p>
                    <div className="tj-actions">
                      <button
                        type="button"
                        className="tj-button"
                        onClick={() => setModalValoracion(true)}
                      >
                        {valoracionActual ? 'Editar mi valoración' : 'Valorar servicio'}
                      </button>
                    </div>
                  </>
                ) : !tieneSesion ? (
                  <p className="tj-muted">
                    Inicia sesión con la cuenta del cliente que contrató este servicio para poder valorarlo.
                  </p>
                ) : !contratacionValoracion ? (
                  <p className="tj-muted">
                    No se pudo comprobar la contratación asociada a esta publicación.
                  </p>
                ) : !esClienteContratante ? (
                  <p className="tj-muted">
                    Solo el cliente que contrató este servicio puede publicar una valoración.
                  </p>
                ) : (
                  <p className="tj-muted">
                    Podrás valorar este servicio cuando la contratación esté finalizada.
                  </p>
                )}
              </section>
            )}

            {valoracionActual && (
              <section className="tj-card">
                <h2>Opinión del cliente</h2>
                <Opinion valoracion={valoracionActual} titulo="Servicio valorado" />
              </section>
            )}

            {modalValoracion && (
              <FormularioValoracion
                idPublicacion={trabajo.id_publicacion}
                idTrabajador={trabajo.trabajador?.id_trabajador}
                valoracion={valoracionActual}
                onClose={() => setModalValoracion(false)}
                onGuardada={() => {
                  consulta.refrescar()
                }}
              />
            )}
          </>
        )}
      </Resultado>
    </div>
  </>
}
