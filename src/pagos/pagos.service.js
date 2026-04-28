// ============================================================
// SERVICE DE PAGOS
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async (search) => {
  const { data, error } = await supabase
    .from('pagos')
    .select(`
      *,
      metodos_pago ( id, nombre ),
      ordenes_trabajo (
        id,
        descripcion_problema,
        clientes ( id, nombre ),
        vehiculos ( id, patente, marca, modelo )
      )
    `)
    .order('fecha_pago', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNO POR ID ─────────────────────────────────────
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('pagos')
    .select(`
      *,
      metodos_pago ( id, nombre ),
      ordenes_trabajo (
        id,
        descripcion_problema,
        clientes ( id, nombre, telefono ),
        vehiculos ( id, patente, marca, modelo )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Pago con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('pagos')
    .insert(body)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── ACTUALIZAR ─────────────────────────────────────────────
export const update = async (id, body) => {
  await findOne(id);

  const { data, error } = await supabase
    .from('pagos')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── ELIMINAR ───────────────────────────────────────────────
// Los pagos sí se pueden eliminar físicamente si hay un error de carga
export const remove = async (id) => {
  await findOne(id);

  const { error } = await supabase
    .from('pagos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Pago eliminado correctamente' };
};

// ── HISTORIAL DE PAGOS POR ORDEN ──────────────────────────
// Devuelve todos los pagos de una orden + resumen del presupuesto
export const findByOrden = async (orden_trabajo_id) => {
  // Pagos de la orden
  const { data: pagos, error: pError } = await supabase
    .from('pagos')
    .select(`
      *,
      metodos_pago ( id, nombre )
    `)
    .eq('orden_trabajo_id', orden_trabajo_id)
    .order('fecha_pago', { ascending: false })

  if (pError) throw new Error(pError.message)

  // Presupuesto vinculado a la orden
  const { data: presupuesto } = await supabase
    .from('presupuestos')
    .select(`
      id,
      estado_id,
      mano_de_obra,
      total_materiales,
      descuento,
      total,
      estados_presupuesto ( nombre, color )
    `)
    .eq('orden_trabajo_id', orden_trabajo_id)
    .maybeSingle()

  // Total cobrado
  const totalCobrado = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0)
  const totalPresupuesto = presupuesto ? Number(presupuesto.total) : 0
  const saldoPendiente = Math.max(0, totalPresupuesto - totalCobrado)

  return {
    pagos,
    presupuesto,
    resumen: {
      totalCobrado,
      totalPresupuesto,
      saldoPendiente,
    }
  }
}