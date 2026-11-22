
export default function CampoAuth({
  etiqueta,
  id,
  placeholder,
  tipo = 'text',
  icono = null,
  autoComplete,
  minLength,
  pattern,
  error = '',
  required = true,
  ...props
}) {
  const idError = `${id}-error`

  return (
    <div className="rg-campo-grupo">
      <label htmlFor={id}>{etiqueta}</label>

      <div
        className={`rg-campo-control ${
          error ? 'rg-campo-control-error' : ''
        }`}
      >
        {icono && (
          <span className="rg-campo-icono">
            {icono}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={tipo}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          pattern={pattern}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? idError : undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={idError} className="rg-campo-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}