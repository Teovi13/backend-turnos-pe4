# Backend de Turnos y Reservas - Pre-entrega 4

API REST de servicios y reservas (Express + FileSystem) reorganizada en tres capas: routers, controllers y managers. Los endpoints y su comportamiento son los mismos que en la entrega anterior.

## Instalación y ejecución

```bash
git clone https://github.com/Teovi13/backend-turnos-pe4.git
cd backend-turnos-pe4
npm install
cp .env.example .env
npm start
```

El servidor queda en `http://localhost:8080`.

## Variables de entorno

| Variable   | Ejemplo       |
| ---------- | ------------- |
| `PORT`     | `8080`        |
| `NODE_ENV` | `development` |

## Organización del proyecto

```
Cliente → Router → Controller → Manager → archivo JSON
```

| Capa       | Archivos                                              | Responsabilidad                                                                 |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Router     | `routes/services.router.js`, `routes/bookings.router.js` | Define los endpoints y los conecta con el controller. No contiene lógica.   |
| Controller | `controllers/services.controller.js`, `controllers/bookings.controller.js` | Lee `req.params`, `req.query` y `req.body`, llama al manager y responde con `res.status().json()`. |
| Manager    | `managers/ServiceManager.js`, `managers/BookingManager.js` | Valida datos, genera ids y lee/escribe los JSON. No usa `req` ni `res`.  |

Funciones de los controllers:

- `services.controller.js`: `getServices`, `getServiceById`, `createService`, `updateService`, `deleteService`.
- `bookings.controller.js`: `createBooking`, `getBookingById`, `addServiceToBooking` (valida la existencia del servicio con `ServiceManager`).

Los errores de validación llegan al middleware de errores de `app.js` con `next(error)` y se responden con 400.

## Endpoints

| Método | Ruta                               | Descripción                         | Códigos       |
| ------ | ---------------------------------- | ----------------------------------- | ------------- |
| GET    | `/api/services`                    | Lista servicios (`?category=`, `?available=`) | 200, 400 |
| GET    | `/api/services/:sid`               | Obtiene un servicio                 | 200, 404      |
| POST   | `/api/services`                    | Crea un servicio                    | 201, 400      |
| PUT    | `/api/services/:sid`               | Actualiza un servicio               | 200, 400, 404 |
| DELETE | `/api/services/:sid`               | Elimina un servicio                 | 200, 404      |
| POST   | `/api/bookings`                    | Crea una reserva                    | 201, 400      |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva                 | 200, 404      |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva    | 200, 400, 404 |

## Ejemplo

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Ana Pérez","clientEmail":"ana@mail.com","date":"2026-11-05","time":"10:30"}'

curl -X POST http://localhost:8080/api/bookings/<bid>/services/4971a0ab-8dcf-42a8-a230-38db8e38e674
```
