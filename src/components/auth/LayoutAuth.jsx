
import { Link } from 'react-router'
import LayoutAplicacion from '../LayoutAplicacion.jsx'
import hero from '../../assets/registro-hero-provisional.png'

// Estructura compartida de Registro y Recuperación.
export default function LayoutAuth({
  titulo,
  introduccion,
  altHero,
  etiqueta = '',
  children,
}) {
  return (
    <LayoutAplicacion publico className="rg-pagina">
      <main className="rg-principal">
        <section
          className="rg-presentacion"
          aria-labelledby="rg-titulo"
        >
          <Link className="rg-regresar" to="/login">
            ← Volver a iniciar sesión
          </Link>

          {etiqueta && (
            <div className="rg-etiqueta">
              <span aria-hidden="true">◉</span> {etiqueta}
            </div>
          )}

          <h1 id="rg-titulo">{titulo}</h1>
          <p className="rg-introduccion">{introduccion}</p>

          <img
            className="rg-hero"
            src={hero}
            alt={altHero}
          />
        </section>

        <section
          className="rg-tarjeta"
          aria-labelledby="rg-formulario-titulo"
        >
          {children}
        </section>
      </main>
    </LayoutAplicacion>
  )
}