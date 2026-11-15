import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ErrorPerfil } from '../../services/perfilProfesionalApi.js'
import {
  listarDisponibilidades,
  crearDisponibilidad,
  editarDisponibilidad,
  eliminarDisponibilidad,
} from '../../services/perfilComplementosApi.js'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const FORMULARIO_VACIO = {
  dia_semana: '1',
  hora_inicio: '09:00',
  hora_fin: '17:00',
  activo: true,
}

const mostrarHora = (hora) => String(hora ?? '').slice(0, 5)

export default function DisponibilidadesPanel() {
  const navigate = useNavigate()
  const [registros, setRegistros] = useState([])
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [idEdicion, setIdEdicion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const manejarError = useCallback((err) => {
    if (err?.name === 'AbortError') return
    if (err instanceof ErrorPerfil && err.status === 401) {
      navigate('/login', { replace: true })
      return
    }
    setError(err?.message || 'No fue posible completar la operación.')
  }, [navigate])

  const cargar = useCallback(async (signal) => {
    const lista = await listarDisponibilidades({ signal })
    setRegistros(Array.isArray(lista) ? lista : [])
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    cargar(controller.signal)
      .catch((err) => { if (!controller.signal.aborted) manejarError(err) })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [cargar, manejarError])

  function modificar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
    setError('')
    setExito('')
  }

  function cancelar() {
    setIdEdicion(null)
    setFormulario(FORMULARIO_VACIO)
    setError('')
  }

  function comenzarEdicion(registro) {
    setIdEdicion(registro.id_disponibilidad)
    setFormulario({
      dia_semana: String(registro.dia_semana),
      hora_inicio: mostrarHora(registro.hora_inicio),
      hora_fin: mostrarHora(registro.hora_fin),
      activo: Boolean(registro.activo),
    })
    setError('')
    setExito('')
  }

  async function guardar(evento) {
    evento.preventDefault()
    setError('')
    setExito('')

    if (!formulario.hora_inicio || !formulario.hora_fin ||
        formulario.hora_inicio >= formulario.hora_fin) {
      setError('La hora de fin debe ser posterior a la hora de inicio.')
      return
    }

    const datos = {
      dia_semana: Number(formulario.dia_semana),
      hora_inicio: formulario.hora_inicio,
      hora_fin: formulario.hora_fin,
    }
    setOcupado(true)
    try {
      if (idEdicion !== null) {
        await editarDisponibilidad(idEdicion, { ...datos, activo: formulario.activo })
      } else {
        await crearDisponibilidad(datos)
      }
      await cargar()
      cancelar()
      setExito(idEdicion !== null ? 'Horario actualizado correctamente.' : 'Horario registrado correctamente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  async function alternar(registro) {
    setError('')
    setExito('')
    setOcupado(true)
    try {
      await editarDisponibilidad(registro.id_disponibilidad, { activo: !registro.activo })
      await cargar()
      setExito('Estado del horario actualizado correctamente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar(registro) {
    if (!window.confirm(`¿Eliminar el horario de ${DIAS[registro.dia_semana - 1]}?`)) return
    setError('')
    setExito('')
    setOcupado(true)
    try {
      await eliminarDisponibilidad(registro.id_disponibilidad)
      await cargar()
      if (idEdicion === registro.id_disponibilidad) cancelar()
      setExito('Horario eliminado correctamente.')
    } catch (err) {
      manejarError(err)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="pc-panel">
      <div className="pc-seccion-titulo">
        <h3>Mis horarios disponibles</h3>
        <p>Registra los periodos en los que puedes atender solicitudes. No se permiten intervalos superpuestos en un mismo día.</p>
      </div>
      {error && <p className="pc-alerta pc-alerta-error" role="alert">{error}</p>}
      {exito && <p className="pc-alerta pc-alerta-exito" role="status">{exito}</p>}
      <div className="pc-dos-columnas">
        <section className="pc-subtarjeta">
          <h4>{idEdicion !== null ? 'Editar disponibilidad' : 'Agregar disponibilidad'}</h4>
          <form onSubmit={guardar} className="pc-formulario">
            <label htmlFor="pc-dia">Día de la semana</label>
            <select id="pc-dia" value={formulario.dia_semana} onChange={(e) => modificar('dia_semana', e.target.value)} disabled={ocupado}>
              {DIAS.map((dia, i) => <option value={i + 1} key={dia}>{dia}</option>)}
            </select>
            <div className="pc-campos-dobles">
              <div>
                <label htmlFor="pc-hora-inicio">Hora de inicio</label>
                <input id="pc-hora-inicio" type="time" required value={formulario.hora_inicio} onChange={(e) => modificar('hora_inicio', e.target.value)} disabled={ocupado} />
              </div>
              <div>
                <label htmlFor="pc-hora-fin">Hora de fin</label>
                <input id="pc-hora-fin" type="time" required value={formulario.hora_fin} onChange={(e) => modificar('hora_fin', e.target.value)} disabled={ocupado} />
              </div>
            </div>
            {idEdicion !== null && (
              <label className="pc-check">
                <input type="checkbox" checked={formulario.activo} onChange={(e) => modificar('activo', e.target.checked)} disabled={ocupado} />
                Horario activo
              </label>
            )}
            <div className="pc-botones">
              <button className="pc-boton" type="submit" disabled={ocupado}>
                {ocupado ? 'Guardando...' : idEdicion !== null ? 'Guardar cambios' : 'Agregar horario'}
              </button>
              {idEdicion !== null && <button className="pc-boton pc-boton-claro" type="button" onClick={cancelar} disabled={ocupado}>Cancelar</button>}
            </div>
          </form>
        </section>

        <section className="pc-subtarjeta" aria-label="Lista de disponibilidades">
          <h4>Horarios registrados ({registros.length})</h4>
          {cargando ? <p role="status">Cargando horarios...</p> : registros.length === 0 ? (
            <p className="pc-vacio">Aún no tienes horarios registrados.</p>
          ) : (
            <ul className="pc-lista">
              {registros.map((registro) => (
                <li className="pc-item" key={registro.id_disponibilidad}>
                  <div className="pc-item-encabezado">
                    <strong>{registro.dia_nombre || DIAS[registro.dia_semana - 1]}</strong>
                    <span className={registro.activo ? 'pc-pill pc-pill-ok' : 'pc-pill'}>{registro.activo ? 'Activo' : 'Inactivo'}</span>
                  </div>
                  <p>{mostrarHora(registro.hora_inicio)} – {mostrarHora(registro.hora_fin)}</p>
                  <div className="pc-botones pc-botones-pequenos">
                    <button type="button" className="pc-boton pc-boton-claro" disabled={ocupado} onClick={() => comenzarEdicion(registro)}>Editar</button>
                    <button type="button" className="pc-boton pc-boton-claro" disabled={ocupado} onClick={() => alternar(registro)}>{registro.activo ? 'Desactivar' : 'Activar'}</button>
                    <button type="button" className="pc-boton pc-boton-peligro" disabled={ocupado} onClick={() => eliminar(registro)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
