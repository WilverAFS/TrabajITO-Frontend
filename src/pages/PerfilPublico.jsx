import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BannerPerfil from '../components/BannerPerfil'
import ColumnaPrincipal from '../components/ColumnaPrincipal'
import SidebarPerfil from '../components/SidebarPerfil'
import ModalContratar from '../components/ModalContratar'
import { obtenerToken } from '../services/apiClient.js'
import { obtenerUsuarioActual } from '../services/authApi.js'
import { obtenerTrabajadorPublico } from '../services/trabajadoresApi.js'
import { listarTrabajosPublicos } from '../services/publicacionesApi.js'
import './PerfilPublico.css'

export default function PerfilPublico() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [trabajos, setTrabajos] = useState([])
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const cargar = async () => {
      setCargando(true)
      setError('')

      try {
        const [datosPerfil, listaTrabajos] = await Promise.all([
          obtenerTrabajadorPublico(id, { signal: controller.signal }),
          listarTrabajosPublicos({ id, signal: controller.signal }).catch(() => []),
        ])

        if (controller.signal.aborted) return
        setPerfil(datosPerfil)
        setTrabajos(Array.isArray(listaTrabajos) ? listaTrabajos : [])
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err.message || 'No se pudo cargar la información del trabajador.')
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()

    if (obtenerToken()) {
      obtenerUsuarioActual({ signal: controller.signal, notificarSesion: false })
        .then((u) => {
          if (!controller.signal.aborted) setUsuarioActual(u)
        })
        .catch(() => {})
    }

    return () => controller.abort()
  }, [id])

  const esPropio =
    Boolean(usuarioActual?.id_trabajador) &&
    Number(usuarioActual.id_trabajador) === Number(perfil?.id_trabajador)

  const handleContratar = () => {
    if (!obtenerToken()) {
      navigate('/login')
      return
    }
    setModalAbierto(true)
  }

  return (
    <>
      <Header botonActivo="catalogo" />

      <main className="perfil-publico-main">
        {cargando && <p className="mensaje-estado" role="status">Cargando perfil…</p>}

        {!cargando && error && (
          <div className="mensaje-estado error" role="alert">
            <p>{error}</p>
            <button type="button" className="tj-button tj-button-secondary" onClick={() => navigate('/catalogo')}>
              Volver al catálogo
            </button>
          </div>
        )}

        {!cargando && !error && perfil && (
          <>
            <BannerPerfil
              perfil={perfil}
              esPropio={esPropio}
              onContratar={handleContratar}
            />

            <div className="contenedor-perfil seccion-inferior-figma">
              <div className="perfil-grid-inferior">
                <ColumnaPrincipal perfil={perfil} trabajos={trabajos} />
                <SidebarPerfil perfil={perfil} />
              </div>
            </div>

            {modalAbierto && (
              <ModalContratar
                trabajador={perfil}
                onClose={() => setModalAbierto(false)}
              />
            )}
          </>
        )}
      </main>

      <Footer className="perfil-publico-footer" />
    </>
  )
}