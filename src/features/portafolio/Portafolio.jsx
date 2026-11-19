import { Link, useLocation, useParams, useOutletContext } from 'react-router'
import { Avisos, CabeceraPagina, Campo, Resultado } from '../../components/ui/Interfaz.jsx'
import { fechaLegible } from '../../components/ui/formatos.js'
import { useAccion } from '../../components/ui/useAccion.js'
import { useConsulta } from '../../components/ui/useConsulta.js'
import { cargarEvidencias, eliminarEvidencia, listarMisTrabajos, obtenerPublicacion } from '../../services/publicacionesApi.js'
import { GaleriaEvidencias, Opinion, TarjetaTrabajo } from './ContenidoTrabajo.jsx'
import EditarPublicacion from './EditarPublicacion.jsx'

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
            {trabajo.valoracion && <section className="tj-card"><h2>Opinión del cliente</h2><Opinion valoracion={trabajo.valoracion} titulo="Servicio valorado" /></section>}
          </>
        )}
      </Resultado>
    </div>
  </>
}
