// ============================================================
// SERVICE DE VEHÍCULOS
// ============================================================

import supabase from '../supabase/supabase.js';

// ── OBTENER TODOS ──────────────────────────────────────────
export const findAll = async (search) => {
  let query = supabase
    .from('vehiculos')
    .select(`
      *,
      clientes (
        id,
        nombre,
        telefono
      )
    `)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `patente.ilike.%${search}%,marca.ilike.%${search}%,modelo.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// ── OBTENER UNO POR ID ─────────────────────────────────────
// Devuelve el vehículo con su cliente actual e historial de propietarios
export const findOne = async (id) => {
  const { data, error } = await supabase
    .from('vehiculos')
    .select(`
      *,
      clientes (
        id,
        nombre,
        telefono,
        email
      ),
      vehiculo_cliente_historial (
        id,
        fecha_inicio,
        fecha_fin,
        observaciones,
        clientes (
          id,
          nombre,
          telefono
        )
      )
    `)
    .eq('id', id)
    .eq('activo', true)
    .single();

  if (error) throw new Error(`Vehículo con id ${id} no encontrado`);
  return data;
};

// ── CREAR ──────────────────────────────────────────────────
export const create = async (body) => {
  const { data, error } = await supabase
    .from('vehiculos')
    .insert(body)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── ACTUALIZAR ─────────────────────────────────────────────
// Si cambia el cliente_id, el trigger en Supabase
// actualiza el historial de propietarios automáticamente
export const update = async (id, body) => {
  await findOne(id);

  const { data, error } = await supabase
    .from('vehiculos')
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
    .from('vehiculos')
    .update({ activo: false })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { mensaje: 'Vehículo eliminado correctamente' };
};