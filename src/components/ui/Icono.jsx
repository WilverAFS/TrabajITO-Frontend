const imagenes = import.meta.glob('../../assets/iconos/*.svg', {
  eager: true,
  import: 'default',
  query: '?url&no-inline',
})

export default function Icono({ nombre, className = '' }) {
  const src = imagenes[`../../assets/iconos/${nombre}.svg`]
  return src ? <img className={`tj-icono ${className}`} src={src} alt="" aria-hidden="true" /> : null
}
