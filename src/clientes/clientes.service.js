// ============================================================
// SERVICE DE CLIENTES
// Toda la lógica de negocio y comunicación con Supabase
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
// Si se pasa un query de búsqueda, filtra por nombre, dni o teléfono
export const findAll = async (search) => {
  let query = supabase
    .from('clientes')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,dni.ilike.%${search}%,telefono.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNO POR ID ─────────────────────────────────────
// Devuelve el cliente con sus vehículos asociados
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('clientes')
    .select(`
      *,
      vehiculos (
        id,
        patente,
        marca,
        modelo,
        anio,
        color,
        kilometraje,
        activo
      )
    `)
    .eq('id', id)
    .eq('activo', true)
    .single();

  if (error) throw new Error(`Cliente con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('clientes')
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
    .from('clientes')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── BORRADO LÓGICO ─────────────────────────────────────────
// No borramos el registro — solo marcamos activo = false
// para mantener el historial de órdenes intacto
export const remove = async (id) => {
  await findOne(id);

  const { error } = await supabase
    .from('clientes')
    .update({ activo: false })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Cliente eliminado correctamente' };
};