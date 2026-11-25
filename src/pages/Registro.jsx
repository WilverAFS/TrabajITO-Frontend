
import { useState } from 'react'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import LayoutAuth from '../components/auth/LayoutAuth.jsx'
import { CandadoIcono, CorreoIcono } from '../components/auth/IconosAuth.jsx'
import { registrarCuenta } from '../services/authApi.js'
import { Link, useNavigate } from 'react-router'
import {
  PATRON_NOMBRE_ESPANOL,
  validarNombreEspanol,
  validarCorreoElectronico,
  validarContrasenaNueva,
  validarConfirmacionContrasena,
  comprobarRequisitosContrasena,
} from '../utils/validaciones.js'
import './Registro.css'

const CAMPOS_INICIALES = {
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmacion: '',
}

const CAMPOS_BACKEND = {
  nombre: 'nombre',
  apellido: 'apellidos',
  correo: 'correo',
  password: 'contrasena',
  password_confirmation: 'confirmacion',
}

function validarCampo(campo, datos) {
  switch (campo) {
    case 'nombre':
      return validarNombreEspanol(datos.nombre)

    case 'apellidos':
      return validarNombreEspanol(datos.apellidos, 'apellido')

    case 'correo':
      return validarCorreoElectronico(datos.correo)

    case 'contrasena':
      return validarContrasenaNueva(datos.contrasena)

    case 'confirmacion':
      return validarConfirmacionContrasena(
        datos.contrasena,
        datos.confirmacion,
      )

    default:
      return ''
  }
}

export default function Registro() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [errorTerminos, setErrorTerminos] = useState(false)
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false)
  const [mostrarContrasenas, setMostrarContrasenas] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const requisitos = comprobarRequisitosContrasena(datos.contrasena)

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
  }

  function validarAlSalir(evento) {
    const { name } = evento.target

    setErrores((actual) => ({
      ...actual,
      [name]: validarCampo(name, datos),
    }))
  }

  async function manejarRegistro(evento) {
    evento.preventDefault()

    if (enviando) return

    setErrorGeneral('')

    const nuevosErrores = {}

    for (const campo of Object.keys(CAMPOS_INICIALES)) {
      const error = validarCampo(campo, datos)

      if (error) {
        nuevosErrores[campo] = error
      }
    }

    setErrores(nuevosErrores)
    setErrorTerminos(!aceptaCondiciones)

    if (Object.keys(nuevosErrores).length > 0 || !aceptaCondiciones) {
      return
    }

    setEnviando(true)

    try {
      await registrarCuenta({
        nombre: datos.nombre.trim(),
        apellido: datos.apellidos.trim(),
        correo: datos.correo.trim(),
        password: datos.contrasena,
        password_confirmation: datos.confirmacion,
        device_name: 'react-web',
      })

      navigate('/inicio', { replace: true })
    } catch (error) {
      if (error?.status === 422 && error?.errors) {
        const erroresBackend = {}

        for (const [campoBackend, campoFrontend] of Object.entries(CAMPOS_BACKEND)) {
          const mensajes = error.errors[campoBackend]

          if (Array.isArray(mensajes) && mensajes.length > 0) {
            const mensajeBackend = mensajes[0]

            const correoDuplicado =
              campoBackend === 'correo' &&
              /has already been taken/i.test(mensajeBackend)

            erroresBackend[campoFrontend] = correoDuplicado
              ? 'Este correo electrónico ya está registrado. Utiliza otro o inicia sesión.'
              : mensajeBackend
          }
        }

        if (Object.keys(erroresBackend).length > 0) {
          setErrores(erroresBackend)
        } else {
          setErrorGeneral(error.message)
        }
      } else {
        setErrorGeneral(
          error?.message || 'No fue posible completar el registro.',
        )
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <LayoutAuth
      etiqueta="Trabajadores de oficio"
      titulo={
        <>
          Encuentra a la persona <span>correcta para tu proyecto.</span>
        </>
      }
      introduccion="Crea una cuenta para buscar servicios o publicar tu perfil de trabajador."
      altHero="Una clienta conversa con un trabajador de oficio en una cocina"
    >
      <h2 id="rg-formulario-titulo">Crea tu cuenta</h2>

      <p className="rg-tarjeta-descripcion">
        Elige si quieres buscar servicios o compartir tu perfil profesional.
      </p>

      <form className="rg-formulario" onSubmit={manejarRegistro} noValidate>
        <div className="rg-fila-nombres">
          <CampoAuth
            id="nombre"
            etiqueta="Nombre"
            placeholder="Tu nombre"
            autoComplete="given-name"
            pattern={PATRON_NOMBRE_ESPANOL}
            maxLength={100}
            value={datos.nombre}
            onChange={cambiarCampo}
            onBlur={validarAlSalir}
            error={errores.nombre}
          />

          <CampoAuth
            id="apellidos"
            etiqueta="Apellidos"
            placeholder="Tus apellidos"
            autoComplete="family-name"
            pattern={PATRON_NOMBRE_ESPANOL}
            maxLength={150}
            value={datos.apellidos}
            onChange={cambiarCampo}
            onBlur={validarAlSalir}
            error={errores.apellidos}
          />
        </div>

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
        />

        <CampoAuth
          id="contrasena"
          etiqueta="Contraseña"
          placeholder="Crea una contraseña"
          tipo={mostrarContrasenas ? 'text' : 'password'}
          icono={<CandadoIcono />}
          autoComplete="new-password"
          minLength={8}
          value={datos.contrasena}
          onChange={cambiarCampo}
          onBlur={validarAlSalir}
          error={errores.contrasena}
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
                <span aria-hidden="true">
                  {requisito.cumple ? '✓' : '○'}
                </span>
                {requisito.texto}
              </li>
            ))}
          </ul>
        )}

        <CampoAuth
          id="confirmacion"
          etiqueta="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          tipo={mostrarContrasenas ? 'text' : 'password'}
          icono={<CandadoIcono />}
          autoComplete="new-password"
          minLength={8}
          value={datos.confirmacion}
          onChange={cambiarCampo}
          onBlur={validarAlSalir}
          error={errores.confirmacion}
        />

        <label className="rg-opcion-check rg-mostrar">
          <input
            type="checkbox"
            checked={mostrarContrasenas}
            onChange={(e) => setMostrarContrasenas(e.target.checked)}
          />
          <span>Mostrar contraseñas</span>
        </label>

        <label className="rg-opcion-check rg-terminos">
          <input
            type="checkbox"
            name="aceptaCondiciones"
            checked={aceptaCondiciones}
            onChange={(e) => {
              setAceptaCondiciones(e.target.checked)
              setErrorTerminos(false)
            }}
          />
          <span>
            Acepto los{' '}
            Términos y condiciones
            {' '}y la{' '}
            Política de privacidad.
          </span>
        </label>

        {errorTerminos && (
          <p className="rg-campo-error" role="alert">
            Debes aceptar los términos y condiciones.
          </p>
        )}

        {errorGeneral && (
          <p className="rg-mensaje rg-error" role="alert">
            {errorGeneral}
          </p>
        )}

        <button
          className="rg-boton-crear"
          type="submit"
          disabled={enviando}
        >
          {enviando ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="rg-tarjeta-pie">
        <p>¿Ya tienes una cuenta?</p>
        <Link to="/">Iniciar sesión</Link>
      </div>
    </LayoutAuth>
  )
}