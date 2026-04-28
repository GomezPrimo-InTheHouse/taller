// ============================================================
// SERVICE DE ÓRDENES DE TRABAJO
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODAS ──────────────────────────────────────────
// Soporta filtro por búsqueda y por estado
export const findAll = async (search, estado) => {
  let query = supabase
    .from('ordenes_trabajo')
    .select(`
      *,
      clientes ( id, nombre, telefono ),
      vehiculos ( id, patente, marca, modelo ),
      mecanicos ( id, nombre ),
      estados_orden ( id, nombre, color )
    `)
    .order('created_at', { ascending: false });

  if (estado) {
    query = query.eq('estado_id', estado);
  }

  if (search) {
    query = query.or(
      `descripcion_problema.ilike.%${search}%,diagnostico.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNA POR ID ─────────────────────────────────────
// Devuelve la orden completa con todos sus datos relacionados
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('ordenes_trabajo')
    .select(`
      *,
      clientes ( id, nombre, telefono, email ),
      vehiculos ( id, patente, marca, modelo, anio, kilometraje ),
      mecanicos ( id, nombre, especialidad ),
      estados_orden ( id, nombre, color ),
      presupuestos (
        id,
        mano_de_obra,
        total_materiales,
        descuento,
        total,
        notas,
        fecha_emision,
        fecha_vencimiento,
        estados_presupuesto ( id, nombre, color )
      ),
      detalle_materiales (
        id,
        cantidad,
        precio_unitario,
        subtotal,
        materiales ( id, nombre, unidad )
      ),
      pagos (
        id,
        monto,
        fecha_pago,
        comprobante,
        metodos_pago ( id, nombre )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Orden con id ${id} no encontrada`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('ordenes_trabajo')
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
    .from('ordenes_trabajo')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── BORRADO LÓGICO ─────────────────────────────────────────
// Las órdenes no se borran — se cancelan cambiando el estado
export const remove = async (id) => {
  await findOne(id);

  // Estado 6 = Cancelado según nuestra tabla estados_orden
  const { error } = await supabase
    .from('ordenes_trabajo')
    .update({ estado_id: 6 })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Orden cancelada correctamente' };
};