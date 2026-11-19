import { Link } from 'react-router'
import { Insignia, Medio } from '../../components/ui/Interfaz.jsx'
import { fechaLegible } from '../../components/ui/formatos.js'
import { resolverUrlBackend } from '../../services/apiClient.js'
import './Portafolio.css'

export function TarjetaTrabajo({ trabajo, propio = false }) {
  const portada = trabajo.evidencias?.find((evidencia) => evidencia.tipo_archivo === 'IMAGEN')
  return (
    <article className="tj-work-card">
      <Link to={`${propio ? '/portafolio' : '/publicaciones'}/${trabajo.id_publicacion}`}>
        <Medio url={portada?.archivo_url} nombre={portada ? trabajo.titulo : ''} icono="imagenes" />
        <h3>{trabajo.titulo}</h3>
      </Link>
      <small className="tj-muted">{fechaLegible(trabajo.fecha_publicacion)}</small>
      {propio && <Insignia tono={trabajo.visible ? 'success' : 'warning'}>{trabajo.visible ? 'Visible' : 'Oculta'}</Insignia>}
    </article>
  )
}

export function GaleriaEvidencias({ evidencias, titulo, eliminar, ocupada }) {
  return <div className="tj-gallery">
    {evidencias.map((evidencia, indice) => {
      const url = resolverUrlBackend(evidencia.archivo_url)
      const tipo = evidencia.tipo_archivo === 'VIDEO' ? 'Video' : 'Imagen'
      const nombre = `${tipo} ${indice + 1} de ${titulo}`
      return (
        <figure key={evidencia.id_evidencia} className="tj-evidence">
          {tipo === 'Video' && url
            ? <video src={url} controls playsInline preload="metadata" aria-label={nombre} />
            : <Medio url={url} nombre={nombre} icono="imagenes" />}
          <figcaption className="tj-cluster">
            {url && <a href={url} target="_blank" rel="noreferrer">Abrir {tipo.toLowerCase()}</a>}
            {eliminar && <button className="tj-button tj-button-danger" type="button" disabled={ocupada}
              onClick={() => eliminar(evidencia.id_evidencia)}>Retirar archivo</button>}
          </figcaption>
        </figure>
      )
    })}
  </div>
}

export function Opinion({ valoracion, titulo }) {
  return <article className="tj-opinion">
    <div className="tj-row-between">
      <strong>{titulo}</strong><span className="tj-rating" aria-label={`${valoracion.calificacion} de 5 estrellas`}>★ {valoracion.calificacion} / 5</span>
    </div>
    <small className="tj-muted">{fechaLegible(valoracion.fecha_valoracion)}</small>
    {valoracion.comentario && <p className="tj-text-preserve">{valoracion.comentario}</p>}
  </article>
}
