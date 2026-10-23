import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Registro from './pages/Registro.jsx'

// Ruta temporal sin dependencias adicionales: /registro.
// Mantiene intacta la página principal mientras otro integrante trabaja el login.
const rutaActual = window.location.pathname.replace(/\/+$/, '') || '/'
const esRegistro = rutaActual === '/registro'

if (esRegistro) {
  document.documentElement.classList.add('trabajito-registro-route')
  document.documentElement.lang = 'es'
  document.title = 'Registro | TrabajITO'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {esRegistro ? <Registro /> : <App />}
  </StrictMode>,
)
