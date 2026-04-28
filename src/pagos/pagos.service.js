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