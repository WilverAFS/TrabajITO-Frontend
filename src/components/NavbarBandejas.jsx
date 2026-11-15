
import { NavLink } from 'react-router';
import './NavbarBandejas.css';

export default function NavbarBandejas({ rol }) {
  const esTrabajador =
    rol?.toLowerCase() === 'trabajador';

  return (
    <nav className="navbar-bandejas">
      <div className="navbar-bandejas-contenido">

        {esTrabajador && (
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
