import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import logo from '../assets/registro-logo-provisional.png'
import { CampanaIcono, CorreoIcono } from './Iconos'
import { obtenerToken } from '../services/apiClient.js'
import { cerrarSesion, obtenerUsuarioActual } from '../services/authApi.js'
import './Header.css'

export default function Header({ botonActivo = 'catalogo' }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState('Invitado')
  const [cerrando, setCerrando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!obtenerToken()) return undefined

    const controlador = new AbortController()
    obtenerUsuarioActual({ signal: controlador.signal, notificarSesion: false })
      .then((usuario) => {
        if (usuario?.nombre) setUsuarioActual(usuario.nombre)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error al obtener usuario.')
        }
      })

    return () => controlador.abort()
  }, [])

  const manejarCerrarSesion = async () => {
    if (cerrando) return
    setCerrando(true)
    try {
      await cerrarSesion()
    } catch {
      // El token se elimina dentro del servicio aunque el servidor no responda.
    } finally {
      setCerrando(false)
      navigate('/login')
    }
  }

  return (
    <header className="trabajito-header">
      <a href="/" className="logo-container"><img src={logo} alt="TrabajITO" /></a>

      <nav>
        <button
          onClick={() => navigate('/inicio')}
          className={`btn-enlace-nav ${botonActivo === 'inicio' ? 'activo' : ''}`}
        >
          Inicio
        </button>
        <button
          onClick={() => navigate('/catalogo')}
          className={`btn-enlace-nav ${botonActivo === 'catalogo' ? 'activo' : ''}`}
        >
          Buscar trabajadores
        </button>
      </nav>

      <div className="usuario-contenedor">
        <div className="iconos-notificacion">
          <CampanaIcono />
          <CorreoIcono />
        </div>

        <button className="btn-perfil-usuario" onClick={() => setMenuAbierto(!menuAbierto)}>
          Bienvenido {usuarioActual} <span style={{ fontSize: '12px', marginLeft: '4px' }}>v</span>
        </button>

        {menuAbierto && (
          <div className="menu-desplegable-usuario">
            <button onClick={() => { setMenuAbierto(false); navigate('/mi-perfil'); }}>Ver perfil</button>
            <button onClick={manejarCerrarSesion} disabled={cerrando}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  )
}
