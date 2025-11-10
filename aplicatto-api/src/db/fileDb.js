import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolver ruta absoluta hacia data/users.json
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(__dirname, '..', '..', 'data', 'users.json')

// Crea el archivo si no existe (inicializa estructura básica)
async function ensureFile() {
	try {
		await fs.access(DATA_PATH)
	} catch {
		await fs.writeFile(DATA_PATH, JSON.stringify({ users: [], seq: 1 }, null, 2))
	}
}

// Carga la "BD" (archivo JSON) a memoria
export async function loadDb() {
	await ensureFile()
	const raw = await fs.readFile(DATA_PATH, 'utf-8')
	return JSON.parse(raw)
}

// Persiste los cambios en disco (se deja .bak como copia de seguridad simple)
export async function saveDb(db) {
	await fs.writeFile(DATA_PATH + '.bak', JSON.stringify(db, null, 2))
	await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2))
}
