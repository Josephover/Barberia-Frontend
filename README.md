# 💈 Sistema de Reservas — Barbería (Frontend)

Interfaz web para el [backend de Spring Boot](https://github.com/Josephover/barberia-backend) del sistema de reservas. Tres experiencias distintas según el rol: el cliente reserva con un calendario visual sin tener que conocer la agenda de ningún barbero (el sistema se lo asigna automáticamente), el barbero gestiona su propia agenda, y el admin administra servicios, barberos y horarios.

## 🌐 Demo en vivo

**[barberia-frontend-topaz.vercel.app](https://barberia-frontend-topaz.vercel.app)**

Para explorar sin registrarte, en la pantalla de login hay acceso directo con cuentas de ejemplo:

| Rol | Email | Contraseña |
|---|---|---|
| Barbero | `willy@barberia.com` | `123` |
| Cliente | `juan@gmail.com` | `123` |

> El panel de Admin (gestión de servicios, barberos y horarios) no está expuesto públicamente para mantener limpios los datos de la demo — con gusto comparto credenciales de admin a quien lo solicite.

## 🧩 La decisión de UX central

En vez de obligar al cliente a elegir un barbero y luego adivinar si tiene hueco libre, el flujo es al revés: el cliente elige un **servicio** y hace click directo en un horario dentro de un **calendario visual** (react-big-calendar). En cuanto lo selecciona, la interfaz consulta en tiempo real qué barbero quedaría asignado (`GET /citas/disponible`) y lo muestra en un selector de solo lectura — con un pequeño *debounce* para no saturar la API. El botón de reservar permanece deshabilitado hasta que hay un barbero confirmado, así el cliente nunca envía una reserva que sabemos de antemano que va a fallar.

## 🎨 Sistema de diseño

Paleta e identidad propia, inspirada en una barbería clásica con acabado moderno:

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#17171A` | Fondo general (carbón cálido) |
| `--surface` | `#201F22` | Tarjetas, navbar |
| `--gold` | `#C89B3C` | Acento principal, botones primarios |
| `--green` | `#3A5941` | Estados de éxito / completado |
| `--red` | `#8C3A3A` | Estados de error / cancelado |

Tipografía: **Fraunces** (serif con carácter) para títulos, **Work Sans** para el cuerpo. Elemento distintivo: una franja diagonal de tres colores como divisor de sección, guiño sutil al barber pole clásico.

## 🛠️ Stack técnico

- React 18 + Vite
- React Router (rutas protegidas por rol)
- Axios (interceptor que adjunta el JWT automáticamente a cada request)
- react-big-calendar + date-fns (selección visual de horario)
- react-hot-toast (notificaciones)
- Docker + Nginx (build de producción) / Vercel (deploy)

## 🗺️ Rutas y roles

| Ruta | Rol requerido | Descripción |
|---|---|---|
| `/login` | Público | Inicio de sesión (con accesos de ejemplo) |
| `/registro` | Público | Registro de nuevos clientes |
| `/cliente/reservar` | CLIENTE | Calendario de reserva con auto-asignación de barbero |
| `/cliente/mis-citas` | CLIENTE | Historial y cancelación de citas propias |
| `/barbero/agenda` | BARBERO | Agenda personal, marcar citas como completadas |
| `/admin` | ADMIN | Crear servicios, registrar barberos, asignar horarios |

Protegidas con un componente `ProtectedRoute` que redirige a `/login` si no hay sesión, o si el rol del usuario no coincide con el requerido.

## 🔐 Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend (ej. `https://barberia-backend-vt5a.onrender.com`). Si no se define, cae a `http://localhost:8080` para desarrollo local. |

## 🚀 Cómo correrlo localmente

### Opción A — modo desarrollo (con el backend corriendo aparte)

```bash
git clone https://github.com/Josephover/barberia-frontend.git
cd barberia-frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Opción B — stack completo con Docker (backend + frontend + base de datos)

Clona ambos repositorios bajo la misma carpeta padre:

```
barberia/
├── barberia-backend/
└── barberia-frontend/
```

Copia el `docker-compose.yml` de este repo a la carpeta `barberia/` y levanta todo:

```bash
docker compose up --build
```

La app queda disponible en `http://localhost:5173`, sirviendo los archivos ya compilados a través de Nginx.

## ✍️ Primeros pasos una vez levantado (modo local)

1. Registra un administrador vía Postman contra `POST http://localhost:8080/auth/register`.
2. Inicia sesión como admin en `/login`.
3. Desde el Dashboard: crea un servicio, registra un barbero, y asígnale un horario laboral.
4. Registra un cliente desde `/registro` y prueba reservar una cita en el calendario.

## 🗺️ Roadmap

- [x] Auto-asignación de barbero con vista previa en tiempo real
- [x] Calendario visual (react-big-calendar) para elegir horario
- [x] Deploy en producción (Vercel)
- [ ] Notificación por email al confirmar una cita

## 👤 Autor

Joseph André Sánchez Verdesoto
[GitHub](https://github.com/Josephover) · [LinkedIn](https://linkedin.com/in/joseph-sánchez-b83211188)