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
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#0d6efd" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Campo({ etiqueta, id, placeholder, tipo = 'text', icono = null, autoComplete }) {
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
          required
        />
      </div>
    </div>
  )
}

export default function Recuperacion() {
  const [mensaje, setMensaje] = useState('')

  function manejarRecuperacion(evento) {
    evento.preventDefault()
    setMensaje('Si el correo está registrado, recibirás un enlace de recuperación en breve.')
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
          <h1 id="rg-titulo">Recupera el acceso a <span>tu cuenta.</span></h1>
          <p className="rg-introduccion">Ingresa el correo asociado a tu cuenta para recibir un enlace y volver a entrar.</p>
          <img
            className="rg-hero"
            src={hero}
            alt="Dos trabajadores conversando sobre un proyecto"
          />
        </section>

        <section className="rg-tarjeta" aria-labelledby="rg-formulario-titulo">
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#e7f1ff', padding: '12px', borderRadius: '12px' }}>
              <CandadoIcono />
            </div>
          </div>
          <h2 id="rg-formulario-titulo">¿Olvidaste tu contraseña?</h2>
          <p className="rg-tarjeta-descripcion">Ingresa el correo de tu cuenta para recibir un enlace y crear una nueva contraseña.</p>

          <form className="rg-formulario" onSubmit={manejarRecuperacion}>
            <Campo id="correo" etiqueta="Correo electrónico" placeholder="tu@correo.com" tipo="email" icono={<CorreoIcono />} autoComplete="email" />

            {mensaje && <p className="rg-mensaje rg-confirmacion" role="status">{mensaje}</p>}

            <button className="rg-boton-crear" type="submit">Enviar enlace de recuperación</button>
          </form>

          <div className="rg-tarjeta-pie" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'center' }}>Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.</p>
            <a href="/">← Volver a iniciar sesión</a>
          </div>
        </section>
      </main>

      <footer className="rg-footer">
        <div className="rg-footer-contenido">
          <small>© 2026 TrabajITO. Hecho para conectar.</small>
          <nav aria-label="Enlaces informativos pendientes de implementación">
            <span>Privacidad</span>
            <span>Términos y condiciones</span>
          </nav>
        </div>
      </footer>
    </div>
  )
}