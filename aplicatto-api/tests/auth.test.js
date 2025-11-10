import request from 'supertest'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import app from '../src/app.js'

// Ruta al archivo JSON de usuarios, igual que en fileDb.js
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(__dirname, '..', 'data', 'users.json')

// Helper: reiniciar DB entre pruebas para aislamiento
async function resetDB() {
  const empty = { users: [], seq: 1 }
  await fs.writeFile(DATA_PATH, JSON.stringify(empty, null, 2))
}

describe('Auth API', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('debería registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana Docente', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(201)

    expect(res.body.ok).toBe(true)
    expect(res.body.user).toMatchObject({ nombre: 'Ana Docente', email: 'ana@sena.edu.co' })
    expect(res.body.user.id).toBeDefined()
  })

  it('no debería permitir registro con email duplicado', async () => {
    // Registro inicial
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(201)

    // Segundo intento con mismo email
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana 2', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(409)

    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/ya está registrado/i)
  })

  it('debería iniciar sesión con credenciales válidas', async () => {
    // Registrar
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(201)

    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(200)

    expect(res.body.ok).toBe(true)
    expect(res.body.message).toMatch(/Autenticación satisfactoria/i)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(10)
  })

  it('debería rechazar login con contraseña incorrecta', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(201)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@sena.edu.co', password: 'incorrecto' }) // Contraseña válida pero incorrecta
      .expect(401) // Falla autenticación por contraseña incorrecta

    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/credenciales/i)
  })

  it('debería responder 404 para rutas desconocidas', async () => {
    const res = await request(app)
      .get('/api/unknown')
      .expect(404)

    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/no encontrado/i)
  })

  it('debería requerir token para /api/auth/me y devolver el perfil', async () => {
    // Registrar y loguear para obtener token
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(201)

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@sena.edu.co', password: 'seguro123' })
      .expect(200)

    const token = login.body.token

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body.ok).toBe(true)
    expect(res.body.user).toMatchObject({ email: 'ana@sena.edu.co' })
  })

  it('debería rechazar /api/auth/me sin token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .expect(401)

    expect(res.body.ok).toBe(false)
  })
})
