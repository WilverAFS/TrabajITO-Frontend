
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
  claseGrupo = 'rg-campo-grupo',
  claseControl = 'rg-campo-control',
  claseError = 'rg-campo-error',
  ...props
}) {
  const idError = `${id}-error`

  return (
    <div className={claseGrupo}>
      <label htmlFor={id}>{etiqueta}</label>

      <div
        className={`${claseControl} ${
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
        <p id={idError} className={claseError} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}