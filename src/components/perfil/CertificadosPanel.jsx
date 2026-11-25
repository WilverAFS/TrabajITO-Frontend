import { useCallback, useEffect, useRef, useState } from 'react'
import {
  listarCertificados,
  crearCertificado,
  eliminarCertificado,
  enlaceDocumento,
} from '../../services/perfilComplementosApi.js'
import AlertasPanel from './AlertasPanel.jsx'
import { Dialogo } from '../ui/Interfaz.jsx'
import { ListaComplementos, ElementoListaComplemento } from './ListaComplementos.jsx'

const LIMITE_BYTES = 5 * 1024 * 1024
const EXTENSIONES_PERMITIDAS = /\.(pdf|jpe?g|png)$/i

export default function CertificadosPanel() {
  const formularioRef = useRef(null)
  const [registros, setRegistros] = useState([])
  const [nombre, setNombre] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [emision, setEmision] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [documento, setDocumento] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [certificadoPendiente, setCertificadoPendiente] = useState(null)

  const manejarError = useCallback((err) => {
    if (err?.name === 'AbortError') return
    // El cliente central elimina el token y notifica la sesión expirada.
    if (err?.status === 401) return
    setError(err?.message || 'No fue posible completar la operación.')
  }, [])

  const cargar = useCallback(async (signal) => {
    const lista = await listarCertificados({ signal })
    setRegistros(Array.isArray(lista) ? lista : [])
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    listarCertificados({ signal: controller.signal })
      .then((lista) => {
        if (!controller.signal.aborted) setRegistros(Array.isArray(lista) ? lista : [])
      })
      .catch((err) => { if (!controller.signal.aborted) manejarError(err) })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [manejarError])

  async function guardar(evento) {
    evento.preventDefault()
    setError('')
    setExito('')

    if (!documento) {
      setError('Selecciona el documento del certificado.')
      return
    }
    if (!EXTENSIONES_PERMITIDAS.test(documento.name)) {
      setError('El archivo debe ser PDF, JPG o PNG.')
      return
    }
    if (documento.size > LIMITE_BYTES) {
      setError('El documento no debe superar los 5 MB.')
      return
    }
    if (vencimiento && vencimiento < emision) {
      setError('La fecha de vencimiento no puede ser anterior a la de emisión.')
      return
    }

    const datos = new FormData()
    datos.append('nombre', nombre.trim())
    datos.append('institucion_emisora', institucion.trim())
    datos.append('fecha_emision', emision)
    if (vencimiento) datos.append('fecha_vencimiento', vencimiento)
    datos.append('documento', documento)

    setOcupado(true)
    try {
      await crearCertificado(datos)
      await cargar()
      setNombre('')
      setInstitucion('')
      setEmision('')
      setVencimiento('')
      setDocumento(null)
      formularioRef.current?.reset()
      setExito('Certificado registrado correctamente. La verificación administrativa es independiente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  function eliminar(registro) {
    setCertificadoPendiente(registro)
  }

  async function confirmarEliminar() {
    if (!certificadoPendiente) return
    setError('')
    setExito('')
    setOcupado(true)
    try {
      await eliminarCertificado(certificadoPendiente.id_certificado)
      await cargar()
      setCertificadoPendiente(null)
      setExito('Certificado eliminado correctamente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="pc-panel">
      <div className="pc-seccion-titulo">
        <h3>Mis certificados</h3>
        <p>Registra documentos que acrediten tu preparación. Los documentos quedan sujetos a verificación; no se validan automáticamente.</p>
      </div>
      <AlertasPanel error={error} exito={exito} />
      <div className="pc-dos-columnas">
        <section className="pc-subtarjeta">
          <h4>Registrar certificado</h4>
          <form ref={formularioRef} className="pc-formulario" onSubmit={guardar}>
            <label htmlFor="pc-cert-nombre">Nombre del certificado</label>
            <input id="pc-cert-nombre" type="text" maxLength="150" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Instalaciones eléctricas" disabled={ocupado} />

            <label htmlFor="pc-cert-inst">Institución emisora</label>
            <input id="pc-cert-inst" type="text" maxLength="150" required value={institucion} onChange={(e) => setInstitucion(e.target.value)} placeholder="Nombre de la institución" disabled={ocupado} />

            <label htmlFor="pc-cert-emision">Fecha de emisión</label>
            <input id="pc-cert-emision" type="date" value={emision} onChange={(e) => setEmision(e.target.value)} required disabled={ocupado} />

            <label htmlFor="pc-cert-vencimiento">Fecha de vencimiento (opcional)</label>
            <input id="pc-cert-vencimiento" type="date" min={emision || undefined} value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} disabled={ocupado} />

            <label htmlFor="pc-cert-archivo">Documento (PDF, JPG o PNG, máximo 5 MB)</label>
            <input id="pc-cert-archivo" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required onChange={(e) => setDocumento(e.target.files?.[0] ?? null)} disabled={ocupado} />
            {documento && <p className="pc-leyenda">Seleccionado: {documento.name}</p>}

            <button type="submit" className="pc-boton" disabled={ocupado}>
              {ocupado ? 'Registrando...' : 'Guardar certificado'}
            </button>
          </form>
        </section>

        <section className="pc-subtarjeta" aria-label="Lista de certificados">
          <h4>Certificados registrados ({registros.length})</h4>
          {cargando ? <p role="status">Cargando certificados...</p> : registros.length === 0 ? (
            <p className="pc-vacio">Todavía no has registrado certificados.</p>
          ) : (
            <ListaComplementos label="Lista de certificados">
              {registros.map((registro) => (
                <ElementoListaComplemento key={registro.id_certificado}>
                  <div className="pc-item-encabezado">
                    <strong>{registro.nombre}</strong>
                    <span className={registro.verificado ? 'pc-pill pc-pill-ok' : 'pc-pill'}>
                      {registro.verificado ? 'Verificado' : 'Sin verificar'}
                    </span>
                  </div>
                  <p>{registro.institucion_emisora}</p>
                  <p>Emisión: {registro.fecha_emision || 'Sin fecha'}</p>
                  {registro.fecha_vencimiento && <p>Vencimiento: {registro.fecha_vencimiento}</p>}
                  <div className="pc-botones pc-botones-pequenos">
                    {enlaceDocumento(registro.documento_url) && (
                      <a href={enlaceDocumento(registro.documento_url)} className="pc-boton pc-boton-claro" target="_blank" rel="noopener noreferrer">Ver documento</a>
                    )}
                    <button type="button" className="pc-boton pc-boton-peligro" disabled={ocupado} onClick={() => eliminar(registro)}>Eliminar</button>
                  </div>
                </ElementoListaComplemento>
              ))}
            </ListaComplementos>
          )}
          <p className="pc-nota">El enlace al documento necesita que el Backend publique su almacenamiento mediante <code>php artisan storage:link</code>.</p>
        </section>
      </div>

      {certificadoPendiente && (
        <Dialogo
          titulo="Eliminar certificado"
          onClose={() => {
            if (!ocupado) setCertificadoPendiente(null)
          }}
        >
          <p>
            ¿Eliminar el certificado «{certificadoPendiente.nombre}» y su documento?
          </p>
          {error && <p role="alert">{error}</p>}
          <div className="pc-botones">
            <button
              type="button"
              className="pc-boton pc-boton-claro"
              disabled={ocupado}
              onClick={() => setCertificadoPendiente(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="pc-boton pc-boton-peligro"
              disabled={ocupado}
              onClick={confirmarEliminar}
            >
              {ocupado ? 'Eliminando...' : 'Sí, eliminar certificado'}
            </button>
          </div>
        </Dialogo>
      )}
    </div>
  )
}
