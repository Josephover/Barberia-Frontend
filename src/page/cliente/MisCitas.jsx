import { useState, useEffect } from 'react';
import { getMisCitas, cancelarCita } from '../../api/citasApi';

export default function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');

  const cargarCitas = () => {
    getMisCitas().then(setCitas).catch(() => setError('No se pudieron cargar las citas'));
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleCancelar = async (id) => {
    setError('');
    try {
      await cancelarCita(id);
      cargarCitas(); // recarga la lista para reflejar el nuevo estado
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cancelar la cita');
    }
  };

  const colorEstado = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return '#e0a800';
      case 'CONFIRMADA': return '#0d6efd';
      case 'COMPLETADA': return '#198754';
      case 'CANCELADA': return '#dc3545';
      default: return '#666';
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Mis citas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {citas.length === 0 && <p>No tienes citas reservadas todavía.</p>}

      {citas.map((cita) => (
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
            <strong>{cita.servicio.nombre}</strong> con {cita.barbero.usuario.nombre}
            <br />
            <span>{new Date(cita.fechaHora).toLocaleString('es-EC', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}</span>
            <br />
            <span style={{ color: colorEstado(cita.estado), fontWeight: 'bold' }}>
              {cita.estado}
            </span>
          </div>

          {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
            <button onClick={() => handleCancelar(cita.id)}>Cancelar</button>
          )}
        </div>
      ))}
    </div>
  );
}