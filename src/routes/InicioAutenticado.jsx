
import { useCallback, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import Inicio from '../pages/Inicio.jsx'
import { obtenerToken } from '../services/apiClient.js'
import { cerrarSesion, obtenerUsuarioActual } from '../services/authApi.js'

export default function InicioAutenticado() {
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState('')
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    if (!obtenerToken()) {
      navigate('/', { replace: true })
      return undefined
    }

    const controlador = new AbortController()

    obtenerUsuarioActual({ signal: controlador.signal })
      .then((cuenta) => {
        if (!controlador.signal.aborted) {
          setUsuario(cuenta)
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controlador.signal.aborted) return
        if (err.status === 401) return

        setError(
          `No se pudo validar la sesión. Comprueba que Laravel esté encendido. ${err.message}`
        )
      })

    return () => controlador.abort()
  }, [navigate])

  const manejarCerrarSesion = useCallback(async () => {
    if (cerrando) return

    setCerrando(true)

    try {
      await cerrarSesion()
    } catch {
      // El servicio gestiona la eliminación del token.
    } finally {
      navigate('/', { replace: true })
    }
  }, [cerrando, navigate])

  if (error) {
    return (
      <main className="tj-ruta-pagina">
        <section className="tj-ruta-tarjeta">
          <h1>No fue posible validar tu sesión</h1>
          <p role="alert">{error}</p>
          <nav className="tj-ruta-acciones">
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
            <Link to="/">Volver al inicio</Link>
          </nav>
        </section>
      </main>
    )
  }

  if (!usuario) {
    return (
      <main className="tj-ruta-pagina">
        <section className="tj-ruta-tarjeta">
          <p role="status">Verificando sesión con Laravel...</p>
        </section>
      </main>
    )
  }

  if (location.pathname === '/inicio') {
    return (
      <Inicio
        cerrarSesion={manejarCerrarSesion}
        nombreUsuario={usuario.nombre}
        usuario={usuario}
      />
    )
  }

  return <Outlet context={{ usuario, cerrarSesion: manejarCerrarSesion }} />
}
