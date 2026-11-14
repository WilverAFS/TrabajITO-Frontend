import React, { useState, useEffect } from 'react';
import logo from '../assets/registro-logo-provisional.png';
import { useNavigate } from 'react-router';
import './Catalogo.css';

// --- ICONOS DE LA BARRA DE NAVEGACIÓN ---
function CampanaIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
function CorreoIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }

// --- ICONOS DE LOS FILTROS SUPERIORES ---
function LlaveIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> }
function AjustesIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg> }
function PinIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> }
function EstrellaFiltroIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> }
function CirculoVacioIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg> }
function ChevronIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg> }

// --- ICONOS DE LOS BOTONES DE OFICIOS ---
function GridIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> }
function GotaIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg> }
function RayoIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> }
function MartilloIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12l-8.5 8.5c-.8.8-2.1.8-2.8 0s-.8-2.1 0-2.8L12 9.2"/><path d="M17.6 2l-2.4 2.4c-.4.4-.4 1 0 1.4l4.6 4.6c.4.4 1 .4 1.4 0L23.6 8a2 2 0 0 0 0-2.8l-3.2-3.2a2 2 0 0 0-2.8 0z"/></svg> }
function YunqueIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10H5.33A2.33 2.33 0 0 1 3 7.67V6h18v1.67A2.33 2.33 0 0 1 18.67 10H17"/><path d="M9 10v4"/><path d="M15 10v4"/><path d="M7 14h10v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4z"/></svg> }
function RodilloIcono() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><path d="M7 11.5L12.5 17"/></svg> }

// --- ICONOS DE LAS TARJETAS ---
function EstrellaIcono() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> }
function UbicacionIcono() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg> }
function RelojIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> }

const Catalogo = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  // Estados de datos
  const [usuarioActual, setUsuarioActual] = useState("Invitado");
  const [perfiles, setPerfiles] = useState([]);
  const [cargandoPerfiles, setCargandoPerfiles] = useState(false);
  
  // Catálogos para los selects
  const [listaOficios, setListaOficios] = useState([]);
  const [listaMunicipios, setListaMunicipios] = useState([]);

  // Estados de los filtros
  const [filtroOficio, setFiltroOficio] = useState("");
  const [filtroMunicipio, setFiltroMunicipio] = useState("");
  const [filtroReputacion, setFiltroReputacion] = useState("");

  // 1. Cargar usuario conectado
  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8000/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const result = await response.json();
        if (result.success) {
          setUsuarioActual(result.data.nombre);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  // 2. Cargar opciones para los filtros
  useEffect(() => {
    const cargarFiltrosBasicos = async () => {
      try {
        const oficiosRes = await fetch('http://localhost:8000/api/v1/oficios', { headers: { 'Accept': 'application/json' } });
        const oficiosData = await oficiosRes.json();
        if (oficiosData.success) setListaOficios(oficiosData.data);

        const muniRes = await fetch('http://localhost:8000/api/v1/estados/1/municipios', { headers: { 'Accept': 'application/json' } });
        const muniData = await muniRes.json();
        if (muniData.success) setListaMunicipios(muniData.data);
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error);
      }
    };
    cargarFiltrosBasicos();
  }, []);

  // 3. Función principal para cargar el catálogo con filtros
  const cargarCatálogo = async () => {
    setCargandoPerfiles(true);
    try {
      let url = 'http://localhost:8000/api/v1/trabajadores?page=1';
      
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

  // Función corregida para los botones de oficios
  const handleOficioClick = (idOficio) => {
    // Si hacemos clic en el mismo que ya está activo, lo desmarcamos
    const nuevoId = filtroOficio === idOficio ? "" : idOficio;
    
    setFiltroOficio(nuevoId);
    
    setTimeout(() => {
      setCargandoPerfiles(true);
      let url = 'http://localhost:8000/api/v1/trabajadores?page=1';
      
      if (nuevoId) url += `&id_oficio=${nuevoId}`;
      if (filtroMunicipio) url += `&id_municipio=${filtroMunicipio}`;
      if (filtroReputacion) url += `&calificacion_minima=${filtroReputacion}`;

      fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(res => res.json())
        .then(result => {
          if (result.success) setPerfiles(result.data);
        })
        .finally(() => setCargandoPerfiles(false));
    }, 50);
  };

  // 4. Implementación del Cierre de Sesión
  const manejarCerrarSesion = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const botonesOficios = [
    { id: "", nombre: "Todos los oficios", icono: <GridIcono /> },
    { id: "2", nombre: "Plomeros", icono: <GotaIcono /> },
    { id: "1", nombre: "Electricistas", icono: <RayoIcono /> },
    { id: "4", nombre: "Carpinteros", icono: <MartilloIcono /> },
    { id: "5", nombre: "Herreros", icono: <YunqueIcono /> },
    { id: "6", nombre: "Pintores", icono: <RodilloIcono /> },
  ];

  return (
    <div className="catalogo-pagina">
      
      {/* BARRA DE NAVEGACIÓN */}
      <header className="cat-header">
        <a href="/" className="cat-logo"><img src={logo} alt="TrabajITO" /></a>
        <nav className="cat-nav">
           <button onClick={() => navigate('/inicio')} className="cat-btn-enlace">Inicio</button>
           <button className="cat-btn-enlace activo">Buscar trabajadores</button>
        </nav>
        
        <div className="cat-usuario-contenedor">
          <div className="cat-iconos-notificacion">
            <CampanaIcono />
            <CorreoIcono />
          </div>
          
          <button className="cat-perfil" onClick={() => setMenuAbierto(!menuAbierto)}>
            Bienvenido {usuarioActual} <span style={{fontSize: '12px', marginLeft: '4px'}}>v</span>
          </button>

          {menuAbierto && (
            <div className="cat-menu-desplegable">
              <button onClick={() => { setMenuAbierto(false); navigate('/mi-perfil'); }}>Ver perfil</button>
              <button onClick={manejarCerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      {/* FONDO AZUL */}
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
          
          <h3 className="titulo-explora">Explora por oficio</h3>
          
          <div className="contenedor-botones-oficios">
            {botonesOficios.map(btn => (
              <button 
                key={btn.nombre} 
                className={`btn-oficio ${filtroOficio === btn.id ? 'activo' : ''}`}
                onClick={() => handleOficioClick(btn.id)}
              >
                <span className="icono-btn">{btn.icono}</span>
                {btn.nombre}
              </button>
            ))}
          </div>

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

          {/* CUADRÍCULA DE PERFILES DINÁMICA */}
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
                <div key={perfil.id_trabajador} className="tarjeta-perfil">
                  <img src={`https://i.pravatar.cc/300?u=${perfil.id_trabajador}`} alt={perfil.nombre_completo} className="perfil-img" />
                  <div className="perfil-info">
                    <h3 className="perfil-nombre">{perfil.nombre_completo}</h3>
                    
                    <p className="perfil-oficio">
                      {perfil.oficios?.length > 0 ? perfil.oficios[0].nombre : "Sin oficio registrado"}
                    </p>
                    
                    <div className="perfil-rating">
                      <EstrellaIcono /> {perfil.calificacion_promedio ?? "0.0"} <small>({perfil.total_valoraciones ?? 0} opiniones)</small>
                    </div>
                    
                    <p className="perfil-tags">{perfil.descripcion?.substring(0, 40)}...</p>
                    
                    <p className="perfil-ubicacion"><UbicacionIcono /> {perfil.municipio?.municipio}, {perfil.estado?.estado}</p>
                    
                    <div className="perfil-horario horario-verde">
                      <RelojIcono />
                      <div className="horario-textos">
                        <span className="horario-titulo">Disponible</span>
                        <span className="horario-detalle">Consulta disponibilidad</span>
                      </div>
                    </div>
                    
                    <button className="btn-ver-perfil" onClick={() => navigate(`/perfiles/${perfil.id_trabajador}`)}>Ver perfil</button>
                  </div>
                </div>
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

      <footer className="cat-footer">
        <div className="contenedor-centrado footer-contenido">
          <div className="footer-logo-seccion">
            <img src={logo} alt="TrabajITO" className="footer-logo" />
            <p>Conectamos clientes con trabajadores de oficio.</p>
          </div>
          
          <div className="footer-abajo">
            <p>© 2026 TrabajITO. Hecho para conectar.</p>
            <div className="footer-enlaces">
              <a href="#privacidad">Privacidad</a>
              <span>-</span>
              <a href="#terminos">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Catalogo;