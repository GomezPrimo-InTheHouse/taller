// ============================================================
// PUNTO DE ENTRADA DEL SERVIDOR
// Configura Express, CORS, rutas y levanta el servidor
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Importamos las rutas de cada módulo
import clientesRoutes from './src/clientes/clientes.routes.js';
import vehiculosRoutes from './src/vehiculos/vehiculos.routes.js';
import mecanicosRoutes from './src/mecanicos/mecanicos.routes.js';
import ordenesRoutes from './src/ordenes/ordenes.routes.js';
import materialesRoutes from './src/materiales/materiales.routes.js';
import presupuestosRoutes from './src/presupuestos/presupuestos.routes.js';
import pagosRoutes from './src/pagos/pagos.routes.js';
import authRoutes from './src/auth/auth.routes.js';
import detallePresupuestoRoutes from './src/detalle-presupuesto/detalle-presupuesto.routes.js'

const app = express();

// ── MIDDLEWARES GLOBALES ────────────────────────────────────

// Permite recibir JSON en el body de los requests
app.use(express.json());

// Permite recibir datos de formularios
app.use(express.urlencoded({ extended: true }));

// CORS — permite que el frontend React se comunique con el backend


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tallerpro-iota.vercel.app', // ← tu URL real de Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}))

// Morgan — registra cada request en consola
// 'dev' muestra: método, ruta, status, tiempo de respuesta
app.use(morgan('dev')); // ← agregá esta línea
// ── RUTAS ───────────────────────────────────────────────────

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`,         authRoutes);
app.use(`${API_PREFIX}/clientes`,     clientesRoutes);
app.use(`${API_PREFIX}/vehiculos`,    vehiculosRoutes);
app.use(`${API_PREFIX}/mecanicos`,    mecanicosRoutes);
app.use(`${API_PREFIX}/ordenes`,      ordenesRoutes);
app.use(`${API_PREFIX}/materiales`,   materialesRoutes);
app.use(`${API_PREFIX}/presupuestos`, presupuestosRoutes);
app.use(`${API_PREFIX}/pagos`,        pagosRoutes);
app.use(`${API_PREFIX}/detalle-presupuesto`, detallePresupuestoRoutes)

// ── RUTA BASE ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'Taller backend corriendo 🚀' });
});

// ── RUTA NO ENCONTRADA ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// ── ARRANQUE ────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Taller backend corriendo en http://localhost:${PORT}/api/v1`);
});