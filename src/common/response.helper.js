// ============================================================
// HELPER DE RESPUESTAS HTTP
// Estandariza el formato de todas las respuestas de la API
// Así el frontend siempre recibe la misma estructura:
// { ok: true, data: [...] } o { ok: false, error: '...' }
// ============================================================

// Respuesta exitosa
export const ok = (res, data, mensaje, statusCode = 200) => {
  return res.status(statusCode).json({
    ok: true,
    mensaje: mensaje ?? null,
    data,
  });
};

// Respuesta de error
export const fail = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    ok: false,
    error: error ?? 'Error interno del servidor',
  });
};