import { Routes, Route } from 'react-router-dom';
import Login from './page/Login.jsx';
import ReservarCita from './page/cliente/ReservarCita';
import MisCitas from './page/cliente/MisCitas';

import ProtectedRoute from './auth/ProtectedRoute';

function AdminPlaceholder() { return <h1>Dashboard Admin</h1>; }
function BarberoPlaceholder() { return <h1>Agenda del Barbero</h1>; }
function ClientePlaceholder() { return <h1>Reservar Cita</h1>; }

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminPlaceholder />
        </ProtectedRoute>
      } />

      <Route path="/barbero/agenda" element={
        <ProtectedRoute allowedRoles={['BARBERO']}>
          <BarberoPlaceholder />
        </ProtectedRoute>
      } />
      <Route path="/cliente/reservar" element={
        <ProtectedRoute allowedRoles={['CLIENTE']}>
          <ReservarCita />
        </ProtectedRoute>
      } />
      <Route path="/cliente/mis-citas" element={
        <ProtectedRoute allowedRoles={['CLIENTE']}>
          <MisCitas />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;