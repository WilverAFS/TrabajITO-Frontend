import { useEffect, useState } from 'react'
import { Dialogo, Paginacion } from '../../components/ui/Interfaz.jsx'
import {
  listarUsuariosAdmin,
  obtenerUsuarioAdmin,
  reactivarUsuarioAdmin,
  suspenderUsuarioAdmin,
} from '../../services/adminApi.js'

export default function UsuariosAdmin({ usuarioActual }) {
  const [usuarios, setUsuarios] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [buscar, setBuscar] = useState('')
  const [filtroActivo, setFiltroActivo] = useState('')
  const [filtroAdmin, setFiltroAdmin] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [totalAdminsActivos, setTotalAdminsActivos] = useState(0)

  const [detalle, setDetalle] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [usuarioASuspender, setUsuarioASuspender] = useState(null)
  const [procesandoId, setProcesandoId] = useState(null)
  const [recargar, setRecargar] = useState(0)
  const [buscarDebounced, setBuscarDebounced] = useState('')

  useEffect(() => {
  const timer = setTimeout(() => {
    setBuscarDebounced(buscar)
  }, 350)
  return () => clearTimeout(timer)
  }, [buscar])

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      listarUsuariosAdmin({
        pagina,
        per_page: 15,
        buscar: buscarDebounced.trim() || undefined,
        activo: filtroActivo || undefined,
        es_administrador: filtroAdmin || undefined,
        signal: controller.signal,
      }),
      listarUsuariosAdmin({
        pagina: 1,
        per_page: 1,
        activo: 'true',
        es_administrador: 'true',
        signal: controller.signal,
      }),
    ])
      .then(([resUsuarios, resAdmins]) => {
        setUsuarios(resUsuarios?.data ?? [])
        setMeta(resUsuarios?.meta ?? null)
        setTotalAdminsActivos(resAdmins?.meta?.total ?? 0)
        setError('')
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar los usuarios.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [pagina, buscarDebounced, filtroActivo, filtroAdmin, recargar])

  const motivoBloqueoSuspension = (u) => {
    if (u.id_usuario === usuarioActual?.id_usuario) {
      return 'No puedes suspender tu propia cuenta.'
    }
    if (u.es_administrador && u.activo && totalAdminsActivos <= 1) {
      return 'No puedes suspender al último administrador activo.'
    }
    return ''
  }

  const handleVerDetalle = async (idUsuario) => {
    setCargandoDetalle(true)
    setError('')
    try {
      const datos = await obtenerUsuarioAdmin(idUsuario)
      setDetalle(datos)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el detalle del usuario.')
    } finally {
      setCargandoDetalle(false)
    }
  }

  const handleConfirmarSuspension = async () => {
    if (!usuarioASuspender) return
    setProcesandoId(usuarioASuspender.id_usuario)
    setError('')
    setMensaje('')
    try {
      await suspenderUsuarioAdmin(usuarioASuspender.id_usuario)
      setMensaje(`Usuario ${usuarioASuspender.nombre} suspendido correctamente.`)
      setUsuarioASuspender(null)
      setRecargar((v) => v + 1)
    } catch (err) {
      setError(err.message || 'No se pudo suspender al usuario.')
    } finally {
      setProcesandoId(null)
    }
  }

  const handleReactivar = async (u) => {
    setProcesandoId(u.id_usuario)
    setError('')
    setMensaje('')
    try {
      await reactivarUsuarioAdmin(u.id_usuario)
      setMensaje(`Usuario ${u.nombre} reactivado correctamente.`)
      setRecargar((v) => v + 1)
    } catch (err) {
      setError(err.message || 'No se pudo reactivar al usuario.')
    } finally {
      setProcesandoId(null)
    }
  }

  return (
    <div>
      {error && <div className="admin-alerta admin-alerta-error">{error}</div>}
      {mensaje && <div className="admin-alerta admin-alerta-ok">{mensaje}</div>}

      <div className="admin-filtros">
        <input
          type="search"
          className="admin-input"
          placeholder="Buscar por nombre, correo o teléfono..."
          value={buscar}
          onChange={(e) => {
            setBuscar(e.target.value)
            setPagina(1)
          }}
        />
        <select
          className="admin-select"
          value={filtroActivo}
          onChange={(e) => {
            setFiltroActivo(e.target.value)
            setPagina(1)
          }}
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Suspendidos</option>
        </select>
        <select
          className="admin-select"
          value={filtroAdmin}
          onChange={(e) => {
            setFiltroAdmin(e.target.value)
            setPagina(1)
          }}
        >
          <option value="">Todos los roles</option>
          <option value="true">Administradores</option>
          <option value="false">No administradores</option>
        </select>
      </div>

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>No se encontraron usuarios con los filtros seleccionados.</p>
      ) : (
        <div className="admin-tabla-wrapper">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const motivoBloqueo = motivoBloqueoSuspension(u)
                return (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{`${u.nombre ?? ''} ${u.apellido ?? ''}`.trim()}</td>
                    <td>{u.correo}</td>
                    <td>{u.es_administrador ? 'Administrador' : 'Usuario'}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          u.activo ? 'admin-badge-ok' : 'admin-badge-error'
                        }`}
                      >
                        {u.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-acciones">
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => handleVerDetalle(u.id_usuario)}
                          disabled={cargandoDetalle}
                        >
                          Ver detalle
                        </button>
                        {u.activo ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn-peligro"
                            disabled={Boolean(motivoBloqueo) || procesandoId === u.id_usuario}
                            title={motivoBloqueo || 'Suspender usuario'}
                            onClick={() => setUsuarioASuspender(u)}
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-exito"
                            disabled={procesandoId === u.id_usuario}
                            onClick={() => handleReactivar(u)}
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                      {u.activo && motivoBloqueo && (
                        <span className="admin-nota-bloqueo">{motivoBloqueo}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Paginacion meta={meta} onCambiar={setPagina} />

      {detalle && (
        <Dialogo
          titulo="Detalle de usuario"
          onClose={() => setDetalle(null)}
        >
          <div className="admin-detalle-lista">
            <div><strong>ID:</strong> {detalle.id_usuario}</div>
            <div><strong>Nombre:</strong> {`${detalle.nombre ?? ''} ${detalle.apellido ?? ''}`.trim()}</div>
            <div><strong>Correo:</strong> {detalle.correo}</div>
            <div><strong>Teléfono:</strong> {detalle.telefono || 'No registrado'}</div>
            <div><strong>Administrador:</strong> {detalle.es_administrador ? 'Sí' : 'No'}</div>
            <div><strong>Estado:</strong> {detalle.activo ? 'Activo' : 'Suspendido'}</div>
            <div><strong>Perfil profesional:</strong> {detalle.perfil_profesional ? 'Sí' : 'No'}</div>
          </div>
        </Dialogo>
      )}

      {usuarioASuspender && (
        <Dialogo
          titulo="Confirmar suspensión"
          onClose={() => setUsuarioASuspender(null)}
        >
          <p>
            ¿Seguro que deseas suspender a{' '}
            <strong>
              {`${usuarioASuspender.nombre ?? ''} ${usuarioASuspender.apellido ?? ''}`.trim()}
            </strong>
            ? Si tiene perfil profesional, también quedará inactivo.
          </p>
          <div className="admin-modal-acciones">
            <button
              type="button"
              className="admin-btn"
              onClick={() => setUsuarioASuspender(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-peligro"
              disabled={procesandoId === usuarioASuspender.id_usuario}
              onClick={handleConfirmarSuspension}
            >
              Confirmar suspensión
            </button>
          </div>
        </Dialogo>
      )}
    </div>
  )
}