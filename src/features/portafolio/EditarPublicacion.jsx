import { Link, useNavigate } from 'react-router'
import { Avisos, Campo, Resultado, Seleccion } from '../../components/ui/Interfaz.jsx'
import { useAccion } from '../../components/ui/useAccion.js'
import { useConsulta } from '../../components/ui/useConsulta.js'
import { crearPublicacion, editarPublicacion, listarTiposPublicacion } from '../../services/publicacionesApi.js'

export default function EditarPublicacion({ contratacion, publicacion, refrescar }) {
  const consulta = useConsulta(listarTiposPublicacion)
  const accion = useAccion()
  const navigate = useNavigate()
  const tipoExistente = publicacion?.tipo?.id_tipo_publicacion

  function guardar(evento) {
    evento.preventDefault()
    const campos = Object.fromEntries(new FormData(evento.currentTarget))
    const datos = {
      id_tipo_publicacion: Number(campos.id_tipo_publicacion),
      titulo: campos.titulo.trim(),
      descripcion: campos.descripcion.trim(),
    }

    if (publicacion) {
      accion.ejecutar(() => editarPublicacion(publicacion.id_publicacion, datos), {
        exito: 'Publicación actualizada.', alCompletar: refrescar,
      })
    } else {
      accion.ejecutar(() => crearPublicacion(contratacion, datos), {
        alCompletar: (trabajo) => navigate(`/portafolio/${trabajo.id_publicacion}`, { state: { mensaje: 'Trabajo publicado. Puedes añadir evidencias.' } }),
        alConflicto: refrescar,
      })
    }
  }

  return <section className="tj-card">
    <h2>{publicacion ? 'Editar publicación' : 'Publicar el trabajo realizado'}</h2>
    {!publicacion && <p className="tj-muted">Agrega el trabajo finalizado a tu portafolio. Después puedes cargar las evidencias.</p>}
    <Resultado consulta={consulta} vacio={consulta.datos?.length === 0 ? 'No hay tipos de publicación disponibles.' : ''}>
      <form onSubmit={guardar} className="tj-form">
        <Seleccion etiqueta="Tipo de publicación" name="id_tipo_publicacion" defaultValue={tipoExistente || ''} required
          opciones={[[ '', 'Selecciona un tipo' ], ...(consulta.datos ?? []).map((tipo) => [tipo.id_tipo_publicacion, tipo.tipo_publicacion])]} />
        <Campo etiqueta="Título" name="titulo" minLength={10} maxLength={150} defaultValue={publicacion?.titulo} required />
        <Campo etiqueta="Descripción">{(id) => (
          <textarea id={id} name="descripcion" rows={5} minLength={20} maxLength={5000} defaultValue={publicacion?.descripcion} required />
        )}</Campo>
        <Avisos error={accion.error} exito={accion.exito} />
        <div className="tj-actions">
          <button className="tj-button" type="submit" disabled={accion.ocupada}>{publicacion ? 'Guardar publicación' : 'Publicar en el portafolio'}</button>
          {publicacion?.visible && <Link className="tj-button tj-button-secondary" to={`/publicaciones/${publicacion.id_publicacion}`}>Ver publicación</Link>}
        </div>
      </form>
    </Resultado>
  </section>
}
