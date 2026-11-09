import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { actualizarMiCuenta, cambiarMiContrasena, obtenerMiCuenta } from '../services/cuentaApi.js'
import './MiPerfil.css'

function formularioDesdeUsuario(usuario) {
  return {
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',
  }
}

function Campo({ etiqueta, id, ...props }) {
  return (
    <div className="mp-campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} {...props} />
    </div>
  )
}

export default function MiPerfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [datos, setDatos] = useState(formularioDesdeUsuario(null))
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensajeDatos, setMensajeDatos] = useState('')
  const [errorDatos, setErrorDatos] = useState('')

  const [claves, setClaves] = useState({
    password_actual: '',
    password: '',
    password_confirmation: '',
  })
  const [mostrarClaves, setMostrarClaves] = useState(false)
  const [cambiandoClave, setCambiandoClave] = useState(false)
  const [claveActualizada, setClaveActualizada] = useState(false)
  const [errorClave, setErrorClave] = useState('')

  useEffect(() => {
    const controlador = new AbortController()
    obtenerMiCuenta({ signal: controlador.signal })
      .then((cuenta) => {
        setUsuario(cuenta)
        setDatos(formularioDesdeUsuario(cuenta))
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (error.status === 401) {
          localStorage.removeItem('token')
          navigate('/login', { replace: true })
          return
        }
        setErrorCarga(error.message)
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })
    return () => controlador.abort()
  }, [navigate])

  function editarDato(evento) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
    setMensajeDatos('')
    setErrorDatos('')
  }

  async function guardarDatos(evento) {
    evento.preventDefault()
    setErrorDatos('')
    setMensajeDatos('')
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
      setMensajeDatos('Tus datos se guardaron correctamente en TrabajITO.')
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }
      setErrorDatos(error.message)
    } finally {
      setGuardando(false)
    }
  }

  function editarClave(evento) {
    const { name, value } = evento.target
    setClaves((anterior) => ({ ...anterior, [name]: value }))
    setErrorClave('')
  }

  async function guardarClave(evento) {
    evento.preventDefault()
    setErrorClave('')
    if (claves.password !== claves.password_confirmation) {
      setErrorClave('La nueva contraseña y su confirmación no coinciden.')
      return
    }
    if (claves.password.length < 8) {
      setErrorClave('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    setCambiandoClave(true)
    try {
      await cambiarMiContrasena(claves)
      // Laravel revoca todos los tokens al cambiar la contraseña.
      localStorage.removeItem('token')
      setClaves({ password_actual: '', password: '', password_confirmation: '' })
      setClaveActualizada(true)
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }
      setErrorClave(error.message)
    } finally {
      setCambiandoClave(false)
    }
  }

  if (cargando) {
    return <main className="mp-pagina"><div className="mp-tarjeta" role="status">Consultando tu perfil en TrabajITO...</div></main>
  }
  if (errorCarga) {
    return (
      <main className="mp-pagina">
        <section className="mp-tarjeta">
          <h1>No pudimos consultar tu perfil</h1>
          <p role="alert" className="mp-error">{errorCarga}</p>
          <div className="mp-acciones"><button type="button" onClick={() => window.location.reload()}>Reintentar</button><Link to="/inicio">Volver al inicio</Link></div>
        </section>
      </main>
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
            <form onSubmit={guardarDatos}>
              <div className="mp-campos-dobles">
                <Campo etiqueta="Nombre" id="mp-nombre" name="nombre" value={datos.nombre} onChange={editarDato} autoComplete="given-name" maxLength={100} required />
                <Campo etiqueta="Apellidos" id="mp-apellido" name="apellido" value={datos.apellido} onChange={editarDato} autoComplete="family-name" maxLength={150} required />
              </div>
              <Campo etiqueta="Correo electrónico" id="mp-correo" name="correo" type="email" value={datos.correo} onChange={editarDato} autoComplete="email" required />
              <Campo etiqueta="Teléfono (10 dígitos, opcional)" id="mp-telefono" name="telefono" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="9511234567" value={datos.telefono} onChange={editarDato} autoComplete="tel" />
              <div className="mp-id">ID de usuario: <strong>{usuario.id_usuario}</strong> · Solo lectura</div>
              {mensajeDatos && <p className="mp-exito" role="status">{mensajeDatos}</p>}
              {errorDatos && <p className="mp-error" role="alert">{errorDatos}</p>}
              <div className="mp-acciones">
                <button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                <button type="button" className="mp-secundario" disabled={guardando} onClick={() => { setDatos(formularioDesdeUsuario(usuario)); setErrorDatos(''); setMensajeDatos('') }}>Cancelar cambios</button>
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
              <form onSubmit={guardarClave}>
                <Campo etiqueta="Contraseña actual" id="mp-clave-actual" name="password_actual" type={mostrarClaves ? 'text' : 'password'} value={claves.password_actual} onChange={editarClave} autoComplete="current-password" required />
                <Campo etiqueta="Nueva contraseña" id="mp-clave-nueva" name="password" type={mostrarClaves ? 'text' : 'password'} value={claves.password} onChange={editarClave} minLength={8} autoComplete="new-password" required />
                <Campo etiqueta="Confirmar nueva contraseña" id="mp-clave-confirmacion" name="password_confirmation" type={mostrarClaves ? 'text' : 'password'} value={claves.password_confirmation} onChange={editarClave} minLength={8} autoComplete="new-password" required />
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
  )
}
