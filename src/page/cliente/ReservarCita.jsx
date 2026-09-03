import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getServicios, crearCitaAuto, getBarberoDisponible } from '../../api/citasApi';

export default function ReservarCita() {
  const [servicios, setServicios] = useState([]);
  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const [barberoAsignado, setBarberoAsignado] = useState(null);
  const [buscandoBarbero, setBuscandoBarbero] = useState(false);
  const [sinDisponibilidad, setSinDisponibilidad] = useState(false);

  useEffect(() => {
    getServicios().then(setServicios);
  }, []);

  // Cada vez que cambian servicio, fecha u hora, buscamos el barbero disponible
  useEffect(() => {
    setBarberoAsignado(null);
    setSinDisponibilidad(false);

    if (!servicioId || !fecha || !hora) return;

    const fechaHora = `${fecha}T${hora}:00`;
    setBuscandoBarbero(true);

    // pequeño debounce para no disparar la llamada en cada tecla
    const timeoutId = setTimeout(() => {
      getBarberoDisponible(servicioId, fechaHora)
        .then((barbero) => {
          setBarberoAsignado(barbero);
          setSinDisponibilidad(false);
        })
        .catch(() => {
          setBarberoAsignado(null);
          setSinDisponibilidad(true);
        })
        .finally(() => setBuscandoBarbero(false));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [servicioId, fecha, hora]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaHora = `${fecha}T${hora}:00`;

    try {
      await crearCitaAuto(Number(servicioId), fechaHora);
      toast.success('¡Cita reservada con éxito!');
      setServicioId(''); setFecha(''); setHora('');
      setBarberoAsignado(null);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo reservar la cita';
      toast.error(msg);
    }
  };

  const textoSelectorBarbero = () => {
    if (buscandoBarbero) return 'Buscando barbero disponible...';
    if (sinDisponibilidad) return 'Sin disponibilidad en ese horario';
    if (barberoAsignado) return barberoAsignado.nombre;
    return 'Elige servicio, fecha y hora primero';
  };

  return (
    <div className="page-container">
      <h2>Reservar cita</h2>
      <div className="stripe-divider" />

      <div className="section-card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Servicio</label>
            <select value={servicioId} onChange={(e) => setServicioId(e.target.value)} required>
              <option value="">Selecciona un servicio</option>
              {servicios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — {s.duracionMinutos} min — ${s.precio}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>

            <div className="field">
              <label>Hora</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label>Barbero asignado</label>
            <select disabled value="placeholder">
              <option value="placeholder">{textoSelectorBarbero()}</option>
            </select>
          </div>

          <button type="submit" disabled={!barberoAsignado || buscandoBarbero}>
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
}