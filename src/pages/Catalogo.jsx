import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TarjetaPerfil from '../components/TarjetaPerfil'
import {
  LlaveIcono, PinIcono, EstrellaFiltroIcono,
  CirculoVacioIcono, ChevronIcono,
} from '../components/Iconos'
import { listarMunicipios, listarOficios } from '../services/catalogosApi.js'
import { listarTrabajadores } from '../services/trabajadoresApi.js'
import './Catalogo.css'

// El catálogo actual muestra municipios de Oaxaca de Juárez.
const ID_ESTADO_OAXACA = 1
const FILTROS_VACIOS = { oficio: '', municipio: '', reputacion: '' }

const Catalogo = () => {
  const [perfiles, setPerfiles] = useState([])
  const [cargandoPerfiles, setCargandoPerfiles] = useState(true)
  const [errorPerfiles, setErrorPerfiles] = useState('')

  const [listaOficios, setListaOficios] = useState([])
  const [listaMunicipios, setListaMunicipios] = useState([])
  const [errorFiltros, setErrorFiltros] = useState('')

  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS)

  useEffect(() => {
    const controlador = new AbortController()

    Promise.all([
      listarOficios({ signal: controlador.signal }),
      listarMunicipios(ID_ESTADO_OAXACA, { signal: controlador.signal }),
    ])
      .then(([oficios, municipios]) => {
        if (controlador.signal.aborted) return
        setListaOficios(Array.isArray(oficios) ? oficios : [])
        setListaMunicipios(Array.isArray(municipios) ? municipios : [])
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controlador.signal.aborted) {
          setErrorFiltros('No se pudieron cargar las opciones de búsqueda.')
        }
      })

    return () => controlador.abort()
  }, [])

  useEffect(() => {
    const controlador = new AbortController()

    listarTrabajadores({
      pagina: 1,
      id_oficio: filtrosAplicados.oficio || undefined,
      id_municipio: filtrosAplicados.municipio || undefined,
      calificacion_minima: filtrosAplicados.reputacion || undefined,
      signal: controlador.signal,
    })
      .then((datos) => {
        if (controlador.signal.aborted) return
        setPerfiles(Array.isArray(datos) ? datos : [])
        setErrorPerfiles('')
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controlador.signal.aborted) {
          setErrorPerfiles('No se pudo cargar el catálogo. Intenta de nuevo.')
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargandoPerfiles(false)
      })

    return () => controlador.abort()
  }, [filtrosAplicados])

  const handleBuscar = () => {
    setCargandoPerfiles(true)
    setErrorPerfiles('')
    setFiltrosAplicados({ ...filtros })
  }

  return (
    <div className="catalogo-pagina">
      <Header estilo="cat" botonActivo="catalogo" />

      <div className="catalogo-fondo-azul">
        <div className="contenedor-centrado">
          <div className="catalogo-cabecera">
            <p className="ruta-migajas">Inicio / Catálogo</p>
            <h1>Catálogo de profesionales</h1>
            <p className="subtitulo">Encuentra el oficio que necesitas en Oaxaca de Juárez y alrededores.</p>
          </div>

          <div className="barra-filtros">
            <div className="filtro-caja">
              <span className="filtro-icono"><LlaveIcono /></span>
              <div className="filtro-contenido">
                <label htmlFor="cat-oficio">TIPO DE OFICIO</label>
                <select
                  id="cat-oficio"
                  value={filtros.oficio}
                  onChange={(e) => setFiltros((actual) => ({ ...actual, oficio: e.target.value }))}
                >
                  <option value="">Todos los oficios</option>
                  {listaOficios.map((oficio) => (
                    <option key={oficio.id_oficio} value={oficio.id_oficio.toString()}>{oficio.nombre}</option>
                  ))}
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><PinIcono /></span>
              <div className="filtro-contenido">
                <label htmlFor="cat-municipio">ZONA DE SERVICIO</label>
                <select
                  id="cat-municipio"
                  value={filtros.municipio}
                  onChange={(e) => setFiltros((actual) => ({ ...actual, municipio: e.target.value }))}
                >
                  <option value="">Todas las zonas</option>
                  {listaMunicipios.map((muni) => (
                    <option key={muni.id_municipio} value={muni.id_municipio.toString()}>{muni.municipio}</option>
                  ))}
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><EstrellaFiltroIcono /></span>
              <div className="filtro-contenido">
                <label htmlFor="cat-reputacion">REPUTACIÓN MÍNIMA</label>
                <select
                  id="cat-reputacion"
                  value={filtros.reputacion}
                  onChange={(e) => setFiltros((actual) => ({ ...actual, reputacion: e.target.value }))}
                >
                  <option value="">Todas las calificaciones</option>
                  <option value="4">4 estrellas o más</option>
                  <option value="3">3 estrellas o más</option>
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <button type="button" className="btn-ver-resultados" onClick={handleBuscar}>
              <CirculoVacioIcono /> Ver resultados
            </button>
          </div>
        </div>
      </div>

      <div className="catalogo-contenido-inferior">
        <div className="contenedor-centrado">
          <div className="cabecera-resultados">
            <div className="resultados-textos">
              <h2>{perfiles.length} perfiles de profesionales</h2>
              <p className="res-ubicacion">En Oaxaca de Juárez y alrededores</p>
              <p className="res-ayuda">Todos los oficios y calificaciones. Usa los filtros para afinar tu búsqueda.</p>
            </div>

            <div className="selector-orden">
              <select aria-label="Ordenar resultados">
                <option>Ordenar: Recomendados</option>
              </select>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>
          </div>

          {errorFiltros && <p role="alert" style={{ textAlign: 'center', margin: '20px 0' }}>{errorFiltros}</p>}

          {errorPerfiles ? (
            <p role="alert" style={{ textAlign: 'center', margin: '40px 0' }}>{errorPerfiles}</p>
          ) : cargandoPerfiles ? (
            <p style={{ textAlign: 'center', margin: '40px 0' }}>Buscando profesionales...</p>
          ) : perfiles.length === 0 ? (
            <div style={{ textAlign: 'center', margin: '40px 0', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <h3 style={{ color: '#475569', marginBottom: '8px' }}>No se encontraron trabajadores</h3>
              <p style={{ color: '#64748b' }}>Prueba modificando tus filtros o eliminando la especialidad seleccionada.</p>
            </div>
          ) : (
            <div className="grid-perfiles">
              {perfiles.map((perfil) => (
                <TarjetaPerfil key={perfil.id_trabajador} perfil={perfil} />
              ))}
            </div>
          )}

          <div className="paginacion-contenedor">
            <span className="paginacion-texto">Mostrando resultados</span>
            <div className="paginacion-botones">
              <button type="button" className="btn-pagina activo">1</button>
              <button type="button" className="btn-pagina btn-siguiente">
                Siguiente <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer className="cat-footer" />
    </div>
  )
}

export default Catalogo
