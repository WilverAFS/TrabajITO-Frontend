
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './LayoutAplicacion.css'

export default function LayoutAplicacion({
  children,
  botonActivo = '',
}) {
  return (
    <div className="tj-layout-aplicacion">
      <Header botonActivo={botonActivo} />

      {children}

      <Footer className="tj-layout-footer" />
    </div>
  )
}