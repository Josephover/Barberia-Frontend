import { useState, useEffect } from 'react';
import { getServicios, getBarberos, crearCita } from '../../api/citasApi';

export default function ReservarCita() {
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [servicioId, setServicioId] = useState('');
  const [barberoId, setBarberoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getServicios().then(setServicios);
    getBarberos().then(setBarberos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const fechaHora = `${fecha}T${hora}:00`;

    try {
      await crearCita(Number(barberoId), Number(servicioId), fechaHora);
      setMensaje('¡Cita reservada con éxito!');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo reservar la cita';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Reservar cita</h2>
      <form onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label>Barbero</label>
          <select value={barberoId} onChange={(e) => setBarberoId(e.target.value)} required>
            <option value="">Selecciona un barbero</option>
            {barberos.map(b => (
              <option key={b.id} value={b.id}>{b.usuario.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </div>

        <div>
          <label>Hora</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
}