import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TarjetaPerfil from '../components/TarjetaPerfil'
import { Paginacion } from '../components/ui/Interfaz.jsx'
import {
  LlaveIcono, PinIcono, EstrellaFiltroIcono,
  CirculoVacioIcono, ChevronIcono,
} from '../components/Iconos'
import { listarEstados, listarMunicipios, listarOficios } from '../services/catalogosApi.js'
import { listarTrabajadores } from '../services/trabajadoresApi.js'
import './Catalogo.css'
import { validarBusqueda } from '../utils/validaciones.js'
const FILTROS_VACIOS = {
  buscar: '',
  oficio: '',
  estado: '1',
  municipio: '',
  reputacion: '',
}

const OPCIONES_ORDEN = {
  recomendados: { sort: undefined, direction: undefined },
  reputacion_desc: { sort: 'reputacion', direction: 'desc' },
  recientes: { sort: 'fecha_registro', direction: 'desc' },
  antiguos: { sort: 'fecha_registro', direction: 'asc' },
}

export default function Catalogo() {
  const [perfiles, setPerfiles] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [orden, setOrden] = useState('recomendados')

  const [cargandoPerfiles, setCargandoPerfiles] = useState(true)
  const [errorPerfiles, setErrorPerfiles] = useState('')

  const [listaOficios, setListaOficios] = useState([])
  const [listaEstados, setListaEstados] = useState([])
  const [listaMunicipios, setListaMunicipios] = useState([])
  const [errorFiltros, setErrorFiltros] = useState('')

  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS)

  // 1. Cargar oficios y estados una sola vez
  useEffect(() => {
    const controlador = new AbortController()

    Promise.all([
      listarOficios({ signal: controlador.signal }),
      listarEstados({ signal: controlador.signal }),
    ])
      .then(([oficios, estados]) => {
        if (controlador.signal.aborted) return
        setListaOficios(Array.isArray(oficios) ? oficios : [])
        setListaEstados(Array.isArray(estados) ? estados : [])
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controlador.signal.aborted) {
          setErrorFiltros('No se pudieron cargar las opciones de búsqueda.')
        }
      })

    return () => controlador.abort()
  }, [])

  // 2. Cargar municipios cuando cambia el estado seleccionado
  useEffect(() => {
    if (!filtros.estado) return
      const controlador = new AbortController()

    listarMunicipios(filtros.estado, { signal: controlador.signal })
      .then((municipios) => {
        if (controlador.signal.aborted) return
        setListaMunicipios(Array.isArray(municipios) ? municipios : [])
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controlador.signal.aborted) {
          setListaMunicipios([])
        }
      })

    return () => controlador.abort()
  }, [filtros.estado])

  // 3. Cargar trabajadores con filtros, orden y página real
  useEffect(() => {
    const controlador = new AbortController()
    const { sort, direction } = OPCIONES_ORDEN[orden] || {}

    listarTrabajadores({
      pagina,
      buscar: filtrosAplicados.buscar.trim() || undefined,
      id_oficio: filtrosAplicados.oficio || undefined,
      id_municipio: filtrosAplicados.municipio || undefined,
      calificacion_minima: filtrosAplicados.reputacion || undefined,
      sort,
      direction,
      conMeta: true,
      signal: controlador.signal,
    })
      .then((respuesta) => {
        if (controlador.signal.aborted) return
        const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data ?? [])
        setPerfiles(Array.isArray(lista) ? lista : [])
        setMeta(respuesta?.meta ?? null)
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
  }, [filtrosAplicados, pagina, orden])

const handleBuscar = (evento) => {
  evento.preventDefault()
  const errorBusqueda = validarBusqueda(filtros.buscar)
  if (errorBusqueda) {
    setErrorFiltros(errorBusqueda)
    return
  }
  setErrorFiltros('')
  setErrorPerfiles('')
  setCargandoPerfiles(true)
  setPagina(1)
  setFiltrosAplicados({ ...filtros })
}
  const handleCambioEstado = (nuevoEstado) => {
    setFiltros((actual) => ({ ...actual, estado: nuevoEstado, municipio: '' }))
    if (!nuevoEstado) setListaMunicipios([])
  }

  const handleCambioOrden = (nuevoOrden) => {
    setCargandoPerfiles(true)
    setOrden(nuevoOrden)
    setPagina(1)
  }

  const handleCambioPagina = (nuevaPagina) => {
    setCargandoPerfiles(true)
    setPagina(nuevaPagina)
  }

  return (
    <div className="catalogo-pagina">
      <Header botonActivo="catalogo" />

      <main>
        <div className="catalogo-fondo-azul">
          <div className="contenedor-centrado">
            <div className="catalogo-cabecera">
              <p className="ruta-migajas">Inicio / Catálogo</p>
              <h1>Catálogo de profesionales</h1>
              <p className="subtitulo">Encuentra el oficio que necesitas en Oaxaca de Juárez y alrededores.</p>
            </div>

            <form className="barra-filtros" onSubmit={handleBuscar}>
              <div className="filtro-caja filtro-busqueda">
                <div className="filtro-contenido">
                  <label htmlFor="cat-buscar">BUSCAR</label>
                  <input
                    id="cat-buscar"
                    type="search"
                    maxLength={150}
                    placeholder="Nombre, oficio o servicio..."
                    value={filtros.buscar}
                    onChange={(e) => setFiltros((actual) => ({ ...actual, buscar: e.target.value }))}
                  />
                </div>
              </div>

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
                  <label htmlFor="cat-estado">ESTADO</label>
                  <select
                    id="cat-estado"
                    value={filtros.estado}
                    onChange={(e) => handleCambioEstado(e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    {listaEstados.map((est) => (
                      <option key={est.id_estado} value={est.id_estado.toString()}>{est.estado}</option>
                    ))}
                  </select>
                </div>
                <span className="filtro-chevron"><ChevronIcono /></span>
              </div>

              <div className="filtro-caja">
                <span className="filtro-icono"><PinIcono /></span>
                <div className="filtro-contenido">
                  <label htmlFor="cat-municipio">MUNICIPIO</label>
                  <select
                    id="cat-municipio"
                    value={filtros.municipio}
                    disabled={!filtros.estado}
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
                  <label htmlFor="cat-reputacion">REPUTACIÓN</label>
                  <select
                    id="cat-reputacion"
                    value={filtros.reputacion}
                    onChange={(e) => setFiltros((actual) => ({ ...actual, reputacion: e.target.value }))}
                  >
                    <option value="">Todas</option>
                    <option value="4">4 estrellas o más</option>
                    <option value="3">3 estrellas o más</option>
                  </select>
                </div>
                <span className="filtro-chevron"><ChevronIcono /></span>
              </div>

              <button type="submit" className="btn-ver-resultados">
                <CirculoVacioIcono /> Ver resultados
              </button>
            </form>
          </div>
        </div>

        <div className="catalogo-contenido-inferior">
          <div className="contenedor-centrado">
            <div className="cabecera-resultados">
              <div className="resultados-textos">
                <h2>{meta?.total ?? perfiles.length} perfiles de profesionales</h2>
                <p className="res-ubicacion">En Oaxaca de Juárez y alrededores</p>
                <p className="res-ayuda">Usa la búsqueda y los filtros para afinar tus resultados.</p>
              </div>

              <div className="selector-orden">
                <select
                  aria-label="Ordenar resultados"
                  value={orden}
                  onChange={(e) => handleCambioOrden(e.target.value)}
                >
                  <option value="recomendados">Ordenar: Recomendados</option>
                  <option value="reputacion_desc">Mejor calificación</option>
                  <option value="recientes">Más recientes</option>
                  <option value="antiguos">Más antiguos</option>
                </select>
                <span className="filtro-chevron"><ChevronIcono /></span>
              </div>
            </div>

            {errorFiltros && <p role="alert" style={{ textAlign: 'center', margin: '20px 0' }}>{errorFiltros}</p>}

            {errorPerfiles ? (
              <p role="alert" style={{ textAlign: 'center', margin: '40px 0' }}>{errorPerfiles}</p>
            ) : cargandoPerfiles ? (
              <p role="status" style={{ textAlign: 'center', margin: '40px 0' }}>Buscando profesionales...</p>
            ) : perfiles.length === 0 ? (
              <div style={{ textAlign: 'center', margin: '40px 0', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <h3 style={{ color: '#475569', marginBottom: '8px' }}>No se encontraron trabajadores</h3>
                <p style={{ color: '#64748b' }}>Prueba modificando tus filtros o tu búsqueda.</p>
              </div>
            ) : (
              <div className="grid-perfiles">
                {perfiles.map((perfil) => (
                  <TarjetaPerfil key={perfil.id_trabajador} perfil={perfil} />
                ))}
              </div>
            )}

            <Paginacion
              meta={meta}
              cambiar={handleCambioPagina}
              cargando={cargandoPerfiles}
            />
          </div>
        </div>
      </main>

      <Footer className="cat-footer" />
    </div>
  )
}