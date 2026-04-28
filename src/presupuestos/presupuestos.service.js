// ============================================================
// SERVICE DE PRESUPUESTOS
// ============================================================

import supabase from '../supabase/supabase.js'

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async () => {
  const { data, error } = await supabase
    .from('presupuestos')
    .select(`
      *,
      estados_presupuesto ( id, nombre, color ),
      ordenes_trabajo (
        id,
        descripcion_problema,
        clientes ( id, nombre, telefono ),
        vehiculos ( id, patente, marca, modelo )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ── OBTENER UNO POR ID ─────────────────────────────────────
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('presupuestos')
    .select(`
      *,
      estados_presupuesto ( id, nombre, color ),
      ordenes_trabajo (
        id,
        descripcion_problema,
        clientes ( id, nombre, telefono ),
        vehiculos ( id, patente, marca, modelo )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(`Presupuesto con id ${id} no encontrado`)
  return data
}

// ── CREAR ──────────────────────────────────────────────────
// Crea el presupuesto en estado borrador
// Verifica que no exista uno para la misma orden
export const create = async (body) => {
  // Verificamos que no exista un presupuesto para esa orden
  const { data: existing } = await supabase
    .from('presupuestos')
    .select('id')
    .eq('orden_trabajo_id', body.orden_trabajo_id)
    .maybeSingle()

  if (existing) throw new Error('Ya existe un presupuesto para esta orden de trabajo')

  const { data, error } = await supabase
    .from('presupuestos')
    .insert({
      orden_trabajo_id:  body.orden_trabajo_id,
      estado_id:         1, // siempre arranca en borrador
      mano_de_obra:      Number(body.mano_de_obra)     || 0,
      total_materiales:  Number(body.total_materiales) || 0,
      descuento:         Number(body.descuento)        || 0,
      notas:             body.notas                    || null,
      fecha_vencimiento: body.fecha_vencimiento        || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ── ACTUALIZAR ─────────────────────────────────────────────
// Maneja el stock cuando cambia el estado
export const update = async (id, body) => {
  const presupuestoActual = await findOne(id)

  console.log('── UPDATE PRESUPUESTO ──────────────────')
  console.log('Estado anterior:', presupuestoActual.estado_id)
  console.log('Estado nuevo:', body.estado_id)
  console.log('orden_trabajo_id:', presupuestoActual.ordenes_trabajo?.id)

  const { data, error } = await supabase
    .from('presupuestos')
    .update({
      estado_id:         body.estado_id         ? Number(body.estado_id)         : undefined,
      mano_de_obra:      body.mano_de_obra      ? Number(body.mano_de_obra)      : undefined,
      total_materiales:  body.total_materiales  !== undefined ? Number(body.total_materiales) : undefined,
      descuento:         body.descuento         !== undefined ? Number(body.descuento)        : undefined,
      notas:             body.notas             !== undefined ? body.notas                    : undefined,
      fecha_vencimiento: body.fecha_vencimiento !== undefined ? body.fecha_vencimiento        : undefined,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  const estadoAnterior = Number(presupuestoActual.estado_id)
  const estadoNuevo    = Number(body.estado_id)

  console.log('estadoAnterior (number):', estadoAnterior)
  console.log('estadoNuevo (number):', estadoNuevo)
  console.log('¿Debería descontar stock?', estadoNuevo === 3 && estadoAnterior !== 3)

  if (body.estado_id && estadoAnterior !== estadoNuevo) {
    const { descontarStock, restaurarStock } = await import(
      '../detalle-presupuesto/detalle-presupuesto.service.js'
    )

    if (estadoNuevo === 3 && estadoAnterior !== 3) {
      console.log('→ Descontando stock para orden:', presupuestoActual.ordenes_trabajo?.id)
      await descontarStock(presupuestoActual.ordenes_trabajo?.id)
      console.log('→ Stock descontado OK')
    }

    if (estadoAnterior === 3 && estadoNuevo !== 3) {
      console.log('→ Restaurando stock para orden:', presupuestoActual.ordenes_trabajo?.id)
      await restaurarStock(presupuestoActual.ordenes_trabajo?.id)
      console.log('→ Stock restaurado OK')
    }
  }

  return data
}

// ── ELIMINAR ───────────────────────────────────────────────
export const remove = async (id) => {
  const presupuesto = await findOne(id)

  // Si estaba aprobado restauramos el stock antes de eliminar
  if (Number(presupuesto.estado_id) === 3) {
    const { restaurarStock } = await import(
      '../detalle-presupuesto/detalle-presupuesto.service.js'
    )
    await restaurarStock(presupuesto.ordenes_trabajo.id)
  }

  // Eliminamos primero los detalles de materiales
  await supabase
    .from('detalle_materiales')
    .delete()
    .eq('orden_trabajo_id', presupuesto.ordenes_trabajo.id)

  const { error } = await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return { mensaje: 'Presupuesto eliminado correctamente' }
}