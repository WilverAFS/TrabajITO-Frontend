export function ListaComplementos({ children, label }) {
  return (
    <ul className="pc-lista" aria-label={label}>
      {children}
    </ul>
  )
}

export function ElementoListaComplemento({ children }) {
  return (
    <li className="pc-item">
      {children}
    </li>
  )
}
