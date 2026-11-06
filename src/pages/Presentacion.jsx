import logo from '../assets/trabajito.png';
import hero from '../assets/registro-hero-provisional.png';
import './Presentacion.css';

const oficios = [
  { icono: '♧', nombre: 'Plomeros', descripcion: 'Fugas e instalaciones' },
  { icono: 'ϟ', nombre: 'Electricistas', descripcion: 'Conexiones seguras' },
  { icono: '⚒', nombre: 'Carpinteros', descripcion: 'Muebles a tu medida' },
  { icono: '⚒', nombre: 'Herreros', descripcion: 'Metal y estructuras' },
  { icono: '▰', nombre: 'Pintores', descripcion: 'Espacios renovados' },
];

const trabajadores = [
  {
    nombre: 'Carlos Mendoza',
    oficio: 'Plomero',
    experiencia: '12 años de experiencia',
    calificacion: '4.9',
    opiniones: '128 opiniones',
    especialidades: 'Fugas · Instalaciones · Calentadores',
    ubicacion: 'Centro, Oaxaca de Juárez',
    disponibilidad: 'Jueves 15 · 14:00–18:00',
    foto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Elena Vargas',
    oficio: 'Electricista',
    experiencia: '9 años de experiencia',
    calificacion: '4.9',
    opiniones: '104 opiniones',
    especialidades: 'Iluminación · Instalaciones eléctricas',
    ubicacion: 'Santa Cruz Xoxocotlán',
    disponibilidad: 'Hoy, 16:00–19:00',
    foto: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Luis Hernández',
    oficio: 'Carpintero',
    experiencia: '10 años de experiencia',
    calificacion: '4.8',
    opiniones: '87 opiniones',
    especialidades: 'Muebles · Cocinas · Reparaciones',
    ubicacion: 'Santa Lucía del Camino',
    disponibilidad: 'Hoy, 15:00–19:00',
    foto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85',
  },
];

function Presentacion({ onIniciarSesion }) {
  return (
    <div className="inicio" id="inicio">

      {/* NAVBAR */}
      <header className="inicio-navbar">
        <a
          className="inicio-logo"
          href="#inicio"
          aria-label="TrabajITO inicio"
        >
          <img src={logo} alt="Logo de TrabajITO" />
          <span>
            trabaj<span>ITO</span>
          </span>
        </a>

        <button
          className="boton-iniciar"
          onClick={onIniciarSesion}
        >
          Iniciar sesión
        </button>
      </header>

      <main>

        {/* PRESENTACIÓN PRINCIPAL */}
        <section className="hero-inicio">
          <div className="hero-interior">

            <div className="hero-texto">
              <span className="hero-etiqueta">
                <span aria-hidden="true">⌖</span> Gente de confianza, cerca de ti
              </span>

              <h1>
                Encuentra profesionales
                <span>en Oaxaca.</span>
              </h1>

              <p>
                Explora perfiles, especialidades, portafolio y horarios
                publicados por trabajadores de Oaxaca.
              </p>

              <div className="hero-ventajas">
                <span>✓ &nbsp;Perfiles con especialidades</span>
                <span>✓ &nbsp;Horarios publicados</span>
              </div>
            </div>

            <div className="hero-foto">
              <img
                src={hero}
                alt="Cliente y trabajador conversando sobre un servicio"
              />

              <div className="hero-mensaje">
                <span className="hero-check">✓</span>

                <div>
                  <strong>Tu hogar, en buenas manos</strong>
                  <small>
                    Consulta especialidades y opiniones de clientes
                  </small>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* OFICIOS Y PERFILES */}
        <section className="seccion-oficios">
          <div className="ancho-contenido">

            <h2>Oficios disponibles</h2>

            <div className="oficios-grid">
              {oficios.map((oficio) => (
                <article
                  className="oficio-card"
                  key={oficio.nombre}
                >
                  <span className="oficio-icono">
                    {oficio.icono}
                  </span>

                  <h3>{oficio.nombre}</h3>
                  <p>{oficio.descripcion}</p>
                </article>
              ))}
            </div>

            <div className="perfiles-titulo">
              <div>
                <h2>Perfiles destacados</h2>
                <p>
                  Consulta sus especialidades, horarios y reseñas de clientes.
                </p>
              </div>

              <span className="catalogo-texto">
                Ver catálogo&nbsp; →
              </span>
            </div>

            <div className="perfiles-grid">
              {trabajadores.map((trabajador) => (
                <article
                  className="perfil-card"
                  key={trabajador.nombre}
                >

                  <div className="perfil-foto-contenedor">
                    <img
                      className="perfil-foto"
                      src={trabajador.foto}
                      alt={`Fotografía ilustrativa de ${trabajador.nombre}`}
                    />
                  </div>

                  <div className="perfil-info">

                    <h3>{trabajador.nombre}</h3>

                    <p>
                      {trabajador.oficio} · {trabajador.experiencia}
                    </p>

                    <div className="calificacion">
                      <span>★</span>
                      <strong>{trabajador.calificacion}</strong>
                      <small>({trabajador.opiniones})</small>
                    </div>

                    <p>{trabajador.especialidades}</p>

                    <p className="ubicacion">
                      ⌖ &nbsp;{trabajador.ubicacion}
                    </p>

                    <div className="disponibilidad">
                      <strong>◷ &nbsp;Disponible hoy</strong>
                      <small>{trabajador.disponibilidad}</small>
                    </div>

                    <span className="boton-perfil">
                      Ver perfil
                    </span>

                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="como-funciona">
          <div className="ancho-contenido">

            <h2>Cómo funciona</h2>

            <p className="como-subtitulo">
              TrabajITO conecta a clientes con trabajadores. Tú consultas
              perfiles, contactas y acuerdas directamente.
            </p>

            <div className="pasos-grid">

              <article className="paso">
                <span>01</span>

                <div>
                  <h3>Busca por oficio o especialidad</h3>
                  <p>
                    Usa filtros para encontrar perfiles de Oaxaca de Juárez
                    y zonas adyacentes.
                  </p>
                </div>
              </article>

              <article className="paso">
                <span>02</span>

                <div>
                  <h3>Consulta perfiles y reseñas</h3>
                  <p>
                    Revisa especialidades, portafolio y horarios publicados
                    por cada trabajador.
                  </p>
                </div>
              </article>

              <article className="paso">
                <span>03</span>

                <div>
                  <h3>Contacta y acuerda directamente</h3>
                  <p>
                    Acuerda con el trabajador los detalles de tu proyecto
                    y el seguimiento que necesitas.
                  </p>
                </div>
              </article>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="inicio-footer">
        <div className="ancho-contenido">

          <div className="footer-marca">
            <img src={logo} alt="Logo de TrabajITO" />

            <strong>
              Trabaj<span>ITO</span>
            </strong>
          </div>

          <p>El talento de tu comunidad, cerca de ti.</p>

          <div className="footer-final">
            <span>© 2026 TrabajITO. Hecho para conectar.</span>
            <span>Privacidad · Términos y condiciones</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Presentacion;