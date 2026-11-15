import { useState } from 'react'
import DisponibilidadesPanel from './DisponibilidadesPanel.jsx'
import CertificadosPanel from './CertificadosPanel.jsx'
import HabilitacionPanel from './HabilitacionPanel.jsx'
import './ComplementosPerfil.css'

const SECCIONES = [
  { id: 'disponibilidad', etiqueta: 'Disponibilidad' },
  { id: 'certificados', etiqueta: 'Certificados' },
  { id: 'habilitacion', etiqueta: 'Habilitación' },
]

export default function ComplementosPerfil({ activo = false }) {
  const [seccion, setSeccion] = useState('disponibilidad')

  return (
    <section className="pc-contenedor" aria-labelledby="pc-titulo">
      <header className="pc-encabezado">
        <span className="pc-sobretitulo">MI PERFIL PROFESIONAL</span>
        <h2 id="pc-titulo">Herramientas del trabajador</h2>
        <p>Organiza tus horarios, registra tus certificados y consulta la habilitación de tu perfil.</p>
      </header>

      <nav className="pc-pestanas" aria-label="Herramientas del perfil profesional">
        {SECCIONES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={seccion === item.id ? 'pc-pestana pc-pestana-activa' : 'pc-pestana'}
            onClick={() => setSeccion(item.id)}
            aria-current={seccion === item.id ? 'page' : undefined}
          >
            {item.etiqueta}
          </button>
        ))}
      </nav>

      <div className="pc-cuerpo">
        {seccion === 'disponibilidad' && <DisponibilidadesPanel />}
        {seccion === 'certificados' && <CertificadosPanel />}
        {seccion === 'habilitacion' && <HabilitacionPanel perfilActivo={activo} />}
      </div>
    </section>
  )
}
