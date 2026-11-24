import { useState } from 'react'
import { Link } from 'react-router'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import LayoutAuth from '../components/auth/LayoutAuth.jsx'
import { CandadoIcono, CorreoIcono } from '../components/auth/IconosAuth.jsx'
import { solicitarRecuperacion } from '../services/authApi.js'
import { validarCorreoElectronico } from '../utils/validaciones.js'
import './Registro.css'

export default function Recuperacion() {
  const [correo, setCorreo] = useState('')
  const [errorCorreo, setErrorCorreo] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function manejarRecuperacion(evento) {
    evento.preventDefault()

    const correoLimpio = correo.trim()
    const errorValidacion = validarCorreoElectronico(correoLimpio)

    if (errorValidacion) {
      setErrorCorreo(errorValidacion)
      setErrorGeneral('')
      setMensaje('')
      return
    }

    setEnviando(true)
    setErrorCorreo('')
    setErrorGeneral('')
    setMensaje('')

    try {
      await solicitarRecuperacion({ correo: correoLimpio })
      setMensaje(
        'Si el correo está registrado, recibirás un enlace de recuperación en breve.'
      )
    } catch (err) {
      const errorCampo = err?.errors?.correo?.[0]
      if (errorCampo) {
        setErrorCorreo(errorCampo)
      } else {
        setErrorGeneral(
          err?.message || 'No se pudo procesar la solicitud. Intenta de nuevo.'
        )
      }
    } finally {
      setEnviando(false)
    }
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
      <p className="rg-tarjeta-descripcion">
        Ingresa el correo de tu cuenta para recibir un enlace y crear una nueva contraseña.
      </p>

      <form className="rg-formulario" onSubmit={manejarRecuperacion} noValidate>
        <CampoAuth
          id="correo"
          etiqueta="Correo electrónico"
          placeholder="tu@correo.com"
          tipo="email"
          icono={<CorreoIcono />}
          autoComplete="email"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value)
            if (errorCorreo) setErrorCorreo('')
            if (errorGeneral) setErrorGeneral('')
          }}
          error={errorCorreo}
          disabled={enviando}
        />

        {errorGeneral && (
          <p className="rg-mensaje rg-error" role="alert">
            {errorGeneral}
          </p>
        )}

        {mensaje && (
          <p className="rg-mensaje rg-confirmacion" role="status">
            {mensaje}
          </p>
        )}

        <button className="rg-boton-crear" type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>

      <div
        className="rg-tarjeta-pie"
        style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '1rem' }}
      >
        <p style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'center' }}>
          Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
        </p>
        <Link to="/login">← Volver a iniciar sesión</Link>
      </div>
    </LayoutAuth>
  )
}