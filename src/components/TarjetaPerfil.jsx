import { useNavigate } from 'react-router'
import { EstrellaIcono, UbicacionIcono, RelojIcono } from './Iconos'
import { Medio } from './ui/Interfaz.jsx'
import './TarjetaPerfil.css'

export default function TarjetaPerfil({ perfil }) {
  const navigate = useNavigate()

  return (
    <div className="tarjeta-perfil">
      <Medio
        url={perfil.foto_url}
        nombre={perfil.nombre_completo}
        className="perfil-img"
      />
      <div className="perfil-info">
        <h3 className="perfil-nombre">{perfil.nombre_completo}</h3>

        <p className="perfil-oficio">
          {perfil.oficios?.length > 0 ? perfil.oficios[0].nombre : 'Sin oficio registrado'}
        </p>

        <div className="perfil-rating">
          <EstrellaIcono /> {perfil.calificacion_promedio ?? '0.0'}{' '}
          <small>({perfil.total_valoraciones ?? 0} opiniones)</small>
        </div>

        <p className="perfil-tags">
          {perfil.descripcion ? `${perfil.descripcion.substring(0, 60)}...` : 'Sin descripción'}
        </p>

        <p className="perfil-ubicacion">
          <UbicacionIcono /> {perfil.municipio?.municipio}, {perfil.estado?.estado}
        </p>

        <div className="perfil-horario horario-verde">
          <RelojIcono />
          <div className="horario-textos">
            <span className="horario-titulo">Disponible</span>
            <span className="horario-detalle">Consulta disponibilidad</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-ver-perfil"
          onClick={() => navigate(`/perfiles/${perfil.id_trabajador}`)}
        >
          Ver perfil
        </button>
      </div>
    </div>
  )
}