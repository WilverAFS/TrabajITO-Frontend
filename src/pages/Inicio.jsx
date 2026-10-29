import { useState } from 'react';
import logo from '../assets/registro-logo-provisional.png';
import hero from '../assets/registro-hero-provisional.png';
import './Inicio.css';

// --- ICONOS SVG ---
function CampanaIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
function CorreoIcono() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
function CheckIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"></path></svg> }
function CirculoIcono() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="#198754"></circle></svg> }

export default function Inicio({ cerrarSesion, nombreUsuario }) {
  // Estado para controlar si el menú del usuario está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

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
              <button>Buscar trabajadores</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}