import { useState, useEffect } from 'react';
import { getMiAgenda, completarCita } from '../../api/citasApi';

export default function MiAgenda() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');

  const cargarAgenda = () => {
    getMiAgenda().then(setCitas).catch(() => setError('No se pudo cargar la agenda'));
  };

  useEffect(() => {
    cargarAgenda();
  }, []);

  const handleCompletar = async (id) => {
    setError('');
    try {
      await completarCita(id);
      cargarAgenda();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo completar la cita');
    }
  };

  const citasOrdenadas = [...citas].sort(
    (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)
  );

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Mi agenda</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {citasOrdenadas.length === 0 && <p>No tienes citas asignadas.</p>}

      {citasOrdenadas.map((cita) => (
        <div
          key={cita.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>{cita.servicio.nombre}</strong> — {cita.cliente.nombre}
            <br />
            <span>{new Date(cita.fechaHora).toLocaleString('es-EC', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}</span>
            <br />
            <span>{cita.estado}</span>
          </div>

          {cita.estado === 'PENDIENTE' && (
            <button onClick={() => handleCompletar(cita.id)}>Marcar completada</button>
          )}
        </div>
      ))}
    </div>
  );
}