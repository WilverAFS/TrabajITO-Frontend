import { useEffect, useState, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'

import logo from '../assets/marca-oficial.png'
import { CampanaIcono } from './Iconos'

import { obtenerToken } from '../services/apiClient.js'
import {
  listarNotificaciones,
  contarNotificacionesNoLeidas,
  marcarNotificacionComoLeida,
  marcarTodasNotificacionesComoLeidas,
} from '../services/notificacionesApi.js'
import {
  cerrarSesion,
  obtenerUsuarioActual,
} from '../services/authApi.js'

import './Header.css'

function HeaderAutenticado({ botonActivo = 'catalogo' }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [datosUsuario, setDatosUsuario] = useState(null)
  const [usuarioActual, setUsuarioActual] = useState('Invitado')
  const [cerrando, setCerrando] = useState(false)

  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false)
  const [errorNotificaciones, setErrorNotificaciones] = useState('')

  const navigate = useNavigate()

  // Obtener usuario autenticado.
  useEffect(() => {
    if (!obtenerToken()) return undefined

    const controlador = new AbortController()

    obtenerUsuarioActual({
      signal: controlador.signal,
      notificarSesion: false,
    })
      .then((usuario) => {
        setDatosUsuario(usuario)
        if (usuario?.nombre) setUsuarioActual(usuario.nombre)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error al obtener usuario.')
        }
      })

    return () => controlador.abort()
  }, [])

  // Cargar notificaciones y contador mediante el servicio Axios.
  const cargarNotificaciones = useCallback(async () => {
    if (!obtenerToken()) return

    setCargandoNotificaciones(true)
    setErrorNotificaciones('')

    try {
      const [respuestaLista, respuestaContador] = await Promise.all([
        listarNotificaciones({ pagina: 1 }),
        contarNotificacionesNoLeidas(),
      ])

      // El servicio devuelve { data, meta }, no un arreglo directo.
      setNotificaciones(
        Array.isArray(respuestaLista?.data)
          ? respuestaLista.data
          : []
      )

      setNoLeidas(Number(respuestaContador?.total ?? 0))
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
      setErrorNotificaciones(
        error.message || 'No se pudieron cargar las notificaciones.'
      )
    } finally {
      setCargandoNotificaciones(false)
    }
  }, [])

  // Consultar al entrar y actualizar automáticamente cada 20 segundos.
  useEffect(() => {
    if (!obtenerToken()) return undefined

    const temporizadorInicial = setTimeout(() => {
      cargarNotificaciones()
    }, 0)

    const intervalo = setInterval(() => {
      cargarNotificaciones()
    }, 20000)

    return () => {
      clearTimeout(temporizadorInicial)
      clearInterval(intervalo)
    }
  }, [cargarNotificaciones])

  // Marcar una notificación como leída.
  const marcarComoLeida = async (id) => {
    try {
      await marcarNotificacionComoLeida(id)
      await cargarNotificaciones()
    } catch (error) {
      console.error(error)
      setErrorNotificaciones(
        error.message || 'No se pudo marcar la notificación como leída.'
      )
    }
  }

  // Marcar todas las notificaciones como leídas.
  const marcarTodasComoLeidas = async () => {
    try {
      await marcarTodasNotificacionesComoLeidas()
      await cargarNotificaciones()
    } catch (error) {
      console.error(error)
      setErrorNotificaciones(
        error.message || 'No se pudieron marcar todas como leídas.'
      )
    }
  }

  // Cerrar sesión.
  const manejarCerrarSesion = async () => {
    if (cerrando) return

    setCerrando(true)

    try {
      await cerrarSesion()
    } catch {
      // El servicio elimina el token aunque el servidor no responda.
    } finally {
      setCerrando(false)
      navigate('/login')
    }
  }

  const esAdmin = Boolean(datosUsuario?.es_administrador)

  return (
    <header className="trabajito-header">
      <Link to={esAdmin ? '/administracion' : '/'} className="logo-container">
        <img src={logo} alt="TrabajITO" />
      </Link>

      <button
        type="button"
        className="btn-menu-movil"
        aria-label={menuMovilAbierto ? 'Cerrar navegación' : 'Abrir navegación'}
        aria-expanded={menuMovilAbierto}
        aria-controls="trabajito-navegacion"
        onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
      >
        <span>{menuMovilAbierto ? '✕' : '☰'}</span>
        <span className="sr-only">
          {menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
        </span>
      </button>

      <nav
        id="trabajito-navegacion"
        className={menuMovilAbierto ? 'navegacion-abierta' : ''}
      >
        {esAdmin ? (
          <NavLink
            to="/administracion"
            onClick={() => setMenuMovilAbierto(false)}
            className={({ isActive }) =>
              `btn-enlace-nav ${
                isActive || botonActivo === 'administracion' ? 'activo' : ''
              }`
            }
          >
            Administración
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/inicio"
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `btn-enlace-nav ${
                  isActive || botonActivo === 'inicio' ? 'activo' : ''
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/catalogo"
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `btn-enlace-nav ${
                  isActive || botonActivo === 'catalogo' ? 'activo' : ''
                }`
              }
            >
              Buscar trabajadores
            </NavLink>

            {datosUsuario?.es_trabajador_habilitado && (
              <NavLink
                to="/solicitudes"
                onClick={() => setMenuMovilAbierto(false)}
                className={({ isActive }) =>
                  `btn-enlace-nav ${isActive ? 'activo' : ''}`
                }
              >
                Solicitudes
              </NavLink>
            )}

            <NavLink
              to="/contrataciones"
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `btn-enlace-nav ${isActive ? 'activo' : ''}`
              }
            >
              Contrataciones
            </NavLink>
          </>
        )}

        <NavLink
          to="/notificaciones"
          onClick={() => setMenuMovilAbierto(false)}
          className={({ isActive }) =>
            `btn-enlace-nav enlace-notificaciones ${
              isActive ? 'activo' : ''
            }`
          }
        >
          Notificaciones
          {noLeidas > 0 && (
            <span className="contador-nav-notificaciones">
              {noLeidas > 99 ? '99+' : noLeidas}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="usuario-contenedor">
        <div className="iconos-notificacion">
          <div className="in-notificaciones-contenedor">
            <button
              type="button"
              className="in-icono-enlace"
              aria-label="Abrir notificaciones"
              title="Notificaciones"
              onClick={() => {
                const abrir = !notificacionesAbiertas
                setNotificacionesAbiertas(abrir)

                if (abrir) {
                  cargarNotificaciones()
                }
              }}
            >
              <CampanaIcono />

              {noLeidas > 0 && (
                <span className="in-notificaciones-contador">
                  {noLeidas > 99 ? '99+' : noLeidas}
                </span>
              )}
            </button>

            {notificacionesAbiertas && (
              <div className="in-notificaciones-panel">
                <div className="in-notificaciones-header">
                  <div>
                    <h3>Notificaciones</h3>
                    <span>{noLeidas} sin leer</span>
                  </div>

                  {noLeidas > 0 && (
                    <button
                      type="button"
                      onClick={marcarTodasComoLeidas}
                    >
                      Leer todas
                    </button>
                  )}
                </div>

                <div className="in-notificaciones-lista">
                  {cargandoNotificaciones && (
                    <p className="in-notificaciones-vacio">
                      Cargando notificaciones...
                    </p>
                  )}

                  {errorNotificaciones && (
                    <p className="in-notificaciones-error">
                      {errorNotificaciones}
                    </p>
                  )}

                  {!cargandoNotificaciones &&
                    !errorNotificaciones &&
                    notificaciones.length === 0 && (
                      <p className="in-notificaciones-vacio">
                        No tienes notificaciones todavía.
                      </p>
                    )}

                  {!cargandoNotificaciones &&
                    notificaciones.map((notificacion) => (
                      <div
                        key={notificacion.id_notificacion}
                        className={`in-notificacion-item ${
                          !notificacion.leida ? 'sin-leer' : ''
                        }`}
                      >
                        <div className="in-notificacion-contenido">
                          <strong>{notificacion.titulo}</strong>
                          <p>{notificacion.mensaje}</p>

                          <small>
                            {notificacion.fecha_creacion
                              ? new Date(
                                  notificacion.fecha_creacion
                                ).toLocaleString('es-MX')
                              : ''}
                          </small>
                        </div>

                        {!notificacion.leida && (
                          <button
                            type="button"
                            className="in-notificacion-leer"
                            title="Marcar como leída"
                            onClick={() =>
                              marcarComoLeida(
                                notificacion.id_notificacion
                              )
                            }
                          >
                            Marcar leída
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <button
          className="btn-perfil-usuario"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          Bienvenido {usuarioActual}
          <span style={{ fontSize: '12px', marginLeft: '4px' }}>v</span>
        </button>

        {menuAbierto && (
          <div className="menu-desplegable-usuario">
            <button
              onClick={() => {
                setMenuAbierto(false)
                navigate('/mi-perfil')
              }}
            >
              Ver perfil
            </button>

            {!esAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMenuAbierto(false)
                  navigate('/perfil-profesional')
                }}
              >
                Mi perfil profesional
              </button>
            )}

            <button
              onClick={manejarCerrarSesion}
              disabled={cerrando}
            >
              {cerrando ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function HeaderPublico() {
  return (
    <header className="trabajito-header trabajito-header-publico">
      <NavLink
        to="/"
        className="logo-container"
        aria-label="TrabajITO, ir al inicio"
      >
        <img src={logo} alt="TrabajITO" />
      </NavLink>

      <nav className="navegacion-publica" aria-label="Navegación pública">
        <NavLink to="/" end className="btn-enlace-nav">
          Inicio
        </NavLink>

        <NavLink to="/catalogo" className="btn-enlace-nav">
          Buscar trabajadores
        </NavLink>

        <NavLink to="/login" className="btn-enlace-nav">
          Iniciar sesión
        </NavLink>

        <NavLink to="/registro" className="btn-enlace-nav">
          Regístrate
        </NavLink>
      </nav>
    </header>
  )
}

export default function Header({
  publico = false,
  botonActivo = 'catalogo',
}) {
  return publico
    ? <HeaderPublico />
    : <HeaderAutenticado botonActivo={botonActivo} />
}