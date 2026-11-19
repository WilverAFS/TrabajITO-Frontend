import { Link } from 'react-router'
import { Medio } from './ui/Interfaz.jsx'
import './BannerPerfil.css'

export default function BannerPerfil({ perfil, esPropio = false, onContratar }) {
  const nombreCompleto = perfil.usuario?.nombre_completo || 'Trabajador'

  return (
    <div className="banner-azul-claro">
      <div className="contenedor-perfil">
        <Link to="/catalogo" className="btn-volver">
          ← Volver a resultados
        </Link>

        <div className="cabecera-perfil-figma">
          <Medio
            url={perfil.foto_url}
            nombre={nombreCompleto}
            className="foto-perfil-figma"
          />

          <div className="info-perfil-figma">
            <h1>{nombreCompleto}</h1>
            <p className="oficio-experiencia">
              {perfil.oficios?.length > 0
                ? perfil.oficios.map((o) => o.nombre).join(' · ')
                : 'Profesional de oficio'}
              {perfil.municipio?.municipio ? ` · ${perfil.municipio.municipio}` : ''}
            </p>

            <div className="rating-figma">
              <span className="estrellitas">★★★★★</span>
              <strong className="rating-num">
                {perfil.calificacion_promedio != null
                  ? parseFloat(perfil.calificacion_promedio).toFixed(1)
                  : '0.0'}
              </strong>
              <span className="rating-texto">({perfil.total_valoraciones || 0} opiniones)</span>
            </div>

            {perfil.disponibilidades?.length > 0 && (
              <p className="badge-verde-horario">
                <span className="bolita-verde">●</span> Horarios publicados por el trabajador
              </p>
            )}

            {esPropio ? (
              <Link to="/portafolio" className="btn-contratar-azul" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Gestionar portafolio
              </Link>
            ) : (
              <button type="button" className="btn-contratar-azul" onClick={onContratar}>
                Contratar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}