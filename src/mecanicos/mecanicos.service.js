// ============================================================
// SERVICE DE MECÁNICOS
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async (search) => {
  let query = supabase
    .from('mecanicos')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,especialidad.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNO POR ID ─────────────────────────────────────
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('mecanicos')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single();

  if (error) throw new Error(`Mecánico con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('mecanicos')
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
    .from('mecanicos')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── BORRADO LÓGICO ─────────────────────────────────────────
export const remove = async (id) => {
  await findOne(id);

  const { error } = await supabase
    .from('mecanicos')
    .update({ activo: false })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Mecánico eliminado correctamente' };
};