import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ErrorPerfil,
  obtenerEstados,
  obtenerMunicipios,
  obtenerOficios,
  obtenerPerfilProfesional,
  crearPerfilProfesional,
  actualizarPerfilProfesional,
  actualizarOficiosProfesionales,
} from '../services/perfilProfesionalApi.js'
import './PerfilProfesional.css'
import ComplementosPerfil from '../components/perfil/ComplementosPerfil.jsx'

export default function PerfilProfesional() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardandoOficios, setGuardandoOficios] = useState(false)
  const [perfil, setPerfil] = useState(null)
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [oficios, setOficios] = useState([])
  const [idEstado, setIdEstado] = useState('')
  const [idMunicipio, setIdMunicipio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [oficiosSeleccionados, setOficiosSeleccionados] = useState([])
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarError = useCallback((err) => {
    if (err?.name === 'AbortError') return
    if (err instanceof ErrorPerfil && err.status === 401) {
      navigate('/login', { replace: true })
      return
    }
    setError(err?.message || 'Ocurrió un error inesperado.')
  }, [navigate])

  // Consultar catálogos y detectar si el usuario ya tiene perfil.
  useEffect(() => {
    const controller = new AbortController()

    async function iniciar() {
      try {
        const [listaEstados, listaOficios, perfilActual] = await Promise.all([
          obtenerEstados({ signal: controller.signal }),
          obtenerOficios({ signal: controller.signal }),
          obtenerPerfilProfesional({ signal: controller.signal }).catch((err) => {
            // El 404 conocido significa "sin perfil"; no es un error de pantalla.
            if (err.status === 404 && err.codigo === 'PROFILE_NOT_FOUND') return null
            throw err
          }),
        ])
        if (controller.signal.aborted) return
        setEstados(listaEstados ?? [])
        setOficios(listaOficios ?? [])
        setPerfil(perfilActual)

        if (perfilActual) {
          setDescripcion(perfilActual.descripcion ?? '')
          setIdEstado(String(perfilActual.municipio?.estado?.id_estado ?? ''))
          setIdMunicipio(String(perfilActual.municipio?.id_municipio ?? ''))
          setOficiosSeleccionados((perfilActual.oficios ?? []).map((o) => String(o.id_oficio)))
        }
      } catch (err) {
        if (!controller.signal.aborted) manejarError(err)
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    iniciar()
    return () => controller.abort()
  }, [manejarError])

  // El catálogo de municipios depende del estado seleccionado.
  useEffect(() => {
    if (!idEstado) return undefined
    const controller = new AbortController()

    obtenerMunicipios(idEstado, { signal: controller.signal })
      .then((lista) => {
        if (controller.signal.aborted) return
        const disponibles = lista ?? []
        setMunicipios(disponibles)
        setIdMunicipio((actual) =>
          disponibles.some((m) => String(m.id_municipio) === actual) ? actual : ''
        )
      })
      .catch((err) => {
        if (!controller.signal.aborted) manejarError(err)
      })

    return () => controller.abort()
  }, [idEstado, manejarError])

  function cambiarEstado(evento) {
    setIdEstado(evento.target.value)
    setIdMunicipio('')
    setMunicipios([])
    setError('')
    setMensaje('')
  }

  function alternarOficio(id) {
    setOficiosSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((valor) => valor !== id)
        : [...actuales, id]
    )
    setError('')
    setMensaje('')
  }

  async function guardarPerfil(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    if (!idMunicipio || !descripcion.trim()) {
      setError('Selecciona un municipio y escribe tu descripción profesional.')
      return
    }
    if (!perfil && oficiosSeleccionados.length === 0) {
      setError('Selecciona por lo menos un oficio para crear el perfil.')
      return
    }

    setGuardando(true)
    try {
      const datos = {
        id_municipio: Number(idMunicipio),
        descripcion: descripcion.trim(),
      }
      const resultado = perfil
        ? await actualizarPerfilProfesional(datos)
        : await crearPerfilProfesional({
          ...datos,
          oficios: oficiosSeleccionados.map(Number),
        })

      setPerfil(resultado)
      setMensaje(perfil
        ? 'Información profesional actualizada correctamente.'
        : 'Perfil profesional creado. Aún debes solicitar su habilitación.')
    } catch (err) {
      manejarError(err)
    } finally {
      setGuardando(false)
    }
  }

  async function guardarOficios(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    if (oficiosSeleccionados.length === 0) {
      setError('Debes conservar al menos un oficio seleccionado.')
      return
    }

    setGuardandoOficios(true)
    try {
      const resultado = await actualizarOficiosProfesionales(oficiosSeleccionados.map(Number))
      setPerfil((anterior) => anterior ? { ...anterior, oficios: resultado.oficios } : anterior)
      setMensaje('Oficios del perfil actualizados correctamente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setGuardandoOficios(false)
    }
  }

  if (cargando) {
    return <main className="pp-pagina"><p className="pp-cargando" role="status">Cargando perfil profesional...</p></main>
  }

  return (
    <main className="pp-pagina">
      <div className="pp-contenedor">
        {perfil && <ComplementosPerfil activo={Boolean(perfil.activo)} />}
        <nav className="pp-volver" aria-label="Regresar">
          <Link to="/inicio">← Volver al inicio</Link>
          <Link to="/mi-perfil">Administrar mi cuenta</Link>
        </nav>

        <header className="pp-cabecera">
          <div className="pp-cabecera-texto">
            <span className="pp-etiqueta">MI PERFIL PROFESIONAL</span>
            <h1>{perfil ? 'Administra tus servicios' : 'Conviértete en trabajador de TrabajITO'}</h1>
            <p>Comparte tus especialidades, ubicación y experiencia con personas que necesitan tus servicios.</p>
          </div>
          <span className={`pp-estado ${perfil?.activo ? 'pp-estado-activo' : 'pp-estado-pendiente'}`}>
            {!perfil ? 'Sin perfil registrado' : perfil.activo ? 'Perfil habilitado' : 'Perfil no habilitado'}
          </span>
        </header>

        {error && <div className="pp-alerta pp-alerta-error" role="alert">{error}</div>}
        {mensaje && <div className="pp-alerta pp-alerta-exito" role="status">{mensaje}</div>}

        {(!error || perfil !== null || estados.length > 0) && (
          <div className="pp-columnas">
            <section className="pp-tarjeta" aria-labelledby="pp-datos-titulo">
              <div className="pp-tarjeta-encabezado">
                <h2 id="pp-datos-titulo">{perfil ? 'Información profesional' : 'Crear perfil profesional'}</h2>
                <p>Selecciona el lugar donde trabajas y describe tu experiencia.</p>
              </div>

              <form onSubmit={guardarPerfil} className="pp-formulario">
                <label htmlFor="pp-estado">Estado</label>
                <select id="pp-estado" value={idEstado} onChange={cambiarEstado} required disabled={guardando}>
                  <option value="">Selecciona un estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id_estado} value={estado.id_estado}>{estado.estado}</option>
                  ))}
                </select>

                <label htmlFor="pp-municipio">Municipio</label>
                <select
                  id="pp-municipio"
                  value={idMunicipio}
                  onChange={(e) => setIdMunicipio(e.target.value)}
                  required
                  disabled={!idEstado || guardando}
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id_municipio} value={municipio.id_municipio}>{municipio.municipio}</option>
                  ))}
                </select>

                <label htmlFor="pp-descripcion">Descripción profesional</label>
                <textarea
                  id="pp-descripcion"
                  rows="6"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ejemplo: Me dedico a realizar instalaciones eléctricas residenciales, mantenimiento y reparaciones..."
                  required
                  disabled={guardando}
                />
                <p className="pp-ayuda">Describe únicamente tu experiencia real y los servicios que puedes ofrecer.</p>

                {!perfil && (
                  <div className="pp-oficios-crear">
                    <h3>Selecciona tus oficios</h3>
                    <p>Elige al menos uno. Podrás modificarlos más adelante.</p>
                    <div className="pp-lista-oficios">
                      {oficios.map((oficio) => (
                        <label className="pp-opcion-oficio" key={oficio.id_oficio}>
                          <input
                            type="checkbox"
                            checked={oficiosSeleccionados.includes(String(oficio.id_oficio))}
                            onChange={() => alternarOficio(String(oficio.id_oficio))}
                            disabled={guardando}
                          />
                          <span>{oficio.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="pp-boton" disabled={guardando}>
                  {guardando ? 'Guardando...' : perfil ? 'Guardar información' : 'Crear perfil profesional'}
                </button>
              </form>
            </section>

            <aside className="pp-lateral">
              <section className="pp-tarjeta" aria-labelledby="pp-resumen-titulo">
                <h2 id="pp-resumen-titulo">Estado de tu perfil</h2>
                {perfil ? (
                  <>
                    <dl className="pp-resumen">
                      <div><dt>ID de trabajador</dt><dd>{perfil.id_trabajador}</dd></div>
                      <div><dt>Municipio</dt><dd>{perfil.municipio?.municipio || 'No disponible'}</dd></div>
                      <div><dt>Estado</dt><dd>{perfil.activo ? 'Habilitado' : 'Pendiente de habilitación'}</dd></div>
                      <div><dt>Oficios registrados</dt><dd>{perfil.oficios?.length ?? 0}</dd></div>
                    </dl>
                    {!perfil.activo && (
                      <p className="pp-nota">Tu perfil profesional todavía no está habilitado. La solicitud de habilitación se integrará en una etapa posterior.</p>
                    )}
                  </>
                ) : (
                  <p className="pp-nota">Una vez que crees tu perfil, podrás administrar tus horarios, certificados y solicitar tu habilitación.</p>
                )}
              </section>

              {perfil && (
                <section className="pp-tarjeta" aria-labelledby="pp-oficios-titulo">
                  <h2 id="pp-oficios-titulo">Mis oficios</h2>
                  <p className="pp-ayuda">Marca las especialidades que ofreces. Al guardar se reemplazará la selección anterior.</p>
                  <form onSubmit={guardarOficios}>
                    <div className="pp-lista-oficios">
                      {oficios.map((oficio) => (
                        <label className="pp-opcion-oficio" key={oficio.id_oficio}>
                          <input
                            type="checkbox"
                            checked={oficiosSeleccionados.includes(String(oficio.id_oficio))}
                            onChange={() => alternarOficio(String(oficio.id_oficio))}
                            disabled={guardandoOficios}
                          />
                          <span>{oficio.nombre}</span>
                        </label>
                      ))}
                    </div>
                    <button type="submit" className="pp-boton pp-boton-secundario" disabled={guardandoOficios}>
                      {guardandoOficios ? 'Guardando...' : 'Actualizar oficios'}
                    </button>
                  </form>
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
