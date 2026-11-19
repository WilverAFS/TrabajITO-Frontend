import { solicitud } from './apiClient.js'

// Crear una solicitud de contratación.
export function crearContratacion(
  { id_trabajador, descripcion_servicio },
  { signal } = {},
) {
  return solicitud('/contrataciones', {
    method: 'POST',
    autenticado: true,
    data: {
      id_trabajador: Number(id_trabajador),
      descripcion_servicio,
    },
    signal,
  })
}

// Listar contrataciones con filtros y paginación del servidor.
export function listarContrataciones({
  participacion,
  id_estado,
  pagina = 1,
  porPagina = 10,
  signal,
} = {}) {
  const params = {
    page: pagina,
    per_page: porPagina,
  }

  if (participacion) params.participacion = participacion
  if (id_estado) params.id_estado = id_estado

  return solicitud('/contrataciones', {
    autenticado: true,
    params,
    conMeta: true,
    signal,
  })
}

// Consultar el detalle de una contratación.
export function obtenerContratacion(id, { signal } = {}) {
  return solicitud(`/contrataciones/${encodeURIComponent(id)}`, {
    autenticado: true,
    signal,
  })
}

const ACCIONES_CONTRATACION = [
  'aceptar',
  'rechazar',
  'iniciar',
  'finalizar',
  'cancelar',
]

// Ejecutar una transición permitida por el backend.
export function ejecutarAccionContratacion(id, accion, { signal } = {}) {
  if (!ACCIONES_CONTRATACION.includes(accion)) {
    throw new Error('La acción de contratación no es válida.')
  }

  return solicitud(
    `/contrataciones/${encodeURIComponent(id)}/${accion}`,
    {
      method: 'PATCH',
      autenticado: true,
      signal,
    },
  )
}
