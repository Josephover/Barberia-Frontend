import { Routes, Route } from 'react-router-dom';
import Login from './page/Login.jsx';
import ReservarCita from './page/cliente/ReservarCita';
import MisCitas from './page/cliente/MisCitas';
import MiAgenda from './page/barbero/MiAgenda';
import Navbar from './components/Navbar';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './page/admin/Dashboard';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/barbero/agenda" element={
          <ProtectedRoute allowedRoles={['BARBERO']}>
            <MiAgenda />
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
        <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Dashboard />
        </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;