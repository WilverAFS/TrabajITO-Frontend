
import { Outlet } from 'react-router';
import NavbarBandejas from '../components/NavbarBandejas';

export default function BandejasLayout() {
  return (
    <>
      <NavbarBandejas />
      <Outlet />
    </>
  );
}
