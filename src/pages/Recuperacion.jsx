import { useState } from 'react'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import LayoutAuth from '../components/auth/LayoutAuth.jsx'
import { CandadoIcono, CorreoIcono } from '../components/auth/IconosAuth.jsx'
import './Registro.css'

export default function Recuperacion() {
  const [mensaje, setMensaje] = useState('')

  function manejarRecuperacion(evento) {
    evento.preventDefault()
    setMensaje('Si el correo está registrado, recibirás un enlace de recuperación en breve.')
  }

  return (
    <LayoutAuth
      titulo={<>Recupera el acceso a <span>tu cuenta.</span></>}
      introduccion="Ingresa el correo asociado a tu cuenta para recibir un enlace y volver a entrar."
      altHero="Dos trabajadores conversando sobre un proyecto"
    >
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: '#e7f1ff', padding: '12px', borderRadius: '12px' }}>
          <CandadoIcono tamano={32} color="#0d6efd" />
        </div>
      </div>
      <h2 id="rg-formulario-titulo">¿Olvidaste tu contraseña?</h2>
      <p className="rg-tarjeta-descripcion">Ingresa el correo de tu cuenta para recibir un enlace y crear una nueva contraseña.</p>

      <form className="rg-formulario" onSubmit={manejarRecuperacion}>
        <CampoAuth id="correo" etiqueta="Correo electrónico" placeholder="tu@correo.com" tipo="email" icono={<CorreoIcono />} autoComplete="email" />

        {mensaje && <p className="rg-mensaje rg-confirmacion" role="status">{mensaje}</p>}

        <button className="rg-boton-crear" type="submit">Enviar enlace de recuperación</button>
      </form>

      <div className="rg-tarjeta-pie" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'center' }}>Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.</p>
        <a href="/">← Volver a iniciar sesión</a>
      </div>
    </LayoutAuth>
  )
}
