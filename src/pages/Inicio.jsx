
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import hero from '../assets/registro-hero-provisional.png'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TarjetaPerfil from '../components/TarjetaPerfil'

import {
  CheckIcono,
  CirculoIcono,
  PlomeroIcono,
  RayoIcono,
  MartilloIcono,
  LlaveIcono,
  PinturaIcono,
} from '../components/Iconos'

import { listarTrabajadores } from '../services/trabajadoresApi.js'
import { OFICIOS, PASOS_INICIO } from '../data/contenidoInicio.js'

import './Inicio.css'

export default function Inicio() {
  const navigate = useNavigate()

  // Estado de los perfiles destacados
  const [busquedaOficio, setBusquedaOficio] = useState('')
  const [destacados, setDestacados] = useState([])
  const [cargandoDestacados, setCargandoDestacados] = useState(true)
  const [errorDestacados, setErrorDestacados] = useState('')

  // Cargar los perfiles destacados desde Laravel
  useEffect(() => {
    const controlador = new AbortController()

    listarTrabajadores({
      per_page: 3,
      signal: controlador.signal,
    })
      .then((datos) => {
        if (!controlador.signal.aborted) {
          setDestacados(Array.isArray(datos) ? datos : [])
        }
      })
      .catch((error) => {
        if (
          error.name !== 'AbortError' &&
          !controlador.signal.aborted
        ) {
          setErrorDestacados(
            'No se pudieron cargar los perfiles destacados.'
          )
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargandoDestacados(false)
        }
      })

    return () => controlador.abort()
  }, [])

  const buscarTrabajadores = (evento) => {
    evento.preventDefault()
    const termino = busquedaOficio.trim()
    navigate(
      termino
        ? `/catalogo?buscar=${encodeURIComponent(termino)}`
        : '/catalogo'
    )
  }

  const iconosOficio = [
    <PlomeroIcono key="plomeros" />,
    <RayoIcono key="electricistas" />,
    <MartilloIcono key="carpinteros" />,
    <LlaveIcono key="herreros" />,
    <PinturaIcono key="pintores" />,
  ]

  const oficios = OFICIOS.map((oficio, index) => ({
    ...oficio,
    desc: oficio.descripcion,
    icono: iconosOficio[index],
  }))

  return (
    <div className="in-pagina">

      {/* Encabezado compartido */}
      <Header estilo="in" botonActivo="inicio" />

      <main className="in-contenido-principal">

        {/* Presentación */}
        <section className="in-hero-superior">
          <div className="in-hero-texto">
            <span className="in-etiqueta">
              <CirculoIcono />
              Gente de confianza, cerca de ti
            </span>

            <h1>
              Encuentra profesionales
              <br />
              en Oaxaca.
            </h1>

            <p>
              Explora perfiles, especialidades, portafolio y horarios
              publicados por trabajadores de Oaxaca.
            </p>

            <div className="in-caracteristicas">
              <span>
                <CheckIcono />
                Perfiles con especialidades
              </span>

              <span>
                <CheckIcono />
                Horarios publicados
              </span>
            </div>
          </div>

          <div className="in-hero-imagen">
            <img
              src={hero}
              alt="Profesionales trabajando"
            />
          </div>
        </section>

        {/* Buscador */}
        <section className="in-buscador-seccion">
          <div className="in-buscador-contenedor">
            <label htmlFor="inicio-busqueda">
              ¿Qué necesitas resolver hoy?
            </label>

            <form className="in-buscador" onSubmit={buscarTrabajadores}>
              <div className="in-buscador-input">
                <span className="in-circulo-vacio"></span>

                <div>
                  <small>TIPO DE OFICIO</small>
                  <input
                    id="inicio-busqueda"
                    type="search"
                    maxLength={150}
                    placeholder="Escribe un oficio o servicio"
                    value={busquedaOficio}
                    onChange={(evento) => setBusquedaOficio(evento.target.value)}
                  />
                </div>
              </div>

              <button type="submit">
                Buscar trabajadores
              </button>
            </form>
          </div>
        </section>

        {/* Catálogo de oficios */}
        <section
          id="catalogo"
          className="in-seccion-catalogo"
        >
          <div className="in-seccion-header">
            <h2>Oficios disponibles</h2>

            <button
              type="button"
              onClick={() => navigate('/catalogo')}
              className="in-btn-enlace"
            >
              Ver catálogo →
            </button>
          </div>

          <div className="in-grid-oficios">
            {oficios.map((oficio) => (
              <div
                key={oficio.id}
                className="in-tarjeta-oficio"
              >
                <div className="in-icono-oficio">
                  {oficio.icono}
                </div>

                <h3>{oficio.nombre}</h3>
                <p>{oficio.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Perfiles destacados */}
        <section className="in-seccion-catalogo">
          <div className="in-seccion-header">
            <h2>Perfiles destacados</h2>

            <button
              type="button"
              onClick={() => navigate('/catalogo')}
              className="in-btn-enlace"
            >
              Ver catálogo →
            </button>
          </div>

          <p className="in-subtitulo">
            Consulta sus especialidades, horarios y reseñas de clientes.
          </p>

          {errorDestacados ? (
            <p
              role="alert"
              style={{
                textAlign: 'center',
                margin: '40px 0',
              }}
            >
              {errorDestacados}
            </p>
          ) : cargandoDestacados ? (
            <p
              style={{
                textAlign: 'center',
                margin: '40px 0',
              }}
            >
              Cargando profesionales...
            </p>
          ) : destacados.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                margin: '40px 0',
              }}
            >
              Aún no hay perfiles destacados publicados.
            </p>
          ) : (
            <div className="in-grid-destacados">
              {destacados.map((perfil) => (
                <TarjetaPerfil
                  key={perfil.id_trabajador}
                  perfil={perfil}
                />
              ))}
            </div>
          )}
        </section>

        {/* Cómo funciona */}
        <section className="in-seccion-como-funciona">
          <h2>Cómo funciona</h2>

          <p className="in-subtitulo">
            TrabajITO conecta a clientes con trabajadores. Tú consultas
            perfiles, contactas y acuerdas directamente.
          </p>

          <div className="in-grid-pasos">

            {PASOS_INICIO.map((paso) => (
              <div className="in-paso" key={paso.numero}>
                <div className="in-paso-numero">{paso.numero}</div>

                <div className="in-paso-texto">
                  <h4>{paso.titulo}</h4>
                  <p>{paso.descripcion}</p>
                </div>
              </div>
            ))}

          </div>
        </section>

      </main>

      {/* Pie de página */}
      <Footer className="in-footer" />

    </div>
  )
}
