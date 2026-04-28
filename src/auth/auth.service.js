// ============================================================
// SERVICE DE AUTH
// Usa Supabase Auth directamente para login y logout
// ============================================================

import supabase from '../supabase/supabase.js';

// ── LOGIN ──────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email y contraseña son obligatorios');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error('Credenciales incorrectas');

  return {
    token: data.session.access_token,
    usuario: {
      id: data.user.id,
      email: data.user.email,
    },
  };
};

// ── LOGOUT ─────────────────────────────────────────────────
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

// ── ME ─────────────────────────────────────────────────────
// Verifica el token JWT y devuelve el usuario actual
export const me = async (token) => {
  if (!token) throw new Error('Token no proporcionado');

  const { data, error } = await supabase.auth.getUser(token);

  if (error) throw new Error('Token inválido o expirado');

  return {
    id: data.user.id,
    email: data.user.email,
  };
};