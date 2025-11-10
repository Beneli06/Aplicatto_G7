import bcrypt from 'bcryptjs'

// Genera el hash de la contraseña usando bcrypt (cost = 10)
export async function hashPassword(plain) {
	const salt = await bcrypt.genSalt(10)
	return await bcrypt.hash(plain, salt)
}

// Compara contraseña en texto plano contra hash almacenado
export async function comparePassword(plain, hashed) {
	return await bcrypt.compare(plain, hashed)
}
