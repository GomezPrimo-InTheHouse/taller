// ============================================================
// SERVICE DE DETALLE DE MATERIALES POR PRESUPUESTO
// Maneja el carrito de materiales y el descuento de stock
// ============================================================

import supabase from '../supabase/supabase.js'

// ── OBTENER MATERIALES DE UN PRESUPUESTO ──────────────────
export const findByPresupuesto = async (presupuesto_id) => {
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
    .eq('orden_trabajo_id', presupuesto_id)

  if (error) throw new Error(error.message)
  return data
}

// ── AGREGAR MATERIAL AL PRESUPUESTO ──────────────────────
// Usa orden_trabajo_id que viene del presupuesto
export const addMaterial = async ({ orden_trabajo_id, material_id, cantidad, precio_unitario }) => {
  // Verificamos que el material exista y tenga stock suficiente
  const { data: material, error: matError } = await supabase
    .from('materiales')
    .select('id, nombre, stock_actual, precio_venta')
    .eq('id', material_id)
    .single()

  if (matError) throw new Error('Material no encontrado')

  // Verificamos si ya existe ese material en el detalle
  const { data: existing } = await supabase
    .from('detalle_materiales')
    .select('id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)
    .eq('material_id', material_id)
    .single()

  if (existing) {
    // Si ya existe, actualizamos la cantidad
    const { data, error } = await supabase
      .from('detalle_materiales')
      .update({
        cantidad: existing.cantidad + cantidad,
        precio_unitario,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // Si no existe, lo insertamos
  const { data, error } = await supabase
    .from('detalle_materiales')
    .insert({ orden_trabajo_id, material_id, cantidad, precio_unitario })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ── ACTUALIZAR CANTIDAD DE UN MATERIAL ────────────────────
export const updateCantidad = async (id, cantidad, precio_unitario) => {
  if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0')

  const { data, error } = await supabase
    .from('detalle_materiales')
    .update({ cantidad, precio_unitario })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ── ELIMINAR MATERIAL DEL PRESUPUESTO ────────────────────
export const removeMaterial = async (id) => {
  const { error } = await supabase
    .from('detalle_materiales')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return { mensaje: 'Material eliminado del presupuesto' }
}

// ── DESCONTAR STOCK AL APROBAR PRESUPUESTO ────────────────
// Se llama cuando el presupuesto cambia a estado = Aprobado (id: 3)
export const descontarStock = async (orden_trabajo_id) => {
  // Traemos todos los materiales del presupuesto
  const { data: detalles, error } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)

  if (error) throw new Error(error.message)
  if (!detalles?.length) return

  // Descontamos stock de cada material
  for (const detalle of detalles) {
    const { data: material } = await supabase
      .from('materiales')
      .select('stock_actual')
      .eq('id', detalle.material_id)
      .single()

    const nuevoStock = Math.max(0, material.stock_actual - detalle.cantidad)

    await supabase
      .from('materiales')
      .update({ stock_actual: nuevoStock })
      .eq('id', detalle.material_id)
  }
}

// ── RESTAURAR STOCK AL RECHAZAR/CANCELAR PRESUPUESTO ──────
// Se llama cuando el presupuesto pasa de Aprobado a otro estado
export const restaurarStock = async (orden_trabajo_id) => {
  const { data: detalles, error } = await supabase
    .from('detalle_materiales')
    .select('material_id, cantidad')
    .eq('orden_trabajo_id', orden_trabajo_id)

  if (error) throw new Error(error.message)
  if (!detalles?.length) return

  for (const detalle of detalles) {
    const { data: material } = await supabase
      .from('materiales')
      .select('stock_actual')
      .eq('id', detalle.material_id)
      .single()

    await supabase
      .from('materiales')
      .update({ stock_actual: material.stock_actual + detalle.cantidad })
      .eq('id', detalle.material_id)
  }
}