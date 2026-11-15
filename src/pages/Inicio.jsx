import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import hero from '../assets/registro-hero-provisional.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TarjetaPerfil from '../components/TarjetaPerfil'; // <-- Importamos nuestra tarjeta mágica
import { 
  CheckIcono, CirculoIcono, PlomeroIcono, RayoIcono, 
  MartilloIcono, LlaveIcono, PinturaIcono 
} from '../components/Iconos';
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  
  // Estado para los perfiles destacados reales de la API
  const [destacados, setDestacados] = useState([]);
  const [cargandoDestacados, setCargandoDestacados] = useState(true);

  // Traer los 3 mejores trabajadores desde Laravel
  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        // Pedimos solo 3 resultados para la página de inicio
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trabajadores?per_page=3`, {
          headers: { 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (result.success) {
          setDestacados(result.data);
        }
      } catch (error) {
        console.error("Error al cargar destacados:", error);
      } finally {
        setCargandoDestacados(false);
      }
    };
    cargarDestacados();
  }, []);

  const oficios = [
    { id: 1, nombre: "Plomeros", desc: "Fugas e instalaciones", icono: <PlomeroIcono /> },
    { id: 2, nombre: "Electricistas", desc: "Conexiones seguras", icono: <RayoIcono /> },
    { id: 3, nombre: "Carpinteros", desc: "Muebles a tu medida", icono: <MartilloIcono /> },
    { id: 4, nombre: "Herreros", desc: "Metal y estructuras", icono: <LlaveIcono /> },
    { id: 5, nombre: "Pintores", desc: "Espacios renovados", icono: <PinturaIcono /> },
  ];

  return (
    <div className="in-pagina">
      
      {/* 1. HEADER REUTILIZABLE */}
      <Header estilo="in" botonActivo="inicio" />

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
            <label>¿Qué necesitas resolver hoy?</label>
            <div className="in-buscador">
              <div className="in-buscador-input">
                <span className="in-circulo-vacio"></span>
                <div>
                  <small>TIPO DE OFICIO</small>
                  <input type="text" placeholder="Selecciona un oficio" />
                </div>
              </div>
              <button onClick={() => navigate('/catalogo')}>
                Buscar trabajadores
              </button>
            </div>
          </div>
        </section>
        
        {/* Sección: Oficios disponibles */}
        <section id="catalogo" className="in-seccion-catalogo">
          <div className="in-seccion-header">
            <h2>Oficios disponibles</h2>
            <button onClick={() => navigate('/catalogo')} className="in-btn-enlace">Ver catálogo →</button>
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

        {/* Sección: Perfiles destacados usando el Componente Reutilizable */}
        <section className="in-seccion-catalogo">
          <div className="in-seccion-header">
            <h2>Perfiles destacados</h2>
            <button onClick={() => navigate('/catalogo')} className="in-btn-enlace">Ver catálogo →</button>
          </div>
          <p className="in-subtitulo">Consulta sus especialidades, horarios y reseñas de clientes.</p>
          
          {cargandoDestacados ? (
            <p style={{textAlign: 'center', margin: '40px 0'}}>Cargando profesionales...</p>
          ) : (
            <div className="in-grid-destacados">
              {destacados.map(perfil => (
                <TarjetaPerfil key={perfil.id_trabajador} perfil={perfil} />
              ))}
            </div>
          )}
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

      {/* 2. FOOTER REUTILIZABLE */}
      <Footer className="in-footer" />
      
    </div>
  );
}