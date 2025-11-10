import { z } from 'zod'

// Helpers para normalizar strings (trim y colapsar espacios internos)
const trimAndCollapse = (val) => val.trim().replace(/\s+/g, ' ')

// Schema de registro: valida y normaliza campos
export const registerSchema = z.object({
  nombre: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(60, 'Máximo 60 caracteres')
    .transform(trimAndCollapse),
  email: z.string()
    .trim()
    .email('Email inválido')
    .transform(e => e.toLowerCase()),
  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .max(128, 'Máximo 128 caracteres')
})

// Schema de login: sólo email y password
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Email inválido')
    .transform(e => e.toLowerCase()),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})
