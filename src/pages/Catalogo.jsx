import React, { useState } from 'react';
import logo from '../assets/registro-logo-provisional.png';
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

const Catalogo = ({ nombreUsuario = "Uriel", cerrarSesion }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [oficioActivo, setOficioActivo] = useState(1);

  const botonesOficios = [
    { id: 1, nombre: "Todos los oficios", count: 96, icono: <GridIcono /> },
    { id: 2, nombre: "Plomeros", count: 24, icono: <GotaIcono /> },
    { id: 3, nombre: "Electricistas", count: 18, icono: <RayoIcono /> },
    { id: 4, nombre: "Carpinteros", count: 20, icono: <MartilloIcono /> },
    { id: 5, nombre: "Herreros", count: 16, icono: <YunqueIcono /> },
    { id: 6, nombre: "Pintores", count: 18, icono: <RodilloIcono /> },
  ];

  const perfiles = [
    { id: 1, nombre: "Carlos Mendoza", oficio: "Plomero • 12 años de experiencia", rating: "4.9", resenas: 128, tags: ["Fugas", "Instalaciones", "Calentadores"], ubicacion: "Centro, Oaxaca de Juárez", estado: "Horario publicado", horario: "Jueves 15 · 14:00-18:00", tipoHorario: "verde", img: "https://i.pravatar.cc/300?img=11" },
    { id: 2, nombre: "Elena Vargas", oficio: "Electricista • 9 años de experiencia", rating: "4.9", resenas: 104, tags: ["Iluminación", "Instalaciones eléctricas"], ubicacion: "Santa Cruz Xoxocotlán", estado: "Disponible hoy", horario: "Hoy, 16:00-19:00", tipoHorario: "verde", img: "https://i.pravatar.cc/300?img=5" },
    { id: 3, nombre: "Luis Hernández", oficio: "Carpintero • 10 años de experiencia", rating: "4.8", resenas: 87, tags: ["Muebles", "Cocinas", "Reparaciones"], ubicacion: "Santa Lucía del Camino", estado: "Disponible hoy", horario: "Hoy, 15:00-19:00", tipoHorario: "verde", img: "https://i.pravatar.cc/300?img=8" },
    { id: 4, nombre: "Diego Martínez", oficio: "Electricista • 11 años de experiencia", rating: "4.8", resenas: 92, tags: ["Tableros", "Cableado", "Mantenimiento"], ubicacion: "Santa Cruz Xoxocotlán", estado: "Disponible mañana", horario: "Mañana, 09:00-13:00", tipoHorario: "azul", img: "https://i.pravatar.cc/300?img=12" },
    { id: 5, nombre: "Mateo Santiago", oficio: "Herrero • 13 años de experiencia", rating: "4.8", resenas: 81, tags: ["Puertas", "Rejas", "Estructuras metálicas"], ubicacion: "San Antonio de la Cal", estado: "Disponible mañana", horario: "Mañana, 08:00-12:00", tipoHorario: "azul", img: "https://i.pravatar.cc/300?img=59" },
    { id: 6, nombre: "Sofía Pérez", oficio: "Pintora • 7 años de experiencia", rating: "4.9", resenas: 58, tags: ["Interiores", "Fachadas", "Acabados"], ubicacion: "Centro, Oaxaca de Juárez", estado: "Disponible hoy", horario: "Hoy, 16:00-18:00", tipoHorario: "verde", img: "https://i.pravatar.cc/300?img=41" },
  ];

  return (
    <div className="catalogo-pagina">
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR BLANCA */}
      <header className="cat-header">
        <a href="/" className="cat-logo"><img src={logo} alt="TrabajITO" /></a>
        <nav className="cat-nav">
           <a href="#inicio">Inicio</a>
           <a href="#buscar" className="activo">Buscar trabajadores</a>
        </nav>
        
        <div className="cat-usuario-contenedor">
          <div className="cat-iconos-notificacion">
            <CampanaIcono />
            <CorreoIcono />
          </div>
          
          <button className="cat-perfil" onClick={() => setMenuAbierto(!menuAbierto)}>
            Bienvenido {nombreUsuario} <span style={{fontSize: '12px', marginLeft: '4px'}}>v</span>
          </button>

          {menuAbierto && (
            <div className="cat-menu-desplegable">
              <button>Ver perfil</button>
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      {/* --- FONDO AZUL --- */}
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
                <select><option>Todos los oficios</option></select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><AjustesIcono /></span>
              <div className="filtro-contenido">
                <label>ESPECIALIDAD</label>
                <select><option>Todas las especialidades</option></select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><PinIcono /></span>
              <div className="filtro-contenido">
                <label>ZONA DE SERVICIO</label>
                <select><option>Todas las zonas</option></select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <div className="filtro-caja">
              <span className="filtro-icono"><EstrellaFiltroIcono /></span>
              <div className="filtro-contenido">
                <label>REPUTACIÓN</label>
                <select><option>Todas las calificaciones</option></select>
              </div>
              <span className="filtro-chevron"><ChevronIcono /></span>
            </div>

            <button className="btn-ver-resultados">
              <CirculoVacioIcono /> Ver resultados
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO INFERIOR BLANCO --- */}
      <div className="catalogo-contenido-inferior">
        <div className="contenedor-centrado">
          
          <h3 className="titulo-explora">Explora por oficio</h3>
          
          <div className="contenedor-botones-oficios">
            {botonesOficios.map(btn => (
              <button 
                key={btn.id} 
                className={`btn-oficio ${oficioActivo === btn.id ? 'activo' : ''}`}
                onClick={() => setOficioActivo(btn.id)}
              >
                <span className="icono-btn">{btn.icono}</span>
                {btn.nombre}
                <span className="badge">{btn.count}</span>
              </button>
            ))}
          </div>

          <div className="cabecera-resultados">
            <div className="resultados-textos">
              <h2>96 perfiles de profesionales</h2>
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

          {/* --- CUADRÍCULA DE PERFILES --- */}
          <div className="grid-perfiles">
            {perfiles.map(perfil => (
              <div key={perfil.id} className="tarjeta-perfil">
                <img src={perfil.img} alt={perfil.nombre} className="perfil-img" />
                <div className="perfil-info">
                  <h3 className="perfil-nombre">{perfil.nombre}</h3>
                  <p className="perfil-oficio">{perfil.oficio}</p>
                  
                  <div className="perfil-rating">
                    <EstrellaIcono /> {perfil.rating} <small>({perfil.resenas} opiniones)</small>
                  </div>
                  
                  <p className="perfil-tags">{perfil.tags.join(' · ')}</p>
                  
                  <p className="perfil-ubicacion"><UbicacionIcono /> {perfil.ubicacion}</p>
                  
                  <div className={`perfil-horario horario-${perfil.tipoHorario}`}>
                    <RelojIcono />
                    <div className="horario-textos">
                      <span className="horario-titulo">{perfil.estado}</span>
                      <span className="horario-detalle">{perfil.horario}</span>
                    </div>
                  </div>
                  
                  <button className="btn-ver-perfil">Ver perfil</button>
                </div>
              </div>
            ))}
          </div>

          {/* --- PAGINACIÓN --- */}
          <div className="paginacion-contenedor">
            <span className="paginacion-texto">Mostrando 1-6 de 96 perfiles</span>
            <div className="paginacion-botones">
              <button className="btn-pagina activo">1</button>
              <button className="btn-pagina">2</button>
              <button className="btn-pagina">3</button>
              <span className="btn-pagina-puntos">...</span>
              <button className="btn-pagina">16</button>
              <button className="btn-pagina btn-siguiente">
                Siguiente <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- FOOTER AZUL OSCURO --- */}
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