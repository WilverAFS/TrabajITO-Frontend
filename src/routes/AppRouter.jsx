
import { useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router'

import App from '../App.jsx'
import Presentacion from '../pages/Presentacion.jsx'
import Registro from '../pages/Registro.jsx'
import Recuperacion from '../pages/Recuperacion.jsx'
import MiPerfil from '../pages/MiPerfil.jsx'
import Catalogo from '../pages/Catalogo.jsx'
import PerfilProfesional from '../pages/PerfilProfesional.jsx'
import BandejaTemporal from '../pages/BandejaTemporal.jsx'

import InicioAutenticado from './InicioAutenticado.jsx'

import { EVENTO_SESION_EXPIRADA } from '../services/apiClient.js'

import './AppRouter.css'

// Mapa de rutas de TrabajITO
const modulos = [
  { ruta: '/', nombre: 'Presentación', descripcion: 'Página principal de TrabajITO', estado: 'existente' },
  { ruta: '/login', nombre: 'Inicio de sesión', descripcion: 'Formulario de inicio de sesión', estado: 'existente' },
  { ruta: '/registro', nombre: 'Registro', descripcion: 'Formulario de registro', estado: 'existente' },
  { ruta: '/recuperar', nombre: 'Recuperación', descripcion: 'Recuperación de contraseña', estado: 'existente' },
  { ruta: '/inicio', nombre: 'Inicio de usuario', descripcion: 'Pantalla con sesión validada', estado: 'existente' },
  { ruta: '/mi-perfil', nombre: 'Mi perfil', descripcion: 'Información y seguridad de la cuenta', estado: 'existente' },
  { ruta: '/catalogo', nombre: 'Catálogo', descripcion: 'Catálogo de profesionales', estado: 'existente' },
  { ruta: '/solicitudes', nombre: 'Solicitudes', descripcion: 'Bandeja de solicitudes del trabajador', estado: 'pendiente' },
  { ruta: '/contrataciones', nombre: 'Contrataciones', descripcion: 'Bandeja de contrataciones', estado: 'pendiente' },
  { ruta: '/notificaciones', nombre: 'Notificaciones', descripcion: 'Bandeja de notificaciones', estado: 'pendiente' },
  { ruta: '/explorar', nombre: 'Exploración de trabajadores', descripcion: 'Exploración', estado: 'pendiente' },
  { ruta: '/perfil-profesional', nombre: 'Perfil profesional', descripcion: 'Perfil profesional', estado: 'existente' },
  { ruta: '/administracion', nombre: 'Administración', descripcion: 'Administración', estado: 'pendiente' },
]

function ConTitulo({ titulo, registro = false, children }) {
  useEffect(() => {
    const tituloPrevio = document.title

    document.title = `${titulo} | TrabajITO`
    document.documentElement.lang = 'es'

    if (registro) {
      document.documentElement.classList.add('trabajito-registro-route')
    }

    return () => {
      document.title = tituloPrevio

      if (registro) {
        document.documentElement.classList.remove('trabajito-registro-route')
      }
    }
  }, [titulo, registro])

  return children
}

function Marcador({ nombre, descripcion, restringida = false }) {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <span className="tj-ruta-etiqueta">Módulo en preparación</span>
        <h1>{nombre}</h1>
        <p>{descripcion}</p>

        <p className="tj-ruta-nota">
          {restringida
            ? 'Esta ruta muestra un aviso temporal. La validación de permisos se integrará con Laravel Sanctum.'
            : 'La vista funcional se incorporará cuando se desarrolle su Work Item correspondiente.'}
        </p>

        <nav className="tj-ruta-acciones" aria-label="Navegación de desarrollo">
          <Link to="/rutas">Ver mapa de rutas</Link>
          <Link to="/inicio">Volver al inicio</Link>
        </nav>
      </section>
    </main>
  )
}

function MapaRutas() {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta tj-ruta-amplia">
        <span className="tj-ruta-etiqueta">Prueba de rutas</span>
        <h1>Rutas de TrabajITO</h1>
        <p>
          Prueba la navegación. Las páginas pendientes todavía no tienen
          funcionalidad implementada.
        </p>

        <div className="tj-ruta-lista">
          {modulos.map((modulo) => (
            <Link
              className="tj-ruta-item"
              key={modulo.ruta}
              to={modulo.ruta}
            >
              <span>
                <strong>{modulo.nombre}</strong>
                <small>{modulo.descripcion}</small>
                <code>{modulo.ruta}</code>
              </span>

              <span className="tj-ruta-estado">
                {modulo.estado === 'existente' ? 'Vista existente' : 'Reservada'}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function NoEncontrada() {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <span className="tj-ruta-etiqueta">Error 404</span>
        <h1>Esta página no existe</h1>
        <p>
          La dirección solicitada no coincide con ninguna ruta registrada
          de TrabajITO.
        </p>

        <nav className="tj-ruta-acciones" aria-label="Navegación de error">
          <Link to="/">Volver al inicio</Link>
          <Link to="/rutas">Consultar rutas</Link>
        </nav>
      </section>
    </main>
  )
}

function PresentacionConNavegacion() {
  const navigate = useNavigate()

  return (
    <ConTitulo titulo="Presentación">
      <Presentacion onIniciarSesion={() => navigate('/login')} />
    </ConTitulo>
  )
}

// Atiende las respuestas 401 de los servicios autenticados
function VigilarSesion() {
  const navigate = useNavigate()

  useEffect(() => {
    const manejarSesionExpirada = () => {
      navigate('/login', { replace: true })
    }

    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)

    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)
    }
  }, [navigate])

  return null
}

export default function AppRouter() {
  return (
    <>
      <VigilarSesion />

      <Routes>
        {/* Presentación */}
        <Route
          path="/"
          element={<PresentacionConNavegacion />}
        />

        {/* Inicio de sesión */}
        <Route
          path="/login"
          element={
            <ConTitulo titulo="Inicio de sesión">
              <App />
            </ConTitulo>
          }
        />

        {/* Registro */}
        <Route
          path="/registro"
          element={
            <ConTitulo titulo="Registro" registro>
              <Registro />
            </ConTitulo>
          }
        />

        {/* Recuperación */}
        <Route
          path="/recuperar"
          element={
            <ConTitulo titulo="Recuperación">
              <Recuperacion />
            </ConTitulo>
          }
        />

        {/* Catálogo */}
        <Route
          path="/catalogo"
          element={
            <ConTitulo titulo="Catálogo de profesionales">
              <Catalogo />
            </ConTitulo>
          }
        />

        {/* Mapa de rutas */}
        <Route
          path="/rutas"
          element={
            <ConTitulo titulo="Rutas">
              <MapaRutas />
            </ConTitulo>
          }
        />

        {/* Rutas que requieren sesión */}
        <Route element={<InicioAutenticado />}>
          <Route
            path="/inicio"
            element={null}
          />

          <Route
            path="/mi-perfil"
            element={
              <ConTitulo titulo="Mi perfil">
                <MiPerfil />
              </ConTitulo>
            }
          />

          <Route
            path="/solicitudes"
            element={
              <ConTitulo titulo="Solicitudes">
                <BandejaTemporal titulo="Solicitudes" />
              </ConTitulo>
            }
          />

          <Route
            path="/contrataciones"
            element={
              <ConTitulo titulo="Contrataciones">
                <BandejaTemporal titulo="Contrataciones" />
              </ConTitulo>
            }
          />

          <Route
            path="/notificaciones"
            element={
              <ConTitulo titulo="Notificaciones">
                <BandejaTemporal titulo="Notificaciones" />
              </ConTitulo>
            }
          />

          <Route
            path="/perfil-profesional"
            element={
              <ConTitulo titulo="Perfil profesional">
                <PerfilProfesional />
              </ConTitulo>
            }
          />

          <Route
            path="/explorar"
            element={
              <ConTitulo titulo="Exploración">
                <Marcador
                  nombre="Exploración de trabajadores"
                  descripcion="Catálogo, filtros y resultados de búsqueda de profesionales."
                />
              </ConTitulo>
            }
          />

          <Route
            path="/administracion"
            element={
              <ConTitulo titulo="Administración">
                <Marcador
                  nombre="Administración"
                  descripcion="Usuarios, verificación de trabajadores, publicaciones y reportes."
                  restringida
                />
              </ConTitulo>
            }
          />
        </Route>

        {/* Error 404 */}
        <Route
          path="*"
          element={
            <ConTitulo titulo="Página no encontrada">
              <NoEncontrada />
            </ConTitulo>
          }
        />
      </Routes>
    </>
  )
}
