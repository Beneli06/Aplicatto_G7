import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

// Router dedicado a operaciones de autenticación
const router = Router()

// Registro de usuario nuevo
router.post('/register', validate(registerSchema), register)

// Inicio de sesión (devuelve JWT si credenciales son válidas)
router.post('/login', validate(loginSchema), login)

export default router
