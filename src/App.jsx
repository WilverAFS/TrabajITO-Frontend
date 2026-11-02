

import { useState, useEffect } from 'react';import logo from './assets/logo.png';
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
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') {
        setCargando(false); // Quitamos la pausa si no hay sesión
        return;
      }

      try {
        const respuesta = await fetch('http://127.0.0.1:8000/api/v1/me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await respuesta.json();
        if (respuesta.ok && data.success) {
          setNombreUsuario(data.data.nombre); 
          setVista('inicio'); 
        } else {
          localStorage.removeItem('token'); 
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false); // Quitamos la pausa sin importar el resultado
      }
    };
    verificarToken();
  }, []);
  const iniciarSesion = async (e) => {
    e.preventDefault();
    setErrorLogin(''); 
    
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: correo,
          password: contrasena, // El backend requiere la clave en inglés
          device_name: 'react-web'
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.success) {
        // Guardamos el token en el almacenamiento local del navegador
        const tokenReal = data.token || data.data.token;
        localStorage.setItem('token', tokenReal);
        // Extraemos el nombre del usuario desde la respuesta de Laravel
        setNombreUsuario(data.data.usuario.nombre);
        // Redirigimos a la pantalla principal
        setVista('inicio');
      } else {
        // Mostramos el error exacto que devuelva el backend
        setErrorLogin(data.message || 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error conectando a la API:', error);
      setErrorLogin('Error de conexión con el servidor.');
    }
  };
  const cerrarSesion = async () => {
    try {
      // 1. Obtenemos el token que guardamos al iniciar sesión
      const token = localStorage.getItem('token');

      if (token) {
        // 2. Hacemos la petición POST al endpoint de logout
        await fetch('http://127.0.0.1:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            // Laravel Sanctum exige el Bearer token para saber a quién desconectar
            'Authorization': `Bearer ${token}` 
          }
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      // 3. Pase lo que pase con el servidor, borramos el token de tu navegador
      localStorage.removeItem('token');
      
      // 4. Limpiamos tus variables de estado de React y volvemos al login
      setCorreo('');
      setContrasena('');
      setNombreUsuario('');
      setErrorLogin('');
      setVista('login');
    }
  };

    if (cargando) {
     return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui' }}>Cargando TrabajITO...</div>;
    }
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
