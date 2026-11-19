import { Outlet, useOutletContext } from 'react-router'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import '../components/ui/Interfaz.css'

export default function PortafolioLayout() {
  const contexto = useOutletContext()
  return (
    <>
      <Header botonActivo="" />
      <main className="pf-modulo">
        <Outlet context={contexto} />
      </main>
      <Footer className="pp-footer" />
    </>
  )
}
