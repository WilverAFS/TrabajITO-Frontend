export default function AlertasPanel({ error, exito }) {
  return (
    <>
      {error && <p className="pc-alerta pc-alerta-error" role="alert">{error}</p>}
      {exito && <p className="pc-alerta pc-alerta-exito" role="status">{exito}</p>}
    </>
  )
}
