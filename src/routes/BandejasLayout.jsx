import { Outlet, useOutletContext } from 'react-router';
import Header from '../components/Header.jsx';

export default function BandejasLayout() {
  const { usuario, cerrarSesion } = useOutletContext();

  return (
    <>
      <Header botonActivo="" />
      <Outlet context={{ usuario, cerrarSesion }} />
    </>
  );
}
