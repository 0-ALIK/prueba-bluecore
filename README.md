# Prueba Bluecore

Prueba técnica para Bluecore: aplicación de solicitud de crédito bancario con backend (Express + Prisma), frontend (Angular) y MySQL.

## Requisitos

- Docker
- Docker Compose

## Pasos para correr el proyecto

1. Clonar el repositorio
2. Ejecutar desde la raíz:

```bash
docker compose up --build
```

Eso levanta los 3 servicios:

| Servicio | Puerto | URL |
|----------|--------|-----|
| MySQL    | 3306   | `localhost:3306` |
| Backend  | 3000   | `http://localhost:3000` |
| Frontend | 4200   | `http://localhost:4200` |

## Sin Docker

Requiere Node.js 22+ y MySQL 8 ejecutándose localmente.

**Backend:**

```bash
cd backend
cp .env.example .env   # editar con tus credenciales
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run start
```

## Endpoints principales

| Método | Ruta | Auth |
|--------|------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| POST | `/credit-applications` | No |
| GET | `/credit-applications` | Sí |
| GET | `/credit-applications/:id` | Sí |
| PATCH | `/credit-applications/:id/status` | Sí |

## Variables de entorno (backend)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string MySQL |
| `DATABASE_HOST` | Host de MySQL |
| `DATABASE_USER` | Usuario de BD |
| `DATABASE_PASSWORD` | Contraseña de BD |
| `DATABASE_NAME` | Nombre de la BD |
| `PORT` | Puerto del servidor |
| `JWT_SECRET` | Clave secreta JWT |
| `JWT_EXPIRES_IN` | Expiración del token |