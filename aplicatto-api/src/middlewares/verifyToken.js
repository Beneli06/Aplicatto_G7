import jwt from 'jsonwebtoken'
import { loadDb } from '../db/fileDb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

/**
 * Middleware: Verifica JWT en encabezado Authorization: Bearer <token>
 * Si es válido, adjunta el objeto usuario a req.user
 */
export async function verifyToken(req, res, next){
  const auth = req.headers.authorization || ''
  const [, token] = auth.split(' ')
  if(!token) return res.status(401).json({ ok:false, error:'Token faltante' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const db = await loadDb()
    const user = db.users.find(u => u.id === payload.sub)
    if(!user) return res.status(401).json({ ok:false, error:'Token inválido (usuario no existe)' })
    req.user = user
    next()
  } catch (err){
    return res.status(401).json({ ok:false, error:'Token inválido' })
  }
}
