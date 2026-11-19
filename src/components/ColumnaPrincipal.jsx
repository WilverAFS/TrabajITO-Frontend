import { useState } from 'react'
import { Opinion, TarjetaTrabajo } from '../features/portafolio/ContenidoTrabajo.jsx'
import './ColumnaPrincipal.css'

export default function ColumnaPrincipal({ perfil, trabajos = [] }) {
  const [tabActiva, setTabActiva] = useState('informacion')

  const trabajosConOpinion = trabajos.filter((t) => Boolean(t.valoracion))
  const certificados = Array.isArray(perfil.certificados) ? perfil.certificados : []

  return (
    <div className="columna-info-principal">
      <div className="tabs-navegacion">
        <button
          type="button"
          className={`tab-item ${tabActiva === 'informacion' ? 'activa' : ''}`}
          onClick={() => setTabActiva('informacion')}
        >
          Información
        </button>
        <button
          type="button"
          className={`tab-item ${tabActiva === 'trabajos' ? 'activa' : ''}`}
          onClick={() => setTabActiva('trabajos')}
        >
          Trabajos realizados ({trabajos.length})
        </button>
        <button
          type="button"
          className={`tab-item ${tabActiva === 'opiniones' ? 'activa' : ''}`}
          onClick={() => setTabActiva('opiniones')}
        >
          Opiniones ({perfil.total_valoraciones || trabajosConOpinion.length})
        </button>
      </div>

      {tabActiva === 'informacion' && (
        <>
          <div className="seccion-sobre-mi">
            <h2>Sobre {perfil.usuario?.nombre || 'este profesional'}</h2>
            <p className="texto-bio">
              {perfil.descripcion || 'Este trabajador aún no ha publicado una descripción.'}
            </p>
          </div>

          <div className="seccion-habilidades">
            <h2>En qué te puedo ayudar</h2>
            <div className="habilidades-chips">
              {perfil.oficios?.length > 0 ? (
                perfil.oficios.map((oficio) => (
                  <span key={oficio.id_oficio} className="chip-habilidad">
                    ✓ {oficio.nombre}
                  </span>
                ))
              ) : (
                <p className="texto-bio">Sin oficios registrados.</p>
              )}
            </div>
          </div>

          {certificados.length > 0 && (
            <div className="seccion-habilidades">
              <h2>Certificados verificados</h2>
              <div className="habilidades-chips">
                {certificados.map((cert) => (
                  <span key={cert.id_certificado} className="chip-habilidad">
                    ✓ {cert.nombre}{cert.institucion_emisora ? ` — ${cert.institucion_emisora}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(tabActiva === 'informacion' || tabActiva === 'trabajos') && (
        <div id="portafolio" className="seccion-portafolio">
          <h2>Portafolio</h2>
          {trabajos.length > 0 ? (
            <div className="tj-grid">
              {trabajos.map((trabajo) => (
                <TarjetaTrabajo key={trabajo.id_publicacion} trabajo={trabajo} />
              ))}
            </div>
          ) : (
            <p className="texto-bio">Aún no tiene trabajos publicados en su portafolio.</p>
          )}
        </div>
      )}

      {(tabActiva === 'informacion' || tabActiva === 'opiniones') && (
        <div id="opiniones" className="seccion-opiniones">
          <h2>Opiniones y comentarios</h2>

          <div className="rating-resumen-figma">
            <span className="rating-numero-figma">
              {perfil.calificacion_promedio != null
                ? parseFloat(perfil.calificacion_promedio).toFixed(1)
                : '0.0'}
            </span>
            <div className="rating-estrellas-contenedor">
              <span className="estrellas-naranjas">★★★★★</span>
              <span className="rating-total-texto">
                {perfil.total_valoraciones || trabajosConOpinion.length} opiniones
              </span>
            </div>
          </div>

          {trabajosConOpinion.length > 0 ? (
            <div className="tj-stack">
              {trabajosConOpinion.map((trabajo) => (
                <Opinion
                  key={trabajo.id_publicacion}
                  valoracion={trabajo.valoracion}
                  titulo={trabajo.titulo}
                />
              ))}
            </div>
          ) : (
            <p className="texto-bio">Este trabajador aún no tiene opiniones publicadas.</p>
          )}
        </div>
      )}
    </div>
  )
}