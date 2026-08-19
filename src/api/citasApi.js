import axiosClient from './axiosClient';

export const getServicios = () => axiosClient.get('/servicios').then(res => res.data);

export const getBarberos = () => axiosClient.get('/barberos').then(res => res.data);

export const getHorariosBarbero = (barberoId) =>
  axiosClient.get(`/horarios/barbero/${barberoId}`).then(res => res.data);

export const crearCita = (barberoId, servicioId, fechaHora) =>
  axiosClient.post('/citas', { barberoId, servicioId, fechaHora }).then(res => res.data);

export const getMisCitas = () =>
  axiosClient.get('/citas/mias').then(res => res.data);

export const cancelarCita = (citaId) =>
  axiosClient.patch(`/citas/${citaId}/cancelar`).then(res => res.data);