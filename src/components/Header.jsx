
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'

import logo from '../assets/registro-logo-provisional.png'
import { CampanaIcono, CorreoIcono } from './Iconos'

import { obtenerToken } from '../services/apiClient.js'
import {
  cerrarSesion,
  obtenerUsuarioActual,
} from '../services/authApi.js'

import './Header.css'

const BASE_API = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1'
).replace(/\/$/, '')

export default function Header({ botonActivo = 'catalogo' }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState('Invitado')
  const [cerrando, setCerrando] = useState(false)

  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false)
  const [errorNotificaciones, setErrorNotificaciones] = useState('')

  const navigate = useNavigate()

  const obtenerHeaders = useCallback(() => {
    const token = obtenerToken()

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }, [])

  // Obtener usuario autenticado.
  useEffect(() => {
    if (!obtenerToken()) return undefined

    const controlador = new AbortController()

    obtenerUsuarioActual({
      signal: controlador.signal,
      notificarSesion: false,
    })
      .then((usuario) => {
        if (usuario?.nombre) {
          setUsuarioActual(usuario.nombre)
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error al obtener usuario.')
        }
      })

    return () => controlador.abort()
  }, [])

  // Cargar notificaciones y contador.
  const cargarNotificaciones = useCallback(async () => {
    const token = obtenerToken()

    if (!token) return

    setCargandoNotificaciones(true)
    setErrorNotificaciones('')

    try {
      const [respuestaLista, respuestaContador] = await Promise.all([
        fetch(`${BASE_API}/notificaciones?page=1`, {
          headers: obtenerHeaders(),
        }),
        fetch(`${BASE_API}/notificaciones/no-leidas/count`, {
          headers: obtenerHeaders(),
        }),
      ])

      if (!respuestaLista.ok || !respuestaContador.ok) {
        throw new Error('No se pudieron cargar las notificaciones.')
      }

      const datosLista = await respuestaLista.json()
      const datosContador = await respuestaContador.json()

      const lista = Array.isArray(datosLista.data)
        ? datosLista.data
        : Array.isArray(datosLista.data?.data)
          ? datosLista.data.data
          : []

      setNotificaciones(lista)

      setNoLeidas(
        Number(
          datosContador.data?.total ??
          datosContador.total ??
          0
        )
      )
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
      setErrorNotificaciones(error.message)
    } finally {
      setCargandoNotificaciones(false)
    }
  }, [obtenerHeaders])

  // Consultar notificaciones al cargar el encabezado.
  useEffect(() => {
    if (obtenerToken()) {
      cargarNotificaciones()
    }
  }, [cargarNotificaciones])

  // Marcar una notificación como leída.
  const marcarComoLeida = async (id) => {
    try {
      const respuesta = await fetch(
        `${BASE_API}/notificaciones/${id}/leer`,
        {
          method: 'PATCH',
          headers: obtenerHeaders(),
        }
      )

      if (!respuesta.ok) {
        throw new Error('No se pudo marcar la notificación como leída.')
      }

      await cargarNotificaciones()
    } catch (error) {
      console.error(error)
      setErrorNotificaciones(error.message)
    }
  }

  // Marcar todas las notificaciones como leídas.
  const marcarTodasComoLeidas = async () => {
    try {
      const respuesta = await fetch(
        `${BASE_API}/notificaciones/leer-todas`,
        {
          method: 'PATCH',
          headers: obtenerHeaders(),
        }
      )

      if (!respuesta.ok) {
        throw new Error('No se pudieron marcar todas como leídas.')
      }

      await cargarNotificaciones()
    } catch (error) {
      console.error(error)
      setErrorNotificaciones(error.message)
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

  return (
    <header className="trabajito-header">
      <a href="/" className="logo-container">
        <img src={logo} alt="TrabajITO" />
      </a>

      <nav>
        <button
          onClick={() => navigate('/inicio')}
          className={`btn-enlace-nav ${
            botonActivo === 'inicio' ? 'activo' : ''
          }`}
        >
          Inicio
        </button>

        <button
          onClick={() => navigate('/catalogo')}
          className={`btn-enlace-nav ${
            botonActivo === 'catalogo' ? 'activo' : ''
          }`}
        >
          Buscar trabajadores
        </button>
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

          <CorreoIcono />
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
