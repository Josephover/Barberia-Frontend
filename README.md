# 💈 Sistema de Reservas — Barbería (Frontend)

Interfaz web para el [backend de Spring Boot](https://github.com/Josephover/barberia-backend) del sistema de reservas. Tres experiencias distintas según el rol: el cliente reserva sin tener que conocer la agenda de ningún barbero (el sistema se lo asigna automáticamente), el barbero gestiona su propia agenda, y el admin administra servicios, barberos y horarios.

## 🧩 La decisión de UX central

En vez de obligar al cliente a elegir un barbero y luego adivinar si tiene hueco libre, el flujo es al revés: el cliente elige **servicio, fecha y hora**, y en cuanto completa esos tres campos, la interfaz consulta en tiempo real qué barbero quedaría asignado (`GET /citas/disponible`) y lo muestra en un selector de solo lectura — con un pequeño *debounce* para no saturar la API mientras el usuario todavía está escribiendo. El botón de reservar permanece deshabilitado hasta que hay un barbero confirmado, así el cliente nunca envía una reserva que sabemos de antemano que va a fallar.

## 🎨 Sistema de diseño

Paleta e identidad propia (no defaults genéricos de framework), inspirada en una barbería clásica pero con acabado moderno:

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#17171A` | Fondo general (carbón cálido) |
| `--surface` | `#201F22` | Tarjetas, navbar |
| `--gold` | `#C89B3C` | Acento principal, botones primarios |
| `--green` | `#3A5941` | Estados de éxito / completado |
| `--red` | `#8C3A3A` | Estados de error / cancelado |

Tipografía: **Fraunces** (serif con carácter) para títulos, **Work Sans** para el cuerpo. Elemento distintivo: una franja diagonal de tres colores (dorado/verde/rojo) como divisor de sección, guiño sutil al barber pole clásico sin ser literal.

Todo vive en `src/styles.css`, con variables CSS reutilizables en vez de estilos inline dispersos por los componentes.

## 🛠️ Stack técnico

- React 18 + Vite
- React Router (rutas protegidas por rol)
- Axios (con interceptor que adjunta el JWT automáticamente a cada request)
- react-hot-toast (notificaciones)
- Docker + Nginx (build de producción)

## 🗺️ Rutas y roles

| Ruta | Rol requerido | Descripción |
|---|---|---|
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de nuevos clientes |
| `/cliente/reservar` | CLIENTE | Reservar cita con auto-asignación de barbero |
| `/cliente/mis-citas` | CLIENTE | Historial y cancelación de citas propias |
| `/barbero/agenda` | BARBERO | Agenda personal, marcar citas como completadas |
| `/admin` | ADMIN | Crear servicios, registrar barberos, asignar horarios |

Las rutas están protegidas con un componente `ProtectedRoute` que redirige a `/login` si no hay sesión, o si el rol del usuario no coincide con el requerido para esa ruta.

## 🚀 Cómo correrlo localmente

### Opción A — modo desarrollo (con el backend corriendo aparte)

Requiere tener el [backend](https://github.com/Josephover/barberia-backend) corriendo en `http://localhost:8080` (con Docker o directo con Maven).

```bash
git clone https://github.com/Josephover/barberia-frontend.git
cd barberia-frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Opción B — stack completo con Docker (backend + frontend + base de datos)

Clona ambos repositorios **bajo la misma carpeta padre**, con estos nombres exactos:

```
barberia/
├── barberia-backend/
└── barberia-frontend/
```

```bash
mkdir barberia && cd barberia
git clone https://github.com/Josephover/barberia-backend.git
git clone https://github.com/Josephover/barberia-frontend.git
```

Copia el `docker-compose.yml` de este repo a la carpeta `barberia/` (un nivel arriba de ambos proyectos) y levanta todo:

```bash
docker compose up --build
```

Esto construye y levanta 3 contenedores: PostgreSQL, el backend de Spring Boot, y el frontend servido por Nginx. La app queda disponible en `http://localhost:5173`.

## ✍️ Primeros pasos una vez levantado

1. Registra un administrador vía Postman contra `POST http://localhost:8080/auth/register` (el registro público del frontend solo crea clientes).
2. Inicia sesión como admin en `http://localhost:5173/login`.
3. Desde el Dashboard: crea un servicio, registra un barbero, y asígnale un horario laboral.
4. Registra un cliente nuevo desde `/registro` y prueba reservar una cita — verás cómo se asigna el barbero automáticamente antes de confirmar.

## 🗺️ Roadmap

- [x] Auto-asignación de barbero con vista previa en tiempo real
- [ ] Calendario visual (react-big-calendar) en vez de inputs de fecha/hora
- [ ] Deploy en producción (Vercel)

## 👤 Autor

Joseph André Sánchez Verdesoto
[GitHub](https://github.com/Josephover) · [LinkedIn](https://linkedin.com/in/joseph-sánchez-b83211188)