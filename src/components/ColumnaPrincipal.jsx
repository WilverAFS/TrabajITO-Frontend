import './ColumnaPrincipal.css';
export default function ColumnaPrincipal({ perfil }) {
  return (
    <div className="columna-info-principal">
      
      <div className="tabs-navegacion">
        <button className="tab-item activa">Información</button>
        <button className="tab-item">Trabajos realizados</button>
        <button className="tab-item">Opiniones ({perfil.total_valoraciones || 0})</button>
      </div>

      <div className="seccion-sobre-mi">
        <h2>Sobre {perfil.usuario?.nombre || 'mí'}</h2>
        <p className="texto-bio">
          {perfil.descripcion || 'Este trabajador aún no ha publicado una descripción detallada sobre su experiencia.'}
        </p>
      </div>

      <div className="seccion-habilidades">
        <h2>En qué te puedo ayudar</h2>
        <div className="habilidades-chips">
          {perfil.oficios?.map(oficio => (
            <span key={oficio.id_oficio} className="chip-habilidad">✓ {oficio.nombre}</span>
          ))}
          <span className="chip-habilidad">✓ Reparación general</span>
          <span className="chip-habilidad">✓ Instalaciones</span>
        </div>
      </div>

      <div className="seccion-portafolio">
        <h2>Portafolio</h2>
        <div className="portafolio-grid">
          <div className="tarjeta-portafolio">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop" alt="Baño" />
            <h4>Renovación de baño</h4>
            <span>septiembre 2026</span>
          </div>
          <div className="tarjeta-portafolio">
            <img src="https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=400&auto=format&fit=crop" alt="Tuberías" />
            <h4>Instalación de tuberías</h4>
            <span>agosto 2026</span>
          </div>
          <div className="tarjeta-portafolio">
            <img src="https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=400&auto=format&fit=crop" alt="Calentador" />
            <h4>Cambio de calentador</h4>
            <span>agosto 2026</span>
          </div>
        </div>
      </div>

      <div className="seccion-opiniones">
        <h2>Opiniones y comentarios</h2>
        
        <div className="rating-resumen-figma">
          <span className="rating-numero-figma">
             {perfil.calificacion_promedio ? parseFloat(perfil.calificacion_promedio).toFixed(1) : '0.0'}
          </span>
          <div className="rating-estrellas-contenedor">
            <span className="estrellas-naranjas">★★★★★</span>
            <span className="rating-total-texto">{perfil.total_valoraciones || 0} opiniones</span>
          </div>
        </div>

        <div className="lista-opiniones-figma">
          <div className="opinion-item-figma">
            <div className="opinion-header-figma">
              <div className="avatar-iniciales-figma">ML</div>
              <div className="opinion-nombres">
                <strong>Mariana López</strong>
                <span>10 de octubre de 2026</span>
              </div>
              <div className="opinion-calificacion-figma">★ 5.0</div>
            </div>
            <p className="opinion-texto-figma">
              {perfil.usuario?.nombre || 'El trabajador'} llegó a la hora acordada, explicó el problema y dejó todo limpio. ¡Lo recomiendo mucho!
            </p>
            <span className="opinion-tag-verde">Servicio general</span>
          </div>

          <div className="opinion-item-figma">
            <div className="opinion-header-figma">
              <div className="avatar-iniciales-figma">AG</div>
              <div className="opinion-nombres">
                <strong>Andrés García</strong>
                <span>3 de octubre de 2026</span>
              </div>
              <div className="opinion-calificacion-figma">★ 5.0</div>
            </div>
            <p className="opinion-texto-figma">
              Muy profesional y cuidadoso. Me explicó cómo usar todo y el precio fue el que habíamos acordado. Excelente trabajo.
            </p>
            <span className="opinion-tag-verde">Instalación</span>
          </div>
        </div>
        
        <button className="btn-outline-azul">Ver opiniones</button>
        
        <div className="caja-dejar-opinion">
          <h3>Dejar opinión</h3>
          <p className="opinion-instruccion">
            Inicia sesión como cliente para valorar un trabajo realizado y publicar tu opinión.
          </p>
          <div className="opinion-calificacion-input">
            <p>Calificación: 1 a 5</p>
            <span className="estrellas-vacias">☆ ☆ ☆ ☆ ☆</span>
          </div>
          <div className="opinion-comentario-input">
            <p>Comentario</p>
            <textarea placeholder="Inicia sesión para escribir tu comentario" disabled></textarea>
          </div>
          <button className="btn-login-opinar">Iniciar sesión para opinar</button>
        </div>
      </div>
    </div>
  );
}