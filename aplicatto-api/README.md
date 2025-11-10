# GA7-220501096-AA5-EV01 — Servicios web (Registro/Login)

Servicio web en Node.js (Express) para registro e inicio de sesión. Almacena usuarios en `data/users.json`, valida entradas con Zod, protege contraseñas con bcrypt y genera JWT.

## Endpoints

- GET `/api/health` — estado del servicio
- POST `/api/auth/register` — registro: `{ nombre, email, password }`
- POST `/api/auth/login` — login: `{ email, password }` → token JWT

Archivo `docs/requests.http` incluye ejemplos listos para usar (VS Code REST Client o Thunder Client).

## Requisitos cumplidos

- Servicio de registro (25%) ✅
- Servicio de inicio de sesión (25%) ✅
- Validaciones de verificación (Zod, normalización) (25%) ✅
- Herramientas de versionamiento (Git) (25%) ✅

## Ejecutar en desarrollo

```bash
npm i
cp .env.example .env
npm run dev
# Abrir: http://localhost:3000/api/health
```

Variables de entorno principales:

- `PORT` — puerto del servidor (default 3000)
- `JWT_SECRET` — clave para firmar JWT (cambiar en producción)
- `TOKEN_TTL` — duración del token (ej. `2h`)

## Respuestas esperadas

- Registro exitoso: `201 { ok:true, message, user:{ id, nombre, email } }`
- Login exitoso: `200 { ok:true, message:'Autenticación satisfactoria', token }`
- Error de validación: `400 { ok:false, error:'Datos inválidos', issues:[...] }`
- Credenciales inválidas: `401 { ok:false, error:'Credenciales inválidas' }`
- Recurso no encontrado: `404 { ok:false, error:'Recurso no encontrado' }`

## Versionamiento (Git)

Pasos típicos para crear el repositorio y publicar (si aún no existe):

```bash
git init
git add .
git commit -m "feat: servicios de registro/login con validaciones y comentarios"
# git branch -M main
# git remote add origin <URL_REPOSITORIO>
# git push -u origin main
```

También se incluye `ENLACE_REPOSITORIO.txt` para consignar la URL del repositorio remoto.

---
Fecha: 2025-11-10
