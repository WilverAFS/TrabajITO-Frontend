import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  const manejarSubmit = (event) => {
    event.preventDefault()
    alert('El formulario funciona. Falta conectar el backend de TrabajITO.')
  }

  return (
    <div className="pagina-login">
      <header className="navbar">
        <a className="marca" href="#inicio" aria-label="TrabajITO, inicio">
          <span className="marca-icono">🛠️</span>
          <span>trabaj<span>ITO</span></span>
        </a>
      </header>

      <main className="login-layout" id="inicio">
        <section className="presentacion">
          <a className="volver" href="#inicio">
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

          <div className="hero-card">
            <img
              src={heroImg}
              alt="Presentación de los servicios de TrabajITO"
              className="hero-imagen"
            />

            <div className="hero-mensaje">
              <span className="escudo" aria-hidden="true">✓</span>
              <div>
                <strong>Perfiles, portafolios y reputación.</strong>
                <p>Disponibilidad publicada y calificaciones.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="formulario-card">
          <div className="formulario-encabezado">
            <h2>Inicia sesión como cliente o trabajador.</h2>
            <p>
              Accede con tu correo y contraseña para consultar perfiles,
              portafolios, disponibilidad y reputación.
            </p>
          </div>

          <form onSubmit={manejarSubmit}>
            <div className="campo">
              <label htmlFor="correo">Correo electrónico</label>

              <div className="input-contenedor">
                <span className="input-icono" aria-hidden="true">✉</span>
                <input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="password">Contraseña</label>

              <div className="input-contenedor">
                <span className="input-icono" aria-hidden="true">♙</span>
                <input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <label className="mostrar-password">
              <input
                type="checkbox"
                checked={mostrarPassword}
                onChange={(event) =>
                  setMostrarPassword(event.target.checked)
                }
              />
              Mostrar contraseña
            </label>

            <button className="boton-login" type="submit">
              Iniciar sesión
            </button>

            <a className="enlace-centrado" href="#recuperar">
              ¿Olvidaste tu contraseña?
            </a>
          </form>

          <div className="registro">
            <p>¿Aún no tienes una cuenta?</p>
            <a href="#registro">
              Regístrate <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="aviso-seguridad">
            <span className="aviso-icono" aria-hidden="true">✓</span>
            <div>
              <strong>Acceso diferenciado.</strong>
              <p>Consulta perfiles, portafolios, disponibilidad y reputación.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App