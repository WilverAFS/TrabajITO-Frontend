import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  listarReportesAdmin,
  listarSolicitudesHabilitacionAdmin,
  listarUsuariosAdmin,
} from '../../services/adminApi.js'

export default function ResumenAdmin({ onIrAPestana }) {
  const [conteos, setConteos] = useState({
    usuarios: 0,
    solicitudesPendientes: 0,
    reportesPendientes: 0,
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      listarUsuariosAdmin({ pagina: 1, per_page: 1, signal: controller.signal }),
      listarSolicitudesHabilitacionAdmin({
        pagina: 1,
        per_page: 1,
        id_estado: 1,
        signal: controller.signal,
      }),
      listarReportesAdmin({
        pagina: 1,
        per_page: 1,
        id_estado: 1,
        signal: controller.signal,
      }),
    ])
      .then(([resUsuarios, resSolicitudes, resReportes]) => {
        setConteos({
          usuarios: resUsuarios?.meta?.total ?? 0,
          solicitudesPendientes: resSolicitudes?.meta?.total ?? 0,
          reportesPendientes: resReportes?.meta?.total ?? 0,
        })
        setError('')
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar los indicadores.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="admin-resumen">
      {error && <div className="admin-alerta admin-alerta-error">{error}</div>}

      <div className="admin-kpis">
        <button
          type="button"
          className="admin-kpi"
          onClick={() => onIrAPestana('usuarios')}
        >
          <span className="admin-kpi-etiqueta">Usuarios registrados</span>
          <strong className="admin-kpi-valor">
            {cargando ? '...' : conteos.usuarios}
          </strong>
        </button>

        <button
          type="button"
          className="admin-kpi"
          onClick={() => onIrAPestana('solicitudes')}
        >
          <span className="admin-kpi-etiqueta">Solicitudes pendientes</span>
          <strong className="admin-kpi-valor">
            {cargando ? '...' : conteos.solicitudesPendientes}
          </strong>
        </button>

        <button
          type="button"
          className="admin-kpi"
          onClick={() => onIrAPestana('reportes')}
        >
          <span className="admin-kpi-etiqueta">Reportes pendientes</span>
          <strong className="admin-kpi-valor">
            {cargando ? '...' : conteos.reportesPendientes}
          </strong>
        </button>

        <button
          type="button"
          className="admin-kpi admin-kpi-info"
          onClick={() => onIrAPestana('publicaciones')}
        >
          <span className="admin-kpi-etiqueta">Publicaciones ocultas</span>
          <strong className="admin-kpi-valor">N/D</strong>
          <small>Requiere GET /admin/publicaciones</small>
        </button>
      </div>

      <div className="admin-resumen-acciones">
        <Link to="/mi-perfil" className="admin-btn">
          Ver mi perfil
        </Link>
      </div>
    </div>
  )
}