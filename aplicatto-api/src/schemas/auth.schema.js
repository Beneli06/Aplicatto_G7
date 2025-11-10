import { z } from 'zod'

// Helpers para normalizar strings (trim y colapsar espacios internos)
const trimAndCollapse = (val) => val.trim().replace(/\s+/g, ' ')

// Schema de registro: valida y normaliza campos
export const registerSchema = z.object({
  nombre: z.string()
    .transform(trimAndCollapse)
    .min(3, 'Mínimo 3 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  email: z.string()
    .email('Email inválido')
    .transform(e => e.toLowerCase().trim()),
  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .max(128, 'Máximo 128 caracteres')
})

// Schema de login: sólo email y password
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .transform(e => e.toLowerCase().trim()),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})
