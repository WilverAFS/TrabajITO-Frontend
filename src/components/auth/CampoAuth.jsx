export default function CampoAuth({
  etiqueta,
  id,
  placeholder,
  tipo = 'text',
  icono = null,
  autoComplete,
  minLength,
}) {
  return (
    <div className="rg-campo-grupo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="rg-campo-control">
        {icono && <span className="rg-campo-icono">{icono}</span>}
        <input
          id={id}
          name={id}
          type={tipo}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
      </div>
    </div>
  )
}
