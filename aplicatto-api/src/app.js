import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'

// Crear aplicación Express
const app = express()

// Middlewares de seguridad, CORS, body parser y logs HTTP
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Ruta de salud para verificar que el servicio está arriba
app.get('/api/health', (req, res) =>
	res.json({ ok: true, service: 'aplicatto-api', time: new Date().toISOString() })
)

// Rutas de autenticación (registro e inicio de sesión)
app.use('/api/auth', authRoutes)

// Handler 404 para rutas no encontradas
app.use((req, res) => {
	return res.status(404).json({ ok: false, error: 'Recurso no encontrado' })
})

// Handler centralizado de errores (evita fugas de stack traces)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error('[ERROR]', err)
	return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
})

export default app
