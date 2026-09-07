import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { getServicios, crearCitaAuto, getBarberoDisponible } from '../../api/citasApi';
import Calendario from '../../components/Calendario';

export default function ReservarCita() {
  const [servicios, setServicios] = useState([]);
  const [servicioId, setServicioId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [barberoAsignado, setBarberoAsignado] = useState(null);
  const [buscandoBarbero, setBuscandoBarbero] = useState(false);
  const [sinDisponibilidad, setSinDisponibilidad] = useState(false);

  useEffect(() => {
    getServicios().then(setServicios);
  }, []);

  // Cada vez que cambian el servicio o el horario elegido en el calendario,
  // buscamos el barbero disponible.
  useEffect(() => {
    setBarberoAsignado(null);
    setSinDisponibilidad(false);

    if (!servicioId || !selectedSlot) return;

    const fechaHora = format(selectedSlot, "yyyy-MM-dd'T'HH:mm:ss");
    setBuscandoBarbero(true);

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
  }, [servicioId, selectedSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Selecciona un horario en el calendario');
      return;
    }

    const fechaHora = format(selectedSlot, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      await crearCitaAuto(Number(servicioId), fechaHora);
      toast.success('¡Cita reservada con éxito!');
      setServicioId('');
      setSelectedSlot(null);
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
    return 'Elige servicio y horario primero';
  };

  return (
    <div className="page-container" style={{ maxWidth: 820 }}>
      <h2>Reservar cita</h2>
      <div className="stripe-divider" />

      <div className="section-card">
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
      </div>

      <div className="section-card">
        <label style={{ marginBottom: 12 }}>Elige un horario en el calendario</label>
        <Calendario selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
      </div>

      <div className="section-card">
        {selectedSlot && (
          <p style={{ marginBottom: 12 }}>
            Horario elegido:{' '}
            <strong>
              {format(selectedSlot, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
            </strong>
          </p>
        )}

        <div className="field">
          <label>Barbero asignado</label>
          <select disabled value="placeholder">
            <option value="placeholder">{textoSelectorBarbero()}</option>
          </select>
        </div>

        <button onClick={handleSubmit} disabled={!barberoAsignado || buscandoBarbero}>
          Reservar
        </button>
      </div>
    </div>
  );
}