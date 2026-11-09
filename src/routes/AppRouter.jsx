import { useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router'
import App from '../App.jsx'
import Presentacion from '../pages/Presentacion.jsx';
import Registro from '../pages/Registro.jsx'
import Recuperacion from '../pages/Recuperacion.jsx'
import InicioAutenticado from './InicioAutenticado.jsx'
import MiPerfil from '../pages/MiPerfil.jsx'
import './AppRouter.css'

// Estas rutas describen la navegacion prevista, NO implementan autorizacion.
// Administracion, perfil y contrataciones mostraran marcadores temporales
// hasta integrar autenticacion y permisos reales desde Laravel Sanctum.
const modulos = [
  { ruta: '/', nombre: 'Presentación', descripcion: 'Página principal de TrabajITO', estado: 'existente' },
  { ruta: '/login', nombre: 'Inicio de sesión', descripcion: 'Formulario de inicio de sesión', estado: 'existente' },
  { ruta: '/registro', nombre: 'Registro', descripcion: 'Formulario de registro', estado: 'existente' },
  { ruta: '/recuperar', nombre: 'Recuperación', descripcion: 'Recuperación de contraseña', estado: 'existente' },
  { ruta: '/inicio', nombre: 'Inicio de usuario', descripcion: 'Pantalla real con sesión validada', estado: 'existente' },
  { ruta: '/mi-perfil', nombre: 'Mi perfil', descripcion: 'Información y seguridad de la cuenta', estado: 'existente' },
  { ruta: '/explorar', nombre: 'Exploración de trabajadores', descripcion: 'Exploración', estado: 'pendiente' },
  { ruta: '/perfil-profesional', nombre: 'Perfil profesional', descripcion: 'Perfil profesional', estado: 'pendiente' },
  { ruta: '/contrataciones', nombre: 'Contrataciones', descripcion: 'Contrataciones', estado: 'pendiente' },
  { ruta: '/administracion', nombre: 'Administración', descripcion: 'Administración', estado: 'pendiente' },
];

function ConTitulo({ titulo, registro = false, children }) {
  useEffect(() => {
    const tituloPrevio = document.title
    document.title = `${titulo} | TrabajITO`
    document.documentElement.lang = 'es'
    if (registro) document.documentElement.classList.add('trabajito-registro-route')
    return () => {
      document.title = tituloPrevio
      if (registro) document.documentElement.classList.remove('trabajito-registro-route')
    }
  }, [titulo, registro])
  return children
}

function Marcador({ nombre, descripcion, restringida = false }) {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <span className="tj-ruta-etiqueta">Modulo en preparacion</span>
        <h1>{nombre}</h1>
        <p>{descripcion}</p>
        <p className="tj-ruta-nota">
          {restringida
            ? 'Esta ruta solo muestra un aviso temporal. Aun no concede acceso ni muestra informacion privada. La validacion de permisos se integrara con Laravel Sanctum.'
            : 'La vista funcional se incorporara cuando se desarrolle su Work Item correspondiente.'}
        </p>
        <nav className="tj-ruta-acciones" aria-label="Navegacion de desarrollo">
          <Link to="/rutas">Ver mapa de rutas</Link>
          <Link to="/">Volver al inicio</Link>
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
        <p>Prueba la navegacion. Las paginas marcadas como pendientes todavia no tienen funcionalidad ni permisos implementados.</p>
        <div className="tj-ruta-lista">
          {modulos.map((modulo) => (
            <Link className="tj-ruta-item" key={modulo.ruta} to={modulo.ruta}>
              <span>
                <strong>{modulo.nombre}</strong>
                <small>{modulo.descripcion}</small>
                <code>{modulo.ruta}</code>
              </span>
              <span className="tj-ruta-estado">{modulo.estado === 'existente' ? 'Vista existente' : 'Reservada'}</span>
            </Link>
          ))}
        </div>
        <p className="tj-ruta-nota">Prueba del router. Tras los avances de autenticacion, se adaptara para usar las rutas y permisos reales.</p>
      </section>
    </main>
  )
}

function NoEncontrada() {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <span className="tj-ruta-etiqueta">Error 404</span>
        <h1>Esta pagina no existe</h1>
        <p>La direccion solicitada no coincide con ninguna ruta registrada de TrabajITO.</p>
        <nav className="tj-ruta-acciones" aria-label="Navegacion de error">
          <Link to="/">Volver al inicio</Link>
          <Link to="/rutas">Consultar rutas</Link>
        </nav>
      </section>
    </main>
  )
}

function PresentacionConNavegacion() {
  const navigate = useNavigate();

  return (
    <ConTitulo titulo="Presentación">
      <Presentacion
        onIniciarSesion={() => navigate('/login')}
      />
    </ConTitulo>
  );
}
export default function AppRouter() {
  return (
    <Routes>
      {/* Página principal: Presentación de TrabajITO */}
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

      <Route
        path="/registro"
        element={
          <ConTitulo titulo="Registro" registro>
            <Registro />
          </ConTitulo>
        }
      />

      <Route
        path="/recuperar"
        element={
          <ConTitulo titulo="Recuperacion">
            <Recuperacion />
          </ConTitulo>
        }
      />

      <Route
        path="/rutas"
        element={
          <ConTitulo titulo="Rutas">
            <MapaRutas />
          </ConTitulo>
        }
      />

      <Route
        path="/inicio"
        element={
          <ConTitulo titulo="Inicio">
            <InicioAutenticado />
          </ConTitulo>
        }
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
        path="/explorar"
        element={
          <ConTitulo titulo="Exploracion">
            <Marcador
              nombre="Exploracion de trabajadores"
              descripcion="Catalogo, filtros y resultados de busqueda de profesionales."
            />
          </ConTitulo>
        }
      />

      <Route
        path="/perfil-profesional"
        element={
          <ConTitulo titulo="Perfil profesional">
            <Marcador
              nombre="Perfil profesional"
              descripcion="Creacion, oficios, disponibilidad, portafolio y reputacion."
              restringida
            />
          </ConTitulo>
        }
      />

      <Route
        path="/contrataciones"
        element={
          <ConTitulo titulo="Contrataciones">
            <Marcador
              nombre="Contrataciones"
              descripcion="Solicitudes, historial, publicaciones y valoraciones."
              restringida
            />
          </ConTitulo>
        }
      />

      <Route
        path="/administracion"
        element={
          <ConTitulo titulo="Administracion">
            <Marcador
              nombre="Administracion"
              descripcion="Usuarios, verificacion de trabajadores, publicaciones y reportes."
              restringida
            />
          </ConTitulo>
        }
      />

      <Route
        path="*"
        element={
          <ConTitulo titulo="Pagina no encontrada">
            <NoEncontrada />
          </ConTitulo>
        }
      />
    </Routes>
  );
}