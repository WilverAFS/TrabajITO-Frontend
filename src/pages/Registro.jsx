import { useState } from 'react'
import logo from '../assets/registro-logo-provisional.png'
import hero from '../assets/registro-hero-provisional.png'
import './Registro.css'

function CorreoIcono() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  )
}

function CandadoIcono() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Campo({ etiqueta, id, placeholder, tipo = 'text', icono = null, autoComplete, minLength }) {
  return (
    <div className="rg-campo-grupo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="rg-campo-control">
        {icono && <span className="rg-campo-icono">{icono}</span>}
        <input
          id={id}
          name={id}
          type={tipo}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
      </div>
    </div>
  )
}

export default function Registro() {
  const [mostrarContrasenas, setMostrarContrasenas] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function manejarRegistro(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    const datos = new FormData(evento.currentTarget)
    const contrasena = String(datos.get('contrasena') ?? '')
    const confirmacion = String(datos.get('confirmacion') ?? '')

    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden. Revisa ambos campos.')
      return
    }

    // Maquetación exclusivamente frontend. No enviar datos ni guardar contraseñas.
    setMensaje('Formulario validado. El registro de cuentas se conectará al backend más adelante.')
  }

  return (
    <div className="rg-pagina">
      <header className="rg-header">
        <div className="rg-header-contenido">
          <a href="/" aria-label="TrabajITO, ir al inicio" className="rg-marca">
            <img src={logo} alt="TrabajITO" />
          </a>
          <a href="/" className="rg-enlace-header">Iniciar sesión</a>
        </div>
      </header>

      <main className="rg-principal">
        <section className="rg-presentacion" aria-labelledby="rg-titulo">
          <a className="rg-regresar" href="/">←&nbsp; Volver a iniciar sesión</a>
          <div className="rg-etiqueta"><span aria-hidden="true">◉</span> Trabajadores de oficio</div>
          <h1 id="rg-titulo">Encuentra a la persona <span>correcta para tu proyecto.</span></h1>
          <p className="rg-introduccion">Crea una cuenta para buscar servicios o publicar tu perfil de trabajador.</p>
          <img
            className="rg-hero"
            src={hero}
            alt="Una clienta conversa con un trabajador de oficio en una cocina, con una tarjeta informativa sobre perfiles y opiniones"
          />
        </section>

        <section className="rg-tarjeta" aria-labelledby="rg-formulario-titulo">
          <h2 id="rg-formulario-titulo">Crea tu cuenta</h2>
          <p className="rg-tarjeta-descripcion">Elige si quieres buscar servicios o compartir tu perfil profesional.</p>

          <form className="rg-formulario" onSubmit={manejarRegistro}>
            <div className="rg-fila-nombres">
              <Campo id="nombre" etiqueta="Nombre" placeholder="Tu nombre" autoComplete="given-name" />
              <Campo id="apellidos" etiqueta="Apellidos" placeholder="Tus apellidos" autoComplete="family-name" />
            </div>

            <Campo id="correo" etiqueta="Correo electrónico" placeholder="tu@correo.com" tipo="email" icono={<CorreoIcono />} autoComplete="email" />
            <Campo id="contrasena" etiqueta="Contraseña" placeholder="Crea una contraseña" tipo={mostrarContrasenas ? 'text' : 'password'} icono={<CandadoIcono />} autoComplete="new-password" minLength={8} />
            <Campo id="confirmacion" etiqueta="Confirmar contraseña" placeholder="Repite tu contraseña" tipo={mostrarContrasenas ? 'text' : 'password'} icono={<CandadoIcono />} autoComplete="new-password" minLength={8} />

            <label className="rg-opcion-check rg-mostrar">
              <input type="checkbox" checked={mostrarContrasenas} onChange={(e) => setMostrarContrasenas(e.target.checked)} />
              <span>Mostrar contraseñas</span>
            </label>

            <label className="rg-opcion-check rg-terminos">
              <input type="checkbox" name="aceptaCondiciones" required />
              <span>Acepto los <span className="rg-texto-enlace">Términos y condiciones</span> y la <span className="rg-texto-enlace">Política de privacidad</span>.</span>
            </label>

            {error && <p className="rg-mensaje rg-error" role="alert">{error}</p>}
            {mensaje && <p className="rg-mensaje rg-confirmacion" role="status">{mensaje}</p>}

            <button className="rg-boton-crear" type="submit">Crear cuenta</button>
          </form>

          <div className="rg-tarjeta-pie">
            <p>¿Ya tienes una cuenta?</p>
            <a href="/">Iniciar sesión</a>
          </div>
        </section>
      </main>

      <footer className="rg-footer">
        <div className="rg-footer-contenido">
          <small>© 2026 TrabajITO. Hecho para conectar.</small>
          <nav aria-label="Enlaces informativos pendientes de implementación">
            <span>Buscar trabajadores</span>
            <span>Privacidad</span>
            <span>Términos y condiciones</span>
          </nav>
        </div>
      </footer>
    </div>
  )
}
