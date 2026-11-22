import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from './assets/marca-oficial.png'
import { eliminarToken, obtenerToken } from './services/apiClient.js'
import { iniciarSesion, obtenerUsuarioActual } from './services/authApi.js'
import LayoutAplicacion from './components/LayoutAplicacion.jsx'
import hero from './assets/registro-hero-provisional.png'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(() => Boolean(obtenerToken()))

  useEffect(() => {
    if (!obtenerToken()) return undefined

    const controlador = new AbortController()
    obtenerUsuarioActual({ signal: controlador.signal })
      .then(() => {
        navigate('/inicio', { replace: true })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (error.status === 401) {
          eliminarToken()
          return
        }
        console.error('Error al verificar la sesión.')
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [navigate])

  const manejarInicioSesion = async (e) => {
    e.preventDefault()
    if (enviando) return
    setErrorLogin('')
    setEnviando(true)

    try {
      await iniciarSesion({
        correo,
        password: contrasena,
        device_name: 'react-web',
      })
      navigate('/inicio', { replace: true })
    } catch (error) {
      setErrorLogin(
        error?.status
          ? error.message
          : 'Error de conexión con el servidor.',
      )
    } finally {
      setEnviando(false)
    }
  }

if (cargando) {
  return (
    <LayoutAplicacion publico className="pagina">
      <main className="contenido">
        <p role="status">Cargando TrabajITO...</p>
      </main>
    </LayoutAplicacion>
  )
}

  return (
  <LayoutAplicacion publico className="pagina">
      <main className="contenido">
        <section className="presentacion">
          <a href="/" className="volver">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>

          <div className="etiqueta">Trabajadores de oficio</div>

          <h1>
            Encuentra y conecta con
            <span> profesionales.</span>
          </h1>

          <p className="descripcion">
            Accede como cliente o trabajador para consultar perfiles,
            portafolios, disponibilidad y reputación.
          </p>

          <div className="imagen-principal">
            <img
              className="login-hero-imagen"
              src={hero}
              alt="Una clienta conversa con un trabajador de oficio"
            />

            <div className="imagen-mensaje">
              <span className="escudo">✓</span>
              <div>
                <strong>Perfiles, portafolios y reputación.</strong>
                <small>Disponibilidad pública y calificaciones.</small>
              </div>
            </div>
          </div>

          <div className="franja-decorativa" />
        </section>

        <section className="login-card">
          <div className="login-encabezado">
            <img src={logo} alt="Logo de TrabajITO" />
          </div>
          <div className="login-encabezado">
            <h2>Inicia sesión como cliente o trabajador.</h2>
            <p>
              Accede con tu correo y contraseña para consultar perfiles,
              portafolios, disponibilidad y reputación.
            </p>
          </div>

          <form onSubmit={manejarInicioSesion}>
            <label htmlFor="correo">Correo electrónico</label>
            <div className="campo">
              <span className="campo-icono" aria-hidden="true">✉</span>
              <input
                id="correo"
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="contrasena">Contraseña</label>
            <div className="campo">
              <span className="campo-icono" aria-hidden="true">♙</span>
              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <label className="mostrar-password">
              <input
                type="checkbox"
                checked={mostrarContrasena}
                onChange={(e) => setMostrarContrasena(e.target.checked)}
              />
              <span>Mostrar contraseña</span>
            </label>

            {errorLogin && (
              <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
                {errorLogin}
              </div>
            )}

            <button type="submit" className="boton-login" disabled={enviando}>
              Iniciar sesión
            </button>

            <Link to="/recuperar" className="enlace-recuperar">
              ¿Olvidaste tu contraseña?
            </Link>
          </form>

          <div className="separador" />

          <div className="registro">
            <p>¿Aún no tienes una cuenta?</p>
            <Link to="/registro">
              Regístrate <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="aviso-seguridad">
            <span className="aviso-icono">✓</span>
            <div>
              <strong>Acceso diferenciado.</strong>
              <small>
                Consulta perfiles, portafolios, disponibilidad y reputación.
              </small>
            </div>
          </div>
        </section>
      </main>
    </LayoutAplicacion>
  )
}

export default App
