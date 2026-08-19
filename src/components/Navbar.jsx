import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // no mostrar navbar si no hay sesión (ej. en /login)

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      borderBottom: '1px solid #ddd',
    }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <strong>💈 Barbería</strong>

        {user.rol === 'CLIENTE' && (
          <>
            <Link to="/cliente/reservar">Reservar</Link>
            <Link to="/cliente/mis-citas">Mis Citas</Link>
          </>
        )}

        {user.rol === 'BARBERO' && (
          <Link to="/barbero/agenda">Mi Agenda</Link>
        )}

        {user.rol === 'ADMIN' && (
          <Link to="/admin">Dashboard</Link>
        )}
      </div>

      <div>
        <span style={{ marginRight: 12 }}>{user.nombre} ({user.rol})</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}