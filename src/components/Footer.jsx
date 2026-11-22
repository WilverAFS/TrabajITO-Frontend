// src/components/Footer.jsx
import logo from '../assets/marca-oficial.png'
import './Footer.css';
export default function Footer({ className }) {
  return (
    <footer className={className}>
      <div className="contenedor-centrado footer-contenido in-footer-contenido">
        <div className="footer-logo-seccion in-footer-logo-texto">
          <img src={logo} alt="TrabajITO" className="footer-logo in-footer-logo" />
          <p>Conectamos clientes con trabajadores de oficio.</p>
        </div>
        
        <div className="footer-abajo in-footer-bottom">
          <p>© 2026 TrabajITO. Hecho para conectar.</p>
          <div className="footer-enlaces in-footer-enlaces">
            <a href="#privacidad">Privacidad</a>
            <span> - </span>
            <a href="#terminos">Términos y condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
}