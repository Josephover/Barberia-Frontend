import { useState, useEffect } from 'react';
import { crearServicio, registrarUsuario, crearBarbero, getBarberos, crearHorario } from '../../api/citasApi';
import toast from 'react-hot-toast';
export default function Dashboard() {
  // --- Formulario de Servicio ---
  const [nombreServicio, setNombreServicio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [msgServicio, setMsgServicio] = useState('');

const handleCrearServicio = async (e) => {
  e.preventDefault();
  try {
    await crearServicio({
      nombre: nombreServicio,
      duracionMinutos: Number(duracion),
      precio: Number(precio),
      activo: true,
    });
    toast.success('Servicio creado correctamente');
    setNombreServicio(''); setDuracion(''); setPrecio('');
  } catch (err) {
    toast.error(err.response?.data?.error || 'Error al crear servicio');
  }
};

  // --- Formulario de Barbero (registro + conversión en un solo paso) ---
  const [nombreBarbero, setNombreBarbero] = useState('');
  const [emailBarbero, setEmailBarbero] = useState('');
  const [passwordBarbero, setPasswordBarbero] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [msgBarbero, setMsgBarbero] = useState('');

const handleCrearBarbero = async (e) => {
  e.preventDefault();
  try {
    const usuarioCreado = await registrarUsuario({
      nombre: nombreBarbero,
      email: emailBarbero,
      password: passwordBarbero,
      telefono: '0000000000',
      rol: 'BARBERO',
    });
    await crearBarbero(usuarioCreado.id, { especialidad });
    toast.success('Barbero registrado y vinculado correctamente');
    setNombreBarbero(''); setEmailBarbero(''); setPasswordBarbero(''); setEspecialidad('');
    setMsgBarbero(Date.now()); // truco para disparar el useEffect que refresca el <select>
  } catch (err) {
    toast.error(err.response?.data?.error || 'Error al crear barbero');
  }
};
// --- Formulario de Horario ---
const [barberos, setBarberos] = useState([]);
const [barberoSeleccionado, setBarberoSeleccionado] = useState('');
const [diaSemana, setDiaSemana] = useState('MONDAY');
const [horaInicio, setHoraInicio] = useState('09:00');
const [horaFin, setHoraFin] = useState('18:00');
const [msgHorario, setMsgHorario] = useState('');

useEffect(() => {
  getBarberos().then(setBarberos);
}, [msgBarbero]); // se refresca la lista cada vez que se crea un barbero nuevo

const handleCrearHorario = async (e) => {
  e.preventDefault();
  try {
    await crearHorario(Number(barberoSeleccionado), {
      diaSemana,
      horaInicio: `${horaInicio}:00`,
      horaFin: `${horaFin}:00`,
    });
    toast.success('Horario asignado correctamente');
  } catch (err) {
    toast.error(err.response?.data?.error || 'Error al crear horario');
  }
};

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Dashboard Admin</h2>

      <section style={{ marginBottom: 40 }}>
        <h3>Crear servicio</h3>
        <form onSubmit={handleCrearServicio}>
          <input placeholder="Nombre (ej. Corte clásico)" value={nombreServicio}
            onChange={(e) => setNombreServicio(e.target.value)} required />
          <input type="number" placeholder="Duración (min)" value={duracion}
            onChange={(e) => setDuracion(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Precio" value={precio}
            onChange={(e) => setPrecio(e.target.value)} required />
          <button type="submit">Crear servicio</button>
        </form>
        {msgServicio && <p>{msgServicio}</p>}
      </section>

      <section>
        <h3>Registrar barbero</h3>
        <form onSubmit={handleCrearBarbero}>
          <input placeholder="Nombre" value={nombreBarbero}
            onChange={(e) => setNombreBarbero(e.target.value)} required />
          <input type="email" placeholder="Email" value={emailBarbero}
            onChange={(e) => setEmailBarbero(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={passwordBarbero}
            onChange={(e) => setPasswordBarbero(e.target.value)} required />
          <input placeholder="Especialidad (opcional)" value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)} />
          <button type="submit">Registrar barbero</button>
        </form>
        {msgBarbero && <p>{msgBarbero}</p>}
      </section>
      <section style={{ marginTop: 40 }}>
  <h3>Asignar horario a un barbero</h3>
  <form onSubmit={handleCrearHorario}>
    <select value={barberoSeleccionado} onChange={(e) => setBarberoSeleccionado(e.target.value)} required>
      <option value="">Selecciona un barbero</option>
      {barberos.map(b => (
        <option key={b.id} value={b.id}>{b.usuario.nombre}</option>
      ))}
    </select>

    <select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)}>
      <option value="MONDAY">Lunes</option>
      <option value="TUESDAY">Martes</option>
      <option value="WEDNESDAY">Miércoles</option>
      <option value="THURSDAY">Jueves</option>
      <option value="FRIDAY">Viernes</option>
      <option value="SATURDAY">Sábado</option>
      <option value="SUNDAY">Domingo</option>
    </select>

    <label>Desde</label>
    <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />

    <label>Hasta</label>
    <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />

    <button type="submit">Asignar horario</button>
  </form>
  {msgHorario && <p>{msgHorario}</p>}
</section>
    </div>
  );
}