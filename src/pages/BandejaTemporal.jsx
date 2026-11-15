import { Link } from 'react-router';

export default function BandejaTemporal({ titulo }) {
  return (
    <main className="tj-ruta-pagina">
      <section className="tj-ruta-tarjeta">
        <h1>{titulo}</h1>
        <p>Vista de {titulo} de TrabajITO.</p>
        <Link to="/inicio">Volver al inicio</Link>
      </section>
    </main>
  );
}