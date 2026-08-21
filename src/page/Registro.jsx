import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register({
        nombre,
        email,
        password,
        telefono,
        rol: 'CLIENTE', // el registro público siempre crea clientes
      });
      navigate('/cliente/reservar');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo completar el registro');
    }
  };

  return (
    <div className="auth-container">
      <div className="section-card">
        <h2>Crear cuenta</h2>
        <div className="stripe-divider" />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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

          <button type="submit">Crear cuenta</button>
        </form>
      </div>

      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
