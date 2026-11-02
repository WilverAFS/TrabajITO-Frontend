import { useState } from 'react';
import logo from '../assets/registro-logo-provisional.png';
import hero from '../assets/registro-hero-provisional.png';
import './Inicio.css';

// --- ICONOS SVG ---
function CampanaIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
function CorreoIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
function CheckIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"></path></svg> }
function CirculoIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="#198754"></circle></svg> }
function PlomeroIcono() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg> }
function RayoIcono() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> }
function MartilloIcono() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 12l-8.5 8.5c-.8.8-2.1.8-2.8 0s-.8-2.1 0-2.8L12 9.2"/><path d="M17.6 2l-2.4 2.4c-.4.4-.4 1 0 1.4l4.6 4.6c.4.4 1 .4 1.4 0L23.6 8a2 2 0 0 0 0-2.8l-3.2-3.2a2 2 0 0 0-2.8 0z"/></svg> }
function LlaveIcono() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> }
function PinturaIcono() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><path d="M7 11.5L12.5 17"/></svg> }
function EstrellaIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> }
function UbicacionIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg> }
function RelojIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> }
export default function Inicio({ cerrarSesion, nombreUsuario }) {
  // Estado para controlar si el menú del usuario está abierto o cerrado

  const [menuAbierto, setMenuAbierto] = useState(false);
  const oficios = [
    { id: 1, nombre: "Plomeros", desc: "Fugas e instalaciones", icono: <PlomeroIcono /> },
    { id: 2, nombre: "Electricistas", desc: "Conexiones seguras", icono: <RayoIcono /> },
    { id: 3, nombre: "Carpinteros", desc: "Muebles a tu medida", icono: <MartilloIcono /> },
    { id: 4, nombre: "Herreros", desc: "Metal y estructuras", icono: <LlaveIcono /> },
    { id: 5, nombre: "Pintores", desc: "Espacios renovados", icono: <PinturaIcono /> },
  ];
  const destacados = [
    { id: 1, nombre: "Carlos Mendoza", oficio: "Plomero • 12 años de experiencia", rating: "4.9", resenas: 128, tags: ["Fugas", "Instalaciones", "Calentadores"], ubicacion: "Centro, Oaxaca de Juárez", estado: "Horario publicado", horario: "Jueves 15 · 14:00-18:00", img: "https://i.pravatar.cc/150?img=11" },
    { id: 2, nombre: "Elena Vargas", oficio: "Electricista • 9 años de experiencia", rating: "4.9", resenas: 104, tags: ["Iluminación", "Instalaciones eléctricas"], ubicacion: "Santa Cruz Xoxocotlán", estado: "Disponible hoy", horario: "Hoy, 16:00-19:00", img: "https://i.pravatar.cc/150?img=5" },
    { id: 3, nombre: "Luis Hernández", oficio: "Carpintero • 10 años de experiencia", rating: "4.8", resenas: 92, tags: ["Muebles", "Cocinas", "Reparaciones"], ubicacion: "Santa Lucía del Camino", estado: "Disponible hoy", horario: "Hoy, 15:00-19:00", img: "https://i.pravatar.cc/150?img=8" },
  ];
  return (
    <div className="in-pagina">
      <header className="in-header">
        <a href="/" className="in-logo"><img src={logo} alt="TrabajITO" /></a>
        <nav className="in-nav">
           <a href="#inicio" className="activo">Inicio</a>
           <a href="#buscar">Buscar trabajadores</a>
        </nav>
        
        <div className="in-usuario-contenedor">
          <div className="in-iconos-notificacion">
            <CampanaIcono />
            <CorreoIcono />
          </div>
          
          <button 
            className="in-perfil" 
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            Bienvenido {nombreUsuario} ⌄
          </button>

          {/* Menú desplegable */}
          {menuAbierto && (
            <div className="in-menu-desplegable">
              <button>Ver perfil</button>
              <button onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="in-contenido-principal">
        {/* Bloque superior: Texto e Imagen */}
        <section className="in-hero-superior">
          <div className="in-hero-texto">
            <span className="in-etiqueta"><CirculoIcono /> Gente de confianza, cerca de ti</span>
            <h1>Encuentra profesionales<br/>en Oaxaca.</h1>
            <p>Explora perfiles, especialidades, portafolio y horarios publicados por trabajadores de Oaxaca.</p>
            
            <div className="in-caracteristicas">
              <span><CheckIcono /> Perfiles con especialidades</span>
              <span><CheckIcono /> Horarios publicados</span>
            </div>
          </div>

          <div className="in-hero-imagen">
            <img src={hero} alt="Profesionales trabajando" />
          </div>
        </section>

        {/* Bloque inferior: Buscador de ancho completo */}
        <section className="in-buscador-seccion">
          <div className="in-buscador-contenedor">
            <label>¿Qué necesitas resolver hoy, {nombreUsuario}?</label>
            <div className="in-buscador">
              <div className="in-buscador-input">
                <span className="in-circulo-vacio"></span>
                <div>
                  <small>TIPO DE OFICIO</small>
                  <input type="text" placeholder="Selecciona un oficio" />
                </div>
              </div>
              <button onClick={() => window.location.href = '#catalogo'}>
                Buscar trabajadores
              </button>
            </div>
          </div>
        </section>
        {/* Sección: Oficios disponibles */}
        <section id="catalogo" className="in-seccion-catalogo">
          <div className="in-seccion-header">
            <h2>Oficios disponibles</h2>
            <a href="#catalogo">Ver catálogo →</a>
          </div>
          <div className="in-grid-oficios">
            {oficios.map(oficio => (
              <div key={oficio.id} className="in-tarjeta-oficio">
                <div className="in-icono-oficio">{oficio.icono}</div>
                <h3>{oficio.nombre}</h3>
                <p>{oficio.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Perfiles destacados */}
        <section className="in-seccion-catalogo">
          <div className="in-seccion-header">
            <h2>Perfiles destacados</h2>
            <a href="#catalogo">Ver catálogo →</a>
          </div>
          <p className="in-subtitulo">Consulta sus especialidades, horarios y reseñas de clientes.</p>
          
          <div className="in-grid-destacados">
            {destacados.map(perfil => (
              <div key={perfil.id} className="in-tarjeta-perfil">
                <img src={perfil.img} alt={perfil.nombre} className="in-perfil-img" />
                <div className="in-perfil-info">
                  <h3>{perfil.nombre}</h3>
                  <p className="in-oficio-txt">{perfil.oficio}</p>
                  <div className="in-rating">
                    <EstrellaIcono /> <span>{perfil.rating}</span> <small>({perfil.resenas} opiniones)</small>
                  </div>
                  
                  {/* Etiquetas unidas por un punto medio */}
                  <div className="in-tags-texto">
                    {perfil.tags.join(' · ')}
                  </div>
                  
                  <p className="in-ubicacion"><UbicacionIcono /> {perfil.ubicacion}</p>
                  
                  {/* Nueva caja de horario estilo Figma */}
                  <div className="in-horario-caja">
                    <RelojIcono />
                    <div className="in-horario-textos">
                      <span className="in-horario-titulo">{perfil.estado}</span>
                      <span className="in-horario-detalle">{perfil.horario}</span>
                    </div>
                  </div>
                  
                  {/* Botón esquinado */}
                  <div className="in-card-footer">
                    <button className="in-btn-perfil-limpio">Ver perfil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Sección: Cómo funciona */}
        <section className="in-seccion-como-funciona">
          <h2>Cómo funciona</h2>
          <p className="in-subtitulo">TrabajITO conecta a clientes con trabajadores. Tú consultas perfiles, contactas y acuerdas directamente.</p>
          
          <div className="in-grid-pasos">
            <div className="in-paso">
              <div className="in-paso-numero">01</div>
              <div className="in-paso-texto">
                <h4>Busca por oficio o especialidad</h4>
                <p>Usa filtros para encontrar perfiles de Oaxaca de Juárez y zonas adyacentes.</p>
              </div>
            </div>
            <div className="in-paso">
              <div className="in-paso-numero">02</div>
              <div className="in-paso-texto">
                <h4>Consulta perfiles y reseñas</h4>
                <p>Revisa especialidades, portafolio y horarios publicados por cada trabajador.</p>
              </div>
            </div>
            <div className="in-paso">
              <div className="in-paso-numero">03</div>
              <div className="in-paso-texto">
                <h4>Contacta y acuerda directamente</h4>
                <p>Acuerda con el trabajador los detalles de tu proyecto y el seguimiento que necesitas.</p>
              </div>
            </div>
          </div>
        </section>
        
      </main>

      {/* Footer azul oscuro */}
      <footer className="in-footer">
        <div className="in-footer-contenido">
          <div className="in-footer-logo-texto">
            <img src={logo} alt="TrabajITO" className="in-footer-logo" />
            <p>Conectamos clientes con trabajadores de oficio.</p>
          </div>
          <div className="in-footer-bottom">
            <p>© 2026 TrabajITO. Hecho para conectar.</p>
            <div className="in-footer-enlaces">
              <a href="#privacidad">Privacidad</a> - <a href="#terminos">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}