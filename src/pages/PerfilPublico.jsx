import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Importamos los 3 componentes nuevos
import BannerPerfil from "../components/BannerPerfil";
import ColumnaPrincipal from "../components/ColumnaPrincipal";
import SidebarPerfil from "../components/SidebarPerfil";

import { obtenerTrabajadorPublico } from '../services/trabajadoresApi';
import './PerfilPublico.css';

export default function PerfilPublico() {
  const { id } = useParams(); 
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Mantenemos los datos temporales hasta que el backend esté listo
        setTimeout(() => {
          setPerfil({
            id_trabajador: id,
            usuario: { 
              nombre: "Carlos", 
              nombre_completo: "Carlos Martínez Ruiz", 
              telefono: "9510000003" 
            },
            oficios: [{ id_oficio: 2, nombre: "Electricidad" }],
            calificacion_promedio: 5.0,
            total_valoraciones: 128,
            descripcion: "Electricista con 12 años de experiencia en hogares y pequeños negocios. Especializado en instalaciones y mantenimiento preventivo.",
            disponibilidades: [
              { id_disponibilidad: 1, dia_nombre: "Jueves", hora_inicio: "14:00:00", hora_fin: "18:00:00" }
            ]
          });
          setCargando(false);
        }, 500); 

      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('No se pudo cargar la información del trabajador. Asegúrate de que el ID exista.');
        }
      }
    };

    cargarPerfil();
    return () => controller.abort();
  }, [id]);

  return (
    <>
      <Header botonActivo="catalogo" />
      
      <main className="perfil-publico-main">
        
        {cargando && <p className="mensaje-estado" role="status">Cargando perfil...</p>}
        
        {!cargando && error && (
          <div className="mensaje-estado error" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {!cargando && !error && perfil && (
          <>
            {/* 1. Componente del Banner Azul */}
            <BannerPerfil perfil={perfil} />

            <div className="contenedor-perfil seccion-inferior-figma">
              <div className="perfil-grid-inferior">
                
                {/* 2. Componente de la Columna Principal (Tabs, Bio, Opiniones) */}
                <ColumnaPrincipal perfil={perfil} />
                
                {/* 3. Componente de la Barra Lateral (Disponibilidad y Contacto) */}
                <SidebarPerfil perfil={perfil} />

              </div>
            </div>
          </>
        )}
      </main>

      <Footer className="perfil-publico-footer" />
    </>
  );
}