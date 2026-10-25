
import { useState } from 'react';
import logo from './assets/logo.png';
import './App.css';
import Recuperacion from './pages/Recuperacion'

function App() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const [vista, setVista] = useState('login');

  const iniciarSesion = (e) => {
    e.preventDefault();
    alert('La pantalla está lista. Falta conectar el inicio de sesión con el backend.');
  };
    if (vista === 'recuperacion') {
      return <Recuperacion />;
    }
  return (
    <div className="pagina">
      <header className="navbar">
        <a className="logo" href="/" aria-label="TrabajITO inicio">
          <img src={logo} alt="Logo de TrabajITO" className="logo-imagen" />
          <span>trabaj<span className="logo-verde">ITO</span></span>
        </a>
      </header>

      <main className="contenido">
        <section className="presentacion">
          <a href="/" className="volver">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>

          <div className="etiqueta">Trabajadores de oficio</div>

          <h1>
            Encuentra y conecta con
            <span> profesionales.</span>
          </h1>

          <p className="descripcion">
            Accede como cliente o trabajador para consultar perfiles,
            portafolios, disponibilidad y reputación.
          </p>

          <div className="imagen-principal">
            <img
              className="logo"
              src={logo}
              alt="Profesionales ofreciendo sus servicios"
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
          <div className="login-encabezado">
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

export default App;
