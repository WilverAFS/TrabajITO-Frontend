import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import logo from '../assets/registro-logo-provisional.png';
import { CampanaIcono, CorreoIcono } from './Iconos';
import './Header.css';

export default function Header({ botonActivo = "catalogo" }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState("Invitado");
  const navigate = useNavigate();

  // 1. Cargar usuario conectado usando variable de entorno
  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (result.success) setUsuarioActual(result.data.nombre);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  // 2. Cerrar sesión usando variable de entorno
  const manejarCerrarSesion = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="trabajito-header">
      <a href="/" className="logo-container"><img src={logo} alt="TrabajITO" /></a>
      
      <nav>
         <button 
           onClick={() => navigate('/inicio')} 
           className={`btn-enlace-nav ${botonActivo === 'inicio' ? 'activo' : ''}`}
         >
           Inicio
         </button>
         <button 
           onClick={() => navigate('/catalogo')} 
           className={`btn-enlace-nav ${botonActivo === 'catalogo' ? 'activo' : ''}`}
         >
           Buscar trabajadores
         </button>
      </nav>
      
      <div className="usuario-contenedor">
        <div className="iconos-notificacion">
          <CampanaIcono />
          <CorreoIcono />
        </div>
        
        <button className="btn-perfil-usuario" onClick={() => setMenuAbierto(!menuAbierto)}>
          Bienvenido {usuarioActual} <span style={{fontSize: '12px', marginLeft: '4px'}}>v</span>
        </button>

        {menuAbierto && (
          <div className="menu-desplegable-usuario">
            <button onClick={() => { setMenuAbierto(false); navigate('/mi-perfil'); }}>Ver perfil</button>
            <button onClick={manejarCerrarSesion}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}