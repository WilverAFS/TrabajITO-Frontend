import { Link } from 'react-router';

export default function BandejaTemporal({ titulo }) {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <h1>{titulo}</h1>
        <p>Este módulo se encuentra en construcción.</p>
        <p>Estamos trabajando para habilitar esta funcionalidad próximamente.</p>
        <Link to="/inicio">Volver al inicio</Link>
      </section>
    </main>
  );
}
