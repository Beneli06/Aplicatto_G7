// Middleware de validación reutilizable con Zod.
// Recibe un schema y valida req.body, devolviendo errores normalizados.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    // Normalizar issues para facilitar pruebas y front-end
    const issues = result.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    return res.status(400).json({ ok: false, error: 'Datos inválidos', issues })
  }
  // Usar datos ya saneados (trim/normalize aplicados en el schema)
  req.body = result.data
  next()
}
