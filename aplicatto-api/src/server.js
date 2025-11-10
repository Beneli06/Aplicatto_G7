// Carga variables de entorno desde .env
import 'dotenv/config'
import app from './app.js'

// Arranque del servidor HTTP
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`[API] http://localhost:${PORT}`)
})
