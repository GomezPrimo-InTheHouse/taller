// ============================================================
// SERVICE DE PRESUPUESTOS
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async (search) => {
  let query = supabase
    .from('presupuestos')
    .select(`
      *,
      estados_presupuesto ( id, nombre, color ),
      ordenes_trabajo (
        id,
        descripcion_problema,
        clientes ( id, nombre ),
        vehiculos ( id, patente, marca, modelo )
      )
    `)
    .order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

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
    .single();

  if (error) throw new Error(`Presupuesto con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('presupuestos')
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
    .from('presupuestos')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── ELIMINAR ───────────────────────────────────────────────
export const remove = async (id) => {
  await findOne(id);

  const { error } = await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Presupuesto eliminado correctamente' };
};