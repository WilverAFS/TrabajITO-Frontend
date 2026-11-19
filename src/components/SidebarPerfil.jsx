import './SidebarPerfil.css';
export default function SidebarPerfil({ perfil }) {
  return (
    <div className="columna-sidebar">

      <div className="tarjeta-figma-sidebar">
        <h3>Disponibilidad</h3>
        <p className="sidebar-subtitulo">Horario publicado por {perfil.usuario?.nombre || 'el trabajador'}:</p>

        {perfil.disponibilidades?.length > 0 ? (
          perfil.disponibilidades.map((disp) => (
            <p key={disp.id_disponibilidad} className="sidebar-dato-principal" style={{ marginBottom: '8px' }}>
              {disp.dia_nombre}<br/>
              {disp.hora_inicio.slice(0, 5)} - {disp.hora_fin.slice(0, 5)}
            </p>
          ))
        ) : (
          <p className="sidebar-dato-principal">Sin horarios publicados.</p>
        )}

        <div className="separador-sidebar"></div>
        <p className="sidebar-nota-pie">Contacta al trabajador para acordar el servicio.</p>
      </div>

      <div className="tarjeta-figma-sidebar">
        <h3 className="titulo-mayusculas">DATOS DE CONTACTO</h3>
        <p className="sidebar-subtitulo">Información directa del trabajador.</p>

        <div className="item-contacto">
          <div className="icono-contacto-azul">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="texto-contacto">
            <span className="contacto-label">Teléfono</span>
            <strong className="contacto-valor">{perfil.usuario?.telefono || 'No proporcionado'}</strong>
          </div>
        </div>
      </div>

      <p className="sidebar-disclaimer">
        Las opiniones son referencias. TrabajITO no garantiza la calidad final del servicio.
      </p>
    </div>
  );
}