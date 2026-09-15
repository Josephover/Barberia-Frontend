import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const CUENTAS_DEMO = [
  { rol: 'Barbero', email: 'willy@barberia.com', password: '123' },
  { rol: 'Cliente', email: 'juan@gmail.com', password: '123' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const irAlDashboard = (rol) => {
    if (rol === 'ADMIN') navigate('/admin');
    else if (rol === 'BARBERO') navigate('/barbero/agenda');
    else navigate('/cliente/reservar');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { rol } = await login(email, password);
      irAlDashboard(rol);
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  const handleLoginDemo = async (cuenta) => {
    setError('');
    setEmail(cuenta.email);
    setPassword(cuenta.password);
    try {
      const { rol } = await login(cuenta.email, cuenta.password);
      irAlDashboard(rol);
    } catch (err) {
      setError('No se pudo iniciar sesión con la cuenta de ejemplo');
    }
  };

  return (
    <div className="auth-container">
      <div className="section-card">
        <h2>Iniciar sesión</h2>
        <div className="stripe-divider" />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="msg-error">{error}</p>}

          <button type="submit">Ingresar</button>
        </form>
      </div>

      <div className="section-card" style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
          👀 ¿Solo estás explorando? Prueba el sistema con una cuenta de ejemplo:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CUENTAS_DEMO.map((cuenta) => (
            <button
              key={cuenta.email}
              type="button"
              className="btn-secondary"
              onClick={() => handleLoginDemo(cuenta)}
              style={{ textAlign: 'left' }}
            >
              Entrar como <strong>{cuenta.rol}</strong>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                {' '}— {cuenta.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="auth-footer">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}