import logo from '../../assets/marca-oficial.png'
import hero from '../../assets/registro-hero-provisional.png'

// Estructura compartida por las pantallas de registro y recuperación.
export default function LayoutAuth({
  titulo,
  introduccion,
  altHero,
  etiqueta = '',
  enlacesFooter = [],
  children,
}) {
  return (
    <div className="rg-pagina">
      <header className="rg-header">
        <div className="rg-header-contenido">
          <a href="/" aria-label="TrabajITO, ir al inicio" className="rg-marca">
            <img src={logo} alt="TrabajITO" />
          </a>
          <a href="/" className="rg-enlace-header">Iniciar sesión</a>
        </div>
      </header>

      <main className="rg-principal">
        <section className="rg-presentacion" aria-labelledby="rg-titulo">
          <a className="rg-regresar" href="/">←&nbsp; Volver a iniciar sesión</a>
          {etiqueta && (
            <div className="rg-etiqueta"><span aria-hidden="true">◉</span> {etiqueta}</div>
          )}
          <h1 id="rg-titulo">{titulo}</h1>
          <p className="rg-introduccion">{introduccion}</p>
          <img className="rg-hero" src={hero} alt={altHero} />
        </section>

        <section className="rg-tarjeta" aria-labelledby="rg-formulario-titulo">
          {children}
        </section>
      </main>

      <footer className="rg-footer">
        <div className="rg-footer-contenido">
          <small>© 2026 TrabajITO. Hecho para conectar.</small>
          <nav aria-label="Enlaces informativos pendientes de implementación">
            {enlacesFooter.map((enlace) => (
              <span key={enlace}>{enlace}</span>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
