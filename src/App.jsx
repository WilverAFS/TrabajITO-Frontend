
import { useState } from 'react';
import logo from './assets/logo.png';
import './App.css';
import Recuperacion from './pages/Recuperacion'
import Inicio from './pages/Inicio';

function App() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  
  const [vista, setVista] = useState('login'); // 'login', 'recuperacion', 'inicio'
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const iniciarSesion = async (e) => {
    e.preventDefault();
    setErrorLogin(''); 
    try {
      // Simulamos la petición a la API leyendo el archivo local
      const respuesta = await fetch('/usuarios.json');
      const usuarios = await respuesta.json();

      // Buscamos si existe un usuario con el correo y contraseña ingresados
      const usuarioValido = usuarios.find(
        (u) => u.correo === correo && u.contrasena === contrasena
      );

      if (usuarioValido) {
        setNombreUsuario(usuarioValido.nombre);
        // Si coincide, pasamos a la pantalla de inicio
        setVista('inicio');
      } else {
        // Si no coincide, mostramos un error
        setErrorLogin('Correo o contraseña incorrectos. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error simulando la API:', error);
      alert('Error de conexión con el servidor.');
    }
    
  };
  const cerrarSesion = () => {
    setCorreo('');
    setContrasena('');
    setNombreUsuario('');
    setErrorLogin('');
    setVista('login');
  };
    if (vista === 'recuperacion') {
      return <Recuperacion />;
    }
    if (vista === 'inicio') {
       return <Inicio cerrarSesion={cerrarSesion} nombreUsuario={nombreUsuario} />;    
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

            {/* Aquí agregamos el mensaje de error en rojo */}
            {errorLogin && (
              <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
                {errorLogin}
              </div>
            )}

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
