import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Inicio from '../pages/Inicio.jsx'

// La variable es opcional; por defecto utiliza el Backend local probado en Postman.
const BASE_API = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '')

export default function InicioAutenticado() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState('')
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || token === 'undefined') {
      navigate('/', { replace: true })
      return
    }

    const controller = new AbortController()
    async function validarSesion() {
      try {
        const respuesta = await fetch(`${BASE_API}/me`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        if (respuesta.status === 401) {
          localStorage.removeItem('token')
          navigate('/', { replace: true })
          return
        }
        if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`)
        const data = await respuesta.json()
        if (!data.success || !data.data) throw new Error('Respuesta inesperada de Laravel.')
        setUsuario(data.data)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(`No se pudo validar la sesión. Comprueba que Laravel esté encendido. ${e.message}`)
        }
      }
    }
    validarSesion()
    return () => controller.abort()
  }, [navigate])

  const cerrarSesion = useCallback(async () => {
    if (cerrando) return
    setCerrando(true)
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const respuesta = await fetch(`${BASE_API}/auth/logout`, {
          method: 'POST',
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        if (!respuesta.ok) console.warn('No se confirmó la revocación del token en Laravel.')
      }
    } catch (e) {
      console.warn('No se pudo confirmar el cierre de sesión en el servidor.', e)
    } finally {
      localStorage.removeItem('token')
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
            <button type="button" onClick={() => window.location.reload()}>Reintentar</button>
            <Link to="/">Volver al inicio</Link>
          </nav>
        </section>
      </main>
    )
  }
  if (!usuario) {
    return <main className="tj-ruta-pagina"><section className="tj-ruta-tarjeta"><p role="status">Verificando sesión con Laravel...</p></section></main>
  }

  return <Inicio cerrarSesion={cerrarSesion} nombreUsuario={usuario.nombre} />
}
