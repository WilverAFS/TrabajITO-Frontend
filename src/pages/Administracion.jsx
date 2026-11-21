import { useState } from 'react'
import { useOutletContext } from 'react-router'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import UsuariosAdmin from '../features/administracion/UsuariosAdmin.jsx'
import SolicitudesAdmin from '../features/administracion/SolicitudesAdmin.jsx'
import PublicacionesAdmin from '../features/administracion/PublicacionesAdmin.jsx'
import ReportesAdmin from '../features/administracion/ReportesAdmin.jsx'
import './Administracion.css'
import ResumenAdmin from '../features/administracion/ResumenAdmin.jsx'
const PESTANAS = [
  { id: 'usuarios', etiqueta: 'Usuarios' },
  { id: 'solicitudes', etiqueta: 'Verificación de trabajadores' },
  { id: 'publicaciones', etiqueta: 'Publicaciones' },
  { id: 'reportes', etiqueta: 'Reportes' },
  { id: 'resumen', etiqueta: 'Resumen' }
]

export default function Administracion() {
  const { usuario } = useOutletContext()
  const [pestanaActiva, setPestanaActiva] = useState('resumen')

  return (
    <div className="admin-pagina">
      <Header botonActivo="administracion" />

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
              {pestanaActiva === 'resumen' && (<ResumenAdmin onIrAPestana={setPestanaActiva} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer className="admin-footer" />
    </div>
  )
}