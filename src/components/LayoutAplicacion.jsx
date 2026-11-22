
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './LayoutAplicacion.css'

export default function LayoutAplicacion({
  children,
  botonActivo = '',
  publico = false,
  className = '',
}) {
  return (
    <div className={`tj-layout-aplicacion ${className}`.trim()}>
      <Header publico={publico} botonActivo={botonActivo} />

      {children}

      <Footer className="tj-layout-footer" />
    </div>
  )
}
