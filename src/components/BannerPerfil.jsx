import { Link } from 'react-router';
import './BannerPerfil.css';

export default function BannerPerfil({ perfil }) {
  return (
    <div className="banner-azul-claro">
      <div className="contenedor-perfil">
        
        <Link to="/catalogo" className="btn-volver">
          ← Volver a resultados
        </Link>

        <div className="cabecera-perfil-figma">
          <img 
            src={`https://i.pravatar.cc/300?u=${perfil.id_trabajador}`} 
            alt="Foto de perfil" 
            className="foto-perfil-figma" 
          />
          
          <div className="info-perfil-figma">
            <h1>{perfil.usuario?.nombre_completo || 'Trabajador'}</h1>
            <p className="oficio-experiencia">
              {perfil.oficios?.length > 0 ? perfil.oficios[0].nombre : 'Profesional de oficio'} · 12 años de experiencia
            </p>
            
            <div className="rating-figma">
              <span className="estrellitas">★★★★★</span>
              <strong className="rating-num">
                {perfil.calificacion_promedio ? parseFloat(perfil.calificacion_promedio).toFixed(1) : '0.0'}
              </strong>
              <span className="rating-texto">({perfil.total_valoraciones || 0} opiniones)</span>
            </div>
            
            <p className="badge-verde-horario">
              <span className="bolita-verde">●</span> Horarios publicados por el trabajador
            </p>
            
            <button className="btn-contratar-azul">Contratar</button>
          </div>
        </div>

      </div>
    </div>
  );
}