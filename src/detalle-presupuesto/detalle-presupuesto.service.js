// ============================================================
// SERVICE DE DETALLE DE MATERIALES
// Si el presupuesto está Aprobado, mueve stock en tiempo real
// ============================================================

import supabase from '../supabase/supabase.js'

// ── HELPER: obtener estado del presupuesto ────────────────
const getPresupuesto = async (presupuesto_id) => {
  const { data, error } = await supabase
    .from('presupuestos')
    .select('id, estado_id, orden_trabajo_id')
    .eq('id', presupuesto_id)
    .single()

  if (error) throw new Error('Presupuesto no encontrado')
  return data
}

// ── HELPER: mover stock de un material ───────────────────
const moverStock = async (material_id, cantidad, operacion) => {
  const { data: material, error } = await supabase
    .from('materiales')
    .select('stock_actual')
    .eq('id', material_id)
    .single()

  if (error) throw new Error('Material no encontrado')

  const nuevoStock = operacion === 'descontar'
    ? Math.max(0, material.stock_actual - Number(cantidad))
    : material.stock_actual + Number(cantidad)

  await supabase
    .from('materiales')
    .update({ stock_actual: nuevoStock })
    .eq('id', material_id)
}

// ── OBTENER MATERIALES DE UN PRESUPUESTO ──────────────────
export const findByPresupuesto = async (presupuesto_id) => {
  const presupuesto = await getPresupuesto(presupuesto_id)

  const { data, error } = await supabase
    .from('detalle_materiales')
    .select(`
      *,
      materiales (
        id,
        nombre,
        unidad,
        precio_venta,
        stock_actual
      )
    `)
    .eq('orden_trabajo_id', presupuesto.orden_trabajo_id)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// ── AGREGAR MATERIAL ──────────────────────────────────────
export const addMaterial = async ({ presupuesto_id, material_id, cantidad, precio_unitario }) => {
  if (!presupuesto_id) throw new Error('presupuesto_id es requerido')
  if (!material_id)    throw new Error('material_id es requerido')

  const presupuesto = await getPresupuesto(presupuesto_id)
  const orden_trabajo_id = presupuesto.orden_trabajo_id
  const estaAprobado = Number(presupuesto.estado_id) === 3

  // Verificamos que el material exista
  const { data: material, error: matError } = await supabase
    .from('materiales')
    .select('id, precio_venta, stock_actual')
    .eq('id', material_id)
    .single()

  if (matError) throw new Error('Material no encontrado')

  // Verificamos si ya existe en el detalle
  const { data: existing } = await supabase
    .from('detalle_materiales')
    .select('id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)
    .eq('material_id', material_id)
    .maybeSingle()

  let resultado

  if (existing) {
    const cantidadDelta = Number(cantidad)

    const { data, error } = await supabase
      .from('detalle_materiales')
      .update({
        cantidad:        Number(existing.cantidad) + cantidadDelta,
        precio_unitario: Number(precio_unitario || material.precio_venta),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Si está aprobado descontamos el delta agregado
    if (estaAprobado) {
      await moverStock(material_id, cantidadDelta, 'descontar')
    }

    resultado = data
  } else {
    const { data, error } = await supabase
      .from('detalle_materiales')
      .insert({
        orden_trabajo_id,
        material_id,
        cantidad:        Number(cantidad),
        precio_unitario: Number(precio_unitario || material.precio_venta),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Si está aprobado descontamos el stock
    if (estaAprobado) {
      await moverStock(material_id, Number(cantidad), 'descontar')
    }

    resultado = data
  }

  return resultado
}

// ── ACTUALIZAR CANTIDAD Y PRECIO ──────────────────────────
export const updateDetalle = async (id, cantidad, precio_unitario, presupuesto_id) => {
  if (Number(cantidad) <= 0) throw new Error('La cantidad debe ser mayor a 0')

  // Obtenemos el detalle actual para calcular el delta
  const { data: detalleActual, error: dError } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('id', id)
    .single()

  if (dError) throw new Error('Detalle no encontrado')

  const { data, error } = await supabase
    .from('detalle_materiales')
    .update({
      cantidad:        Number(cantidad),
      precio_unitario: Number(precio_unitario),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Si el presupuesto está aprobado ajustamos el stock por el delta
  if (presupuesto_id) {
    const presupuesto = await getPresupuesto(presupuesto_id)
    if (Number(presupuesto.estado_id) === 3) {
      const delta = Number(cantidad) - Number(detalleActual.cantidad)
      if (delta > 0) {
        await moverStock(detalleActual.material_id, delta, 'descontar')
      } else if (delta < 0) {
        await moverStock(detalleActual.material_id, Math.abs(delta), 'restaurar')
      }
    }
  }

  return data
}

// ── ELIMINAR ──────────────────────────────────────────────
export const removeMaterial = async (id, presupuesto_id) => {
  // Obtenemos el detalle antes de eliminar
  const { data: detalle, error: dError } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('id', id)
    .single()

  if (dError) throw new Error('Detalle no encontrado')

  const { error } = await supabase
    .from('detalle_materiales')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  // Si el presupuesto está aprobado restauramos el stock
  if (presupuesto_id) {
    const presupuesto = await getPresupuesto(presupuesto_id)
    if (Number(presupuesto.estado_id) === 3) {
      await moverStock(detalle.material_id, detalle.cantidad, 'restaurar')
    }
  }

  return { mensaje: 'Material eliminado' }
}

// ── DESCONTAR STOCK COMPLETO (al aprobar) ─────────────────
export const descontarStock = async (orden_trabajo_id) => {
  const { data: detalles, error } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)

  if (error) throw new Error(error.message)
  if (!detalles?.length) return

  for (const detalle of detalles) {
    await moverStock(detalle.material_id, detalle.cantidad, 'descontar')
  }
}

// ── RESTAURAR STOCK COMPLETO (al desaprobar/eliminar) ─────
export const restaurarStock = async (orden_trabajo_id) => {
  const { data: detalles, error } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)

  if (error) throw new Error(error.message)
  if (!detalles?.length) return

  for (const detalle of detalles) {
    await moverStock(detalle.material_id, detalle.cantidad, 'restaurar')
  }
}