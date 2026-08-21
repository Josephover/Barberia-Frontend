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
  <nav className="navbar">
    <div className="navbar-links">
      <span className="navbar-brand">💈 Barbería</span>

      {user.rol === 'CLIENTE' && (
        <>
          <Link to="/cliente/reservar">Reservar</Link>
          <Link to="/cliente/mis-citas">Mis Citas</Link>
        </>
      )}

      {user.rol === 'BARBERO' && <Link to="/barbero/agenda">Mi Agenda</Link>}

      {user.rol === 'ADMIN' && <Link to="/admin">Dashboard</Link>}
    </div>

    <div className="navbar-user">
      <span>{user.nombre} · {user.rol}</span>
      <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  </nav>
);
}