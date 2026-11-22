
import { Outlet, useOutletContext } from 'react-router'
import LayoutAplicacion from '../components/LayoutAplicacion.jsx'

export default function BandejasLayout() {
  const { usuario, cerrarSesion } = useOutletContext()

  return (
    <LayoutAplicacion>
      <Outlet context={{ usuario, cerrarSesion }} />
    </LayoutAplicacion>
  )
}