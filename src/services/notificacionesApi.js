import { solicitud } from './apiClient.js';

export function listarNotificaciones({ pagina = 1, signal } = {}) {
  return solicitud('/notificaciones', {
    params: { page: pagina },
    autenticado: true,
    signal,
  });
}

export function contarNotificacionesNoLeidas({ signal } = {}) {
  return solicitud('/notificaciones/no-leidas/count', {
    autenticado: true,
    signal,
  });
}

export function marcarNotificacionComoLeida(id, { signal } = {}) {
  return solicitud(
    `/notificaciones/${encodeURIComponent(id)}/leer`,
    {
      method: 'PATCH',
      autenticado: true,
      signal,
    }
  );
}

export function marcarTodasNotificacionesComoLeidas({ signal } = {}) {
  return solicitud('/notificaciones/leer-todas', {
    method: 'PATCH',
    autenticado: true,
    signal,
  });
}
