import { NavLink } from 'react-router';
import './NavbarBandejas.css';

export default function NavbarBandejas({
  esTrabajadorHabilitado = false,
  esAdministrador = false,
}) {
  const puedeVerSolicitudes =
    esTrabajadorHabilitado || esAdministrador;

  return (
    <nav className="navbar-bandejas">
      <div className="navbar-bandejas-contenido">
        {puedeVerSolicitudes && (
          <NavLink
            to="/solicitudes"
            className={({ isActive }) =>
              `navbar-bandejas-link ${isActive ? 'activo' : ''}`
            }
          >
            <span>📋</span>
            Solicitudes
          </NavLink>
        )}

        <NavLink
          to="/contrataciones"
          className={({ isActive }) =>
            `navbar-bandejas-link ${isActive ? 'activo' : ''}`
          }
        >
          <span>🤝</span>
          Contrataciones
        </NavLink>

        <NavLink
          to="/notificaciones"
          className={({ isActive }) =>
            `navbar-bandejas-link ${isActive ? 'activo' : ''}`
          }
        >
          <span>🔔</span>
          Notificaciones
        </NavLink>
      </div>
    </nav>
  );
}
