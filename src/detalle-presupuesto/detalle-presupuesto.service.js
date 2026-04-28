// ── ACTUALIZAR ─────────────────────────────────────────────
// Si el estado cambia a Aprobado (3) → descuenta stock
// Si el estado cambia de Aprobado a otro → restaura stock
export const update = async (id, body) => {
  const presupuestoActual = await findOne(id)

  const { data, error } = await supabase
    .from('presupuestos')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  const estadoAnterior = presupuestoActual.estado_id
  const estadoNuevo    = Number(body.estado_id)

  // Importamos las funciones de stock
  const { descontarStock, restaurarStock } = await import(
    '../detalle-presupuesto/detalle-presupuesto.service.js'
  )

  // Si pasó a Aprobado → descuenta stock
  if (estadoNuevo === 3 && estadoAnterior !== 3) {
    await descontarStock(presupuestoActual.orden_trabajo_id)
  }

  // Si estaba Aprobado y cambió a otro estado → restaura stock
  if (estadoAnterior === 3 && estadoNuevo !== 3) {
    await restaurarStock(presupuestoActual.orden_trabajo_id)
  }

  return data
}