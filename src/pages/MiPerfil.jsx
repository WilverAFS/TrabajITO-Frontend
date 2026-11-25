import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import CampoAuth from '../components/auth/CampoAuth.jsx'
import { eliminarToken } from '../services/apiClient.js'
import { actualizarMiCuenta, cambiarMiContrasena, obtenerMiCuenta } from '../services/cuentaApi.js'
import LayoutAplicacion from '../components/LayoutAplicacion.jsx'
import {
  comprobarRequisitosContrasena,
  validarConfirmacionContrasena,
  validarContrasenaNueva,
  validarCorreoElectronico,
  validarNombreEspanol,
  validarTelefono,
} from '../utils/validaciones.js'
import './MiPerfil.css'

const CAMPOS_CUENTA = ['nombre', 'apellido', 'correo', 'telefono']
const CAMPOS_CLAVE = ['password_actual', 'password', 'password_confirmation']
const CLAVES_VACIAS = {
  password_actual: '',
  password: '',
  password_confirmation: '',
}

function formularioDesdeUsuario(usuario) {
  return {
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',
  }
}

function validarDato(campo, valor) {
  if (campo === 'nombre') return validarNombreEspanol(valor)
  if (campo === 'apellido') return validarNombreEspanol(valor, 'apellido')
  if (campo === 'correo') return validarCorreoElectronico(valor)
  if (campo === 'telefono') return validarTelefono(valor)
  return ''
}

function validarClave(campo, valores) {
  if (campo === 'password_actual') {
    return valores.password_actual ? '' : 'Escribe tu contraseña actual.'
  }
  if (campo === 'password') {
    const error = validarContrasenaNueva(valores.password)
    if (error) return error
    return valores.password === valores.password_actual
      ? 'La contraseña nueva debe ser diferente de la actual.'
      : ''
  }
  if (campo === 'password_confirmation') {
    return validarConfirmacionContrasena(valores.password, valores.password_confirmation)
  }
  return ''
}

// El cliente Axios ya conserva `error.errors` para respuestas HTTP 422.
function erroresBackend(error, campos) {
  if (error?.status !== 422 || !error?.errors) return {}
  const resultado = {}
  for (const campo of campos) {
    const mensajes = error.errors[campo]
    if (Array.isArray(mensajes) && mensajes.length) resultado[campo] = String(mensajes[0])
    else if (typeof mensajes === 'string' && mensajes) resultado[campo] = mensajes
  }
  return resultado
}

export default function MiPerfil() {
  const [usuario, setUsuario] = useState(null)
  const [datos, setDatos] = useState(formularioDesdeUsuario(null))
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensajeDatos, setMensajeDatos] = useState('')
  const [errorDatos, setErrorDatos] = useState('')
  const [erroresDatos, setErroresDatos] = useState({})

  const [claves, setClaves] = useState(CLAVES_VACIAS)
  const [mostrarClaves, setMostrarClaves] = useState(false)
  const [cambiandoClave, setCambiandoClave] = useState(false)
  const [claveActualizada, setClaveActualizada] = useState(false)
  const [errorClave, setErrorClave] = useState('')
  const [erroresClave, setErroresClave] = useState({})

  useEffect(() => {
    const controlador = new AbortController()
    obtenerMiCuenta({ signal: controlador.signal })
      .then((cuenta) => {
        if (controlador.signal.aborted) return
        setUsuario(cuenta)
        setDatos(formularioDesdeUsuario(cuenta))
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (error.status === 401) return
        setErrorCarga(error.message)
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })
    return () => controlador.abort()
  }, [])

  function editarDato(evento) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
    setErroresDatos((anterior) => ({ ...anterior, [name]: '' }))
    setMensajeDatos('')
    setErrorDatos('')
  }

  function validarDatoAlSalir(evento) {
    const { name, value } = evento.target
    setErroresDatos((anterior) => ({ ...anterior, [name]: validarDato(name, value) }))
  }

  async function guardarDatos(evento) {
    evento.preventDefault()
    if (guardando) return
    setErrorDatos('')
    setMensajeDatos('')

    const nuevosErrores = {}
    for (const campo of CAMPOS_CUENTA) {
      const mensaje = validarDato(campo, datos[campo])
      if (mensaje) nuevosErrores[campo] = mensaje
    }
    setErroresDatos(nuevosErrores)
    if (Object.keys(nuevosErrores).length) return

    setGuardando(true)
    try {
      const payload = {
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim(),
        telefono: datos.telefono.trim() || null,
      }
      const cuentaActualizada = await actualizarMiCuenta(payload)
      setUsuario(cuentaActualizada)
      setDatos(formularioDesdeUsuario(cuentaActualizada))
      setErroresDatos({})
      setMensajeDatos('Tus datos se guardaron correctamente en TrabajITO.')
    } catch (error) {
      if (error.status === 401) return
      const porCampo = erroresBackend(error, CAMPOS_CUENTA)
      if (Object.keys(porCampo).length) setErroresDatos(porCampo)
      else setErrorDatos(error.message || 'No se pudieron guardar los cambios.')
    } finally {
      setGuardando(false)
    }
  }

  function editarClave(evento) {
    const { name, value } = evento.target
    setClaves((anterior) => ({ ...anterior, [name]: value }))
    setErroresClave((anterior) => ({
      ...anterior,
      [name]: '',
      ...(name === 'password' || name === 'password_actual'
        ? { password_confirmation: '' }
        : {}),
    }))
    setErrorClave('')
  }

  function validarClaveAlSalir(evento) {
    const { name } = evento.target
    setErroresClave((anterior) => ({ ...anterior, [name]: validarClave(name, claves) }))
  }

  async function guardarClave(evento) {
    evento.preventDefault()
    if (cambiandoClave) return
    setErrorClave('')

    const nuevosErrores = {}
    for (const campo of CAMPOS_CLAVE) {
      const mensaje = validarClave(campo, claves)
      if (mensaje) nuevosErrores[campo] = mensaje
    }
    setErroresClave(nuevosErrores)
    if (Object.keys(nuevosErrores).length) return

    setCambiandoClave(true)
    try {
      await cambiarMiContrasena(claves)
      // Laravel revoca los tokens al cambiar la contraseña.
      eliminarToken()
      setClaves(CLAVES_VACIAS)
      setErroresClave({})
      setClaveActualizada(true)
    } catch (error) {
      if (error.status === 401) return
      const porCampo = erroresBackend(error, CAMPOS_CLAVE)
      if (Object.keys(porCampo).length) setErroresClave(porCampo)
      else setErrorClave(error.message || 'No fue posible cambiar la contraseña.')
    } finally {
      setCambiandoClave(false)
    }
  }

if (cargando) {
  return (
    <LayoutAplicacion>
      <main className="mp-pagina">
        <div className="mp-tarjeta" role="status">
          Consultando tu perfil en TrabajITO...
        </div>
      </main>
    </LayoutAplicacion>
  )
}

if (errorCarga) {
  return (
    <LayoutAplicacion>
      <main className="mp-pagina">
        <section className="mp-tarjeta">
          <h1>No pudimos consultar tu perfil</h1>

          <p role="alert" className="mp-error">
            {errorCarga}
          </p>

          <div className="mp-acciones">
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>

            <Link to="/inicio">Volver al inicio</Link>
          </div>
        </section>
      </main>
    </LayoutAplicacion>
  )
}
  if (!usuario) return null

  const iniciales = `${usuario.nombre?.slice(0, 1) ?? ''}${usuario.apellido?.slice(0, 1) ?? ''}`.toUpperCase()
  const tipoCuenta = usuario.es_administrador ? 'Administrador' : 'Usuario de TrabajITO'
  const estadoPerfil = usuario.es_trabajador_habilitado
    ? 'Trabajador habilitado'
    : usuario.tiene_perfil_profesional
      ? 'Perfil profesional sin habilitación'
      : 'Sin perfil profesional'

  return (
    <LayoutAplicacion>
      <main className="mp-pagina">
        <div className="mp-contenedor">
          <nav className="mp-navegacion" aria-label="Volver a la aplicación">
            <Link to="/inicio">← Volver al inicio</Link>
          </nav>

          <header className="mp-encabezado">
            <div className="mp-avatar" aria-hidden="true">{iniciales || 'U'}</div>
            <div className="mp-presentacion">
              <span className="mp-categoria">Mi cuenta</span>
              <h1>{usuario.nombre} {usuario.apellido}</h1>
              <p>Consulta y administra tu información personal de forma segura.</p>
              <div className="mp-etiquetas">
                <span>{tipoCuenta}</span>
                <span>{estadoPerfil}</span>
                <span>{usuario.activo ? 'Cuenta activa' : 'Cuenta inactiva'}</span>
              </div>
            </div>
          </header>

          <div className="mp-grid">
            <section className="mp-tarjeta" aria-labelledby="mp-datos-titulo">
              <div className="mp-tarjeta-cabecera">
                <div>
                  <h2 id="mp-datos-titulo">Información personal</h2>
                  <p>Estos datos corresponden a tu cuenta en TrabajITO.</p>
                </div>
              </div>
              <form onSubmit={guardarDatos} noValidate>
                <div className="mp-campos-dobles">
                  <CampoAuth etiqueta="Nombre" id="mp-nombre" name="nombre" value={datos.nombre} onChange={editarDato} onBlur={validarDatoAlSalir} error={erroresDatos.nombre} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" autoComplete="given-name" maxLength={100} required />
                  <CampoAuth etiqueta="Apellidos" id="mp-apellido" name="apellido" value={datos.apellido} onChange={editarDato} onBlur={validarDatoAlSalir} error={erroresDatos.apellido} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" autoComplete="family-name" maxLength={150} required />
                </div>
                <CampoAuth etiqueta="Correo electrónico" id="mp-correo" name="correo" tipo="email" value={datos.correo} onChange={editarDato} onBlur={validarDatoAlSalir} error={erroresDatos.correo} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" autoComplete="email" maxLength={255} required />
                <CampoAuth etiqueta="Teléfono (10 dígitos, opcional)" id="mp-telefono" name="telefono" tipo="tel" inputMode="numeric" maxLength={10} placeholder="9511234567" value={datos.telefono} onChange={editarDato} onBlur={validarDatoAlSalir} error={erroresDatos.telefono} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" autoComplete="tel" required={false} />
                <div className="mp-id">ID de usuario: <strong>{usuario.id_usuario}</strong> · Solo lectura</div>
                {mensajeDatos && <p className="mp-exito" role="status">{mensajeDatos}</p>}
                {errorDatos && <p className="mp-error" role="alert">{errorDatos}</p>}
                <div className="mp-acciones">
                  <button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                  <button
                    type="button"
                    className="mp-secundario"
                    disabled={guardando}
                    onClick={() => {
                      setDatos(formularioDesdeUsuario(usuario))
                      setErroresDatos({})
                      setErrorDatos('')
                      setMensajeDatos('')
                    }}
                  >
                    Cancelar cambios
                  </button>
                </div>
              </form>
            </section>

            <section className="mp-tarjeta" aria-labelledby="mp-clave-titulo">
              <div className="mp-tarjeta-cabecera">
                <div>
                  <h2 id="mp-clave-titulo">Cambiar contraseña</h2>
                  <p>Esta operación es independiente de tus datos personales.</p>
                </div>
              </div>
              {claveActualizada ? (
                <div className="mp-clave-ok">
                  <p className="mp-exito" role="status">Tu contraseña cambió correctamente. Laravel cerró las sesiones activas para proteger tu cuenta.</p>
                  <Link className="mp-enlace-boton" to="/login">Iniciar sesión nuevamente</Link>
                </div>
              ) : (
                <form onSubmit={guardarClave} noValidate>
                  <CampoAuth etiqueta="Contraseña actual" id="mp-clave-actual" name="password_actual" tipo={mostrarClaves ? 'text' : 'password'} value={claves.password_actual} onChange={editarClave} onBlur={validarClaveAlSalir} error={erroresClave.password_actual} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" autoComplete="current-password" required />
                  <CampoAuth etiqueta="Nueva contraseña" id="mp-clave-nueva" name="password" tipo={mostrarClaves ? 'text' : 'password'} value={claves.password} onChange={editarClave} onBlur={validarClaveAlSalir} error={erroresClave.password} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" minLength={8} autoComplete="new-password" required />
                  {claves.password.length > 0 && (
                    <ul className="mp-requisitos" aria-label="Requisitos de la nueva contraseña">
                      {comprobarRequisitosContrasena(claves.password).map((requisito) => (
                        <li key={requisito.id} className={requisito.cumple ? 'mp-requisito-cumple' : ''}>
                          <span aria-hidden="true">{requisito.cumple ? '✓' : '○'}</span> {requisito.texto}
                        </li>
                      ))}
                    </ul>
                  )}
                  <CampoAuth etiqueta="Confirmar nueva contraseña" id="mp-clave-confirmacion" name="password_confirmation" tipo={mostrarClaves ? 'text' : 'password'} value={claves.password_confirmation} onChange={editarClave} onBlur={validarClaveAlSalir} error={erroresClave.password_confirmation} claseGrupo="mp-campo" claseControl="mp-campo-control" claseError="mp-error-campo" minLength={8} autoComplete="new-password" required />
                  <label className="mp-mostrar">
                    <input type="checkbox" checked={mostrarClaves} onChange={(e) => setMostrarClaves(e.target.checked)} />
                    Mostrar contraseñas
                  </label>
                  <p className="mp-ayuda">Al cambiar la contraseña tendrás que iniciar sesión nuevamente.</p>
                  {errorClave && <p className="mp-error" role="alert">{errorClave}</p>}
                  <div className="mp-acciones">
                    <button type="submit" disabled={cambiandoClave}>{cambiandoClave ? 'Actualizando...' : 'Cambiar contraseña'}</button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </LayoutAplicacion>
  )
}