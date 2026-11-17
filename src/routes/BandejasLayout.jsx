import { Outlet, useOutletContext } from 'react-router';
import NavbarBandejas from '../components/NavbarBandejas';

export default function BandejasLayout() {
  const { usuario, cerrarSesion } = useOutletContext();

  return (
    <>
      <NavbarBandejas
        esTrabajadorHabilitado={usuario?.es_trabajador_habilitado}
        esAdministrador={usuario?.es_administrador}
      />

      <Outlet context={{ usuario, cerrarSesion }} />
    </>
  );
}
