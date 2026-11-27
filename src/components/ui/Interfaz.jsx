import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import Icono from './Icono.jsx'
import { iniciales } from './formatos.js'
import { resolverUrlBackend } from '../../services/apiClient.js'

export function CabeceraPagina({ titulo, descripcion, volver, acciones, children }) {
  return (
    <div className="tj-page-head">
      <div className="tj-container">
        {volver && <Link className="tj-back" to={volver.to}><Icono nombre="regresar" /> {volver.texto}</Link>}
        <div className="tj-page-heading">
          <div><h1>{titulo}</h1>{descripcion && <p>{descripcion}</p>}</div>
          {acciones && <div className="tj-actions">{acciones}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}

export function Avisos({ error, exito }) {
  return <>
    {error && <p className="tj-alert tj-alert-error" role="alert">{error}</p>}
    {exito && <p className="tj-alert tj-alert-success" role="status">{exito}</p>}
  </>
}

export function Resultado({ consulta, vacio, children }) {
  if (consulta.error) {
    return <div className="tj-empty">
      <p role="alert">{consulta.error}</p>
      <button className="tj-button tj-button-secondary" type="button" onClick={consulta.refrescar}>Reintentar</button>
    </div>
  }
  if (consulta.cargando && !consulta.datos) return <p className="tj-empty" role="status">Cargando…</p>
  if (vacio) return <p className="tj-empty" role="status">{vacio}</p>
  return children
}

export function Campo({ etiqueta, id, ayuda, children, ...props }) {
  const generado = useId()
  const campoId = id || generado
  const idAyuda = ayuda ? `${campoId}-ayuda` : undefined
  return (
    <div className="tj-field">
      <label htmlFor={campoId}>{etiqueta}</label>
      {children ? children(campoId, idAyuda) : <input id={campoId} aria-describedby={idAyuda} {...props} />}
      {ayuda && <small id={idAyuda}>{ayuda}</small>}
    </div>
  )
}

export function Seleccion({ etiqueta, name, opciones, ...props }) {
  return <Campo etiqueta={etiqueta}>{(id) => (
    <select id={id} name={name} {...props}>
      {opciones.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
    </select>
  )}</Campo>
}

export function Paginacion({ meta, cambiar, cargando = false }) {
  if (!meta || meta.last_page <= 1) return null
  return (
    <nav className="tj-pagination" aria-label="Paginación">
      <span>{meta.total} resultados · Página {meta.current_page} de {meta.last_page}</span>
      <div className="tj-actions">
        <button className="tj-button tj-button-secondary" type="button" disabled={cargando || meta.current_page <= 1}
          onClick={() => cambiar(meta.current_page - 1)}>Anterior</button>
        <button className="tj-button tj-button-secondary" type="button" disabled={cargando || meta.current_page >= meta.last_page}
          onClick={() => cambiar(meta.current_page + 1)}>Siguiente</button>
      </div>
    </nav>
  )
}

export function Insignia({ children, tono = 'neutral' }) {
  return <span className={`tj-badge tj-badge-${tono}`}>{children}</span>
}

export function Medio({url, urlBlob = null, nombre = '', icono = 'usuario', className = '',}) {
  const src = urlBlob || resolverUrlBackend(url)
  const [fallida, setFallida] = useState('')

  return (
    <div className={`tj-media ${className}`}>
      {src && src !== fallida
        ? (
          <img
            src={src}
            alt={nombre}
            loading="lazy"
            onError={() => setFallida(src)}
          />
        )
        : (
          <span aria-hidden="true">
            {icono === 'usuario' && iniciales(nombre) ||
              <Icono nombre={icono} />}
          </span>
        )}
    </div>
  )
}

export function Dialogo({ titulo, onClose, children }) {
  const dialogo = useRef(null)
  const id = useId()
  useEffect(() => {
    const instancia = dialogo.current
    instancia.showModal()
    return () => { instancia.close() }
  }, [])

  return <dialog ref={dialogo} className="tj-dialog" aria-labelledby={id}
    onCancel={(evento) => { evento.preventDefault(); onClose() }}>
    <div className="tj-dialog-top">
      <h2 id={id}>{titulo}</h2>
      <button className="tj-icon-button" type="button" aria-label="Cerrar ventana" onClick={onClose}>
        <Icono nombre="cerrar" />
      </button>
    </div>
    {children}
  </dialog>
}
