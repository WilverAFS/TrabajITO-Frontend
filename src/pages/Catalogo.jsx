import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TarjetaPerfil from '../components/TarjetaPerfil';
import { 
  LlaveIcono, PinIcono, EstrellaFiltroIcono, 
  CirculoVacioIcono, ChevronIcono 
} from '../components/Iconos';
import './Catalogo.css';

const Catalogo = () => {
  // Estados de datos
  const [perfiles, setPerfiles] = useState([]);
  const [cargandoPerfiles, setCargandoPerfiles] = useState(false);
  
  // Catálogos para los selects
  const [listaOficios, setListaOficios] = useState([]);
  const [listaMunicipios, setListaMunicipios] = useState([]);

  // Estados de los filtros
  const [filtroOficio, setFiltroOficio] = useState("");
  const [filtroMunicipio, setFiltroMunicipio] = useState("");
  const [filtroReputacion, setFiltroReputacion] = useState("");

  // 1. Cargar opciones para los filtros
  useEffect(() => {
    const cargarFiltrosBasicos = async () => {
      try {
        const oficiosRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/oficios`, { headers: { 'Accept': 'application/json' } });
        const oficiosData = await oficiosRes.json();
        if (oficiosData.success) setListaOficios(oficiosData.data);

        const muniRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/estados/1/municipios`, { headers: { 'Accept': 'application/json' } });
        const muniData = await muniRes.json();
        if (muniData.success) setListaMunicipios(muniData.data);
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error);
      }
    };
    cargarFiltrosBasicos();
  }, []);

  // 2. Función principal para cargar el catálogo con filtros
  const cargarCatálogo = async () => {
    setCargandoPerfiles(true);
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/trabajadores?page=1`;
      
      if (filtroOficio) url += `&id_oficio=${filtroOficio}`;
      if (filtroMunicipio) url += `&id_municipio=${filtroMunicipio}`;
      if (filtroReputacion) url += `&calificacion_minima=${filtroReputacion}`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        setPerfiles(result.data);
      }
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setCargandoPerfiles(false);
    }
  };

  useEffect(() => {
    cargarCatálogo();
  }, []);

  const handleBuscar = () => {
    cargarCatálogo();
  };

  return (
    <div className="catalogo-pagina">
      
      {/* 1. HEADER REUTILIZABLE */}
      <Header estilo="cat" botonActivo="catalogo" />

      {/* FONDO AZUL CON FILTROS */}
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
                <label>TIPO DE OFICIO</label>
                <select value={filtroOficio} onChange={(e) => setFiltroOficio(e.target.value)}>
                  <option value="">Todos los oficios</option>
                  {listaOficios.map(oficio => (
                    <option key={oficio.id_oficio} value={oficio.id_oficio.toString()}>{oficio.nombre}</option>
                  ))}
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><PinIcono /></span>
              <div className="filtro-contenido">
                <label>ZONA DE SERVICIO</label>
                <select value={filtroMunicipio} onChange={(e) => setFiltroMunicipio(e.target.value)}>
                  <option value="">Todas las zonas</option>
                  {listaMunicipios.map(muni => (
                    <option key={muni.id_municipio} value={muni.id_municipio.toString()}>{muni.municipio}</option>
                  ))}
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><EstrellaFiltroIcono /></span>
              <div className="filtro-contenido">
                <label>REPUTACIÓN MÍNIMA</label>
                <select value={filtroReputacion} onChange={(e) => setFiltroReputacion(e.target.value)}>
                  <option value="">Todas las calificaciones</option>
                  <option value="4">4 estrellas o más</option>
                  <option value="3">3 estrellas o más</option>
                </select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <button className="btn-ver-resultados" onClick={handleBuscar}>
              <CirculoVacioIcono /> Ver resultados
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO INFERIOR */}
      <div className="catalogo-contenido-inferior">
        <div className="contenedor-centrado">
          
          <div className="cabecera-resultados">
            <div className="resultados-textos">
              <h2>{perfiles.length} perfiles de profesionales</h2>
              <p className="res-ubicacion">En Oaxaca de Juárez y alrededores</p>
              <p className="res-ayuda">Todos los oficios y calificaciones. Usa los filtros para afinar tu búsqueda.</p>
            </div>
            
            <div className="selector-orden">
              <select>
                <option>Ordenar: Recomendados</option>
              </select>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>
          </div>

          {/* 2. CUADRÍCULA DE PERFILES REUTILIZABLE */}
          {cargandoPerfiles ? (
            <p style={{textAlign: 'center', margin: '40px 0'}}>Buscando profesionales...</p>
          ) : perfiles.length === 0 ? (
            <div style={{textAlign: 'center', margin: '40px 0', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px'}}>
              <h3 style={{color: '#475569', marginBottom: '8px'}}>No se encontraron trabajadores</h3>
              <p style={{color: '#64748b'}}>Prueba modificando tus filtros o eliminando la especialidad seleccionada.</p>
            </div>
          ) : (
            <div className="grid-perfiles">
              {perfiles.map(perfil => (
                <TarjetaPerfil key={perfil.id_trabajador} perfil={perfil} />
              ))}
            </div>
          )}

          <div className="paginacion-contenedor">
            <span className="paginacion-texto">Mostrando resultados</span>
            <div className="paginacion-botones">
              <button className="btn-pagina activo">1</button>
              <button className="btn-pagina btn-siguiente">
                Siguiente <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FOOTER REUTILIZABLE */}
      <Footer className="cat-footer" />

    </div>
  );
};

export default Catalogo;