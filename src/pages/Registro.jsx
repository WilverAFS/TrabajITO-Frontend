import { useState } from 'react'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import LayoutAuth from '../components/auth/LayoutAuth.jsx'
import { CandadoIcono, CorreoIcono } from '../components/auth/IconosAuth.jsx'
import { registrarCuenta } from '../services/authApi.js'
import './Registro.css'

const ENLACES_FOOTER = ['Buscar trabajadores', 'Privacidad', 'Términos y condiciones']

export default function Registro() {
  const [mostrarContrasenas, setMostrarContrasenas] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function manejarRegistro(evento) {
    evento.preventDefault()
    if (enviando) return
    setMensaje('')
    setError('')

    const formulario = evento.currentTarget
    const datos = new FormData(formulario)
    const nombre = String(datos.get('nombre') ?? '')
    const apellidos = String(datos.get('apellidos') ?? '')
    const correo = String(datos.get('correo') ?? '')
    const contrasena = String(datos.get('contrasena') ?? '')
    const confirmacion = String(datos.get('confirmacion') ?? '')

    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden. Revisa ambos campos.')
      return
    }

    setEnviando(true)
    try {
      await registrarCuenta({
        nombre,
        // El contrato de la base de datos usa "apellido" en singular.
        apellido: apellidos,
        correo,
        password: contrasena,
        password_confirmation: confirmacion,
        device_name: 'react-web',
      })
      setMensaje('¡Cuenta creada exitosamente! Ahora puedes regresar e iniciar sesión.')
      setError('')
      formulario.reset()
    } catch (err) {
      setMensaje('')
      setError(err?.status ? err.message : 'Error de conexión con el servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <LayoutAuth
      etiqueta="Trabajadores de oficio"
      titulo={<>Encuentra a la persona <span>correcta para tu proyecto.</span></>}
      introduccion="Crea una cuenta para buscar servicios o publicar tu perfil de trabajador."
      altHero="Una clienta conversa con un trabajador de oficio en una cocina, con una tarjeta informativa sobre perfiles y opiniones"
      enlacesFooter={ENLACES_FOOTER}
    >
      <h2 id="rg-formulario-titulo">Crea tu cuenta</h2>
      <p className="rg-tarjeta-descripcion">Elige si quieres buscar servicios o compartir tu perfil profesional.</p>

      <form className="rg-formulario" onSubmit={manejarRegistro}>
        <div className="rg-fila-nombres">
          <CampoAuth id="nombre" etiqueta="Nombre" placeholder="Tu nombre" autoComplete="given-name" />
          <CampoAuth id="apellidos" etiqueta="Apellidos" placeholder="Tus apellidos" autoComplete="family-name" />
        </div>

        <CampoAuth id="correo" etiqueta="Correo electrónico" placeholder="tu@correo.com" tipo="email" icono={<CorreoIcono />} autoComplete="email" />
        <CampoAuth id="contrasena" etiqueta="Contraseña" placeholder="Crea una contraseña" tipo={mostrarContrasenas ? 'text' : 'password'} icono={<CandadoIcono />} autoComplete="new-password" minLength={8} />
        <CampoAuth id="confirmacion" etiqueta="Confirmar contraseña" placeholder="Repite tu contraseña" tipo={mostrarContrasenas ? 'text' : 'password'} icono={<CandadoIcono />} autoComplete="new-password" minLength={8} />

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

        <button className="rg-boton-crear" type="submit" disabled={enviando}>Crear cuenta</button>
      </form>

      <div className="rg-tarjeta-pie">
        <p>¿Ya tienes una cuenta?</p>
        <a href="/">Iniciar sesión</a>
      </div>
    </LayoutAuth>
  )
}
