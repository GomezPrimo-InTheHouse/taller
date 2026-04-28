// ============================================================
// SERVICE DE MATERIALES
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async (search) => {
  let query = supabase
    .from('materiales')
    .select(`
      *,
      categorias_material ( id, nombre )
    `)
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,descripcion.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNO POR ID ─────────────────────────────────────
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('materiales')
    .select(`
      *,
      categorias_material ( id, nombre )
    `)
    .eq('id', id)
    .eq('activo', true)
    .single();

  if (error) throw new Error(`Material con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('materiales')
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
    .from('materiales')
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
    .from('materiales')
    .update({ activo: false })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Material eliminado correctamente' };
};