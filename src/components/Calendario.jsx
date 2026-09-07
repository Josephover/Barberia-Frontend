import { useMemo } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import { localizer } from './calendarLocalizer';
import toast from 'react-hot-toast';

const mensajes = {
  week: 'Semana',
  day: 'Día',
  today: 'Hoy',
  previous: '◀',
  next: '▶',
  noEventsInRange: 'No hay nada en este rango',
  showMore: (total) => `+ ${total} más`,
};

// Se definen UNA sola vez, fuera del componente, para que no cambien
// de identidad en cada render (eso confundía la navegación interna
// del calendario).
const HORA_MIN = new Date(1970, 0, 1, 9, 0);
const HORA_MAX = new Date(1970, 0, 1, 19, 0);
const VISTAS = [Views.WEEK, Views.DAY];

export default function Calendario({ selectedSlot, onSelectSlot }) {
  const events = useMemo(() => {
    if (!selectedSlot) return [];
    return [{
      start: selectedSlot,
      end: new Date(selectedSlot.getTime() + 30 * 60000),
      title: 'Tu horario',
    }];
  }, [selectedSlot]);

  const handleSelectSlot = (slotInfo) => {
    if (slotInfo.start < new Date()) {
      toast.error('No puedes reservar en una fecha u hora pasada');
      return;
    }
    onSelectSlot(slotInfo.start);
  };

  return (
    <Calendar
      localizer={localizer}
      culture="es"
      messages={mensajes}
      defaultView={Views.WEEK}
      views={VISTAS}
      step={30}
      timeslots={1}
      min={HORA_MIN}
      max={HORA_MAX}
      selectable
      events={events}
      onSelectSlot={handleSelectSlot}
      style={{ height: 480 }}
    />
  );
}