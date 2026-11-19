import { useState } from 'react'
import { Link } from 'react-router'
import { CabeceraPagina, Campo } from '../../components/ui/Interfaz.jsx'
import EditarPublicacion from './EditarPublicacion.jsx'

export default function NuevaPublicacion() {
  const [identificador, setIdentificador] = useState('')
  const [contratacion, setContratacion] = useState(null)

  function seleccionar(evento) {
    evento.preventDefault()
    const id = Number(identificador)
    if (Number.isSafeInteger(id) && id > 0) setContratacion(id)
  }

  return (
    <>
      <CabeceraPagina
        titulo="Publicar un trabajo finalizado"
        descripcion="Las publicaciones se asocian a una contratación finalizada en TrabajITO."
        volver={{ to: '/portafolio', texto: 'Volver a mi portafolio' }}
      />
      <div className="tj-container tj-section tj-stack">
        <section className="tj-card tj-stack">
          <h2>Identificar contratación</h2>
          <p className="tj-muted">Usa el identificador de una contratación que ya terminó. Laravel verificará que pertenezcas al trabajo y que la publicación esté permitida.</p>
          <form className="tj-form" onSubmit={seleccionar}>
            <Campo etiqueta="ID de contratación" inputMode="numeric" type="number" min="1" step="1" required value={identificador}
              onChange={(evento) => { setIdentificador(evento.target.value); setContratacion(null) }} />
            <div className="tj-actions"><button className="tj-button" type="submit">Continuar</button>
              <Link className="tj-button tj-button-secondary" to="/portafolio">Cancelar</Link></div>
          </form>
        </section>
        {contratacion && <EditarPublicacion key={contratacion} contratacion={contratacion} />}
      </div>
    </>
  )
}
