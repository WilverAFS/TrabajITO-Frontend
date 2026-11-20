import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import logo from '../assets/registro-logo-provisional.png'
import Footer from '../components/Footer.jsx'
import '../components/Footer.css'
import { cerrarSesion } from '../services/authApi.js'
import UsuariosAdmin from '../features/administracion/UsuariosAdmin.jsx'
import SolicitudesAdmin from '../features/administracion/SolicitudesAdmin.jsx'
import PublicacionesAdmin from '../features/administracion/PublicacionesAdmin.jsx'
import ReportesAdmin from '../features/administracion/ReportesAdmin.jsx'
import './Administracion.css'

const PESTANAS = [
  { id: 'usuarios', etiqueta: 'Usuarios' },
  { id: 'solicitudes', etiqueta: 'Verificación de trabajadores' },
  { id: 'publicaciones', etiqueta: 'Publicaciones' },
  { id: 'reportes', etiqueta: 'Reportes' },
]

export default function Administracion() {
  const { usuario } = useOutletContext()
  const navigate = useNavigate()
  const [pestanaActiva, setPestanaActiva] = useState('usuarios')
  const [cerrando, setCerrando] = useState(false)

  const handleCerrarSesion = async () => {
    setCerrando(true)
    try {
      await cerrarSesion()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="admin-pagina">
      <header className="admin-topbar">
        <div className="admin-topbar-contenido">
          <div className="admin-marca">
            <img src={logo} alt="TrabajITO" className="admin-logo" />
          </div>

          <div className="admin-usuario-barra">
            <span className="admin-usuario-nombre">
              Bienvenido {usuario?.nombre || 'Administrador'}
            </span>
            <button
              type="button"
              className="admin-btn"
              disabled={cerrando}
              onClick={handleCerrarSesion}
            >
              {cerrando ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-contenedor">
          <header className="admin-encabezado">
            <div>
              <h1 className="admin-titulo">Panel de administración</h1>
              <p className="admin-subtitulo">
                Gestiona usuarios, solicitudes de habilitación, publicaciones y reportes.
              </p>
            </div>
          </header>

          <div className="admin-tarjeta">
            <nav className="admin-tabs" aria-label="Secciones de administración">
              {PESTANAS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`admin-tab ${pestanaActiva === tab.id ? 'activa' : ''}`}
                  onClick={() => setPestanaActiva(tab.id)}
                >
                  {tab.etiqueta}
                </button>
              ))}
            </nav>

            <div className="admin-contenido">
              {pestanaActiva === 'usuarios' && <UsuariosAdmin usuarioActual={usuario} />}
              {pestanaActiva === 'solicitudes' && <SolicitudesAdmin />}
              {pestanaActiva === 'publicaciones' && <PublicacionesAdmin />}
              {pestanaActiva === 'reportes' && <ReportesAdmin />}
            </div>
          </div>
        </section>
      </main>

      <Footer className="admin-footer" />
    </div>
  )
}