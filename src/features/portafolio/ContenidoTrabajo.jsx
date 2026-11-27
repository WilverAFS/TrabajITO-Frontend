import { Link } from 'react-router'
import { Insignia, Medio } from '../../components/ui/Interfaz.jsx'
import { fechaLegible } from '../../components/ui/formatos.js'
import { useArchivoBackend } from '../../components/ui/useArchivoBackend.js'
import './Portafolio.css'

export function TarjetaTrabajo({ trabajo, propio = false }) {
  const portada = trabajo.evidencias?.find(
    (evidencia) => evidencia.tipo_archivo === 'IMAGEN',
  )

  const privado = propio && !trabajo.visible

  const archivo = useArchivoBackend(portada?.archivo_url, {
    privado,
  })

  return (
    <article className="tj-work-card">
      <Link
        to={`${propio ? '/portafolio' : '/publicaciones'}/${trabajo.id_publicacion}`}
      >
        <Medio
          url={privado ? null : archivo.url}
          urlBlob={privado ? archivo.url : null}
          nombre={portada ? trabajo.titulo : ''}
          icono="imagenes"
        />
        <h3>{trabajo.titulo}</h3>
      </Link>

      <small className="tj-muted">
        {fechaLegible(trabajo.fecha_publicacion)}
      </small>

      {propio && (
        <Insignia tono={trabajo.visible ? 'success' : 'warning'}>
          {trabajo.visible ? 'Visible' : 'Oculta'}
        </Insignia>
      )}
    </article>
  )
}

function EvidenciaGaleria({
  evidencia,
  indice,
  titulo,
  eliminar,
  ocupada,
  privado,
}) {
  const { url, cargando, error } = useArchivoBackend(
    evidencia.archivo_url,
    { privado },
  )

  const tipo =
    evidencia.tipo_archivo === 'VIDEO' ? 'Video' : 'Imagen'

  const nombre = `${tipo} ${indice + 1} de ${titulo}`

  return (
    <figure className="tj-evidence">
      {tipo === 'Video' && url
        ? (
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            aria-label={nombre}
          />
        )
        : (
          <Medio
            url={privado ? null : url}
            urlBlob={privado ? url : null}
            nombre={nombre}
            icono="imagenes"
          />
        )}

      {cargando && (
        <p className="tj-muted" role="status">
          Cargando archivo…
        </p>
      )}

      {error && (
        <p className="tj-muted" role="alert">
          {error}
        </p>
      )}

      <figcaption className="tj-cluster">
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            Abrir {tipo.toLowerCase()}
          </a>
        )}

        {eliminar && (
          <button
            className="tj-button tj-button-danger"
            type="button"
            disabled={ocupada}
            onClick={() => eliminar(evidencia.id_evidencia)}
          >
            Retirar archivo
          </button>
        )}
      </figcaption>
    </figure>
  )
}

export function GaleriaEvidencias({
  evidencias,
  titulo,
  eliminar,
  ocupada,
  privado = false,
}) {
  return (
    <div className="tj-gallery">
      {evidencias.map((evidencia, indice) => (
        <EvidenciaGaleria
          key={evidencia.id_evidencia}
          evidencia={evidencia}
          indice={indice}
          titulo={titulo}
          eliminar={eliminar}
          ocupada={ocupada}
          privado={privado}
        />
      ))}
    </div>
  )
}

export function Opinion({ valoracion, titulo }) {
  return (
    <article className="tj-opinion">
      <div className="tj-row-between">
        <strong>{titulo}</strong>
        <span
          className="tj-rating"
          aria-label={`${valoracion.calificacion} de 5 estrellas`}
        >
          ★ {valoracion.calificacion} / 5
        </span>
      </div>

      <small className="tj-muted">
        {fechaLegible(valoracion.fecha_valoracion)}
      </small>

      {valoracion.comentario && (
        <p className="tj-text-preserve">
          {valoracion.comentario}
        </p>
      )}
    </article>
  )
}
