// ============================================================
// CLIENTE DE SUPABASE
// Se inicializa una sola vez y se reutiliza en toda la app
// Usamos la service_role key para tener acceso completo desde el backend
// ============================================================

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
}

// Creamos el cliente apuntando al schema taller
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'taller',
  },
  auth: {
    // En el backend no necesitamos persistir sesiones
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;