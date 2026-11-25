
import { Navigate } from 'react-router'
import { obtenerToken } from '../services/apiClient.js'

// Restringe el acceso a las rutas que requieren autenticación.
export default function RutaProtegida({ children }) {
  if (!obtenerToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}