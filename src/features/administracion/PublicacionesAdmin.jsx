import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Dialogo } from '../../components/ui/Interfaz.jsx'
import {
  listarReportesAdmin,
  obtenerPublicacionAdmin,
  ocultarPublicacionAdmin,
} from '../../services/adminApi.js'

export default function PublicacionesAdmin() {
  const [publicaciones, setPublicaciones] = useState([])
  const [filtroEstado, setFiltroEstado] = useState('')
  const [idBuscar, setIdBuscar] = useState('')
  const [cargando, setCargando] = useState(true)
  const [buscandoId, setBuscandoId] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [pubAOcultar, setPubAOcultar] = useState(null)
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    listarReportesAdmin({
      pagina: 1,
      per_page: 50,
      tipo_objetivo: 'PUBLICACION',
      signal: controller.signal,
    })
      .then(async (res) => {
        const reportes = res?.data ?? []
        const idsUnicos = [...new Set(reportes.map((r) => r.id_objetivo).filter(Boolean))]
        if (idsUnicos.length === 0) {
          setPublicaciones([])
          return
        }
        const resultados = await Promise.allSettled(
          idsUnicos.map((id) => obtenerPublicacionAdmin(id, { signal: controller.signal })),
        )
        const cargadas = resultados
          .filter((r) => r.status === 'fulfilled' && r.value)
          .map((r) => r.value)
        setPublicaciones(cargadas)
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar las publicaciones.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [])

  const handleBuscarPorId = async (e) => {
    e.preventDefault()
    const idLimpio = idBuscar.trim()
    if (!idLimpio) return

    setBuscandoId(true)
    setError('')
    setMensaje('')
    try {
      const pub = await obtenerPublicacionAdmin(idLimpio)
      if (pub) {
        setPublicaciones((prev) => {
          const existe = prev.some((p) => p.id_publicacion === pub.id_publicacion)
          return existe
            ? prev.map((p) => (p.id_publicacion === pub.id_publicacion ? pub : p))
            : [pub, ...prev]
        })
        setIdBuscar('')
      }
    } catch (err) {
      setError(err.message || 'No se encontró la publicación con ese ID.')
    } finally {
      setBuscandoId(false)
    }
  }

  const handleConfirmarOcultar = async () => {
    if (!pubAOcultar) return
    setProcesando(true)
    setError('')
    setMensaje('')
    try {
      await ocultarPublicacionAdmin(pubAOcultar.id_publicacion)
      setPublicaciones((prev) =>
        prev.map((p) =>
          p.id_publicacion === pubAOcultar.id_publicacion ? { ...p, visible: false } : p,
        ),
      )
      setMensaje(`Publicación #${pubAOcultar.id_publicacion} ocultada correctamente.`)
      setPubAOcultar(null)
    } catch (err) {
      setError(err.message || 'No se pudo ocultar la publicación.')
    } finally {
      setProcesando(false)
    }
  }

  const publicacionesFiltradas = publicaciones.filter((pub) => {
    if (filtroEstado === 'visible') return Boolean(pub.visible)
    if (filtroEstado === 'oculta') return !pub.visible
    return true
  })

  return (
    <div>
      {error && <div className="admin-alerta admin-alerta-error">{error}</div>}
      {mensaje && <div className="admin-alerta admin-alerta-ok">{mensaje}</div>}

      <div className="admin-filtros">
        <form className="admin-acciones" onSubmit={handleBuscarPorId}>
          <input
            type="number"
            min="1"
            className="admin-input"
            placeholder="Consultar publicación por ID..."
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />
          <button
            type="submit"
            className="admin-btn admin-btn-primario"
            disabled={buscandoId || !idBuscar.trim()}
          >
            {buscandoId ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        <select
          className="admin-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="visible">Visibles</option>
          <option value="oculta">Ocultas</option>
        </select>
      </div>

      {cargando ? (
        <p>Cargando publicaciones...</p>
      ) : publicacionesFiltradas.length === 0 ? (
        <p>No hay publicaciones reportadas en este momento. Puedes consultar cualquier publicación por su ID arriba.</p>
      ) : (
        <div className="admin-tabla-wrapper">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {publicacionesFiltradas.map((pub) => (
                <tr key={pub.id_publicacion}>
                  <td>{pub.id_publicacion}</td>
                  <td>{pub.titulo}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        pub.visible ? 'admin-badge-ok' : 'admin-badge-error'
                      }`}
                    >
                      {pub.visible ? 'Visible' : 'Oculta'}
                    </span>
                  </td>
                  <td>
                    {pub.fecha_publicacion
                      ? new Date(pub.fecha_publicacion).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <div className="admin-acciones">
                      <Link
                        to={`/publicaciones/${pub.id_publicacion}`}
                        className="admin-btn"
                      >
                        Ver
                      </Link>
                      {pub.visible && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-peligro"
                          disabled={procesando}
                          onClick={() => setPubAOcultar(pub)}
                        >
                          Ocultar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pubAOcultar && (
        <Dialogo
          titulo="Confirmar ocultamiento"
          onClose={() => setPubAOcultar(null)}
        >
          <p>
            ¿Seguro que deseas ocultar la publicación{' '}
            <strong>{pubAOcultar.titulo}</strong> (#{pubAOcultar.id_publicacion})? Dejará de
            ser visible para el público.
          </p>
          <div className="admin-modal-acciones">
            <button
              type="button"
              className="admin-btn"
              onClick={() => setPubAOcultar(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-peligro"
              disabled={procesando}
              onClick={handleConfirmarOcultar}
            >
              Confirmar ocultar
            </button>
          </div>
        </Dialogo>
      )}
    </div>
  )
}