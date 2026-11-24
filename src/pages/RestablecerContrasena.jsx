import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import LayoutAuth from '../components/auth/LayoutAuth.jsx'
import { CandadoIcono, CorreoIcono } from '../components/auth/IconosAuth.jsx'
import { restablecerContrasena } from '../services/authApi.js'
import {
  comprobarRequisitosContrasena,
  validarConfirmacionContrasena,
  validarContrasenaNueva,
  validarCorreoElectronico,
} from '../utils/validaciones.js'
import './Registro.css'

const CAMPOS_BACKEND = {
  correo: 'correo',
  email: 'correo',
  password: 'contrasena',
  password_confirmation: 'confirmacion',
  token: 'token',
}

export default function RestablecerContrasena() {
  const { token: tokenRuta } = useParams()
  const [searchParams] = useSearchParams()

  const tokenInicial = tokenRuta || searchParams.get('token') || ''
  const correoInicial =
    searchParams.get('correo') || searchParams.get('email') || ''

  const [datos, setDatos] = useState({
    correo: correoInicial,
    contrasena: '',
    confirmacion: '',
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarContrasenas, setMostrarContrasenas] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [completado, setCompletado] = useState(false)

  const requisitos = comprobarRequisitosContrasena(datos.contrasena)

  function validarCampo(campo, valores) {
    switch (campo) {
      case 'correo':
        return validarCorreoElectronico(valores.correo)
      case 'contrasena':
        return validarContrasenaNueva(valores.contrasena)
      case 'confirmacion':
        return validarConfirmacionContrasena(
          valores.contrasena,
          valores.confirmacion,
        )
      default:
        return ''
    }
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setDatos((actual) => ({
      ...actual,
      [name]: value,
    }))

    setErrores((actual) => ({
      ...actual,
      [name]: '',
      ...(name === 'contrasena' ? { confirmacion: '' } : {}),
    }))

    setErrorGeneral('')
    setMensaje('')
  }

  function validarAlSalir(evento) {
    const { name } = evento.target

    setErrores((actual) => ({
      ...actual,
      [name]: validarCampo(name, datos),
    }))
  }

  async function manejarRestablecimiento(evento) {
    evento.preventDefault()

    if (enviando) return

    setErrorGeneral('')
    setMensaje('')

    if (!tokenInicial) {
      setErrorGeneral(
        'El enlace de recuperación no es válido o está incompleto. Solicita uno nuevo.',
      )
      return
    }

    const nuevosErrores = {}
    for (const campo of ['correo', 'contrasena', 'confirmacion']) {
      const err = validarCampo(campo, datos)
      if (err) nuevosErrores[campo] = err
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setEnviando(true)

    try {
      await restablecerContrasena({
        correo: datos.correo.trim(),
        token: tokenInicial,
        password: datos.contrasena,
        password_confirmation: datos.confirmacion,
      })

      setMensaje(
        '¡Contraseña restablecida correctamente! Ya puedes iniciar sesión con tu nueva contraseña.',
      )
      setCompletado(true)
      setDatos((actual) => ({
        ...actual,
        contrasena: '',
        confirmacion: '',
      }))
      setErrores({})
    } catch (error) {
      if (error?.status === 422 && error?.errors) {
        const erroresBackend = {}

        for (const [campoBackend, campoFrontend] of Object.entries(
          CAMPOS_BACKEND,
        )) {
          const mensajes = error.errors[campoBackend]
          if (Array.isArray(mensajes) && mensajes.length > 0) {
            if (campoFrontend === 'token') {
              setErrorGeneral(mensajes[0])
            } else {
              erroresBackend[campoFrontend] = mensajes[0]
            }
          }
        }

        if (Object.keys(erroresBackend).length > 0) {
          setErrores(erroresBackend)
        } else if (!error.errors.token) {
          setErrorGeneral(error.message)
        }
      } else {
        setErrorGeneral(
          error?.message ||
            'No fue posible restablecer la contraseña. El enlace puede haber expirado.',
        )
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <LayoutAuth
      titulo={
        <>
          Crea una <span>nueva contraseña.</span>
        </>
      }
      introduccion="Elige una contraseña segura para recuperar el acceso a tu cuenta de TrabajITO."
      altHero="Dos trabajadores conversando sobre un proyecto"
    >
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <div
          style={{
            backgroundColor: '#e7f1ff',
            padding: '12px',
            borderRadius: '12px',
          }}
        >
          <CandadoIcono tamano={32} color="#0d6efd" />
        </div>
      </div>

      <h2 id="rg-formulario-titulo">Restablecer contraseña</h2>
      <p className="rg-tarjeta-descripcion">
        Ingresa tu nueva contraseña y confírmala para actualizar el acceso a tu
        cuenta.
      </p>

      {!tokenInicial && (
        <p className="rg-mensaje rg-error" role="alert">
          El enlace de recuperación no contiene un token válido. Solicita un
          nuevo enlace desde la pantalla de recuperación.
        </p>
      )}

      <form
        className="rg-formulario"
        onSubmit={manejarRestablecimiento}
        noValidate
      >
        <CampoAuth
          id="correo"
          etiqueta="Correo electrónico"
          placeholder="tu@correo.com"
          tipo="email"
          icono={<CorreoIcono />}
          autoComplete="email"
          maxLength={255}
          value={datos.correo}
          onChange={cambiarCampo}
          onBlur={validarAlSalir}
          error={errores.correo}
          disabled={enviando || completado}
        />

        <CampoAuth
          id="contrasena"
          etiqueta="Nueva contraseña"
          placeholder="Crea una nueva contraseña"
          tipo={mostrarContrasenas ? 'text' : 'password'}
          icono={<CandadoIcono />}
          autoComplete="new-password"
          minLength={8}
          value={datos.contrasena}
          onChange={cambiarCampo}
          onBlur={validarAlSalir}
          error={errores.contrasena}
          disabled={enviando || completado}
        />

        {datos.contrasena.length > 0 && (
          <ul className="rg-requisitos" aria-label="Requisitos de contraseña">
            {requisitos.map((requisito) => (
              <li
                key={requisito.id}
                className={
                  requisito.cumple
                    ? 'rg-requisito rg-requisito-cumple'
                    : 'rg-requisito'
                }
              >
                <span aria-hidden="true">{requisito.cumple ? '✓' : '○'}</span>
                {requisito.texto}
              </li>
            ))}
          </ul>
        )}

        <CampoAuth
          id="confirmacion"
          etiqueta="Confirmar nueva contraseña"
          placeholder="Repite tu nueva contraseña"
          tipo={mostrarContrasenas ? 'text' : 'password'}
          icono={<CandadoIcono />}
          autoComplete="new-password"
          minLength={8}
          value={datos.confirmacion}
          onChange={cambiarCampo}
          onBlur={validarAlSalir}
          error={errores.confirmacion}
          disabled={enviando || completado}
        />

        <label className="rg-opcion-check rg-mostrar">
          <input
            type="checkbox"
            checked={mostrarContrasenas}
            onChange={(e) => setMostrarContrasenas(e.target.checked)}
            disabled={enviando || completado}
          />
          <span>Mostrar contraseñas</span>
        </label>

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

        <button
          className="rg-boton-crear"
          type="submit"
          disabled={enviando || completado || !tokenInicial}
        >
          {enviando ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>

      <div
        className="rg-tarjeta-pie"
        style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.75rem' }}
      >
        <Link to="/login">← Volver a iniciar sesión</Link>
        {!completado && (
          <Link to="/recuperar">Solicitar un nuevo enlace</Link>
        )}
      </div>
    </LayoutAuth>
  )
}