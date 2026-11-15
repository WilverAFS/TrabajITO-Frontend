export default function SelectorOficios({ oficios, seleccionados, onAlternar, disabled = false }) {
  return (
    <div className="pp-lista-oficios">
      {oficios.map((oficio) => (
        <label className="pp-opcion-oficio" key={oficio.id_oficio}>
          <input
            type="checkbox"
            checked={seleccionados.includes(String(oficio.id_oficio))}
            onChange={() => onAlternar(String(oficio.id_oficio))}
            disabled={disabled}
          />
          <span>{oficio.nombre}</span>
        </label>
      ))}
    </div>
  )
}
