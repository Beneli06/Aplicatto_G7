import jwt from 'jsonwebtoken'
import { loadDb, saveDb } from '../db/fileDb.js'
import { hashPassword, comparePassword } from '../utils/hash.js'

// Parámetros de JWT (usar variables de entorno en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const TOKEN_TTL = process.env.TOKEN_TTL || '2h'

/**
 * Controlador: Registro de usuario
 * Entrada: { nombre, email, password }
 * Salida: 201 con datos básicos del usuario (sin password) o error 409 si email existe
 */
export async function register(req, res){
  const { nombre, email, password } = req.body

  // Cargar "base de datos" JSON
  const db = await loadDb()

  // Verificar unicidad de email (normalizado en schema)
  const exists = db.users.find(u => u.email === email)
  if (exists) return res.status(409).json({ ok: false, error: 'El email ya está registrado' })

  // Hashear la contraseña antes de guardar
  const passwordHash = await hashPassword(password)

  // Persistir usuario
  const user = { id: db.seq++, nombre, email, passwordHash, createdAt: new Date().toISOString() }
  db.users.push(user)
  await saveDb(db)

  // Responder sin exponer hash de contraseña
  return res.status(201).json({ ok: true, message: 'Usuario registrado correctamente', user: { id: user.id, nombre, email } })
}

/**
 * Controlador: Inicio de sesión
 * Entrada: { email, password }
 * Salida: 200 con token JWT o 401 si credenciales inválidas
 */
export async function login(req, res){
  const { email, password } = req.body
  const db = await loadDb()

  // Buscar usuario por email
  const user = db.users.find(u => u.email === email)
  if (!user) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })

  // Comparar contraseña ingresada vs hash almacenado
  const valid = await comparePassword(password, user.passwordHash)
  if (!valid) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })

  // Emitir JWT de corta duración con subject = id del usuario
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL })
  return res.json({ ok: true, message: 'Autenticación satisfactoria', token })
}

/**
 * Controlador: Perfil del usuario autenticado.
 * Requiere que el middleware de auth haya colocado req.user.
 */
export async function me(req, res){
  // req.user viene del middleware verifyToken
  const { id, nombre, email, createdAt } = req.user
  return res.json({ ok:true, user:{ id, nombre, email, createdAt } })
}
