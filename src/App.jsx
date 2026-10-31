import { useState } from 'react';
import logo from './assets/logo.png';
import hero from './assets/hero.png';
import './App.css';
import Recuperacion from './pages/Recuperacion';

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

function App() {
  const [vista, setVista] = useState('inicio');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const iniciarSesion = (e) => {
    e.preventDefault();
    alert('La pantalla está lista. Falta conectar el inicio de sesión con el backend.');
  };

  if (vista === 'recuperacion') {
    return <Recuperacion />;
  }

  if (vista === 'login') {
    return (
      <div className="pagina">
        <header className="navbar">
          <button
            className="logo"
            type="button"
            aria-label="Volver al inicio de TrabajITO"
            onClick={() => setVista('inicio')}
          >
            <img src={logo} alt="Logo de TrabajITO" className="logo-imagen" />
            <span>trabaj<span className="logo-verde">ITO</span></span>
          </button>
        </header>

        <main className="contenido">
          <section className="presentacion">
            <button
              type="button"
              className="volver"
              onClick={() => setVista('inicio')}
            >
              <span aria-hidden="true">←</span> Volver al inicio
            </button>

            <div className="etiqueta">Trabajadores de oficio</div>

            <h1>
              Encuentra y conecta con
              <span> profesionales.</span>
            </h1>

            <p className="descripcion">
              Accede como cliente o trabajador para consultar perfiles,
              portafolios, disponibilidad y reputación.
            </p>

            <div className="imagen-contenedor">
              <img
                className="imagen-hero"
                src={hero}
                alt="Cliente y trabajador conversando sobre un servicio"
              />
              <div className="imagen-mensaje">
                <span className="escudo">✓</span>
                <div>
                  <strong>Perfiles, portafolios y reputación.</strong>
                  <small>Disponibilidad pública y calificaciones.</small>
                </div>
              </div>
            </div>
            <div className="franja-decorativa" />
          </section>

          <section className="login-card">
            <div className="login-logo">
              <img src={logo} alt="Logo de TrabajITO" />
            </div>

            <div className="login-encabezado">
              <h2>Inicia sesión como cliente o trabajador.</h2>
              <p>
                Accede con tu correo y contraseña para consultar perfiles,
                portafolios, disponibilidad y reputación.
              </p>
            </div>

            <form onSubmit={iniciarSesion}>
              <label htmlFor="correo">Correo electrónico</label>
              <div className="campo">
                <span className="campo-icono" aria-hidden="true">✉</span>
                <input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <label htmlFor="contrasena">Contraseña</label>
              <div className="campo">
                <span className="campo-icono" aria-hidden="true">♙</span>
                <input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <label className="mostrar-password">
                <input
                  type="checkbox"
                  checked={mostrarContrasena}
                  onChange={(e) => setMostrarContrasena(e.target.checked)}
                />
                <span>Mostrar contraseña</span>
              </label>

              <button type="submit" className="boton-login">
                Iniciar sesión
              </button>

              <a
                href="#recuperar"
                className="enlace-recuperar"
                onClick={(e) => {
                  e.preventDefault();
                  setVista('recuperacion');
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </form>

            <div className="separador" />

            <div className="registro">
              <p>¿Aún no tienes una cuenta?</p>
              <a href="/registro">
                Regístrate <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="aviso-seguridad">
              <span className="aviso-icono">✓</span>
              <div>
                <strong>Acceso diferenciado.</strong>
                <small>
                  Consulta perfiles, portafolios, disponibilidad y reputación.
                </small>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="inicio" id="inicio">
      <header className="inicio-navbar">
        <a className="inicio-logo" href="#inicio" aria-label="TrabajITO inicio">
          <img src={logo} alt="Logo de TrabajITO" />
          <span>trabaj<span>ITO</span></span>
        </a>

        <button className="boton-iniciar" onClick={() => setVista('login')}>
          Iniciar sesión
        </button>
      </header>

      <main>
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
                  <small>Consulta especialidades y opiniones de clientes</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="seccion-oficios">
          <div className="ancho-contenido">
            <h2>Oficios disponibles</h2>

            <div className="oficios-grid">
              {oficios.map((oficio) => (
                <article className="oficio-card" key={oficio.nombre}>
                  <span className="oficio-icono">{oficio.icono}</span>
                  <h3>{oficio.nombre}</h3>
                  <p>{oficio.descripcion}</p>
                </article>
              ))}
            </div>

            <div className="perfiles-titulo">
              <div>
                <h2>Perfiles destacados</h2>
                <p>Consulta sus especialidades, horarios y reseñas de clientes.</p>
              </div>
              <span className="catalogo-texto">Ver catálogo&nbsp; →</span>
            </div>

            <div className="perfiles-grid">
              {trabajadores.map((trabajador) => (
                <article className="perfil-card" key={trabajador.nombre}>
                  <div className="perfil-foto-contenedor">
                    <img
                      className="perfil-foto"
                      src={trabajador.foto}
                      alt={`Fotografía ilustrativa de ${trabajador.nombre}`}
                    />
                  </div>

                  <div className="perfil-info">
                    <h3>{trabajador.nombre}</h3>
                    <p>{trabajador.oficio} · {trabajador.experiencia}</p>

                    <div className="calificacion">
                      <span>★</span>
                      <strong>{trabajador.calificacion}</strong>
                      <small>({trabajador.opiniones})</small>
                    </div>

                    <p>{trabajador.especialidades}</p>
                    <p className="ubicacion">⌖ &nbsp;{trabajador.ubicacion}</p>

                    <div className="disponibilidad">
                      <strong>◷ &nbsp;Disponible hoy</strong>
                      <small>{trabajador.disponibilidad}</small>
                    </div>

                    <span className="boton-perfil">Ver perfil</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
                  <p>Usa filtros para encontrar perfiles de Oaxaca de Juárez y zonas adyacentes.</p>
                </div>
              </article>

              <article className="paso">
                <span>02</span>
                <div>
                  <h3>Consulta perfiles y reseñas</h3>
                  <p>Revisa especialidades, portafolio y horarios publicados por cada trabajador.</p>
                </div>
              </article>

              <article className="paso">
                <span>03</span>
                <div>
                  <h3>Contacta y acuerda directamente</h3>
                  <p>Acuerda con el trabajador los detalles de tu proyecto y el seguimiento que necesitas.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="inicio-footer">
        <div className="ancho-contenido">
          <div className="footer-marca">
            <img src={logo} alt="Logo de TrabajITO" />
            <strong>Trabaj<span>ITO</span></strong>
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

export default App;
